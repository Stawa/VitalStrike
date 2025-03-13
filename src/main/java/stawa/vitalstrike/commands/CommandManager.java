package stawa.vitalstrike.commands;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.entity.Player;
import stawa.vitalstrike.Errors.DatabaseException;
import stawa.vitalstrike.HelpManager;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.logger.VitalLogger;

import java.util.*;
import java.util.function.Function;

/**
 * Manages all commands for the VitalStrike plugin.
 */
public class CommandManager {
    private static final String CMD_HOLOGRAM = "hologram";
    private static final String CMD_LEADERBOARD = "leaderboard";
    private static final String CMD_LEADERBOARD_SHORT = "lb";
    private static final String CMD_RELOAD = "reload";
    private static final String CMD_STATS = "stats";
    private static final String CMD_TOGGLE = "toggle";
    private static final String CMD_PERMISSIONS = "perm";

    private final VitalStrike plugin;
    private final VitalLogger logger;
    private final PlayerManager playerManager;
    private final PlayerStats playerStats;
    private final HelpManager helpManager;

    /**
     * Constructs a new CommandManager.
     *
     * @param plugin        the VitalStrike plugin instance
     * @param logger        the logger
     * @param playerManager the player manager
     * @param playerStats   the player stats
     * @param helpManager   the help manager
     */
    public CommandManager(VitalStrike plugin, VitalLogger logger, PlayerManager playerManager,
            PlayerStats playerStats, HelpManager helpManager) {
        this.plugin = plugin;
        this.logger = logger;
        this.playerManager = playerManager;
        this.playerStats = playerStats;
        this.helpManager = helpManager;
    }

