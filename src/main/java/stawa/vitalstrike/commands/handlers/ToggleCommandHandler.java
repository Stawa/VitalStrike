package stawa.vitalstrike.commands.handlers;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.logger.VitalLogger;

/**
 * Handles toggle-related commands for the VitalStrike plugin. This class manages the enabling and
 * disabling of damage indicators for players.
 */
public class ToggleCommandHandler {
  /** The main plugin instance */
  private final VitalStrike plugin;

  /** The plugin's logger */
  private final VitalLogger logger;

  /** The player manager instance */
  private final PlayerManager playerManager;

  /**
   * Constructs a new ToggleCommandHandler.
   *
   * @param plugin the VitalStrike plugin instance
   * @param logger the plugin's logger
   * @param playerManager the player manager instance
   */
  public ToggleCommandHandler(VitalStrike plugin, VitalLogger logger, PlayerManager playerManager) {
    this.plugin = plugin;
    this.logger = logger;
    this.playerManager = playerManager;
  }

  /**
   * Handles the toggle command execution.
   *
   * @param sender the command sender
   * @param args the command arguments
   * @return true if the command was handled successfully, false otherwise
   */
  public boolean handleCommand(CommandSender sender, String[] args) {
    if (!(sender instanceof Player)) {
      sendPlayerOnlyMessage(sender);
      return false;
    }

    if (!hasPermission(sender, "vitalstrike.use")) {
      return false;
    }

    if (playerManager == null) {
      logger.severe("PlayerManager is null in ToggleCommandHandler.handleCommand");
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize(
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
   * Handles specific toggle commands (on/off).
   *
   * @param player the player executing the command
   * @param toggleType the type of toggle (on/off)
   * @param currentState the current toggle state
   * @return true if the toggle was successful, false otherwise
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
        player.sendMessage(
            MiniMessage.miniMessage()
                .deserialize("<red>Invalid toggle option. Use 'on' or 'off'."));
        return false;
    }
  }

  /**
   * Sends a toggle status message to the player.
   *
   * @param player the player to send the message to
   * @param enabled the new toggle state
   */
  private void sendToggleMessage(Player player, boolean enabled) {
    player.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                plugin
                    .getConfig()
                    .getString(
                        "messages." + (enabled ? "enabled-personal" : "disabled-personal"))));
  }

  /**
   * Sends a message when indicators are already enabled.
   *
   * @param player the player to send the message to
   */
  private void sendAlreadyEnabledMessage(Player player) {
    player.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                plugin
                    .getConfig()
                    .getString(
                        "messages.already-enabled",
                        "<yellow>VitalStrike damage indicators are already enabled for you!")));
  }

  /**
   * Sends a message when indicators are already disabled.
   *
   * @param player the player to send the message to
   */
  private void sendAlreadyDisabledMessage(Player player) {
    player.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                plugin
                    .getConfig()
                    .getString(
                        "messages.already-disabled",
                        "<yellow>VitalStrike damage indicators are already disabled for you!")));
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
