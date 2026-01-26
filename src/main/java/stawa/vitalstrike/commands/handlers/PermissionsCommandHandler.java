package stawa.vitalstrike.commands.handlers;

import java.util.*;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.logger.VitalLogger;

/**
 * Handles permission-related commands for the VitalStrike plugin. This class manages the addition,
 * removal, and listing of player permissions.
 */
public class PermissionsCommandHandler {
  /** The main plugin instance */
  private final VitalStrike plugin;

  /** The plugin's logger */
  private final VitalLogger logger;

  /** The player manager instance */
  private final PlayerManager playerManager;

  /**
   * Constructs a new PermissionsCommandHandler.
   *
   * @param plugin the VitalStrike plugin instance
   * @param logger the plugin's logger
   * @param playerManager the player manager instance
   */
  public PermissionsCommandHandler(
      VitalStrike plugin, VitalLogger logger, PlayerManager playerManager) {
    this.plugin = plugin;
    this.logger = logger;
    this.playerManager = playerManager;
  }

  /**
   * Handles the permissions command execution.
   *
   * @param sender the command sender
   * @param args the command arguments
   * @return true if the command was handled successfully, false otherwise
   */
  public boolean handleCommand(CommandSender sender, String[] args) {
    if (!hasPermission(sender, "vitalstrike.admin.permissions")) {
      return false;
    }

    if (args.length < 3) {
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<red>Usage: /vs perm <add|remove|list> <player> [permission]"));
      return false;
    }

    String action = args[1].toLowerCase();
    String playerName = args[2];

    Player targetPlayer = Bukkit.getPlayer(playerName);
    if (targetPlayer == null) {
      sender.sendMessage(
          MiniMessage.miniMessage().deserialize("<red>Player not found: " + playerName));
      return false;
    }

    return switch (action) {
      case "add" -> handleAdd(sender, targetPlayer, args);
      case "remove" -> handleRemove(sender, targetPlayer, args);
      case "list" -> {
        listPermissions(sender, targetPlayer);
        yield true;
      }
      default -> {
        sender.sendMessage(MiniMessage.miniMessage().deserialize("<red>Unknown action: " + action));
        yield false;
      }
    };
  }

  /**
   * Handles the permission addition command.
   *
   * @param sender the command sender
   * @param targetPlayer the target player
   * @param args the command arguments
   * @return true if the permission was added successfully, false otherwise
   */
  private boolean handleAdd(CommandSender sender, Player targetPlayer, String[] args) {
    if (args.length < 4) {
      sender.sendMessage(
          MiniMessage.miniMessage().deserialize("<red>Usage: /vs perm add <player> <permission>"));
      return false;
    }
    addPermission(sender, targetPlayer, args[3]);
    return true;
  }

  /**
   * Handles the permission removal command.
   *
   * @param sender the command sender
   * @param targetPlayer the target player
   * @param args the command arguments
   * @return true if the permission was removed successfully, false otherwise
   */
  private boolean handleRemove(CommandSender sender, Player targetPlayer, String[] args) {
    if (args.length < 4) {
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<red>Usage: /vs perm remove <player> <permission>"));
      return false;
    }
    removePermission(sender, targetPlayer, args[3]);
    return true;
  }

  /**
   * Adds a permission to a player.
   *
   * @param sender the command sender
   * @param targetPlayer the target player
   * @param permission the permission to add
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
        logger.info(
            "Added group permission: " + permission + " to player " + targetPlayer.getName());
      }

      if (targetPlayer != sender) {
        targetPlayer.sendMessage(
            MiniMessage.miniMessage()
                .deserialize(
                    "<green>You've been granted the permission <yellow>"
                        + permission
                        + "</yellow>"));
      }

      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize(
                  "<green>Added permission <yellow>"
                      + permission
                      + "</yellow> to player <yellow>"
                      + targetPlayer.getName()
                      + "</yellow>"));

      logger.info(
          sender.getName() + " added permission " + permission + " to " + targetPlayer.getName());

    } catch (Exception e) {
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<red>Failed to add permission: " + e.getMessage()));
      logger.warning("Failed to add permission: " + e.getMessage());
    }
  }

  /**
   * Removes a permission from a player.
   *
   * @param sender the command sender
   * @param targetPlayer the target player
   * @param permission the permission to remove
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
        sender.sendMessage(
            MiniMessage.miniMessage()
                .deserialize(
                    "<red>Player <yellow>"
                        + targetPlayer.getName()
                        + "</yellow> does not have the permission <yellow>"
                        + permission
                        + "</yellow>"));
        return;
      }

      targetPlayer.addAttachment(plugin, permission, false);
      permissions.remove(permission);
      playerManager.getDatabase().set(path, permissions);
      playerManager.saveDatabase();

      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize(
                  "<green>Removed permission <yellow>"
                      + permission
                      + "</yellow> from player <yellow>"
                      + targetPlayer.getName()
                      + "</yellow>"));

      logger.info(
          sender.getName()
              + " removed permission "
              + permission
              + " from "
              + targetPlayer.getName());
    } catch (Exception e) {
      sender.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<red>Failed to remove permission: " + e.getMessage()));
      logger.warning("Failed to remove permission: " + e.getMessage());
    }
  }

  /**
   * Lists all VitalStrike permissions for a player.
   *
   * @param sender the command sender
   * @param targetPlayer the target player
   */
  private void listPermissions(CommandSender sender, Player targetPlayer) {
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                "<green>Permissions for player <yellow>" + targetPlayer.getName() + "</yellow>:"));

    StringBuilder permList = new StringBuilder();

    for (org.bukkit.permissions.PermissionAttachmentInfo perm :
        targetPlayer.getEffectivePermissions()) {
      if (perm.getPermission().startsWith("vitalstrike.") && perm.getValue()) {
        if (targetPlayer.isOp() && !isExplicitlyAssigned(targetPlayer, perm.getPermission())) {
          continue;
        }
        permList.append("<yellow>").append(perm.getPermission()).append("</yellow>\n");
      }
    }

    if (permList.length() == 0) {
      sender.sendMessage(
          MiniMessage.miniMessage().deserialize("<gray>No VitalStrike permissions found."));
    } else {
      sender.sendMessage(MiniMessage.miniMessage().deserialize(permList.toString()));
    }
  }

  /**
   * Checks if a permission is explicitly assigned to a player.
   *
   * @param player the player to check
   * @param permission the permission to check
   * @return true if the permission is explicitly assigned, false otherwise
   */
  private boolean isExplicitlyAssigned(Player player, String permission) {
    return playerManager.hasPlayerPermission(player.getUniqueId(), permission);
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
}
