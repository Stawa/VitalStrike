package stawa.vitalstrike.systems;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import net.kyori.adventure.text.Component;
import org.bukkit.Location;
import org.bukkit.Sound;
import org.bukkit.SoundCategory;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.Display;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.TextDisplay;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.util.BoundingBox;
import org.bukkit.util.RayTraceResult;
import org.bukkit.util.Transformation;
import org.bukkit.util.Vector;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;
import stawa.vitalstrike.Lookup;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** Floating damage and heal numbers. One shared task animates every live indicator. */
public final class DamageIndicatorManager {
  private static final String FALLBACK_FORMAT = "<red>-%.1f ❤";
  private static final double VIEW_RADIUS = 48;
  private static final int PULSE_TICKS = 5;

  // Mobs at least this wide or tall (dragon, ghast, ravager, wither, big slimes) get their text
  // on the side the attacker is looking at, scaled up, instead of above their centre.
  private static final double LARGE_WIDTH = 1.9;
  private static final double LARGE_HEIGHT = 3.0;
  private static final float MAX_SIZE_SCALE = 2.5f;

  private record Group(String permission, boolean useSimple, Map<String, String> formats) {}

  private record Slot(UUID victim, UUID source, boolean heal) {}

  private static final class Indicator {
    final Slot slot;
    final LivingEntity victim;
    final Player focus;
    final TextDisplay display;
    final double jitterX;
    final double jitterZ;
    final double swayX;
    final double swayZ;
    double total;
    double lift;
    long lastHit;
    int tick;
    int pulse;
    float appliedScale = -1;
    float sizeScale = 1f;
    float appliedSize = 1f;
    double anchorX;
    double anchorY;
    double anchorZ;

    Indicator(Slot slot, LivingEntity victim, Player focus, TextDisplay display, double jitter) {
      this.slot = slot;
      this.victim = victim;
      this.focus = focus;
      this.display = display;
      this.jitterX = (Math.random() - 0.5) * jitter;
      this.jitterZ = (Math.random() - 0.5) * jitter;
      double angle = Math.random() * Math.PI * 2;
      this.swayX = Math.cos(angle);
      this.swayZ = Math.sin(angle);
    }
  }

  private final VitalStrike plugin;
  private final PlayerManager players;
  private final Map<Slot, Indicator> active = new HashMap<>();
  private BukkitTask ticker;

  private double offsetX;
  private double offsetY;
  private double randomOffset;
  private double floatSpeed;
  private double floatCurve;
  private double dirX;
  private double dirY;
  private double dirZ;
  private int durationTicks;
  private int fadeInTicks;
  private int fadeOutTicks;
  private boolean merge;
  private long mergeWindowMs;
  private boolean showHeals;

  private boolean groupMode;
  private Map<String, String> simpleFormats = Map.of();
  private Map<String, Group> groups = Map.of();

  private Map<String, Sound> sounds = Map.of();
  private float soundVolume;
  private float soundPitch;
  private double soundRadius;

  public DamageIndicatorManager(VitalStrike plugin, PlayerManager players) {
    this.plugin = plugin;
    this.players = players;
  }

