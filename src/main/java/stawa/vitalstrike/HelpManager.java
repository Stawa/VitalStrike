package stawa.vitalstrike;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;

/**
 * Manages help menu functionality for VitalStrike plugin.
 */
public class HelpManager {
    private final FileConfiguration config;

    /**
     * Constructs a new HelpManager.
     *
     * @param plugin the VitalStrike plugin instance
     */
    public HelpManager(VitalStrike plugin) {
        this.config = plugin.getConfig();
    }

    /**
     * Sends the help menu to the sender.
     *
     * @param sender the command sender
     */
    public void sendHelpMenu(CommandSender sender) {
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.header",
                        "<dark_gray><strikethrough>                    </strikethrough>")));

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.title", "<gold><bold>VitalStrike Commands</bold></gold>")));

        ConfigurationSection commandsSection = config.getConfigurationSection("help-menu.commands");
        if (commandsSection != null) {
            for (String key : commandsSection.getKeys(false)) {
                if (sender.hasPermission("vitalstrike." + key)) {
                    String command = commandsSection.getString(key + ".command", "");
                    String description = commandsSection.getString(key + ".description", "");
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            "<yellow>" + command + " <gray>- " + description));
                }
            }
        }

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.footer",
                        "<dark_gray><strikethrough>                    </strikethrough>")));
    }

    /**
     * Sends a specific help section to the sender.
     *
     * @param sender  the command sender
     * @param section the help section to display
     */
    public void sendHelpSection(CommandSender sender, String section) {
        String sectionPath = "help-menu.sections." + section.toLowerCase();

        if (!config.contains(sectionPath)) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Help section not found: " + section));
            return;
        }

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.header",
                        "<dark_gray><strikethrough>                    </strikethrough>")));

        String title = config.getString(sectionPath + ".title", "<gold><bold>" + section + " Help</bold></gold>");
        sender.sendMessage(MiniMessage.miniMessage().deserialize(title));

        ConfigurationSection contentSection = config.getConfigurationSection(sectionPath + ".content");
        if (contentSection != null) {
            for (String key : contentSection.getKeys(false)) {
                String content = contentSection.getString(key, "");
                sender.sendMessage(MiniMessage.miniMessage().deserialize(content));
            }
        }

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.footer",
                        "<dark_gray><strikethrough>                    </strikethrough>")));
    }
}