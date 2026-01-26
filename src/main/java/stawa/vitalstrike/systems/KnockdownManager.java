package stawa.vitalstrike.systems;

import java.util.*;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.GameMode;
import org.bukkit.Location;
import org.bukkit.attribute.Attribute;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.boss.BossBar;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitTask;
import stawa.vitalstrike.Errors;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.items.CustomItems;

/**
 * Manages the knockdown system in VitalStrike, providing a second-chance mechanic for players in
 * combat. When a player would normally die, they enter a "downed" state where they are temporarily
 * incapacitated but can be revived by teammates or use special items for self-revival.
 */
public class KnockdownManager {
  /** Controls whether the knockdown system is enabled */
  private final boolean enabled;

  /** Determines if Vital Awakening items are used instantly or require a progress bar */
  private final boolean instantUse;

  /** The amount of health a player has while in the downed state */
  private final double downedHealth;

  /** The time in seconds it takes for another player to revive a downed player */
  private final double reviveDuration;

  /** The maximum distance in blocks at which a player can revive another player */
  private final double reviveRange;

  /** The time in seconds it takes to use a Vital Awakening item */
  private final double useTime;

  /** The time in seconds a player can remain in the downed state before dying */
  private final int downDuration;

  /** Maps player UUIDs to their downed state boss bars */
  private final Map<UUID, BossBar> playerBossBars = new HashMap<>();

  /** Maps player UUIDs to their self-revival progress boss bars */
  private final Map<UUID, BossBar> selfReviveBars = new HashMap<>();

  /** Maps player UUIDs to their downed state tasks */
  private final Map<UUID, BukkitTask> downedPlayers = new HashMap<>();

  /** Maps player UUIDs to the timestamp when they entered the downed state */
  private final Map<UUID, Long> downStartTimes = new HashMap<>();

  /** Maps player UUIDs to the timestamp when their downed state was paused */
  private final Map<UUID, Long> pauseStartTimes = new HashMap<>();

  /** Maps player UUIDs to their total paused time in the downed state */
  private final Map<UUID, Long> totalPausedTime = new HashMap<>();

  /** Maps player UUIDs to their revival attempt tasks */
  private final Map<UUID, BukkitTask> revivingTasks = new HashMap<>();

  /** Maps player UUIDs to their self-revival attempt tasks */
  private final Map<UUID, BukkitTask> selfReviveTasks = new HashMap<>();

  /** Maps reviver UUIDs to target UUIDs for revival tracking */
  private final Map<UUID, UUID> revivingPairs = new HashMap<>();

  private final Map<UUID, UUID> reviveAttempts = new HashMap<>();
  private final Map<UUID, Long> lastReviveAttempt = new HashMap<>();
  private static final long REVIVE_COOLDOWN = 1000;

  /** Handles custom item functionality including Vital Awakening items */
  private final CustomItems customItems;

  /** Reference to the main plugin instance */
  private final VitalStrike plugin;

  /**
   * Initializes the KnockdownManager with configuration settings from the plugin.
   *
   * @param plugin The VitalStrike plugin instance
   * @throws Errors.ConfigurationException If there are issues with the configuration values
   */
  public KnockdownManager(VitalStrike plugin) throws Errors.ConfigurationException {
    this.plugin = plugin;
    plugin.reloadConfig();
    this.enabled = plugin.getConfig().getBoolean("knockdown-system.enabled", true);
    this.downDuration = plugin.getConfig().getInt("knockdown-system.down-duration", 30);
    this.reviveDuration =
        plugin.getConfig().getDouble("knockdown-system.external-revive.duration", 5.0);
    this.reviveRange = plugin.getConfig().getDouble("knockdown-system.external-revive.range", 3.0);
    this.downedHealth =
        Math.clamp(plugin.getConfig().getDouble("knockdown-system.downed-health", 20.0), 1.0, 20.0);
    this.instantUse =
        plugin.getConfig().getBoolean("knockdown-system.vital-awakening.instant-use", false);
    this.useTime =
        plugin.getConfig().getDouble("knockdown-system.vital-awakening.use-duration", 2.0);
    try {
      this.customItems = new CustomItems(plugin);
    } catch (Errors.ConfigurationException e) {
      plugin.getLogger().warning("Failed to initialize CustomItems: " + e.getMessage());
      plugin
          .getLogger()
          .warning("Some features related to Vital Awakening items may not work properly.");
      throw e;
    }
  }