  public void reload(FileConfiguration c) {
    offsetX = c.getDouble("display.position.x");
    offsetY = c.getDouble("display.position.y");
    randomOffset = Math.max(0, c.getDouble("display.position.random-offset"));
    floatSpeed = c.getDouble("display.animation.float-speed");
    floatCurve = c.getDouble("display.animation.float-curve");
    switch (c.getString("display.position.direction", "down").toLowerCase(Locale.ROOT)) {
      case "up" -> setDirection(0, 1);
      case "left" -> setDirection(-1, 0);
      case "right" -> setDirection(1, 0);
      default -> setDirection(0, -1);
    }
    durationTicks = Math.max(1, (int) (c.getDouble("display.duration") * 20));
    fadeInTicks = Math.min(durationTicks, (int) (c.getDouble("display.animation.fade-in") * 20));
    fadeOutTicks = Math.min(durationTicks, (int) (c.getDouble("display.animation.fade-out") * 20));
    merge = c.getBoolean("display.merge.enabled");
    mergeWindowMs = c.getLong("display.merge.window");
    showHeals = c.getBoolean("display.show-heals");

    groupMode = "group-damage-formats".equals(c.getString("damage-indicator"));
    simpleFormats = readFormats(c.getConfigurationSection("simple-damage-formats"));
    Map<String, Group> loaded = new LinkedHashMap<>();
    ConfigurationSection section = c.getConfigurationSection("group-damage-formats");
    if (section != null) {
      for (String name : section.getKeys(false)) {
        ConfigurationSection g = section.getConfigurationSection(name);
        if (g != null) {
          loaded.put(
              name,
              new Group(
                  g.getString("permission", "vitalstrike.group." + name.toLowerCase(Locale.ROOT)),
                  g.getBoolean("use-simple-formats"),
                  readFormats(g.getConfigurationSection("damage-formats"))));
        }
      }
    }
    groups = loaded;

    Map<String, Sound> loadedSounds = new HashMap<>();
    ConfigurationSection soundSection = c.getConfigurationSection("damage-type-sounds");
    if (soundSection != null) {
      for (String type : soundSection.getKeys(false)) {
        Sound sound = Lookup.sound(soundSection.getString(type));
        if (sound == null) {
          plugin
              .getSLF4JLogger()
              .warn("Invalid sound '{}' for damage type '{}'", soundSection.getString(type), type);
        } else {
          loadedSounds.put(type.toLowerCase(Locale.ROOT), sound);
        }
      }
    }
    sounds = loadedSounds;
    soundVolume = (float) c.getDouble("damage-type-sounds-settings.volume");
    soundPitch = (float) c.getDouble("damage-type-sounds-settings.pitch");
    soundRadius = c.getDouble("damage-type-sounds-settings.radius");
  }

  private void setDirection(double x, double y) {
    dirX = x;
    dirY = y;
    dirZ = 0;
  }

  private static Map<String, String> readFormats(ConfigurationSection section) {
    Map<String, String> formats = new HashMap<>();
    if (section != null) {
      for (String key : section.getKeys(false)) {
        formats.put(key, section.getString(key));
      }
    }
    return formats;
  }

  /** Shows the numbers for damage that was actually applied to {@code victim}. */
  public void showDamage(
      LivingEntity victim, Player attacker, EntityDamageEvent event, double dealt) {
    if (!isEligible(victim) || dealt < 0.05) {
      return;
    }
    boolean crit = event instanceof EntityDamageByEntityEvent byEntity && byEntity.isCritical();
    String type = crit ? "critical" : event.getCause().name().toLowerCase(Locale.ROOT);
    show(
        victim,
        attacker,
        dealt,
        resolveFormat(attacker, crit ? "critical" : formatKey(event.getCause().name())),
        false);
    playSound(victim, type);
  }

  public void showHeal(LivingEntity entity, double amount) {
    if (showHeals && isEligible(entity) && amount >= 0.05) {
      show(entity, null, amount, simpleFormats.getOrDefault("heal", "<green>+%.1f ❤"), true);
    }
  }

  private static boolean isEligible(LivingEntity entity) {
    return !(entity instanceof ArmorStand) && !entity.getScoreboardTags().contains("nodamage");
  }

  /** Maps a damage cause to the key used in the format sections of config.yml. */
  private static String formatKey(String cause) {
    return switch (cause) {
      case "ENTITY_ATTACK" -> "default";
      case "FIRE_TICK" -> "fire";
      case "DROWNING" -> "drown";
      case "BLOCK_EXPLOSION", "ENTITY_EXPLOSION" -> "explosion";
      case "DRAGON_BREATH" -> "dragon";
      case "ENTITY_SWEEP_ATTACK" -> "sweep";
      case "FLY_INTO_WALL" -> "wall";
      case "WORLD_BORDER" -> "border";
      default -> cause.toLowerCase(Locale.ROOT);
    };
  }

  private String resolveFormat(Player attacker, String key) {
    if (groupMode && attacker != null) {
      for (Map.Entry<String, Group> entry : groups.entrySet()) {
        Group group = entry.getValue();
        if (entry.getKey().equals("default") || !players.hasGrant(attacker, group.permission())) {
          continue;
        }
        String format = group.formats().getOrDefault(key, group.formats().get("default"));
        if (format != null) {
          return format;
        }
      }
      Group fallback = groups.get("default");
      if (fallback != null && !fallback.useSimple()) {
        String format = fallback.formats().getOrDefault(key, fallback.formats().get("default"));
        if (format != null) {
          return format;
        }
      }
    }
    return simpleFormats.getOrDefault(key, simpleFormats.getOrDefault("default", FALLBACK_FORMAT));
  }

