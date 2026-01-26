package stawa.vitalstrike.commands.handlers;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.logger.VitalLogger;

/**
 * Handles statistics-related commands for the VitalStrike plugin. This class manages the display of
 * player combat statistics.
 */
public class StatsCommandHandler {
  /** The main plugin instance */
  private final VitalStrike plugin;

  /** The plugin's logger */
  private final VitalLogger logger;

  /** The player statistics manager */
  private final PlayerStats playerStats;

  /**
   * Constructs a new StatsCommandHandler.
   *
   * @param plugin the VitalStrike plugin instance
   * @param logger the plugin's logger
   * @param playerStats the player statistics manager
   */
  public StatsCommandHandler(VitalStrike plugin, VitalLogger logger, PlayerStats playerStats) {
    this.plugin = plugin;
    this.logger = logger;
    this.playerStats = playerStats;
  }

  /**
   * Handles the stats command execution.
   *
   * @param sender the command sender
   * @return true if the command was handled successfully, false otherwise
   */
  public boolean handleCommand(CommandSender sender) {
    if (!(sender instanceof Player)) {
      sendPlayerOnlyMessage(sender);
      return false;
    }

    if (!hasPermission(sender, "vitalstrike.stats")) {
      return false;
    }

    return displayPlayerStats(sender);
  }

  /**
   * Displays the player's combat statistics.
   *
   * @param sender the command sender
   * @return true if stats were displayed successfully, false otherwise
   */
  private boolean displayPlayerStats(CommandSender sender) {
    try {
      Player statsPlayer = (Player) sender;
      PlayerStats.PlayerStatistics stats = playerStats.getPlayerStats(statsPlayer.getUniqueId());

      String statsMessage = buildStatsMessage(stats);
      sender.sendMessage(MiniMessage.miniMessage().deserialize(statsMessage));
      return true;
    } catch (Exception e) {
      handleStatsError(sender, e);
      return false;
    }
  }

  /**
   * Builds the formatted statistics message.
   *
   * @param stats the player's statistics
   * @return the formatted message string
   */
  private String buildStatsMessage(PlayerStats.PlayerStatistics stats) {
    return "<dark_gray><strikethrough>                    </strikethrough>\n"
        + "<gold><bold>Your Combat Statistics</bold></gold>\n"
        + "<yellow>Highest Combo: <white>"
        + stats.getHighestCombo()
        + "\n"
        + "<yellow>Total Damage Dealt: <white>"
        + String.format("%.1f", stats.getTotalDamageDealt())
        + "\n"
        + "<yellow>Average Damage/Hit: <white>"
        + String.format("%.1f", stats.getAverageDamagePerHit())
        + "\n"
        + "<yellow>Total Hits: <white>"
        + stats.getTotalHits()
        + "\n"
        + "<dark_gray><strikethrough>                    </strikethrough>";
  }

  /**
   * Handles and logs statistics retrieval errors.
   *
   * @param sender the command sender
   * @param e the exception that occurred
   */
  private void handleStatsError(CommandSender sender, Exception e) {
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize("<red>Failed to retrieve statistics: " + e.getMessage()));
    logger.severe("Error retrieving player statistics: " + e.getMessage());
  }

  /**
   * Checks if the sender has the required permission.
   *
   * @param sender the command sender
   * @param permission the permission to check
   * @return true if the sender has permission, false otherwise
   */
  private boolean hasPermission(CommandSender sender, String permission) {
    if (!sender.hasPermission(permission)) {
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize(
                  plugin
                      .getConfig()
                      .getString(
                          "messages.no-permission",
                          "<red>You don't have permission to use this command!")));
      return false;
    }
    return true;
  }

  /**
   * Sends a player-only command message to the sender.
   *
   * @param sender the command sender
   */
  private void sendPlayerOnlyMessage(CommandSender sender) {
    sender.sendMessage(
        MiniMessage.miniMessage().deserialize("<red>This command can only be used by players!"));
  }
}
