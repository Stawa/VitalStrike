package stawa.vitalstrike.commands;

import java.util.*;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import stawa.vitalstrike.Errors.DatabaseException;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.commands.handlers.*;
import stawa.vitalstrike.logger.VitalLogger;
import stawa.vitalstrike.resources.ResourcePackManager;

/**
 * Manages all commands for the VitalStrike plugin. This class handles command routing, tab
 * completion, and permission checks.
 */
public class CommandManager implements CommandExecutor, TabCompleter {
  private static final String CMD_HELP = "help";

  /** Command constant for the VitalAwakening command */
  private static final String CMD_VITAL_AWAKENING = "vitalawakening";

  private static final String CMD_VA = "va";

  /** Command constant for the Hologram command */
  private static final String CMD_HOLOGRAM = "hologram";

  /** Command constant for the Leaderboard command */
  private static final String CMD_LEADERBOARD = "leaderboard";

  /** Command constant for the Leaderboard shorthand command */
  private static final String CMD_LEADERBOARD_SHORT = "lb";

  /** Command constant for the Reload command */
  private static final String CMD_RELOAD = "reload";

  /** Command constant for the Stats command */
  private static final String CMD_STATS = "stats";

  /** Command constant for the Toggle command */
  private static final String CMD_TOGGLE = "toggle";

  /** Command constant for the Permissions command */
  private static final String CMD_PERMISSIONS = "perm";

  /** Command constant for the ResourcePack command */
  private static final String CMD_RESOURCE_PACK = "resourcepack";

  private static final String CMD_RP = "rp";

  /** Handler for leaderboard-related commands */
  private final LeaderboardCommandHandler leaderboardHandler;

  /** Handler for stats-related commands */
  private final StatsCommandHandler statsHandler;

  /** Handler for toggle-related commands */
  private final ToggleCommandHandler toggleHandler;

  /** Handler for hologram-related commands */
  private final HologramCommandHandler hologramHandler;

  /** Handler for permissions-related commands */
  private final PermissionsCommandHandler permissionsHandler;

  /** The main plugin instance */
  private final VitalStrike plugin;

  /** The plugin's logger */
  private final VitalLogger logger;

  /** The help menu manager */
  private final HelpManager helpManager;

  /** Handler for giving items */
  private final GiveItemCommand giveItemCommand;

  private final ResourcePackCommandHandler resourcePackHandler;

  /**
   * Constructs a new CommandManager.
   *
   * @param plugin the VitalStrike plugin instance
   * @param logger the logger
   * @param playerManager the player manager
   * @param playerStats the player stats
   * @param helpManager the help manager
   * @param resourcePackManager the resource pack manager
   */
  public CommandManager(
      VitalStrike plugin,
      VitalLogger logger,
      PlayerManager playerManager,
      PlayerStats playerStats,
      HelpManager helpManager,
      ResourcePackManager resourcePackManager) {
    this.plugin = plugin;
    this.logger = logger;
    this.helpManager = helpManager;
    this.giveItemCommand = new GiveItemCommand(plugin);
    this.leaderboardHandler = new LeaderboardCommandHandler(plugin, logger, playerStats);
    this.statsHandler = new StatsCommandHandler(plugin, logger, playerStats);
    this.toggleHandler = new ToggleCommandHandler(plugin, logger, playerManager);
    this.hologramHandler = new HologramCommandHandler(plugin, playerManager);
    this.permissionsHandler = new PermissionsCommandHandler(plugin, logger, playerManager);
    this.resourcePackHandler = new ResourcePackCommandHandler(plugin, resourcePackManager);
  }

  /**
   * Handles the command.
   *
   * @param sender the command sender
   * @param command the command
   * @param label the label
   * @param args the arguments
   * @return true if the command was handled, false otherwise
   */
  /**
   * Processes a command and routes it to the appropriate handler.
   *
   * @param sender the command sender
   * @param command the command being executed
   * @param label the command label used
   * @param args the command arguments
   * @return true if the command was handled successfully, false otherwise
   */
  @Override
  public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
    if (!isVitalStrikeCommand(command)) {
      return false;
    }

    if (isHelpCommand(args)) {
      handleHelpCommand(sender, args);
      return true;
    }