  private void playSound(LivingEntity victim, String type) {
    Sound sound = sounds.get(type);
    if (sound == null) {
      return;
    }
    Location at = victim.getLocation();
    for (Player viewer : at.getWorld().getNearbyPlayers(at, soundRadius)) {
      if (players.isEnabled(viewer)) {
        viewer.playSound(at, sound, SoundCategory.PLAYERS, soundVolume, soundPitch);
      }
    }
  }

  private void show(
      LivingEntity victim, Player attacker, double amount, String format, boolean heal) {
    long now = System.currentTimeMillis();
    UUID source =
        !merge ? UUID.randomUUID() : attacker != null ? attacker.getUniqueId() : new UUID(0, 0);
    Slot slot = new Slot(victim.getUniqueId(), source, heal);

    Indicator existing = active.get(slot);
    if (existing != null && existing.display.isValid() && now - existing.lastHit < mergeWindowMs) {
      existing.total += amount;
      existing.lastHit = now;
      existing.tick = Math.min(existing.tick, fadeInTicks);
      existing.pulse = PULSE_TICKS;
      existing.display.text(render(format, existing.total));
      return;
    }
    if (existing != null) {
      existing.display.remove();
    }

    Indicator indicator = spawn(slot, victim, attacker, render(format, amount));
    indicator.total = amount;
    indicator.lastHit = now;
  }

  /** Pops a one-off "slain" marker above a victim that just died. */
  public void showKill(LivingEntity victim, Component text) {
    if (isEligible(victim)) {
      Indicator indicator =
          spawn(new Slot(victim.getUniqueId(), UUID.randomUUID(), false), victim, null, text);
      indicator.lift = 0.6;
      indicator.pulse = PULSE_TICKS;
    }
  }

  private Indicator spawn(Slot slot, LivingEntity victim, Player focus, Component text) {
    Indicator indicator =
        new Indicator(slot, victim, focus, spawnDisplay(victim, text), randomOffset);
    active.put(slot, indicator);
    place(indicator);
    if (ticker == null) {
      ticker = plugin.getServer().getScheduler().runTaskTimer(plugin, this::tick, 1L, 1L);
    }
    return indicator;
  }

  private static Component render(String format, double amount) {
    return Text.parse(Text.format(format, amount));
  }

  TextDisplay spawnDisplay(LivingEntity victim, Component text) {
    Location at = victim.getLocation();
    TextDisplay display =
        at.getWorld()
            .spawn(
                at,
                TextDisplay.class,
                d -> {
                  d.setPersistent(false);
                  d.addScoreboardTag(VitalStrike.TEXT_TAG);
                  d.setVisibleByDefault(false);
                  d.setBillboard(Display.Billboard.CENTER);
                  d.setDefaultBackground(false);
                  d.setShadowed(true);
                  d.setTeleportDuration(1);
                  d.setInterpolationDuration(1);
                  d.setTransformation(scale(0));
                  d.text(text);
                });
    for (Player viewer : at.getWorld().getNearbyPlayers(at, VIEW_RADIUS)) {
      if (players.isEnabled(viewer)) {
        viewer.showEntity(plugin, display);
      }
    }
    return display;
  }

  static Transformation scale(float s) {
    return new Transformation(
        new Vector3f(), new AxisAngle4f(), new Vector3f(s, s, s), new AxisAngle4f());
  }

