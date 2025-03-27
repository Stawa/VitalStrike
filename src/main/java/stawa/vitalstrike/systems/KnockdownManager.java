package stawa.vitalstrike.systems;

import java.util.*;

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
import net.kyori.adventure.text.minimessage.MiniMessage;

/**
 * Manages the knockdown system in VitalStrike, handling player states when they are downed in combat.
 * This system allows players to be temporarily incapacitated instead of dying instantly,
 * giving teammates a chance to revive them or allowing self-revival with special items.
 */
public class KnockdownManager {
    private final VitalStrike plugin;
    private final Map<UUID, BukkitTask> downedPlayers = new HashMap<>();
    private final Map<UUID, BukkitTask> revivingTasks = new HashMap<>();
    private final Map<UUID, UUID> revivingPairs = new HashMap<>();
    private final CustomItems customItems;

    private final boolean enabled;
    private final int downDuration;
    private final double reviveDuration;
    private final double reviveRange;
    private final Map<UUID, BossBar> playerBossBars = new HashMap<>();
    private final double downedHealth;
    private final Map<UUID, BukkitTask> selfReviveTasks = new HashMap<>();
    private final Map<UUID, BossBar> selfReviveBars = new HashMap<>();
    private final boolean instantUse;
    private final double useTime;
    private final Map<UUID, Long> downStartTimes = new HashMap<>();

    /**
 * Initializes the KnockdownManager with configuration settings from the plugin.
 *
 * @param plugin The VitalStrike plugin instance
 * @throws Errors.ConfigurationException If there are issues with the configuration values
 */
public KnockdownManager(VitalStrike plugin) throws Errors.ConfigurationException {
        this.plugin = plugin;
        this.enabled = plugin.getConfig().getBoolean("knockdown-system.enabled", true);
        this.downDuration = plugin.getConfig().getInt("knockdown-system.down-duration", 30);
        this.reviveDuration = plugin.getConfig().getDouble("knockdown-system.revive-duration", 5.0);
        this.reviveRange = plugin.getConfig().getDouble("knockdown-system.revive-range", 3.0);
        this.downedHealth = Math.clamp(
                plugin.getConfig().getDouble("knockdown-system.downed-health", 20.0),
                1.0, 20.0);
        this.customItems = new CustomItems(plugin);
        this.instantUse = plugin.getConfig().getBoolean("knockdown-system.vital-awakening.instant-use", false);
        this.useTime = plugin.getConfig().getDouble("knockdown-system.vital-awakening.use-duration", 2.0);
    }

    /**
 * Attempts to initiate a self-revival process for a downed player using a Vital Awakening item.
 * If instant use is enabled, the revival happens immediately. Otherwise, it starts a progress bar.
 *
 * @param player The player attempting to self-revive
 */
public void attemptSelfRevive(Player player) {
        if (!isPlayerDowned(player))
            return;

        ItemStack mainHand = player.getInventory().getItemInMainHand();
        ItemStack offHand = player.getInventory().getItemInOffHand();

        if (instantUse) {
            if (customItems.isVitalAwakening(mainHand)) {
                mainHand.setAmount(mainHand.getAmount() - 1);
                completeRevive(player, player);
            } else if (customItems.isVitalAwakening(offHand)) {
                offHand.setAmount(offHand.getAmount() - 1);
                completeRevive(player, player);
            }
            return;
        }

        if (customItems.isVitalAwakening(mainHand) || customItems.isVitalAwakening(offHand)) {
            startSelfRevive(player);
        }
    }