  /**
   * Attempts to initiate a self-revival process for a downed player using a Vital Awakening item.
   * If instant use is enabled, the revival happens immediately. Otherwise, it starts a progress
   * bar.
   *
   * @param player The player attempting to self-revive
   */
  public void attemptSelfRevive(Player player) {
    if (!isPlayerDowned(player)) return;

    ItemStack mainHand = player.getInventory().getItemInMainHand();
    ItemStack offHand = player.getInventory().getItemInOffHand();
    boolean hasMainHandItem = customItems.isVitalAwakening(mainHand);
    boolean hasOffHandItem = customItems.isVitalAwakening(offHand);

    if (!hasMainHandItem && !hasOffHandItem) {
      return;
    }

    if (instantUse) {
      if (hasMainHandItem) {
        mainHand.setAmount(mainHand.getAmount() - 1);
        completeRevive(player, player);
      } else {
        offHand.setAmount(offHand.getAmount() - 1);
        completeRevive(player, player);
      }
      return;
    }

    startSelfRevive(player);
  }

  /**
   * Cancels an ongoing self-revival attempt for a player. Cleans up associated tasks and progress
   * bars.
   *
   * @param player The player whose self-revival attempt should be cancelled
   */
  public void cancelSelfRevive(Player player) {
    UUID playerId = player.getUniqueId();
    BukkitTask task = selfReviveTasks.remove(playerId);
    if (task != null) {
      task.cancel();
    }

    BossBar bar = selfReviveBars.remove(playerId);
    if (bar != null) {
      bar.removeAll();
    }
  }

  /**
   * Starts the self-revival process for a downed player. Creates a boss bar to show progress and
   * schedules the task to handle the revival.
   *
   * @param player The player attempting to self-revive
   */
  public void startSelfRevive(Player player) {
    UUID playerId = player.getUniqueId();
    cancelSelfRevive(player);

    boolean wasMainHand = customItems.isVitalAwakening(player.getInventory().getItemInMainHand());
    BossBar bossBar =
        Bukkit.createBossBar("§e§lUsing Vital Awakening...", BarColor.YELLOW, BarStyle.SOLID);
    bossBar.setProgress(0.0);
    bossBar.addPlayer(player);
    selfReviveBars.put(playerId, bossBar);

    final double[] progress = {0.0};
    BukkitTask task =
        plugin
            .getServer()
            .getScheduler()
            .runTaskTimer(
                plugin,
                () -> {
                  if (!isPlayerDowned(player) || !player.isOnline()) {
                    cancelSelfRevive(player);
                    return;
                  }

                  ItemStack currentMainHand = player.getInventory().getItemInMainHand();
                  ItemStack currentOffHand = player.getInventory().getItemInOffHand();
                  boolean hasMainHandItem = customItems.isVitalAwakening(currentMainHand);
                  boolean hasOffHandItem = customItems.isVitalAwakening(currentOffHand);

                  if ((wasMainHand && !hasMainHandItem) || (!wasMainHand && !hasOffHandItem)) {
                    cancelSelfRevive(player);
                    player.sendMessage("§cVital Awakening interrupted: Item was changed.");
                    return;
                  }

                  progress[0] += 0.05;
                  double progressPercent = progress[0] / useTime;
                  bossBar.setProgress(Math.min(1.0, progressPercent));

                  if (progress[0] >= useTime) {
                    ItemStack usedItem = wasMainHand ? currentMainHand : currentOffHand;
                    usedItem.setAmount(usedItem.getAmount() - 1);
                    completeRevive(player, player);
                    cancelSelfRevive(player);
                  }
                },
                0L,
                1L);

    selfReviveTasks.put(playerId, task);
  }

  /**
   * Performs cleanup of all active knockdown-related tasks and resources. This should be called
   * when the plugin is being disabled or reloaded.
   */
  public void cleanup() {
    downedPlayers.values().forEach(BukkitTask::cancel);
    downedPlayers.clear();
    revivingTasks.values().forEach(BukkitTask::cancel);
    revivingTasks.clear();
    revivingPairs.clear();
    playerBossBars.values().forEach(BossBar::removeAll);
    playerBossBars.clear();
    selfReviveTasks.values().forEach(BukkitTask::cancel);
    selfReviveTasks.clear();
    selfReviveBars.values().forEach(BossBar::removeAll);
    selfReviveBars.clear();
    pauseStartTimes.clear();
    totalPausedTime.clear();
    lastReviveAttempt.clear();
  }

