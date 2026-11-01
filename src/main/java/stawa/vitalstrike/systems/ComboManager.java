package stawa.vitalstrike.systems;

import java.time.Duration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.title.Title;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Display;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.TextDisplay;
import org.bukkit.scheduler.BukkitTask;
import stawa.vitalstrike.Lookup;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** Consecutive-hit combos with ranks, damage multipliers, decay, effects and a streak hologram. */
public final class ComboManager {
  private static final String DEFAULT_RANK = "D";
  private static final float HOLOGRAM_SCALE = 1.3f;

  private static final class State {
    int combo;
    long lastHit;
    long lastDecay;
    TextDisplay hologram;
    long hologramUntil;
  }

  private final VitalStrike plugin;
  private final PlayerManager players;
  private final PlayerStats stats;
  private final Map<UUID, State> states = new HashMap<>();
  private BukkitTask ticker;

  private boolean enabled;
  private long resetMs;
  private boolean decayEnabled;
  private long decayAfterMs;
  private long decayIntervalMs;
  private int decayRate;
  private int decayMinimum;

  private boolean multiplierEnabled;
  private double multBase;
  private double multPerCombo;
  private double multMax;
  private Map<String, Double> rankMultipliers = Map.of();

  private final TreeMap<Integer, String> rankThresholds = new TreeMap<>();
  private Map<String, String> rankColors = Map.of();
  private boolean rankEnabled;
  private String rankFormat;
  private String comboFormat;
  private String multiplierFormat;
  private String decayFormat;

  private boolean hologramEnabled;
  private int hologramMinCombo;
  private long hologramMs;
  private double hologramHeight;
  private String hologramFormat;
  private String rankUpFormat;

  private boolean effects;
  private Sound comboSound;
  private Sound milestoneSound;
  private float soundVolume;
  private float soundPitch;
  private Particle particle;
  private int particleCount;

  public ComboManager(VitalStrike plugin, PlayerManager players, PlayerStats stats) {
    this.plugin = plugin;
    this.players = players;
    this.stats = stats;
  }

  public void reload(FileConfiguration c) {
    enabled = c.getBoolean("combo.enabled");
    resetMs = c.getLong("combo.reset-time") * 1000;
    decayEnabled = c.getBoolean("combo.decay.enabled");
    decayAfterMs = c.getLong("combo.decay.time") * 1000;
    decayIntervalMs = Math.max(1, c.getLong("combo.decay.interval")) * 1000;
    decayRate = c.getInt("combo.decay.rate");
    decayMinimum = c.getInt("combo.decay.minimum");

    multiplierEnabled = c.getBoolean("combo.multiplier.enabled");
    multBase = c.getDouble("combo.multiplier.base");
    multPerCombo = c.getDouble("combo.multiplier.per-combo");
    multMax = c.getDouble("combo.multiplier.max");
    Map<String, Double> ranks = new HashMap<>();
    ConfigurationSection rankMults = c.getConfigurationSection("combo.multiplier.ranks");
    if (rankMults != null) {
      rankMults.getKeys(false).forEach(rank -> ranks.put(rank, rankMults.getDouble(rank)));
    }
    rankMultipliers = ranks;

    rankThresholds.clear();
    ConfigurationSection thresholds = c.getConfigurationSection("combo.display.rank.thresholds");
    if (thresholds != null) {
      thresholds.getKeys(false).forEach(rank -> rankThresholds.put(thresholds.getInt(rank), rank));
    }
    Map<String, String> colors = new HashMap<>();
    ConfigurationSection colorSection = c.getConfigurationSection("combo.display.rank.colors");
    if (colorSection != null) {
      colorSection.getKeys(false).forEach(rank -> colors.put(rank, colorSection.getString(rank)));
    }
    rankColors = colors;
    rankEnabled = c.getBoolean("combo.display.rank.enabled");
    rankFormat = c.getString("combo.display.rank.format");
    comboFormat = c.getString("combo.display.format");
    multiplierFormat = c.getString("combo.display.multiplier-format");
    decayFormat = c.getString("combo.display.decay-warning");

    hologramEnabled = c.getBoolean("combo.hologram.enabled");
    hologramMinCombo = c.getInt("combo.hologram.min-combo");
    hologramMs = (long) (c.getDouble("combo.hologram.duration") * 1000);
    hologramHeight = c.getDouble("combo.hologram.height");
    hologramFormat = c.getString("combo.hologram.format");
    rankUpFormat = c.getString("combo.display.rank-up", "");

    effects = c.getBoolean("combo.effects.enabled");
    boolean sound = c.getBoolean("combo.effects.sound.enabled");
    comboSound = sound ? sound(c.getString("combo.effects.sound.combo-up")) : null;
    milestoneSound = sound ? sound(c.getString("combo.effects.sound.combo-milestone")) : null;
    soundVolume = (float) c.getDouble("combo.effects.sound.volume");
    soundPitch = (float) c.getDouble("combo.effects.sound.pitch");
    particle =
        c.getBoolean("combo.effects.particles.enabled")
            ? particle(c.getString("combo.effects.particles.type"))
            : null;
    particleCount = c.getInt("combo.effects.particles.count");

    if (!enabled) {
      shutdown();
    } else if (ticker == null) {
      ticker = plugin.getServer().getScheduler().runTaskTimer(plugin, this::tick, 10L, 10L);
    }
  }

