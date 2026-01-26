package stawa.vitalstrike.systems;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Location;
import org.bukkit.NamespacedKey;
import org.bukkit.Particle;
import org.bukkit.Registry;
import org.bukkit.Sound;
import org.bukkit.entity.Entity;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.TextDisplay;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitTask;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.config.ConfigManager;

/**
 * Manages player combos, including tracking, decay, multipliers, and effects. Handles combo display
 * and decay tasks.
 */
public class ComboManager {
  private final JavaPlugin plugin;
  private final ConfigManager configManager;
  private final PlayerManager playerManager;
  private final PlayerStats playerStats;
  private final Logger logger;

  private final Map<UUID, Integer> playerCombos = new HashMap<>();
  private final Map<UUID, Long> lastComboTime = new HashMap<>();
  private final Map<UUID, Long> lastActionTime = new HashMap<>();
  private final Map<UUID, TextDisplay> activeHolograms = new HashMap<>();
  private final Map<UUID, BukkitTask> decayTasks = new HashMap<>();

  /**
   * Creates a new ComboManager instance.
   *
   * @param plugin The plugin instance
   * @param configManager The configuration manager
   * @param playerManager The player manager
   * @param playerStats The player statistics manager
   * @param logger The logger to use for reporting combo status
   */
  public ComboManager(
      JavaPlugin plugin,
      ConfigManager configManager,
      PlayerManager playerManager,
      PlayerStats playerStats,
      Logger logger) {
    this.plugin = plugin;
    this.configManager = configManager;
    this.playerManager = playerManager;
    this.playerStats = playerStats;
    this.logger = logger;
  }

  /**
   * Handles combo logic when a player deals damage. Updates combo count, resets decay timer,
   * applies multipliers, and triggers effects.
   *
   * @param player The player dealing damage
   * @param event The damage event
   * @param currentTime The current system time in milliseconds
   */
  public void handlePlayerCombos(Player player, EntityDamageEvent event, long currentTime) {
    if (event.getEntity().getType() == EntityType.ARMOR_STAND) {
      return;
    }

    UUID playerId = player.getUniqueId();
    updatePlayerCombo(playerId, currentTime);
    handleComboDecay(player, playerId);
    applyDamageMultiplier(player, playerId, event);
    playComboEffects(player, playerId);

    playerStats.updateStats(player, event.getFinalDamage(), playerCombos.get(playerId));
    displayComboHUD(player, event.getEntity());
  }

  private void updatePlayerCombo(UUID playerId, long currentTime) {
    Long lastCombo = lastComboTime.getOrDefault(playerId, 0L);
    if (currentTime - lastCombo > configManager.getComboResetTime()) {
      playerCombos.put(playerId, 1);
    } else {
      int currentCombo = playerCombos.getOrDefault(playerId, 0);
      playerCombos.put(playerId, currentCombo + 1);
    }

    lastComboTime.put(playerId, currentTime);
    lastActionTime.put(playerId, currentTime);
  }

  private void handleComboDecay(Player player, UUID playerId) {
    if (!configManager.isComboDecayEnabled()) return;

    BukkitTask existingTask = decayTasks.remove(playerId);
    if (existingTask != null) {
      existingTask.cancel();
    }

    BukkitTask decayTask =
        plugin
            .getServer()
            .getScheduler()
            .runTaskTimer(
                plugin,
                () -> {
                  long timeSinceLastAction =
                      (System.currentTimeMillis() - lastActionTime.get(playerId)) / 1000;

                  if (timeSinceLastAction >= configManager.getComboDecayTime()) {
                    int currentCombo = playerCombos.getOrDefault(playerId, 0);
                    int min = configManager.getComboDecayMinimum();
                    if (currentCombo > min) {
                      playerCombos.put(
                          playerId,
                          Math.max(currentCombo - configManager.getComboDecayRate(), min));
                      displayComboHUD(player, null);
                    }
                  }
                },
                configManager.getComboDecayTime() * 20L,
                configManager.getComboDecayInterval() * 20L);

    decayTasks.put(playerId, decayTask);
  }

  private void applyDamageMultiplier(Player player, UUID playerId, EntityDamageEvent event) {
    if (!configManager.isComboMultiplierEnabled()) return;

    int combo = playerCombos.get(playerId);
    String rank = getRankName(combo);

    double multiplier =
        configManager.getComboMultiplierBase()
            + (combo * configManager.getComboMultiplierPerCombo());

    double rankMultiplier =
        configManager
            .getRankMultipliers()
            .getOrDefault(rank, configManager.getComboMultiplierBase());
    multiplier = Math.max(multiplier, rankMultiplier);
    applyElementalEffects(player, event.getEntity(), combo);

    multiplier = Math.min(multiplier, configManager.getComboMultiplierMax());

    event.setDamage(event.getDamage() * multiplier);
  }