  /**
   * Creates a boss bar for a downed player showing their remaining time.
   *
   * @param player The downed player to create the boss bar for
   */
  private void createDownedBossBar(Player player) {
    String message =
        plugin
            .getConfig()
            .getString(
                "knockdown-system.effects.messages.downed",
                "<red>You have been knocked down! Wait for help or death in %time% seconds");
    message = message.replace("%time%", String.valueOf(downDuration));

    String plainTitle = "§c§lDowned! " + downDuration + "s remaining";

    BossBar bossBar = Bukkit.createBossBar(plainTitle, BarColor.RED, BarStyle.SOLID);
    bossBar.setProgress(1.0);
    bossBar.addPlayer(player);
    playerBossBars.put(player.getUniqueId(), bossBar);

    player.sendMessage(MiniMessage.miniMessage().deserialize(message));
  }

  /**
   * Updates the boss bar for a downed player with the remaining time.
   *
   * @param player The downed player
   * @param remainingSeconds The remaining time in seconds before death
   */
  private void updateDownedBossBar(Player player, int remainingSeconds) {
    BossBar bossBar = playerBossBars.get(player.getUniqueId());
    if (bossBar != null) {
      double progress = Math.max(0.0, (double) remainingSeconds / downDuration);
      bossBar.setProgress(progress);
      bossBar.setTitle("§c§lDowned! " + remainingSeconds + "s remaining");
    }
  }

  /**
   * Removes the boss bar for a player who is no longer downed.
   *
   * @param player The player whose boss bar should be removed
   */
  private void removeDownedBossBar(Player player) {
    BossBar bossBar = playerBossBars.remove(player.getUniqueId());
    if (bossBar != null) {
      bossBar.removeAll();
    }
  }

  /**
   * Initiates the knockdown state for a player who would normally die. This method handles the
   * complete
   *
   * @param player The player entering the knockdown state
   */
  public void handlePlayerDeath(Player player) {
    if (!enabled
        || player.getGameMode() == GameMode.CREATIVE
        || player.getGameMode() == GameMode.SPECTATOR) {
      return;
    }

    UUID playerId = player.getUniqueId();

    if (isPlayerDowned(player)) {
      BukkitTask task = downedPlayers.remove(playerId);
      if (task != null) {
        task.cancel();
      }
      removeDownedBossBar(player);
      cancelSelfRevive(player);
    }

    player.setHealth(downedHealth);
    player.setInvulnerable(true);
    downStartTimes.put(playerId, System.currentTimeMillis());
    pauseStartTimes.remove(playerId);
    totalPausedTime.remove(playerId);

    applyDownedEffects(player);
    createDownedBossBar(player);

    BukkitTask task =
        plugin
            .getServer()
            .getScheduler()
            .runTaskTimer(
                plugin,
                () -> {
                  if (!player.isOnline() || !isPlayerDowned(player)) {
                    removeDownedState(player);
                    return;
                  }
                  int remainingTime = getRemainingTime(player);
                  if (remainingTime <= 0) {
                    finalizePlayerDeath(player);
                  } else {
                    updateDownedBossBar(player, remainingTime);
                  }
                },
                20L,
                20L);

    downedPlayers.put(playerId, task);
  }

  /**
   * Finalizes a player's death after their downed timer expires. Removes the downed state and sets
   * their health to 0.
   *
   * @param player The player to kill
   */
  private void finalizePlayerDeath(Player player) {
    if (player == null || !player.isOnline()) return;
    removeDownedState(player);
    plugin
        .getServer()
        .getScheduler()
        .runTaskLater(
            plugin,
            () -> {
              if (player.isOnline()) {
                player.setInvulnerable(false);
                player.setHealth(0);
              }
            },
            2L);
  }