  private void tick() {
    active.values().removeIf(this::safeStep);
    if (active.isEmpty() && ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }

  /** A failing indicator is removed so it can neither linger nor stall the others. */
  private boolean safeStep(Indicator i) {
    try {
      return step(i);
    } catch (RuntimeException e) {
      plugin.getSLF4JLogger().warn("Dropping a broken damage indicator", e);
      i.display.remove();
      return true;
    }
  }

  /** Advances one indicator by a tick; returns true once it should be dropped. */
  private boolean step(Indicator i) {
    if (!i.display.isValid()) {
      return true;
    }
    if (i.tick >= durationTicks) {
      i.display.remove();
      return true;
    }
    place(i);

    float sizeScale = i.sizeScale;
    float scale = 1f;
    if (i.tick < fadeInTicks) {
      scale = (float) i.tick / fadeInTicks;
    } else if (i.tick >= durationTicks - fadeOutTicks && fadeOutTicks > 0) {
      scale = 1f - (float) (i.tick - (durationTicks - fadeOutTicks)) / fadeOutTicks;
    }
    if (i.pulse > 0) {
      scale *= 1f + 0.3f * i.pulse-- / PULSE_TICKS;
    }
    if (scale != i.appliedScale || sizeScale != i.appliedSize) {
      i.display.setTransformation(scale(scale * sizeScale));
      i.appliedScale = scale;
      i.appliedSize = sizeScale;
    }
    i.tick++;
    return false;
  }

  private void place(Indicator i) {
    if (i.victim.isValid()) {
      BoundingBox box = i.victim.getBoundingBox();
      double width = Math.max(box.getWidthX(), box.getWidthZ());
      if (width >= LARGE_WIDTH || box.getHeight() >= LARGE_HEIGHT) {
        double size = Math.max(width, box.getHeight());
        i.sizeScale = (float) Math.min(MAX_SIZE_SCALE, Math.max(1, Math.sqrt(size / 1.5)));
        if (!anchorTowardViewer(i, box)) {
          anchorOnTop(i, box);
        }
      } else {
        i.sizeScale = 1f;
        anchorOnTop(i, box);
      }
    }
    double sway = Math.sin(i.tick / 20.0 * Math.PI) * floatCurve;
    double travel = floatSpeed * i.tick;
    Location to = i.display.getLocation();
    to.set(
        i.anchorX + offsetX + i.jitterX + dirX * travel + i.swayX * sway,
        i.anchorY + offsetY + i.lift + dirY * travel,
        i.anchorZ + i.jitterZ + dirZ * travel + i.swayZ * sway);
    i.display.teleport(to);
  }

  private static void anchorOnTop(Indicator i, BoundingBox box) {
    i.anchorX = box.getCenterX();
    i.anchorY = box.getMaxY() + 0.5;
    i.anchorZ = box.getCenterZ();
  }

  /**
   * Puts the indicator on the surface of a large mob, on the line from the viewer's eyes to the
   * mob, so it appears where they are looking. Returns false when there is no viewer to face.
   */
  private boolean anchorTowardViewer(Indicator i, BoundingBox box) {
    Player viewer = viewerFor(i);
    if (viewer == null) {
      return false;
    }
    Location eye = viewer.getEyeLocation();
    Vector from = eye.toVector();
    Vector center = box.getCenter();
    double distance = center.distance(from);
    Vector at;
    if (distance < 1e-3 || box.contains(from)) {
      // Standing inside the hitbox (dragon): float the text a little ahead of the viewer.
      at = from.clone().add(eye.getDirection().multiply(2.5));
    } else {
      Vector direction = center.clone().subtract(from).multiply(1 / distance);
      RayTraceResult hit = box.rayTrace(from, direction, distance);
      if (hit == null) {
        return false;
      }
      at = hit.getHitPosition().subtract(direction.multiply(0.4));
    }
    i.anchorX = at.getX();
    i.anchorY = at.getY() + 0.3;
    i.anchorZ = at.getZ();
    return true;
  }

  /** The attacker if still around, otherwise the nearest player who can see indicators. */
  private Player viewerFor(Indicator i) {
    Location at = i.victim.getLocation();
    double max = VIEW_RADIUS * VIEW_RADIUS;
    Player focus = i.focus;
    if (focus != null
        && focus.isOnline()
        && focus.getWorld().equals(at.getWorld())
        && focus.getLocation().distanceSquared(at) <= max) {
      return focus;
    }
    Player nearest = null;
    double best = max;
    for (Player candidate : at.getWorld().getNearbyPlayers(at, VIEW_RADIUS)) {
      double d = candidate.getLocation().distanceSquared(at);
      if (d < best && players.isEnabled(candidate)) {
        best = d;
        nearest = candidate;
      }
    }
    return nearest;
  }

  /** Removes every live indicator, e.g. on disable or reload. */
  public void shutdown() {
    active.values().forEach(i -> i.display.remove());
    active.clear();
    if (ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }
}