  private void applyElementalEffects(Player player, Entity target, int combo) {
    String element = playerManager.getPlayerElement(player);
    if (element == null) return;

    switch (element.toLowerCase()) {
      case "fire":
        target.setFireTicks(combo * 20);
        break;
      case "ice":
        if (target instanceof LivingEntity livingEntity) {
          livingEntity.addPotionEffect(
              new PotionEffect(PotionEffectType.SLOWNESS, combo * 20, combo / 5));
        }
        break;
      case "lightning":
        if (combo % 10 == 0) {
          target.getWorld().strikeLightning(target.getLocation());
        }
        break;
      default:
        break;
    }
  }

  private void playComboEffects(Player player, UUID playerId) {
    if (!plugin.getConfig().getBoolean("combo.effects.enabled", true)
        || !playerManager.isEnabled(player)) return;

    playComboSound(player, playerId);
    spawnComboParticles(player);
  }

  private void playComboSound(Player player, UUID playerId) {
    if (!plugin.getConfig().getBoolean("combo.effects.sound.enabled", true)) return;

    try {
      String soundName =
          plugin
              .getConfig()
              .getString("combo.effects.sound.combo-up", "entity.experience_orb.pickup");
      Sound sound = Registry.SOUNDS.get(NamespacedKey.minecraft(soundName.toLowerCase()));
      if (sound == null) {
        logger.warning("Invalid sound name in config: " + soundName);
        return;
      }

      float volume = (float) plugin.getConfig().getDouble("combo.effects.sound.volume", 1.0);
      float pitch = (float) plugin.getConfig().getDouble("combo.effects.sound.pitch", 1.0);
      Location location = player.getLocation();
      if (location != null) {
        player.playSound(location, sound, volume, pitch);
      }

      int prevCombo = playerCombos.getOrDefault(playerId, 0) - 1;
      String prevRank = getRankName(prevCombo);
      String newRank = getRankName(playerCombos.get(playerId));

      if (!prevRank.equals(newRank)) {
        String milestoneSoundName =
            plugin
                .getConfig()
                .getString("combo.effects.sound.combo-milestone", "ENTITY_PLAYER_LEVELUP");
        Sound milestoneSound =
            Registry.SOUNDS.get(NamespacedKey.minecraft(milestoneSoundName.toLowerCase()));
        if (milestoneSound == null) {
          logger.warning("Invalid milestone sound name in config: " + milestoneSoundName);
          return;
        }

        Location playerLoc = player.getLocation();
        if (playerLoc != null) {
          player.playSound(playerLoc, milestoneSound, volume * 1.2f, pitch * 1.2f);
        }
      }
    } catch (IllegalArgumentException e) {
      logger.warning("Invalid sound name in config: " + e.getMessage());
    }
  }

  private void spawnComboParticles(Player player) {
    if (!plugin.getConfig().getBoolean("combo.effects.particles.enabled", true)) return;

    try {
      String particleType = plugin.getConfig().getString("combo.effects.particles.type", "CRIT");
      int count = plugin.getConfig().getInt("combo.effects.particles.count", 10);
      Location playerLocation = player.getLocation();

      if (playerLocation != null) {
        Location particleLocation = playerLocation.clone().add(0, 1, 0);
        player
            .getWorld()
            .spawnParticle(
                Particle.valueOf(particleType.toUpperCase()),
                particleLocation,
                count,
                0.5,
                0.5,
                0.5,
                0);
      }

    } catch (IllegalArgumentException e) {
      logger.warning("Invalid particle type in config: " + e.getMessage());
    }
  }

  private void displayComboHUD(Player player, Entity target) {
    if (!configManager.isComboEnabled() || !playerManager.isEnabled(player)) return;

    int combo = playerCombos.getOrDefault(player.getUniqueId(), 0);
    if (combo <= 0) return;

    String displayText = buildComboHudText(player, combo);

    Component message = MiniMessage.miniMessage().deserialize(displayText);
    player.sendActionBar(message);

    if (configManager.isComboHologramEnabled()
        && playerManager.isHologramEnabled(player)
        && combo >= configManager.getComboHologramMinCombo()
        && target != null) {
      createComboHologram(player, combo, target);
    }

    scheduleActionBarClear(player, combo);
  }

  private void createComboHologram(Player player, int combo, Entity target) {
    UUID playerId = player.getUniqueId();

    TextDisplay existing = activeHolograms.remove(playerId);
    if (existing != null && existing.isValid()) {
      existing.remove();
    }

    Location loc =
        target.getLocation().add(0, target.getHeight() + configManager.getComboHologramHeight(), 0);
    TextDisplay hologram = (TextDisplay) loc.getWorld().spawnEntity(loc, EntityType.TEXT_DISPLAY);

    String formattedText =
        configManager.getComboHologramFormat().replace("%combo%", String.valueOf(combo));
    hologram.text(MiniMessage.miniMessage().deserialize(formattedText));

    hologram.setBillboard(org.bukkit.entity.Display.Billboard.CENTER);
    hologram.setAlignment(TextDisplay.TextAlignment.CENTER);
    hologram.setSeeThrough(true);
    hologram.setShadowed(true);
    hologram.setPersistent(false);
    hologram.setViewRange(32);
    hologram.setDefaultBackground(false);

    activeHolograms.put(playerId, hologram);

    int removalTicks = (int) (configManager.getComboHologramDuration() * 20);
    plugin
        .getServer()
        .getScheduler()
        .runTaskLater(
            plugin,
            () -> {
              TextDisplay storedHologram = activeHolograms.get(playerId);
              if (storedHologram != null && storedHologram.equals(hologram) && hologram.isValid()) {
                hologram.remove();
                activeHolograms.remove(playerId);
              }
            },
            removalTicks);
  }