  /**
   * Removes the downed state from a player. Cleans up tasks, effects, and UI elements.
   *
   * @param player The player to remove the downed state from
   */
  private void removeDownedState(Player player) {
    if (player == null) return;

    UUID playerId = player.getUniqueId();
    BukkitTask task = downedPlayers.remove(playerId);
    if (task != null) {
      task.cancel();
    }
    downStartTimes.remove(playerId);
    pauseStartTimes.remove(playerId);
    totalPausedTime.remove(playerId);
    removeDownedBossBar(player);
    removeDownedEffects(player);
    player.setInvulnerable(false);
  }

  /**
   * Handles a player disconnecting from the server while in a downed state. Preserves their downed
   * state but cancels active tasks.
   *
   * @param player The player who disconnected
   */
  public void handlePlayerQuit(Player player) {
    UUID playerId = player.getUniqueId();

    reviveAttempts.remove(player.getUniqueId());
    lastReviveAttempt.remove(player.getUniqueId());

    UUID targetId =
        reviveAttempts.entrySet().stream()
            .filter(entry -> entry.getValue().equals(player.getUniqueId()))
            .map(Map.Entry::getKey)
            .findFirst()
            .orElse(null);

    if (targetId != null) {
      Player reviver = Bukkit.getPlayer(targetId);
      if (reviver != null) {
        cancelRevive(reviver.getUniqueId());
      }
      reviveAttempts.remove(targetId);
    }

    if (isPlayerDowned(player)) {
      BukkitTask task = downedPlayers.remove(playerId);
      if (task != null) {
        task.cancel();
      }
      BossBar bossBar = playerBossBars.remove(playerId);
      if (bossBar != null) {
        bossBar.removeAll();
      }
      cancelSelfRevive(player);
    }

    for (Map.Entry<UUID, UUID> entry : new HashMap<>(revivingPairs).entrySet()) {
      if (entry.getValue().equals(playerId)) {
        cancelRevive(entry.getKey());
      }
    }
  }

  /**
   * Manages the state restoration of a player who rejoins the server while in a downed state. This
   * method handles several scenarios:
   *
   * <ul>
   *   <li>Checks if the player's downed timer expired during their absence
   *   <li>Restores the downed state with appropriate health and effects if time remains
   *   <li>Resumes the countdown timer and UI elements
   *   <li>Ensures proper cleanup if the player disconnects again
   * </ul>
   *
   * @param player The player who joined the server
   */
  public void handlePlayerJoin(Player player) {
    UUID playerId = player.getUniqueId();

    if (downStartTimes.containsKey(playerId)) {
      int remainingTime = getRemainingTime(player);
      if (remainingTime <= 0) {
        downStartTimes.remove(playerId);
        pauseStartTimes.remove(playerId);
        totalPausedTime.remove(playerId);

        plugin
            .getServer()
            .getScheduler()
            .runTaskLater(
                plugin,
                () -> {
                  if (player.isOnline()) {
                    player.setInvulnerable(false);
                    player.setHealth(0);
                  }
                },
                5L);
        return;
      }

      player.setHealth(downedHealth);
      player.setInvulnerable(true);
      applyDownedEffects(player);
      createDownedBossBar(player);

      BukkitTask task =
          plugin
              .getServer()
              .getScheduler()
              .runTaskTimer(
                  plugin,
                  () -> {
                    if (!player.isOnline()) {
                      BukkitTask currentTask = downedPlayers.remove(playerId);
                      if (currentTask != null) {
                        currentTask.cancel();
                      }
                      return;
                    }

                    if (!isPlayerDowned(player)) {
                      removeDownedState(player);
                      return;
                    }

                    int currentRemainingTime = getRemainingTime(player);
                    if (currentRemainingTime <= 0) {
                      finalizePlayerDeath(player);
                    } else {
                      updateDownedBossBar(player, currentRemainingTime);
                    }
                  },
                  20L,
                  20L);

      downedPlayers.put(playerId, task);
    }
  }