  private Sound sound(String name) {
    Sound sound = Lookup.sound(name);
    if (sound == null) {
      plugin.getSLF4JLogger().warn("Invalid combo sound '{}'", name);
    }
    return sound;
  }

  private Particle particle(String name) {
    Particle particle = Lookup.particle(name);
    if (particle == null) {
      plugin.getSLF4JLogger().warn("Invalid combo particle '{}'", name);
    }
    return particle;
  }

  /** Damage multiplier for the hit this player is about to land. */
  public double multiplierForNextHit(Player player) {
    if (!enabled || !multiplierEnabled) {
      return 1.0;
    }
    State s = states.get(player.getUniqueId());
    boolean expired =
        s == null || (!decayEnabled && System.currentTimeMillis() - s.lastHit > resetMs);
    return multiplierFor((expired ? 0 : s.combo) + 1);
  }

  private double multiplierFor(int combo) {
    double byCombo = multBase + combo * multPerCombo;
    double byRank = rankMultipliers.getOrDefault(rankOf(combo), multBase);
    return Math.min(Math.max(byCombo, byRank), multMax);
  }

  /** Registers a landed hit: advances the combo and drives the HUD, effects and hologram. */
  public void onHit(Player player, LivingEntity victim) {
    if (!enabled) {
      return;
    }
    long now = System.currentTimeMillis();
    State s = states.computeIfAbsent(player.getUniqueId(), id -> new State());
    if (!decayEnabled && now - s.lastHit > resetMs) {
      s.combo = 0;
    }
    int before = s.combo++;
    s.lastHit = now;
    s.lastDecay = now;
    stats.recordCombo(player, s.combo);

    if (!players.isEnabled(player)) {
      return;
    }
    if (effects) {
      playEffects(player, before, s.combo);
    }
    player.sendActionBar(hud(s, now));
    boolean rankUp = !rankOf(before).equals(rankOf(s.combo));
    if (rankUp && !rankUpFormat.isBlank()) {
      player.showTitle(
          Title.title(
              Component.empty(),
              Text.parse(streakText(rankUpFormat, s.combo)),
              Title.Times.times(Duration.ZERO, Duration.ofMillis(700), Duration.ofMillis(300))));
    }
    if (hologramEnabled && s.combo >= hologramMinCombo && players.isHologramEnabled(player)) {
      showHologram(s, victim, now, rankUp);
    }
  }

  /** Fills %combo%, %rank% and %color% (the rank's colour tag) in a configured streak text. */
  private String streakText(String format, int combo) {
    String rank = rankOf(combo);
    return format
        .replace("%combo%", String.valueOf(combo))
        .replace("%rank%", rank)
        .replace("%color%", rankColors.getOrDefault(rank, "<white>"));
  }

  private void playEffects(Player player, int before, int after) {
    Location at = player.getLocation();
    if (comboSound != null) {
      player.playSound(at, comboSound, soundVolume, soundPitch);
    }
    if (milestoneSound != null && !rankOf(before).equals(rankOf(after))) {
      player.playSound(at, milestoneSound, soundVolume * 1.2f, soundPitch * 1.2f);
    }
    if (particle != null) {
      try {
        at.getWorld().spawnParticle(particle, at.add(0, 1, 0), particleCount, 0.5, 0.5, 0.5, 0);
      } catch (IllegalArgumentException e) {
        plugin
            .getSLF4JLogger()
            .warn("Particle '{}' needs extra data and cannot be used", particle.key());
        particle = null;
      }
    }
  }