    return handleSubCommand(sender, command, label, args);
  }

  /**
   * Checks if the command is a VitalStrike command.
   *
   * @param command the command to check
   * @return true if the command is a VitalStrike command
   */
  private boolean isVitalStrikeCommand(Command command) {
    return command.getName().equalsIgnoreCase("vitalstrike")
        || command.getName().equalsIgnoreCase("vs");
  }

  /**
   * Checks if the command is a help command.
   *
   * @param args the command arguments
   * @return true if the command is a help command
   */
  private boolean isHelpCommand(String[] args) {
    return args.length == 0 || args[0].equalsIgnoreCase(CMD_HELP);
  }

  /**
   * Handles the help command.
   *
   * @param sender the command sender
   * @param args the command arguments
   */
  private void handleHelpCommand(CommandSender sender, String[] args) {
    if (args.length > 1) {
      helpManager.sendHelpSection(sender, args[1]);
    } else {
      helpManager.sendHelpMenu(sender);
    }
  }

  /**
   * Handles a specific subcommand by routing it to the appropriate handler.
   *
   * @param sender the command sender
   * @param command the command being executed
   * @param label the command label
   * @param args the command arguments
   * @return true if the command was handled successfully
   */
  private boolean handleSubCommand(
      CommandSender sender, Command command, String label, String[] args) {
    try {
      return routeCommand(sender, command, label, args[0].toLowerCase(), args);
    } catch (DatabaseException e) {
      handleDatabaseError(sender, e);
      return false;
    }
  }

  /**
   * Routes the command to the appropriate handler based on the subcommand.
   *
   * @param sender the command sender
   * @param command the command being executed
   * @param label the command label
   * @param subCommand the subcommand to route
   * @param args the full command arguments
   * @return true if the command was handled successfully
   */
  private boolean routeCommand(
      CommandSender sender, Command command, String label, String subCommand, String[] args)
      throws DatabaseException {
    return switch (subCommand) {
      case CMD_TOGGLE -> toggleHandler.handleCommand(sender, args);
      case CMD_RELOAD -> handleReloadCommand(sender);
      case CMD_STATS -> statsHandler.handleCommand(sender);
      case CMD_LEADERBOARD, CMD_LEADERBOARD_SHORT -> leaderboardHandler.handleCommand(sender, args);
      case CMD_HOLOGRAM -> hologramHandler.handleCommand(sender, args);
      case CMD_PERMISSIONS -> permissionsHandler.handleCommand(sender, args);
      case CMD_VITAL_AWAKENING, CMD_VA ->
          giveItemCommand.onCommand(
              sender,
              command,
              label,
              args.length > 1 ? Arrays.copyOfRange(args, 1, args.length) : new String[0]);
      case CMD_RESOURCE_PACK, CMD_RP -> resourcePackHandler.handleCommand(sender);
      default -> false;
    };
  }

  /**
   * Handles database errors by sending appropriate messages.
   *
   * @param sender the command sender
   * @param e the database exception
   */
  private void handleDatabaseError(CommandSender sender, DatabaseException e) {
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                "<red>An error occurred while processing your command: " + e.getMessage()));
    logger.severe("Database error: " + e.getMessage());
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
      helpManager.reloadConfig();
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize(
                  plugin
                      .getConfig()
                      .getString(
                          "messages.config-reloaded",
                          "<green>Configuration reloaded successfully!")));
      return true;
    } catch (Exception e) {
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<red>Failed to reload configuration: " + e.getMessage()));
      logger.severe("Error reloading configuration: " + e.getMessage());
      return false;
    }
  }

  /** Checks if sender has permission and sends message if not. */
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
   * Handles tab completion for the plugin commands.
   *
   * @param sender the command sender
   * @param command the command
   * @param alias the alias
   * @param args the arguments
   * @return the list of completions
   */
  public List<String> onTabComplete(
      CommandSender sender, Command command, String alias, String[] args) {
    if (!isVitalStrikeCommand(command)) {
      return Collections.emptyList();
    }

    return getCompletionsForArgument(sender, args);
  }

  /**
   * Gets completions based on argument position.
   *
   * @param sender the command sender
   * @param args the command arguments
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
   * @param arg the current argument
   * @return list of filtered completions
   */
  private List<String> getFirstArgumentCompletions(CommandSender sender, String arg) {
    Map<String, String> commandPermissions =
        Map.ofEntries(
            Map.entry(CMD_TOGGLE, "vitalstrike.toggle"),
            Map.entry(CMD_RELOAD, "vitalstrike.reload"),
            Map.entry(CMD_HELP, "vitalstrike.help"),
            Map.entry(CMD_STATS, "vitalstrike.stats"),
            Map.entry(CMD_LEADERBOARD, "vitalstrike.leaderboard"),
            Map.entry(CMD_LEADERBOARD_SHORT, "vitalstrike.leaderboard"),
            Map.entry(CMD_HOLOGRAM, "vitalstrike.hologram"),
            Map.entry(CMD_PERMISSIONS, "vitalstrike.admin.permissions"),
            Map.entry(CMD_VITAL_AWAKENING, "vitalstrike.vitalawakening"),
            Map.entry(CMD_VA, "vitalstrike.vitalawakening"),
            Map.entry(CMD_RESOURCE_PACK, "vitalstrike.resourcepack"),
            Map.entry(CMD_RP, "vitalstrike.resourcepack"));

    return commandPermissions.entrySet().stream()
        .filter(entry -> sender.hasPermission(entry.getValue()))
        .map(Map.Entry::getKey)
        .filter(cmd -> cmd.toLowerCase().startsWith(arg.toLowerCase()))
        .toList();
  }

  /**
   * Gets completions for the second argument.
   *
   * @param firstArg the first argument
   * @param secondArg the current argument
   * @return list of filtered completions
   */
  private List<String> getSecondArgumentCompletions(String firstArg, String secondArg) {
    List<String> completions = new ArrayList<>();

    switch (firstArg.toLowerCase()) {
      case CMD_TOGGLE, CMD_HOLOGRAM:
        completions.addAll(Arrays.asList("on", "off"));
        break;
      case CMD_LEADERBOARD, CMD_LEADERBOARD_SHORT:
        completions.addAll(Arrays.asList("damage", "combo", "average"));
        break;
      case CMD_PERMISSIONS:
        completions.addAll(Arrays.asList("add", "remove", "list"));
        break;
      case CMD_VITAL_AWAKENING, CMD_VA:
        for (int i = 1; i <= 64; i++) {
          completions.add(String.valueOf(i));
        }
        break;
      case CMD_HELP:
        completions.addAll(helpManager.getHelpSections());
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
   * @param thirdArg the current argument
   * @return list of filtered completions
   */
  private List<String> getThirdArgumentCompletions(String secondArg, String thirdArg) {
    if (secondArg.equalsIgnoreCase("add")
        || secondArg.equalsIgnoreCase("remove")
        || secondArg.equalsIgnoreCase("list")) {
      return Bukkit.getOnlinePlayers().stream()
          .map(Player::getName)
          .filter(name -> name.toLowerCase().startsWith(thirdArg.toLowerCase()))
          .toList();
    }

    return Collections.emptyList();
  }
}
