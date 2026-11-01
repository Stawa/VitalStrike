package stawa.vitalstrike.commands;

import java.io.File;
import java.util.Set;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.YamlConfiguration;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** Renders the help menu and help sections defined in {@code help.yml}. */
public final class HelpManager {
  private static final String RULE =
      "<dark_gray><strikethrough>                    </strikethrough>";

  private final VitalStrike plugin;
  private YamlConfiguration help;

  public HelpManager(VitalStrike plugin) {
    this.plugin = plugin;
    reload();
  }

  public void reload() {
    File file = new File(plugin.getDataFolder(), "help.yml");
    if (!file.exists()) {
      plugin.saveResource("help.yml", false);
    }
    help = YamlConfiguration.loadConfiguration(file);
  }

  public Set<String> sections() {
    ConfigurationSection sections = help.getConfigurationSection("help-menu.sections");
    return sections == null ? Set.of() : sections.getKeys(false);
  }

  public void sendMenu(CommandSender sender) {
    sender.sendMessage(Text.parse(help.getString("help-menu.header", RULE)));
    sender.sendMessage(
        Text.parse(
            help.getString("help-menu.title", "<gold><bold>VitalStrike Commands</bold></gold>")));
    ConfigurationSection commands = help.getConfigurationSection("help-menu.commands");
    if (commands != null) {
      for (String key : commands.getKeys(false)) {
        String permission = commands.getString(key + ".permission");
        String usage = commands.getString(key + ".command");
        String description = commands.getString(key + ".description");
        if (usage != null
            && description != null
            && (permission == null || sender.hasPermission(permission))) {
          sender.sendMessage(Text.parse("<yellow>" + usage + " <gray>- " + description));
        }
      }
    }
    sender.sendMessage(Text.parse(help.getString("help-menu.footer", RULE)));
  }

  public void sendSection(CommandSender sender, String section) {
    String path = "help-menu.sections." + section.toLowerCase();
    ConfigurationSection content = help.getConfigurationSection(path + ".content");
    if (!help.contains(path)) {
      sender.sendMessage(Text.parse("<red>Help section not found: " + section));
      return;
    }
    sender.sendMessage(Text.parse(help.getString("help-menu.header", RULE)));
    sender.sendMessage(
        Text.parse(
            help.getString(path + ".title", "<gold><bold>" + section + " Help</bold></gold>")));
    if (content != null) {
      for (String key : content.getKeys(false)) {
        sender.sendMessage(Text.parse(content.getString(key, "")));
      }
    }
    sender.sendMessage(Text.parse(help.getString("help-menu.footer", RULE)));
  }
}