  /**
   * Revives a player from their downed state by restoring their normal gameplay state. This method
   * handles the complete revival process including:
   *
   * <ul>
   *   <li>Canceling all active downed state tasks
   *   <li>Removing UI elements and visual indicators
   *   <li>Clearing all downed state tracking data
   *   <li>Restoring the player's normal movement, health, and status effects
   * </ul>
   *
   * @param player The player to revive from the downed state
   */
  public void revivePlayer(Player player) {
    UUID playerId = player.getUniqueId();

    BukkitTask task = downedPlayers.remove(playerId);
    if (task != null) {
      task.cancel();
    }

    BossBar bossBar = playerBossBars.remove(playerId);
    if (bossBar != null) {
      bossBar.removeAll();
    }

    downStartTimes.remove(playerId);
    pauseStartTimes.remove(playerId);
    totalPausedTime.remove(playerId);

    player.setWalkSpeed(0.2f);
    player.setHealth(player.getAttribute(Attribute.MAX_HEALTH).getValue());
    player.removePotionEffect(PotionEffectType.BLINDNESS);
    player.removePotionEffect(PotionEffectType.SLOWNESS);
    player.setInvulnerable(false);
  }

  /**
   * Initiates the revival process for a downed player by another player. Creates a progress bar and
   * starts the revival countdown.
   *
   * @param reviver The player attempting to revive the downed player
   * @param target The downed player being revived
   */
  private final Map<UUID, BossBar> revivingBossBars = new HashMap<>();

  private final Map<UUID, BossBar> beingRevivedBossBars = new HashMap<>();

  /**
   * Starts the revival process for a downed player by another player.
   *
   * @param reviver The player attempting to revive the downed player
   * @param target The downed player being revived
   */
  public void startRevive(Player reviver, Player target) {
    UUID reviverId = reviver.getUniqueId();
    UUID targetId = target.getUniqueId();

    long currentTime = System.currentTimeMillis();
    if (lastReviveAttempt.containsKey(reviverId)) {
      long lastAttempt = lastReviveAttempt.get(reviverId);
      if (currentTime - lastAttempt < REVIVE_COOLDOWN) {
        return;
      }
    }

    if (reviveAttempts.containsKey(reviverId) || isBeingRevived(target)) {
      return;
    }

    if (!canRevive(reviver, target)) {
      String message =
          plugin
              .getConfig()
              .getString(
                  "knockdown-system.effects.messages.cannot-revive",
                  "<red>You cannot revive this player right now.");
      reviver.sendMessage(MiniMessage.miniMessage().deserialize(message));
      return;
    }

    lastReviveAttempt.put(reviverId, currentTime);
    reviveAttempts.put(reviverId, targetId);

    String reviverMessage =
        plugin
            .getConfig()
            .getString(
                "knockdown-system.effects.messages.reviving-player",
                "<yellow>Reviving %player%...");
    reviverMessage = reviverMessage.replace("%player%", target.getName());

    String targetMessage =
        plugin
            .getConfig()
            .getString(
                "knockdown-system.effects.messages.being-revived",
                "<yellow>Being revived by %player%...");
    targetMessage = targetMessage.replace("%player%", reviver.getName());

    reviver.sendMessage(MiniMessage.miniMessage().deserialize(reviverMessage));
    target.sendMessage(MiniMessage.miniMessage().deserialize(targetMessage));

    String reviverBarTitle =
        plugin
            .getConfig()
            .getString(
                "knockdown-system.effects.boss-bar.reviving.title", "<yellow>Reviving %player%...");
    reviverBarTitle = reviverBarTitle.replace("%player%", target.getName());

    String targetBarTitle =
        plugin
            .getConfig()
            .getString(
                "knockdown-system.effects.boss-bar.being-revived.title",
                "<yellow>Being revived by %player%...");
    targetBarTitle = targetBarTitle.replace("%player%", reviver.getName());

    String plainReviverTitle = "§e§l" + MiniMessage.miniMessage().stripTags(reviverBarTitle);
    String plainTargetTitle = "§e§l" + MiniMessage.miniMessage().stripTags(targetBarTitle);

    BarColor barColor;
    BarStyle barStyle;

    try {
      String colorStr =
          plugin
              .getConfig()
              .getString("knockdown-system.effects.boss-bar.reviving.color", "YELLOW");
      barColor = BarColor.valueOf(colorStr.toUpperCase());
    } catch (Exception e) {
      barColor = BarColor.YELLOW;
    }

    try {
      String styleStr =
          plugin.getConfig().getString("knockdown-system.effects.boss-bar.reviving.style", "SOLID");
      barStyle = BarStyle.valueOf(styleStr.toUpperCase());
    } catch (Exception e) {
      barStyle = BarStyle.SOLID;
    }

    BossBar reviverBar = Bukkit.createBossBar(plainReviverTitle, barColor, barStyle);

    BossBar targetBar = Bukkit.createBossBar(plainTargetTitle, barColor, barStyle);

    reviverBar.addPlayer(reviver);
    targetBar.addPlayer(target);
    revivingBossBars.put(reviverId, reviverBar);
    beingRevivedBossBars.put(targetId, targetBar);

    BukkitTask task =
        plugin
            .getServer()
            .getScheduler()
            .runTaskTimer(
                plugin,
                new Runnable() {
                  private double progress = 0;
                  private final Location startLoc = reviver.getLocation();

                  @Override
                  public void run() {
                    if (!reviver.isOnline() || !target.isOnline() || !isPlayerDowned(target)) {
                      cancelRevive(reviverId);
                      String message =
                          plugin
                              .getConfig()
                              .getString(
                                  "knockdown-system.effects.messages.revive-failed",
                                  "<red>Revival failed! Stay closer to the player.");
                      if (reviver.isOnline()) {
                        reviver.sendMessage(MiniMessage.miniMessage().deserialize(message));
                      }
                      return;
                    }

                    Location currentLocation = reviver.getLocation();
                    if (isPlayerDowned(reviver)
                        || currentLocation == null
                        || startLoc == null
                        || !currentLocation.getWorld().equals(startLoc.getWorld())
                        || currentLocation.distance(startLoc) > 0.5) {
                      cancelRevive(reviverId);
                      String message =
                          plugin
                              .getConfig()
                              .getString(
                                  "knockdown-system.effects.messages.revive-failed",
                                  "<red>Revival failed! Stay closer to the player.");
                      reviver.sendMessage(MiniMessage.miniMessage().deserialize(message));
                      return;
                    }

                    progress += 1.0 / (reviveDuration * 20);
                    reviverBar.setProgress(Math.min(1.0, progress));
                    targetBar.setProgress(Math.min(1.0, progress));

                    if (progress >= 1.0) {
                      completeRevive(reviver, target);
                      cancelRevive(reviverId);
                    }
                  }
                },
                0L,
                1L);

    revivingTasks.put(reviverId, task);
    revivingPairs.put(reviverId, targetId);
  }

