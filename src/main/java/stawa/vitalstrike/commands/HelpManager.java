package stawa.vitalstrike.commands;

import java.io.File;
import java.util.Collections;
import java.util.Set;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;
import stawa.vitalstrike.VitalStrike;

/** Manages help menu functionality for VitalStrike plugin. */
public class HelpManager {
  private FileConfiguration config;
  private File helpFile;
  private final VitalStrike plugin;

  /**
   * Constructs a new HelpManager.
   *
   * @param plugin the VitalStrike plugin instance
   */
  public HelpManager(VitalStrike plugin) {
    this.plugin = plugin;
    loadConfig();
  }

  /** Reloads the help configuration from the file. */
  public void reloadConfig() {
    loadConfig();
  }

  private void loadConfig() {
    helpFile = new File(plugin.getDataFolder(), "help.yml");
    if (!helpFile.exists()) {
      plugin.saveResource("help.yml", false);
    }
    config = YamlConfiguration.loadConfiguration(helpFile);
  }

  /**
   * Gets the available help sections.
   *
   * @return set of section names
   */
  public Set<String> getHelpSections() {
    ConfigurationSection sections = config.getConfigurationSection("help-menu.sections");
    if (sections != null) {
      return sections.getKeys(false);
    }
    return Collections.emptySet();
  }

  /**
   * Sends the help menu to the sender.
   *
   * @param sender the command sender
   */
  public void sendHelpMenu(CommandSender sender) {
    String header =
        config.getString(
            "help-menu.header", "<dark_gray><strikethrough>                    </strikethrough>");
    String title =
        config.getString("help-menu.title", "<gold><bold>VitalStrike Commands</bold></gold>");
    String footer =
        config.getString(
            "help-menu.footer", "<dark_gray><strikethrough>                    </strikethrough>");

    sender.sendMessage(MiniMessage.miniMessage().deserialize(header));
    sender.sendMessage(MiniMessage.miniMessage().deserialize(title));

    ConfigurationSection commandsSection = config.getConfigurationSection("help-menu.commands");
    if (commandsSection != null) {
      for (String key : commandsSection.getKeys(false)) {
        if (key.equals("help")
            || sender.hasPermission("vitalstrike." + key)
            || sender.hasPermission("vitalstrike.admin")) {
          String command = commandsSection.getString(key + ".command");
          String description = commandsSection.getString(key + ".description");

          if (command != null && description != null) {
            sender.sendMessage(
                MiniMessage.miniMessage()
                    .deserialize("<yellow>" + command + " <gray>- " + description));
          }
        }
      }
    }

    sender.sendMessage(MiniMessage.miniMessage().deserialize(footer));
  }

  /**
   * Sends a specific help section to the sender.
   *
   * @param sender the command sender
   * @param section the help section to display
   */
  public void sendHelpSection(CommandSender sender, String section) {
    String sectionPath = "help-menu.sections." + section.toLowerCase();

    if (!config.contains(sectionPath)) {
      sender.sendMessage(
          MiniMessage.miniMessage().deserialize("<red>Help section not found: " + section));
      return;
    }

    sender.sendMessage(MiniMessage.miniMessage().deserialize(config.getString("help-menu.header")));

    String title =
        config.getString(sectionPath + ".title", "<gold><bold>" + section + " Help</bold></gold>");
    sender.sendMessage(MiniMessage.miniMessage().deserialize(title));

    ConfigurationSection contentSection = config.getConfigurationSection(sectionPath + ".content");
    if (contentSection != null) {
      for (String key : contentSection.getKeys(false)) {
        String content = contentSection.getString(key, "");
        sender.sendMessage(MiniMessage.miniMessage().deserialize(content));
      }
    }

    sender.sendMessage(MiniMessage.miniMessage().deserialize(config.getString("help-menu.footer")));
  }
}
