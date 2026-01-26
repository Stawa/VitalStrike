package stawa.vitalstrike.commands.handlers;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import stawa.vitalstrike.Errors.DatabaseException;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.VitalStrike;

/**
 * Handles hologram-related commands for the VitalStrike plugin. This class manages the toggling of
 * combo holograms for players.
 */
public class HologramCommandHandler {
  /** The main plugin instance */
  private final VitalStrike plugin;

  /** The player manager instance */
  private final PlayerManager playerManager;

  /**
   * Constructs a new HologramCommandHandler.
   *
   * @param plugin the VitalStrike plugin instance
   * @param playerManager the player manager instance
   */
  public HologramCommandHandler(VitalStrike plugin, PlayerManager playerManager) {
    this.plugin = plugin;
    this.playerManager = playerManager;
  }

  /**
   * Handles the hologram command execution.
   *
   * @param sender the command sender
   * @param args the command arguments
   * @return true if the command was handled successfully, false otherwise
   * @throws DatabaseException if a database error occurs
   */
  public boolean handleCommand(CommandSender sender, String[] args) throws DatabaseException {
    if (!(sender instanceof Player)) {
      sendPlayerOnlyMessage(sender);
      return false;
    }

    if (!hasPermission(sender, "vitalstrike.hologram")) {
      return false;
    }

    return handleHologramToggle((Player) sender, args);
  }

  /**
   * Handles the hologram toggle functionality.
   *
   * @param player the player executing the command
   * @param args the command arguments
   * @return true if the toggle was successful, false otherwise
   * @throws DatabaseException if a database error occurs
   */
  private boolean handleHologramToggle(Player player, String[] args) throws DatabaseException {
    boolean currentState = playerManager.isHologramEnabled(player);

    if (args.length > 1) {
      return handleSpecificHologramToggle(player, args[1], currentState);
    }

    playerManager.setHologramEnabled(player, !currentState);
    sendHologramToggleMessage(player, !currentState);
    return true;
  }

  /**
   * Handles specific hologram toggle commands (on/off).
   *
   * @param player the player executing the command
   * @param toggleType the type of toggle (on/off)
   * @param currentState the current hologram state
   * @return true if the toggle was successful, false otherwise
   * @throws DatabaseException if a database error occurs
   */
  private boolean handleSpecificHologramToggle(
      Player player, String toggleType, boolean currentState) throws DatabaseException {
    return switch (toggleType.toLowerCase()) {
      case "on" -> handleHologramEnable(player, currentState);
      case "off" -> handleHologramDisable(player, currentState);
      default -> {
        player.sendMessage(
            MiniMessage.miniMessage()
                .deserialize("<red>Invalid toggle option. Use 'on' or 'off'."));
        yield false;
      }
    };
  }

  /**
   * Handles enabling holograms for a player.
   *
   * @param player the player to enable holograms for
   * @param currentState the current hologram state
   * @return true if successful, false if already enabled
   * @throws DatabaseException if a database error occurs
   */
  private boolean handleHologramEnable(Player player, boolean currentState)
      throws DatabaseException {
    if (currentState) {
      player.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<yellow>Combo holograms are already enabled for you!"));
      return false;
    }
    playerManager.setHologramEnabled(player, true);
    sendHologramToggleMessage(player, true);
    return true;
  }

  /**
   * Handles disabling holograms for a player.
   *
   * @param player the player to disable holograms for
   * @param currentState the current hologram state
   * @return true if successful, false if already disabled
   * @throws DatabaseException if a database error occurs
   */
  private boolean handleHologramDisable(Player player, boolean currentState)
      throws DatabaseException {
    if (!currentState) {
      player.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<yellow>Combo holograms are already disabled for you!"));
      return false;
    }
    playerManager.setHologramEnabled(player, false);
    sendHologramToggleMessage(player, false);
    return true;
  }

  /**
   * Sends a hologram toggle status message to the player.
   *
   * @param player the player to send the message to
   * @param enabled the new hologram state
   */
  private void sendHologramToggleMessage(Player player, boolean enabled) {
    player.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                enabled
                    ? "<green>Combo holograms enabled for you!"
                    : "<red>Combo holograms disabled for you!"));
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
