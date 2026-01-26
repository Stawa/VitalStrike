package stawa.vitalstrike.commands.handlers;

import java.util.*;
import java.util.function.Function;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.command.CommandSender;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.logger.VitalLogger;

/**
 * Handles leaderboard-related commands for the VitalStrike plugin. This class manages the display
 * of various player statistics leaderboards.
 */
public class LeaderboardCommandHandler {
  /** The main plugin instance */
  private final VitalStrike plugin;

  /** The plugin's logger */
  private final VitalLogger logger;

  /** The player statistics manager */
  private final PlayerStats playerStats;

  /**
   * Constructs a new LeaderboardCommandHandler.
   *
   * @param plugin the VitalStrike plugin instance
   * @param logger the plugin's logger
   * @param playerStats the player statistics manager
   */
  public LeaderboardCommandHandler(
      VitalStrike plugin, VitalLogger logger, PlayerStats playerStats) {
    this.plugin = plugin;
    this.logger = logger;
    this.playerStats = playerStats;
  }

  /**
   * Handles the leaderboard command execution.
   *
   * @param sender the command sender
   * @param args the command arguments
   * @return true if the command was handled successfully, false otherwise
   */
  public boolean handleCommand(CommandSender sender, String[] args) {
    if (!hasPermission(sender)) {
      return false;
    }

    String type = determineLeaderboardType(args);
    return displayLeaderboard(sender, type);
  }

  /**
   * Determines the type of leaderboard to display based on command arguments.
   *
   * @param args the command arguments
   * @return the leaderboard type (defaults to "damage")
   */
  private String determineLeaderboardType(String[] args) {
    return args.length > 1 ? args[1].toLowerCase() : "damage";
  }

  /**
   * Displays the leaderboard to the sender.
   *
   * @param sender the command sender
   * @param type the type of leaderboard to display
   * @return true if displayed successfully, false otherwise
   */
  private boolean displayLeaderboard(CommandSender sender, String type) {
    try {
      LeaderboardData data = getLeaderboardData(type);

      if (data == null) {
        sendNoDataMessage(sender);
        return false;
      }

      if (data.leaderboard.isEmpty()) {
        sendEmptyLeaderboardMessage(sender);
        return true;
      }

      String message = buildLeaderboardMessage(data);
      sender.sendMessage(MiniMessage.miniMessage().deserialize(message));
      return true;
    } catch (Exception e) {
      handleLeaderboardError(sender, e);
      return false;
    }
  }

  /** Represents the data structure for leaderboard information. */
  private static class LeaderboardData {
    final List<Map.Entry<UUID, PlayerStats.PlayerStatistics>> leaderboard;
    final String title;
    final String valueFormat;
    final Function<PlayerStats.PlayerStatistics, Double> valueExtractor;

    LeaderboardData(
        List<Map.Entry<UUID, PlayerStats.PlayerStatistics>> leaderboard,
        String title,
        String valueFormat,
        Function<PlayerStats.PlayerStatistics, Double> valueExtractor) {
      this.leaderboard = leaderboard;
      this.title = title;
      this.valueFormat = valueFormat;
      this.valueExtractor = valueExtractor;
    }
  }

  /**
   * Retrieves leaderboard data based on the specified type.
   *
   * @param type the type of leaderboard to retrieve
   * @return the leaderboard data, or null if invalid type or error
   */
  private LeaderboardData getLeaderboardData(String type) {
    if (playerStats == null) {
      return null;
    }

    int limit = plugin.getConfig().getInt("leaderboard.display-limit", 10);

    try {
      return switch (type) {
        case "damage", "dmg" -> createDamageLeaderboard(limit);
        case "combo", "combos" -> createComboLeaderboard(limit);
        case "average", "avg" -> createAverageLeaderboard(limit);
        default -> null;
      };
    } catch (Exception e) {
      logger.severe("Error retrieving leaderboard data: " + e.getMessage());
      return null;
    }
  }