    /**
     * Handles the command.
     * 
     * @param sender  the command sender
     * @param command the command
     * @param label   the label
     * @param args    the arguments
     * @return true if the command was handled, false otherwise
     */
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!command.getName().equalsIgnoreCase("vitalstrike")) {
            return false;
        }

        if (args.length == 0 || args[0].equalsIgnoreCase("help")) {
            if (args.length > 1) {
                helpManager.sendHelpSection(sender, args[1]);
            } else {
                helpManager.sendHelpMenu(sender);
            }
            return true;
        }

        String subCommand = args[0].toLowerCase();

        try {
            switch (subCommand) {
                case CMD_TOGGLE:
                    return handleToggleCommand(sender, args);
                case CMD_RELOAD:
                    return handleReloadCommand(sender);
                case CMD_STATS:
                    return handleStatsCommand(sender);
                case CMD_LEADERBOARD, CMD_LEADERBOARD_SHORT:
                    return handleLeaderboardCommand(sender, args);
                case CMD_HOLOGRAM:
                    return handleHologramCommand(sender, args);
                case CMD_PERMISSIONS:
                    return handlePermissionsCommand(sender, args);
                default:
                    return false;
            }
        } catch (DatabaseException e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>An error occurred while processing your command: " + e.getMessage()));
            logger.severe("Database error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Handles the permission management commands.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handlePermissionsCommand(CommandSender sender, String[] args) {
        if (!hasPermission(sender, "vitalstrike.admin.permissions")) {
            return false;
        }

        if (args.length < 3) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Usage: /vs perm <add|remove|list> <player> [permission]"));
            return false;
        }

        String action = args[1].toLowerCase();
        String playerName = args[2];

        Player targetPlayer = Bukkit.getPlayer(playerName);
        if (targetPlayer == null) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Player not found: " + playerName));
            return false;
        }

        switch (action) {
            case "add":
                if (args.length < 4) {
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            "<red>Usage: /vs perm add <player> <permission>"));
                    return false;
                }
                addPermission(sender, targetPlayer, args[3]);
                return true;
            case "remove":
                if (args.length < 4) {
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            "<red>Usage: /vs perm remove <player> <permission>"));
                    return false;
                }
                removePermission(sender, targetPlayer, args[3]);
                return true;
            case "list":
                listPermissions(sender, targetPlayer);
                return true;
            default:
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>Unknown action: " + action));
                return false;
        }
    }

    /**
     * Removes a permission from a player.
     * 
     * @param sender       the command sender
     * @param targetPlayer the target player
     * @param permission   the permission to remove
     */
    private void removePermission(CommandSender sender, Player targetPlayer, String permission) {
        try {
            if (!permission.startsWith("vitalstrike.")) {
                permission = "vitalstrike." + permission;
            }

            UUID uuid = targetPlayer.getUniqueId();
            String path = "players." + uuid + ".permissions";

            List<String> permissions = playerManager.getDatabase().getStringList(path);

            if (!permissions.contains(permission)) {
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>Player <yellow>" + targetPlayer.getName() +
                                "</yellow> does not have the permission <yellow>" + permission + "</yellow>"));
                return;
            }

            targetPlayer.addAttachment(plugin, permission, false);
            permissions.remove(permission);
            playerManager.getDatabase().set(path, permissions);
            playerManager.saveDatabase();

            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<green>Removed permission <yellow>" + permission + "</yellow> from player <yellow>"
                            + targetPlayer.getName() + "</yellow>"));

            logger.info(sender.getName() + " removed permission " + permission + " from " + targetPlayer.getName());
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to remove permission: " + e.getMessage()));
            logger.warning("Failed to remove permission: " + e.getMessage());
        }
    }

    /**
     * Handles the toggle command.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleToggleCommand(CommandSender sender, String[] args) {
        if (!(sender instanceof Player)) {
            sendPlayerOnlyMessage(sender);
            return false;
        }

        if (!hasPermission(sender, "vitalstrike.use")) {
            return false;
        }

        if (playerManager == null) {
            logger.severe("PlayerManager is null in CommandManager.handleToggleCommand");
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>An internal error occurred. Please contact the server administrator."));
            return false;
        }

        Player player = (Player) sender;
        boolean currentState = playerManager.isEnabled(player);

        if (args.length > 1) {
            return handleSpecificToggle(player, args[1], currentState);
        }

        playerManager.setEnabled(player, !currentState);
        sendToggleMessage(player, !currentState);
        return true;
    }

    /**
     * Handles specific on/off toggle commands.
     */
    private boolean handleSpecificToggle(Player player, String toggleType, boolean currentState) {
        switch (toggleType.toLowerCase()) {
            case "on":
                if (currentState) {
                    sendAlreadyEnabledMessage(player);
                    return false;
                }
                playerManager.setEnabled(player, true);
                sendToggleMessage(player, true);
                return true;

            case "off":
                if (!currentState) {
                    sendAlreadyDisabledMessage(player);
                    return false;
                }
                playerManager.setEnabled(player, false);
                sendToggleMessage(player, false);
                return true;

            default:
                player.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>Invalid toggle option. Use 'on' or 'off'."));
                return false;
        }
    }

    /**
     * Handles the reload command.
     * 
     * @param sender the command sender
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleReloadCommand(CommandSender sender) {
        if (!hasPermission(sender, "vitalstrike.reload")) {
            return false;
        }

        try {
            plugin.reload();
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    plugin.getConfig().getString("messages.config-reloaded",
                            "<green>Configuration reloaded successfully!")));
            return true;
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to reload configuration: " + e.getMessage()));
            logger.severe("Error reloading configuration: " + e.getMessage());
            return false;
        }
    }

    /**
     * Adds a permission to a player.
     * 
     * @param sender       the command sender
     * @param targetPlayer the target player
     * @param permission   the permission to add
     */
    private void addPermission(CommandSender sender, Player targetPlayer, String permission) {
        try {
            if (!permission.startsWith("vitalstrike.")) {
                permission = "vitalstrike." + permission;
            }

            targetPlayer.addAttachment(plugin, permission, true);

            UUID uuid = targetPlayer.getUniqueId();
            String path = "players." + uuid + ".permissions";
            List<String> permissions = playerManager.getDatabase().getStringList(path);

            if (!permissions.contains(permission)) {
                permissions.add(permission);
                playerManager.getDatabase().set(path, permissions);
                playerManager.saveDatabase();
            }

            if (permission.startsWith("vitalstrike.group.")) {
                logger.info("Added group permission: " + permission + " to player " + targetPlayer.getName());
            }

            if (targetPlayer != sender) {
                targetPlayer.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<green>You've been granted the permission <yellow>" + permission + "</yellow>"));
            }

            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<green>Added permission <yellow>" + permission + "</yellow> to player <yellow>"
                            + targetPlayer.getName() + "</yellow>"));

            logger.info(sender.getName() + " added permission " + permission + " to " + targetPlayer.getName());

            if (permission.startsWith("vitalstrike.group.")) {
                plugin.refreshPlayerDamageFormat(targetPlayer);
            }
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to add permission: " + e.getMessage()));
            logger.warning("Failed to add permission: " + e.getMessage());
        }
    }

    /**
     * Lists all VitalStrike permissions a player has.
     * 
     * @param sender       the command sender
     * @param targetPlayer the target player
     */
    private void listPermissions(CommandSender sender, Player targetPlayer) {
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                "<green>Permissions for player <yellow>" + targetPlayer.getName() + "</yellow>:"));

        StringBuilder permList = new StringBuilder();

        for (org.bukkit.permissions.PermissionAttachmentInfo perm : targetPlayer.getEffectivePermissions()) {
            if (perm.getPermission().startsWith("vitalstrike.") && perm.getValue()) {
                if (targetPlayer.isOp() && !isExplicitlyAssigned(targetPlayer, perm.getPermission())) {
                    continue;
                }
                permList.append("<yellow>").append(perm.getPermission()).append("</yellow>\n");
            }
        }

        if (permList.length() == 0) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize("<gray>No VitalStrike permissions found."));
        } else {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(permList.toString()));
        }
    }

    /**
     * Checks if a permission is explicitly assigned to a player rather than
     * inherited from OP status.
     * 
     * @param player     the player to check
     * @param permission the permission to check
     * @return true if the permission is explicitly assigned, false otherwise
     */
    private boolean isExplicitlyAssigned(Player player, String permission) {
        return playerManager.hasPlayerPermission(player.getUniqueId(), permission);
    }

    /**
     * Handles the stats command.
     * 
     * @param sender the command sender
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleStatsCommand(CommandSender sender) {
        if (!(sender instanceof Player)) {
            sendPlayerOnlyMessage(sender);
            return false;
        }

        if (!hasPermission(sender, "vitalstrike.stats")) {
            return false;
        }

        try {
            Player statsPlayer = (Player) sender;
            PlayerStats.PlayerStatistics stats = playerStats.getPlayerStats(statsPlayer.getUniqueId());

            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<dark_gray><strikethrough>                    </strikethrough>\n" +
                            "<gold><bold>Your Combat Statistics</bold></gold>\n" +
                            "<yellow>Highest Combo: <white>" + stats.getHighestCombo() + "\n" +
                            "<yellow>Total Damage Dealt: <white>" +
                            String.format("%.1f", stats.getTotalDamageDealt()) + "\n" +
                            "<yellow>Average Damage/Hit: <white>" +
                            String.format("%.1f", stats.getAverageDamagePerHit()) + "\n" +
                            "<yellow>Total Hits: <white>" + stats.getTotalHits() + "\n" +
                            "<dark_gray><strikethrough>                    </strikethrough>"));
            return true;
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to retrieve statistics: " + e.getMessage()));
            logger.severe("Error retrieving player statistics: " + e.getMessage());
            return false;
        }
    }

    /**
     * Handles the leaderboard command.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleLeaderboardCommand(CommandSender sender, String[] args) {
        if (!hasPermission(sender, "vitalstrike.leaderboard")) {
            return false;
        }

        String type = "damage";
        if (args.length > 1) {
            type = args[1].toLowerCase();
        }

        try {
            LeaderboardData data = getLeaderboardData(type);

            if (data == null) {
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>No leaderboard data available. Either the leaderboard type is invalid or no player statistics exist yet."));
                return false;
            }

            if (data.leaderboard.isEmpty()) {
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<yellow>The leaderboard is currently empty. Play more to see statistics!"));
                return true;
            }

            String message = buildLeaderboardMessage(data);
            sender.sendMessage(MiniMessage.miniMessage().deserialize(message));
            return true;
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to retrieve leaderboard: " + e.getMessage()));
            logger.severe("Error retrieving leaderboard: " + e.getMessage());
            return false;
        }
    }

    /**
     * Handles the hologram command.
     */
    private boolean handleHologramCommand(CommandSender sender, String[] args) throws DatabaseException {
        if (!(sender instanceof Player)) {
            sendPlayerOnlyMessage(sender);
            return false;
        }

        if (!hasPermission(sender, "vitalstrike.hologram")) {
            return false;
        }

        Player player = (Player) sender;
        boolean currentState = playerManager.isHologramEnabled(player);

        if (args.length > 1) {
            return handleSpecificHologramToggle(player, args[1], currentState);
        }

        playerManager.setHologramEnabled(player, !currentState);
        sendHologramToggleMessage(player, !currentState);
        return true;
    }

    private boolean handleSpecificHologramToggle(Player player, String toggleType, boolean currentState)
            throws DatabaseException {
        switch (toggleType.toLowerCase()) {
            case "on":
                if (currentState) {
                    player.sendMessage(MiniMessage.miniMessage().deserialize(
                            "<yellow>Combo holograms are already enabled for you!"));
                    return false;
                }
                playerManager.setHologramEnabled(player, true);
                sendHologramToggleMessage(player, true);
                return true;

            case "off":
                if (!currentState) {
                    player.sendMessage(MiniMessage.miniMessage().deserialize(
                            "<yellow>Combo holograms are already disabled for you!"));
                    return false;
                }
                playerManager.setHologramEnabled(player, false);
                sendHologramToggleMessage(player, false);
                return true;

            default:
                player.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>Invalid toggle option. Use 'on' or 'off'."));
                return false;
        }
    }

    private void sendHologramToggleMessage(Player player, boolean enabled) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                enabled ? "<green>Combo holograms enabled for you!" : "<red>Combo holograms disabled for you!"));
    }

    /**
     * Container class for leaderboard data.
     */
    private class LeaderboardData {
        final List<Map.Entry<UUID, PlayerStats.PlayerStatistics>> leaderboard;
        final String title;
        final String valueFormat;
        final Function<PlayerStats.PlayerStatistics, Double> valueExtractor;

        LeaderboardData(List<Map.Entry<UUID, PlayerStats.PlayerStatistics>> leaderboard,
                String title, String valueFormat,
                Function<PlayerStats.PlayerStatistics, Double> valueExtractor) {
            this.leaderboard = leaderboard;
            this.title = title;
            this.valueFormat = valueFormat;
            this.valueExtractor = valueExtractor;
        }
    }

    /**
     * Gets leaderboard data based on type.
     */
    private LeaderboardData getLeaderboardData(String type) {
        int limit = plugin.getConfig().getInt("leaderboard.display-limit", 10);

        if (playerStats == null) {
            return null;
        }

        try {
            switch (type) {
                case "damage", "dmg":
                    return new LeaderboardData(
                            playerStats.getTopPlayers(limit, PlayerStats.PlayerStatistics::getTotalDamageDealt),
                            plugin.getConfig().getString("leaderboard.display.title-formats.damage",
                                    "<gold><bold>Top %d Damage Dealers</bold></gold>"),
                            plugin.getConfig().getString("leaderboard.number-format.damage", "%.1f"),
                            PlayerStats.PlayerStatistics::getTotalDamageDealt);
                case "combo", "combos":
                    return new LeaderboardData(
                            playerStats.getTopPlayers(limit, stats -> (double) stats.getHighestCombo()),
                            plugin.getConfig().getString("leaderboard.display.title-formats.combo",
                                    "<gold><bold>Top %d Highest Combos</bold></gold>"),
                            plugin.getConfig().getString("leaderboard.number-format.combo", "%d"),
                            stats -> (double) stats.getHighestCombo());
                case "average", "avg":
                    return new LeaderboardData(
                            playerStats.getTopPlayers(limit, PlayerStats.PlayerStatistics::getAverageDamagePerHit),
                            plugin.getConfig().getString("leaderboard.display.title-formats.average",
                                    "<gold><bold>Top %d Average Damage</bold></gold>"),
                            plugin.getConfig().getString("leaderboard.number-format.average", "%.1f"),
                            PlayerStats.PlayerStatistics::getAverageDamagePerHit);
                default:
                    return null;
            }
        } catch (Exception e) {
            logger.severe("Error retrieving leaderboard data: " + e.getMessage());
            return null;
        }
    }

    /**
     * Builds the leaderboard message.
     */
    private String buildLeaderboardMessage(LeaderboardData data) {
        StringBuilder message = new StringBuilder();
        String header = plugin.getConfig().getString("leaderboard.display.header",
                "<dark_gray><strikethrough>                    </strikethrough>");
        String footer = plugin.getConfig().getString("leaderboard.display.footer",
                "<dark_gray><strikethrough>                    </strikethrough>");
        String entryFormat = plugin.getConfig().getString("leaderboard.display.entry-format",
                "<yellow>#%d <white>%s: <gold>%s");

        int limit = plugin.getConfig().getInt("leaderboard.display-limit", 10);

        message.append(header).append("\n")
                .append(String.format(data.title, limit)).append("\n");

        int rank = 1;
        for (Map.Entry<UUID, PlayerStats.PlayerStatistics> entry : data.leaderboard) {
            String playerName = Bukkit.getOfflinePlayer(entry.getKey()).getName();
            if (playerName == null)
                continue;

            double value = data.valueExtractor.apply(entry.getValue());
            String formattedValue;

            if (data.valueFormat.contains("%d")) {
                formattedValue = String.format(data.valueFormat, (int) value);
            } else {
                formattedValue = String.format(data.valueFormat, value);
            }

            message.append(String.format(entryFormat, rank++, playerName, formattedValue)).append("\n");
        }

        message.append(footer);
        return message.toString();
    }

    /**
     * Checks if sender has permission and sends message if not.
     */
    private boolean hasPermission(CommandSender sender, String permission) {
        if (!sender.hasPermission(permission)) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    plugin.getConfig().getString("messages.no-permission",
                            "<red>You don't have permission to use this command!")));
            return false;
        }
        return true;
    }

    /**
     * Sends player-only command message.
     */
    private void sendPlayerOnlyMessage(CommandSender sender) {
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                "<red>This command can only be used by players!"));
    }

    /**
     * Sends toggle state message.
     */
    private void sendToggleMessage(Player player, boolean enabled) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                plugin.getConfig().getString("messages." + (enabled ? "enabled-personal" : "disabled-personal"))));
    }

    /**
     * Sends already enabled message.
     */
    private void sendAlreadyEnabledMessage(Player player) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                plugin.getConfig().getString("messages.already-enabled",
                        "<yellow>VitalStrike damage indicators are already enabled for you!")));
    }

    /**
     * Sends already disabled message.
     */
    private void sendAlreadyDisabledMessage(Player player) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                plugin.getConfig().getString("messages.already-disabled",
                        "<yellow>VitalStrike damage indicators are already disabled for you!")));
    }

    /**
     * Handles tab completion for the plugin commands.
     * 
     * @param sender  the command sender
     * @param command the command
     * @param alias   the alias
     * @param args    the arguments
     * @return the list of completions
     */
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (!command.getName().equalsIgnoreCase("vitalstrike")) {
            return Collections.emptyList();
        }

        return getCompletionsForArgument(sender, args);
    }

    /**
     * Gets completions based on argument position.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return list of tab completions
     */
    private List<String> getCompletionsForArgument(CommandSender sender, String[] args) {
        if (args.length == 1) {
            return getFirstArgumentCompletions(sender, args[0]);
        }

        if (args.length == 2) {
            return getSecondArgumentCompletions(args[0], args[1]);
        }

        if (args.length == 3 && args[0].equalsIgnoreCase(CMD_PERMISSIONS)) {
            return getThirdArgumentCompletions(args[1], args[2]);
        }

        return Collections.emptyList();
    }

    /**
     * Gets completions for the first argument.
     * 
     * @param sender the command sender
     * @param arg    the current argument
     * @return list of filtered completions
     */
    private List<String> getFirstArgumentCompletions(CommandSender sender, String arg) {
        List<String> completions = new ArrayList<>();

        if (sender.hasPermission("vitalstrike.toggle"))
            completions.add(CMD_TOGGLE);
        if (sender.hasPermission("vitalstrike.reload"))
            completions.add(CMD_RELOAD);
        if (sender.hasPermission("vitalstrike.help"))
            completions.add("help");
        if (sender.hasPermission("vitalstrike.stats"))
            completions.add(CMD_STATS);
        if (sender.hasPermission("vitalstrike.leaderboard")) {
            completions.add(CMD_LEADERBOARD);
            completions.add(CMD_LEADERBOARD_SHORT);
        }
        if (sender.hasPermission("vitalstrike.hologram"))
            completions.add(CMD_HOLOGRAM);
        if (sender.hasPermission("vitalstrike.admin.permissions"))
            completions.add(CMD_PERMISSIONS);

        return completions.stream()
                .filter(s -> s.toLowerCase().startsWith(arg.toLowerCase()))
                .toList();
    }

    /**
     * Gets completions for the second argument.
     * 
     * @param firstArg  the first argument
     * @param secondArg the current argument
     * @return list of filtered completions
     */
    private List<String> getSecondArgumentCompletions(String firstArg, String secondArg) {
        List<String> completions = new ArrayList<>();

        switch (firstArg.toLowerCase()) {
            case CMD_TOGGLE:
            case CMD_HOLOGRAM:
                completions.addAll(Arrays.asList("on", "off"));
                break;
            case CMD_LEADERBOARD, CMD_LEADERBOARD_SHORT:
                completions.addAll(Arrays.asList("damage", "combo", "average"));
                break;
            case CMD_PERMISSIONS:
                completions.addAll(Arrays.asList("add", "remove", "list"));
                break;
            case "help":
                ConfigurationSection helpSections = plugin.getConfig().getConfigurationSection("help-menu.sections");
                if (helpSections != null) {
                    completions.addAll(helpSections.getKeys(false));
                }
                break;
            default:
                return Collections.emptyList();
        }

        return completions.stream()
                .filter(s -> s.toLowerCase().startsWith(secondArg.toLowerCase()))
                .toList();
    }

    /**
     * Gets completions for the third argument.
     * 
     * @param secondArg the second argument
     * @param thirdArg  the current argument
     * @return list of filtered completions
     */
    private List<String> getThirdArgumentCompletions(String secondArg, String thirdArg) {
        if (secondArg.equalsIgnoreCase("add") || secondArg.equalsIgnoreCase("remove") ||
                secondArg.equalsIgnoreCase("list")) {
            return Bukkit.getOnlinePlayers().stream()
                    .map(Player::getName)
                    .filter(name -> name.toLowerCase().startsWith(thirdArg.toLowerCase()))
                    .toList();
        }

        return Collections.emptyList();
    }
}