  private String buildComboHudText(Player player, int combo) {
    StringBuilder display = new StringBuilder();

    display.append(String.format(configManager.getComboFormat(), combo));

    if (configManager.isComboRankEnabled()) {
      display.append(getComboRank(combo));
    }

    if (configManager.isComboMultiplierEnabled()) {
      display.append(getComboMultiplierText(combo));
    }

    if (configManager.isComboDecayEnabled()) {
      display.append(getDecayWarningText(player));
    }

    return display.toString();
  }

  private String getComboMultiplierText(int combo) {
    String rank = getRankName(combo);
    double multiplier =
        configManager.getComboMultiplierBase()
            + (combo * configManager.getComboMultiplierPerCombo());
    double rankMultiplier =
        configManager
            .getRankMultipliers()
            .getOrDefault(rank, configManager.getComboMultiplierBase());
    multiplier = Math.clamp(multiplier, rankMultiplier, configManager.getComboMultiplierMax());
    return String.format(configManager.getMultiplierFormat(), multiplier);
  }

  private String getDecayWarningText(Player player) {
    UUID playerId = player.getUniqueId();
    if (!lastActionTime.containsKey(playerId)) {
      return "";
    }

    long timeSinceLastAction = (System.currentTimeMillis() - lastActionTime.get(playerId)) / 1000;
    if (timeSinceLastAction >= configManager.getComboDecayTime() - 3) {
      float timeUntilDecay = (float) configManager.getComboDecayTime() - timeSinceLastAction;
      if (timeUntilDecay > 0) {
        return " " + String.format(configManager.getDecayWarningFormat(), timeUntilDecay);
      }
    }
    return "";
  }

  private void scheduleActionBarClear(Player player, int currentCombo) {
    int durationTicks = (int) (configManager.getDisplayDuration() * 20);
    plugin
        .getServer()
        .getScheduler()
        .runTaskLater(
            plugin,
            () -> {
              if (playerCombos.getOrDefault(player.getUniqueId(), 0) == currentCombo) {
                player.sendActionBar(Component.empty());
              }
            },
            durationTicks);
  }

  /**
   * Gets the rank name for a given combo count.
   *
   * @param combo The combo count
   * @return The rank name
   */
  public String getRankName(int combo) {
    String currentRank = "D";
    int highestThreshold = -1;

    for (Map.Entry<String, Integer> entry : configManager.getRankThresholds().entrySet()) {
      if (combo >= entry.getValue() && entry.getValue() > highestThreshold) {
        currentRank = entry.getKey();
        highestThreshold = entry.getValue();
      }
    }
    return currentRank;
  }

  /**
   * Gets the rank name for a given combo count.
   *
   * @param combo The combo count
   * @return The rank name
   */
  private String getComboRank(int combo) {
    String currentRank = getRankName(combo);
    String rankColor = configManager.getRankColors().getOrDefault(currentRank, "<white>");
    return String.format(configManager.getRankFormat(), rankColor + currentRank);
  }

  /**
   * Cleans up all resources associated with a player. Removes holograms, cancels tasks, and clears
   * combo data.
   *
   * @param playerId The UUID of the player to cleanup
   */
  public void cleanup(UUID playerId) {
    TextDisplay hologram = activeHolograms.remove(playerId);
    if (hologram != null && hologram.isValid()) {
      hologram.remove();
    }
    BukkitTask task = decayTasks.remove(playerId);
    if (task != null) {
      task.cancel();
    }
    playerCombos.remove(playerId);
    lastActionTime.remove(playerId);
    lastComboTime.remove(playerId);
  }

  /**
   * Resets a player's combo counter
   *
   * @param playerId the UUID of the player
   */
  public void resetPlayerCombo(UUID playerId) {
    playerCombos.put(playerId, 0);
    lastComboTime.remove(playerId);
    lastActionTime.remove(playerId);

    org.bukkit.scheduler.BukkitTask existingTask = decayTasks.remove(playerId);
    if (existingTask != null) {
      existingTask.cancel();
    }

    TextDisplay hologram = activeHolograms.remove(playerId);
    if (hologram != null && hologram.isValid()) {
      hologram.remove();
    }
  }
}