  /** Creates a damage-based leaderboard. */
  private LeaderboardData createDamageLeaderboard(int limit) {
    return new LeaderboardData(
        playerStats.getTopPlayers(limit, PlayerStats.PlayerStatistics::getTotalDamageDealt),
        plugin
            .getConfig()
            .getString(
                "leaderboard.display.title-formats.damage",
                "<gold><bold>Top %d Damage Dealers</bold></gold>"),
        plugin.getConfig().getString("leaderboard.number-format.damage", "%.1f"),
        PlayerStats.PlayerStatistics::getTotalDamageDealt);
  }

  /** Creates a combo-based leaderboard. */
  private LeaderboardData createComboLeaderboard(int limit) {
    return new LeaderboardData(
        playerStats.getTopPlayers(limit, stats -> (double) stats.getHighestCombo()),
        plugin
            .getConfig()
            .getString(
                "leaderboard.display.title-formats.combo",
                "<gold><bold>Top %d Highest Combos</bold></gold>"),
        plugin.getConfig().getString("leaderboard.number-format.combo", "%d"),
        stats -> (double) stats.getHighestCombo());
  }

  /** Creates an average damage leaderboard. */
  private LeaderboardData createAverageLeaderboard(int limit) {
    return new LeaderboardData(
        playerStats.getTopPlayers(limit, PlayerStats.PlayerStatistics::getAverageDamagePerHit),
        plugin
            .getConfig()
            .getString(
                "leaderboard.display.title-formats.average",
                "<gold><bold>Top %d Average Damage</bold></gold>"),
        plugin.getConfig().getString("leaderboard.number-format.average", "%.1f"),
        PlayerStats.PlayerStatistics::getAverageDamagePerHit);
  }

  /** Builds the formatted leaderboard message. */
  private String buildLeaderboardMessage(LeaderboardData data) {
    StringBuilder message = new StringBuilder();
    String header =
        plugin
            .getConfig()
            .getString(
                "leaderboard.display.header",
                "<dark_gray><strikethrough>                    </strikethrough>");
    String footer =
        plugin
            .getConfig()
            .getString(
                "leaderboard.display.footer",
                "<dark_gray><strikethrough>                    </strikethrough>");
    String entryFormat =
        plugin
            .getConfig()
            .getString("leaderboard.display.entry-format", "<yellow>#%d <white>%s: <gold>%s");

    int limit = plugin.getConfig().getInt("leaderboard.display-limit", 10);

    message.append(header).append("\n").append(String.format(data.title, limit)).append("\n");

    buildLeaderboardEntries(message, data, entryFormat);
    message.append(footer);
    return message.toString();
  }

  /** Builds the individual leaderboard entries. */
  private void buildLeaderboardEntries(
      StringBuilder message, LeaderboardData data, String entryFormat) {
    int rank = 1;
    for (Map.Entry<UUID, PlayerStats.PlayerStatistics> entry : data.leaderboard) {
      String playerName = Bukkit.getOfflinePlayer(entry.getKey()).getName();
      if (playerName == null) continue;

      String formattedValue =
          formatValue(data.valueExtractor.apply(entry.getValue()), data.valueFormat);
      message.append(String.format(entryFormat, rank++, playerName, formattedValue)).append("\n");
    }
  }

  /** Formats a value according to the specified format string. */
  private String formatValue(double value, String format) {
    return format.contains("%d")
        ? String.format(format, (int) value)
        : String.format(format, value);
  }

  /** Checks if the sender has the required permission. */
  private boolean hasPermission(CommandSender sender) {
    if (!sender.hasPermission("vitalstrike.leaderboard")) {
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

  /** Sends an error message when no leaderboard data is available. */
  private void sendNoDataMessage(CommandSender sender) {
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                "<red>No leaderboard data available. Either the leaderboard type is invalid or no player statistics exist yet."));
  }

  /** Sends a message when the leaderboard is empty. */
  private void sendEmptyLeaderboardMessage(CommandSender sender) {
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                "<yellow>The leaderboard is currently empty. Play more to see statistics!"));
  }

  /** Handles and logs leaderboard errors. */
  private void handleLeaderboardError(CommandSender sender, Exception e) {
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize("<red>Failed to retrieve leaderboard: " + e.getMessage()));
    logger.severe("Error retrieving leaderboard: " + e.getMessage());
  }
}