  private Component hud(State s, long now) {
    StringBuilder text = new StringBuilder(Text.format(comboFormat, s.combo));
    if (rankEnabled) {
      String rank = rankOf(s.combo);
      text.append(Text.format(rankFormat, rankColors.getOrDefault(rank, "<white>") + rank));
    }
    if (multiplierEnabled) {
      text.append(Text.format(multiplierFormat, multiplierFor(s.combo)));
    }
    if (decayEnabled) {
      double untilDecay = (decayAfterMs - (now - s.lastHit)) / 1000.0;
      if (untilDecay > 0 && untilDecay <= 3) {
        text.append(' ').append(Text.format(decayFormat, untilDecay));
      }
    }
    return Text.parse(text.toString());
  }

  private void showHologram(State s, LivingEntity victim, long now, boolean rankUp) {
    Location at = victim.getLocation().add(0, victim.getHeight() + hologramHeight, 0);
    Component text = Text.parse(streakText(hologramFormat, s.combo));
    if (s.hologram == null || !s.hologram.isValid()) {
      removeHologram(s);
      s.hologram =
          at.getWorld()
              .spawn(
                  at,
                  TextDisplay.class,
                  d -> {
                    d.setPersistent(false);
                    d.addScoreboardTag(VitalStrike.TEXT_TAG);
                    d.setBillboard(Display.Billboard.CENTER);
                    d.setAlignment(TextDisplay.TextAlignment.CENTER);
                    d.setSeeThrough(true);
                    d.setShadowed(true);
                    d.setDefaultBackground(false);
                    d.setViewRange(0.5f);
                    d.setTransformation(DamageIndicatorManager.scale(HOLOGRAM_SCALE * 0.4f));
                  });
    } else {
      s.hologram.teleport(at);
    }
    s.hologram.text(text);
    s.hologramUntil = now + hologramMs;
    pop(s.hologram, rankUp ? 1.7f : 1.25f);
  }

  /** Swells the hologram and eases it back, so each hit visibly lands. */
  private void pop(TextDisplay display, float peak) {
    display.setInterpolationDuration(1);
    display.setTransformation(DamageIndicatorManager.scale(HOLOGRAM_SCALE * peak));
    plugin
        .getServer()
        .getScheduler()
        .runTaskLater(
            plugin,
            () -> {
              if (display.isValid()) {
                display.setInterpolationDuration(5);
                display.setTransformation(DamageIndicatorManager.scale(HOLOGRAM_SCALE));
              }
            },
            2L);
  }

  public String rankOf(int combo) {
    var entry = rankThresholds.floorEntry(combo);
    return entry == null ? DEFAULT_RANK : entry.getValue();
  }

  private void tick() {
    long now = System.currentTimeMillis();
    for (Iterator<Map.Entry<UUID, State>> it = states.entrySet().iterator(); it.hasNext(); ) {
      Map.Entry<UUID, State> entry = it.next();
      State s = entry.getValue();
      if (s.hologram != null && now >= s.hologramUntil) {
        s.hologram.remove();
        s.hologram = null;
      }
      Player player = plugin.getServer().getPlayer(entry.getKey());
      if (!decayEnabled && now - s.lastHit > resetMs) {
        s.combo = 0;
      } else if (decayEnabled
          && s.combo > decayMinimum
          && now - s.lastHit >= decayAfterMs
          && now - s.lastDecay >= decayIntervalMs) {
        s.combo = Math.max(decayMinimum, s.combo - decayRate);
        s.lastDecay = now;
        if (player != null && players.isEnabled(player)) {
          player.sendActionBar(hud(s, now));
        }
      }
      boolean idle = s.combo <= (decayEnabled ? decayMinimum : 0);
      if (player == null || (idle && s.hologram == null)) {
        removeHologram(s);
        it.remove();
      }
    }
  }

  private static void removeHologram(State s) {
    if (s.hologram != null) {
      s.hologram.remove();
      s.hologram = null;
    }
  }

  /** Removes every combo hologram but keeps the combos themselves. */
  public void clearHolograms() {
    states.values().forEach(ComboManager::removeHologram);
  }

  public void cleanup(UUID id) {
    State s = states.remove(id);
    if (s != null) {
      removeHologram(s);
    }
  }

  public void shutdown() {
    states.values().forEach(ComboManager::removeHologram);
    states.clear();
    if (ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }
}