  /**
   * Checks if a downed player is currently being revived by another player.
   *
   * @param target The downed player to check
   * @return true if the player is being revived, false otherwise
   */
  private boolean isBeingRevived(Player target) {
    return reviveAttempts.containsValue(target.getUniqueId());
  }

  /**
   * Cancels an ongoing revival attempt by a player. Cleans up associated tasks and progress bars.
   *
   * @param reviverId The UUID of the player attempting the revival
   */
  public void cancelRevive(UUID reviverId) {
    reviveAttempts.remove(reviverId);
    BukkitTask task = revivingTasks.remove(reviverId);
    if (task != null) {
      task.cancel();
    }

    BossBar reviverBar = revivingBossBars.remove(reviverId);
    if (reviverBar != null) {
      reviverBar.removeAll();
    }

    UUID targetId = revivingPairs.remove(reviverId);
    if (targetId != null) {
      BossBar targetBar = beingRevivedBossBars.remove(targetId);
      if (targetBar != null) {
        targetBar.removeAll();
      }
    }
  }

  /**
   * Checks if a player can revive another player based on distance and other conditions.
   *
   * @param reviver The player attempting to revive
   * @param target The downed player to be revived
   * @return true if the reviver can revive the target, false otherwise
   */
  private boolean canRevive(Player reviver, Player target) {
    if (!isPlayerDowned(target) || isPlayerDowned(reviver)) {
      return false;
    }

    Location targetLoc = target.getLocation();
    Location reviverLoc = reviver.getLocation();

    if (targetLoc == null
        || reviverLoc == null
        || !targetLoc.getWorld().equals(reviverLoc.getWorld())
        || targetLoc.distance(reviverLoc) > reviveRange) {
      return false;
    }

    boolean requireVitalAwakening =
        plugin
            .getConfig()
            .getBoolean("knockdown-system.external-revive.require-vital-awakening", false);

    if (!requireVitalAwakening) {
      return true;
    }

    ItemStack mainHand = reviver.getInventory().getItemInMainHand();
    ItemStack offHand = reviver.getInventory().getItemInOffHand();
    return customItems.isVitalAwakening(mainHand) || customItems.isVitalAwakening(offHand);
  }