    /**
 * Cancels an ongoing self-revival attempt for a player.
 * Cleans up associated tasks and progress bars.
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

    private void startSelfRevive(Player player) {
        UUID playerId = player.getUniqueId();

        cancelSelfRevive(player);

        BossBar bossBar = Bukkit.createBossBar(
                "§e§lUsing Vital Awakening...",
                BarColor.YELLOW,
                BarStyle.SOLID);
        bossBar.setProgress(0.0);
        bossBar.addPlayer(player);
        selfReviveBars.put(playerId, bossBar);

        final double[] progress = { 0.0 };
        BukkitTask task = plugin.getServer().getScheduler().runTaskTimer(plugin, () -> {
            if (!isPlayerDowned(player) || !player.isOnline()) {
                cancelSelfRevive(player);
                return;
            }

            progress[0] += 0.05;
            double progressPercent = progress[0] / useTime;
            bossBar.setProgress(Math.min(1.0, progressPercent));

            if (progress[0] >= useTime) {
                ItemStack usedItem = customItems.isVitalAwakening(player.getInventory().getItemInMainHand())
                        ? player.getInventory().getItemInMainHand()
                        : player.getInventory().getItemInOffHand();
                usedItem.setAmount(usedItem.getAmount() - 1);
                completeRevive(player, player);
                cancelSelfRevive(player);
            }
        }, 0L, 1L);

        selfReviveTasks.put(playerId, task);
    }

    /**
 * Performs cleanup of all active knockdown-related tasks and resources.
 * This should be called when the plugin is being disabled or reloaded.
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
    }

    private void createDownedBossBar(Player player) {
        BossBar bossBar = Bukkit.createBossBar(
                "§c§lDowned! Waiting for help...",
                BarColor.RED,
                BarStyle.SOLID);
        bossBar.setProgress(1.0);
        bossBar.addPlayer(player);
        playerBossBars.put(player.getUniqueId(), bossBar);
    }

    private void updateDownedBossBar(Player player, int remainingSeconds) {
        BossBar bossBar = playerBossBars.get(player.getUniqueId());
        if (bossBar != null) {
            double progress = Math.max(0.0, (double) remainingSeconds / downDuration);
            bossBar.setProgress(progress);
            bossBar.setTitle("§c§lDowned! " + remainingSeconds + "s remaining");
        }
    }

    private void removeDownedBossBar(Player player) {
        BossBar bossBar = playerBossBars.remove(player.getUniqueId());
        if (bossBar != null) {
            bossBar.removeAll();
        }
    }

    /**
 * Handles the knockdown state when a player would normally die.
 * Sets up the downed state, effects, and countdown timer.
 *
 * @param player The player entering the knockdown state
 */
public void handlePlayerDeath(Player player) {
        if (!enabled)
            return;
        if (player.getGameMode() == GameMode.CREATIVE ||
                player.getGameMode() == GameMode.SPECTATOR)
            return;
        if (isPlayerDowned(player))
            return;
        player.setHealth(downedHealth);
        player.setInvulnerable(true);
        downStartTimes.put(player.getUniqueId(), System.currentTimeMillis());
        applyDownedEffects(player);
        createDownedBossBar(player);
        BukkitTask task = plugin.getServer().getScheduler().runTaskTimer(plugin, () -> {
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
        }, 20L, 20L);
        downedPlayers.put(player.getUniqueId(), task);
        String downedMessage = plugin.getConfig().getString("knockdown-system.effects.messages.downed",
                "<red>You have been knocked down! Wait for help or death in %time% seconds");
        downedMessage = downedMessage.replace("%time%", String.valueOf(downDuration));
        player.sendMessage(MiniMessage.miniMessage().deserialize(downedMessage));
    }

    private void finalizePlayerDeath(Player player) {
        if (player == null || !player.isOnline())
            return;
        removeDownedState(player);
        plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
            if (player.isOnline()) {
                player.setInvulnerable(false);
                player.setHealth(0);
            }
        }, 2L);
    }

    private void removeDownedState(Player player) {
        if (player == null)
            return;

        UUID playerId = player.getUniqueId();
        BukkitTask task = downedPlayers.remove(playerId);
        if (task != null) {
            task.cancel();
        }
        downStartTimes.remove(playerId);
        removeDownedBossBar(player);
        removeDownedEffects(player);
        player.setInvulnerable(false);
    }

    /**
 * Handles necessary state updates when a player joins the server.
 * Ensures knockdown states are properly maintained across reconnects.
 *
 * @param player The player who joined the server
 */
