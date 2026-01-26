package stawa.vitalstrike.commands.handlers;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.resources.ResourcePackManager;

/**
 * Handles resource pack-related commands for the VitalStrike plugin. This class manages the manual
 * resource pack distribution to players.
 */
public class ResourcePackCommandHandler {
  private final VitalStrike plugin;
  private final ResourcePackManager resourcePackManager;

  /**
   * Constructs a new ResourcePackCommandHandler.
   *
   * @param plugin the VitalStrike plugin instance
   * @param resourcePackManager the resource pack manager instance
   */
  public ResourcePackCommandHandler(VitalStrike plugin, ResourcePackManager resourcePackManager) {
    this.plugin = plugin;
    this.resourcePackManager = resourcePackManager;
  }

  /**
   * Handles the resource pack command execution.
   *
   * @param sender the command sender
   * @return true if the command was handled successfully, false otherwise
   */
  public boolean handleCommand(CommandSender sender) {
    if (!(sender instanceof Player)) {
      sendPlayerOnlyMessage(sender);
      return false;
    }

    if (!hasPermission(sender, "vitalstrike.resourcepack")) {
      return false;
    }

    Player player = (Player) sender;
    resourcePackManager.sendResourcePack(player);
    sender.sendMessage(
        MiniMessage.miniMessage()
            .deserialize(
                "<green>Resource pack request sent. Please accept it in your game client. If not working, please download it manually to your game client. You can download it from https://vitalstrike.vercel.app/downloads."));
    return true;
  }

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

  private void sendPlayerOnlyMessage(CommandSender sender) {
    sender.sendMessage(
        MiniMessage.miniMessage().deserialize("<red>This command can only be used by players!"));
  }
}