  private void applyDownedEffects(Player player) {
    int slowness = plugin.getConfig().getInt("knockdown-system.effects.down.slowness", 255);
    int blindness = plugin.getConfig().getInt("knockdown-system.effects.down.blindness", 1);

    if (slowness > 0) {
      player.addPotionEffect(
          new PotionEffect(PotionEffectType.SLOWNESS, Integer.MAX_VALUE, slowness, false, false));
    }

    if (blindness > 0) {
      player.addPotionEffect(
          new PotionEffect(PotionEffectType.BLINDNESS, Integer.MAX_VALUE, blindness, false, false));
    }
  }

  private void removeDownedEffects(Player player) {
    player.removePotionEffect(PotionEffectType.SLOWNESS);
    player.removePotionEffect(PotionEffectType.BLINDNESS);
  }

  /**
   * Completes the revival process for a downed player.
   *
   * @param reviver The player who revived the downed player
   * @param target The downed player who was revived
   */
  private void completeRevive(Player reviver, Player target) {
    revivePlayer(target);

    if (reviver.equals(target)) {
      String message =
          plugin
              .getConfig()
              .getString(
                  "knockdown-system.effects.messages.self-revived",
                  "<green>You used Vital Awakening to revive yourself!");
      target.sendMessage(MiniMessage.miniMessage().deserialize(message));
    } else {
      String message =
          plugin
              .getConfig()
              .getString(
                  "knockdown-system.effects.messages.revive-complete",
                  "<green>You have been revived by %player%!");
      message = message.replace("%player%", reviver.getName());
      target.sendMessage(MiniMessage.miniMessage().deserialize(message));

      String reviverMessage =
          plugin
              .getConfig()
              .getString(
                  "knockdown-system.effects.messages.reviver-complete",
                  "<green>You successfully revived %player%!");
      reviverMessage = reviverMessage.replace("%player%", target.getName());
      reviver.sendMessage(MiniMessage.miniMessage().deserialize(reviverMessage));
    }
  }

  /**
   * Calculates the remaining time before a downed player dies. Pauses the timer if the player is
   * currently being revived or using Vital Awakening.
   *
   * @param player The downed player
   * @return The remaining time in seconds
   */
  private int getRemainingTime(Player player) {
    UUID playerId = player.getUniqueId();
    if (!downStartTimes.containsKey(playerId)) {
      return 0;
    }

    boolean isBeingRevived = revivingPairs.containsValue(playerId);
    boolean isSelfReviving = selfReviveTasks.containsKey(playerId);

    if ((isBeingRevived || isSelfReviving) && !pauseStartTimes.containsKey(playerId)) {
      pauseStartTimes.put(playerId, System.currentTimeMillis());
    } else if (!(isBeingRevived || isSelfReviving) && pauseStartTimes.containsKey(playerId)) {
      long pauseStart = pauseStartTimes.remove(playerId);
      long pauseDuration = System.currentTimeMillis() - pauseStart;
      totalPausedTime.put(playerId, totalPausedTime.getOrDefault(playerId, 0L) + pauseDuration);
    }

    long startTime = downStartTimes.get(playerId);
    long currentTime = System.currentTimeMillis();
    long pauseTime = totalPausedTime.getOrDefault(playerId, 0L);

    if (pauseStartTimes.containsKey(playerId)) {
      pauseTime += (currentTime - pauseStartTimes.get(playerId));
    }

    int elapsedSeconds = (int) ((currentTime - startTime - pauseTime) / 1000);
    return Math.max(0, downDuration - elapsedSeconds);
  }

  /**
   * Checks if a player is currently in a downed state.
   *
   * @param player The player to check
   * @return true if the player is downed, false otherwise
   */
  public boolean isPlayerDowned(Player player) {
    UUID playerId = player.getUniqueId();
    return downStartTimes.containsKey(playerId);
  }

  /**
   * Gets the maximum range at which players can be revived
   *
   * @return The revival range in blocks
   */
  public double getReviveRange() {
    return reviveRange;
  }

  /**
   * Checks if a player is currently attempting to revive another player.
   *
   * @param player The player to check
   * @return true if the player is attempting to revive someone, false otherwise
   */
  public boolean isAttemptingRevive(Player player) {
    return reviveAttempts.containsKey(player.getUniqueId());
  }
}