public void handlePlayerJoin(Player player) {
        if (isPlayerDowned(player)) {
            player.setHealth(downedHealth);
            player.setInvulnerable(true);
            applyDownedEffects(player);
            createDownedBossBar(player);
        }
    }

    /**
 * Initiates the revival process for a downed player by another player.
 * Creates a progress bar and starts the revival countdown.
 *
 * @param reviver The player attempting to revive the downed player
 * @param target The downed player being revived
 */
public void startRevive(Player reviver, Player target) {
        if (!canRevive(reviver, target)) {
            String message = plugin.getConfig().getString("knockdown-system.effects.messages.cannot-revive");
            reviver.sendMessage(MiniMessage.miniMessage().deserialize(message));
            return;
        }

        UUID reviverId = reviver.getUniqueId();
        UUID targetId = target.getUniqueId();

        cancelRevive(reviverId);

        BukkitTask task = plugin.getServer().getScheduler().runTaskTimer(plugin, new Runnable() {
            private double progress = 0;
            private final Location startLoc = reviver.getLocation();

            @Override
            public void run() {
                Location currentLocation = reviver.getLocation();
                if (!canRevive(reviver, target) ||
                        currentLocation == null ||
                        startLoc == null ||
                        !currentLocation.equals(startLoc)) {
                    cancelRevive(reviverId);
                    String message = plugin.getConfig().getString("knockdown-system.effects.messages.revive-failed");
                    reviver.sendMessage(MiniMessage.miniMessage().deserialize(message));
                    return;
                }

                progress += 0.05;
                if (progress >= reviveDuration) {
                    completeRevive(reviver, target);
                    return;
                }

                String message = plugin.getConfig().getString("knockdown-system.effects.messages.reviving");
                message = message.replace("%player%", target.getName())
                        .replace("%progress%", String.format("%.0f", (progress / reviveDuration) * 100));
                reviver.sendActionBar(MiniMessage.miniMessage().deserialize(message));
            }
        }, 0L, 1L);

        revivingTasks.put(reviverId, task);
        revivingPairs.put(reviverId, targetId);
    }

    private void cancelRevive(UUID reviverId) {
        BukkitTask task = revivingTasks.remove(reviverId);
        if (task != null) {
            task.cancel();
        }
        revivingPairs.remove(reviverId);
    }

    private boolean canRevive(Player reviver, Player target) {
        Location targetLoc = target.getLocation();
        Location reviverLoc = reviver.getLocation();

        return isPlayerDowned(target)
                && targetLoc != null
                && reviverLoc != null
                && targetLoc.distance(reviverLoc) <= reviveRange
                && !isPlayerDowned(reviver);
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

    private void completeRevive(Player reviver, Player target) {
        UUID reviverId = reviver.getUniqueId();

        cancelRevive(reviverId);
        BukkitTask downTask = downedPlayers.remove(target.getUniqueId());
        if (downTask != null) {
            downTask.cancel();
        }

        removeDownedBossBar(target);
        target.setInvulnerable(false);
        target.setHealth(target.getAttribute(Attribute.MAX_HEALTH).getDefaultValue() * 0.3);
        removeDownedEffects(target);

        if (reviver == target) {
            String message = plugin.getConfig().getString("knockdown-system.effects.messages.self-revived",
                    "<green>You used Vital Awakening to revive yourself!");
            target.sendMessage(MiniMessage.miniMessage().deserialize(message));
        } else {
            String message = plugin.getConfig().getString("knockdown-system.effects.messages.revived");
            message = message.replace("%player%", reviver.getName());
            target.sendMessage(MiniMessage.miniMessage().deserialize(message));
        }
    }

    private int getRemainingTime(Player player) {
        UUID playerId = player.getUniqueId();
        if (!downStartTimes.containsKey(playerId)) {
            return 0;
        }

        long startTime = downStartTimes.get(playerId);
        long currentTime = System.currentTimeMillis();
        int elapsedSeconds = (int) ((currentTime - startTime) / 1000);
        return Math.max(0, downDuration - elapsedSeconds);
    }

    /**
 * Checks if a player is currently in a downed state.
 *
 * @param player The player to check
 * @return true if the player is downed, false otherwise
 */
public boolean isPlayerDowned(Player player) {
        return downedPlayers.containsKey(player.getUniqueId());
    }
}