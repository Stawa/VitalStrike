package stawa.vitalstrike.commands;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.ToDoubleFunction;
import org.bukkit.Bukkit;
import org.bukkit.OfflinePlayer;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabExecutor;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** The {@code /vitalstrike} command and all of its subcommands. */
public final class VitalCommand implements TabExecutor {
  private record Board(String key, ToDoubleFunction<PlayerStats.Stats> value, boolean whole) {}

  private static final Map<String, String> ALIASES =
      Map.of("lb", "leaderboard", "va", "vitalawakening", "rp", "resourcepack");

  private static final Map<String, String> PERMISSIONS =
      Map.of(
          "toggle", "vitalstrike.toggle",
          "hologram", "vitalstrike.hologram",
          "stats", "vitalstrike.stats",
          "leaderboard", "vitalstrike.leaderboard",
          "resourcepack", "vitalstrike.resourcepack",
          "reload", "vitalstrike.reload",
          "clear", "vitalstrike.clear",
          "revive", "vitalstrike.revive",
          "vitalawakening", "vitalstrike.give",
          "perm", "vitalstrike.admin.permissions");

  private static final Map<String, Board> BOARDS =
      Map.of(
          "damage", new Board("damage", PlayerStats.Stats::totalDamage, false),
          "dmg", new Board("damage", PlayerStats.Stats::totalDamage, false),
          "combo", new Board("combo", PlayerStats.Stats::highestCombo, true),
          "combos", new Board("combo", PlayerStats.Stats::highestCombo, true),
          "average", new Board("average", PlayerStats.Stats::averageDamage, false),
          "avg", new Board("average", PlayerStats.Stats::averageDamage, false));

  private final VitalStrike plugin;
  private final HelpManager help;

  public VitalCommand(VitalStrike plugin, HelpManager help) {
    this.plugin = plugin;
    this.help = help;
  }

  @Override
  public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
    if (args.length == 0 || args[0].equalsIgnoreCase("help")) {
      if (args.length > 1) {
        help.sendSection(sender, args[1]);
      } else {
        help.sendMenu(sender);
      }
      return true;
    }

    String sub = args[0].toLowerCase(Locale.ROOT);
    sub = ALIASES.getOrDefault(sub, sub);
    String permission = PERMISSIONS.get(sub);
    if (permission == null) {
      sender.sendMessage(
          Text.parse("<red>Unknown subcommand. Try <white>/" + label + " help</white>."));
    } else if (!sender.hasPermission(permission)) {
      send(sender, "no-permission");
    } else {
      switch (sub) {
        case "toggle" -> toggle(sender, args, false);
        case "hologram" -> toggle(sender, args, true);
        case "stats" -> stats(sender, args);
        case "leaderboard" -> leaderboard(sender, args);
        case "resourcepack" -> withPlayer(sender, p -> plugin.getResourcePacks().send(p));
        case "reload" -> reload(sender);
        case "clear" -> {
          int strays = plugin.clearText();
          sender.sendMessage(
              Text.parse(
                  "<green>Cleared all floating text"
                      + (strays > 0 ? " <gray>(" + strays + " stray removed)" : "")));
        }
        case "revive" -> revive(sender, args);
        case "vitalawakening" -> giveAwakening(sender, args);
        default -> permissions(sender, args);
      }
    }
    return true;
  }

  private void send(CommandSender to, String messageKey) {
    to.sendMessage(Text.parse(plugin.getConfig().getString("messages." + messageKey, "")));
  }

  private void withPlayer(CommandSender sender, java.util.function.Consumer<Player> action) {
    if (sender instanceof Player player) {
      action.accept(player);
    } else {
      sender.sendMessage(Text.parse("<red>This command can only be used by players."));
    }
  }

  private static Boolean parseSwitch(String arg) {
    return switch (arg.toLowerCase(Locale.ROOT)) {
      case "on", "true", "enable" -> Boolean.TRUE;
      case "off", "false", "disable" -> Boolean.FALSE;
      default -> null;
    };
  }

  private void toggle(CommandSender sender, String[] args, boolean hologram) {
    withPlayer(
        sender,
        player -> {
          boolean current =
              hologram
                  ? plugin.getPlayers().isHologramEnabled(player)
                  : plugin.getPlayers().isEnabled(player);
          Boolean wanted = args.length > 1 ? parseSwitch(args[1]) : Boolean.valueOf(!current);
          if (wanted == null) {
            player.sendMessage(Text.parse("<red>Use 'on' or 'off'."));
            return;
          }
          if (wanted == current) {
            send(player, wanted ? "already-enabled" : "already-disabled");
            return;
          }
          if (hologram) {
            plugin.getPlayers().setHologramEnabled(player, wanted);
            send(player, wanted ? "hologram-enabled" : "hologram-disabled");
          } else {
            plugin.getPlayers().setEnabled(player, wanted);
            send(player, wanted ? "enabled-personal" : "disabled-personal");
          }
        });
  }

  private void stats(CommandSender sender, String[] args) {
    OfflinePlayer target =
        args.length > 1
            ? Bukkit.getOfflinePlayerIfCached(args[1])
            : sender instanceof Player p ? p : null;
    if (target == null) {
      sender.sendMessage(
          Text.parse(
              args.length > 1
                  ? "<red>Unknown player: " + args[1]
                  : "<red>Specify a player: /vs stats <player>"));
      return;
    }
    PlayerStats.Stats s = plugin.getStats().find(target.getUniqueId());
    String name = target.getName() != null ? target.getName() : "Unknown";
    String rule = "<dark_gray><strikethrough>                    </strikethrough>";
    sender.sendMessage(
        Text.parse(
            rule
                + "\n<gold><bold>"
                + name
                + "'s Combat Statistics</bold></gold>"
                + "\n<yellow>Level: <white>"
                + plugin.getProgression().progress(s.xp()).level()
                + " <gray>("
                + s.kills()
                + " kills)"
                + "\n<yellow>Highest Combo: <white>"
                + s.highestCombo()
                + "\n<yellow>Total Damage Dealt: <white>"
                + Text.format("%.1f", s.totalDamage())
                + "\n<yellow>Average Damage/Hit: <white>"
                + Text.format("%.1f", s.averageDamage())
                + "\n<yellow>Total Hits: <white>"
                + s.hits()
                + "\n"
                + rule));
  }

  private void leaderboard(CommandSender sender, String[] args) {
    FileConfiguration config = plugin.getConfig();
    String type =
        args.length > 1 ? args[1] : config.getString("leaderboard.default-type", "damage");
    Board board = BOARDS.get(type.toLowerCase(Locale.ROOT));
    if (board == null) {
      sender.sendMessage(Text.parse("<red>Unknown leaderboard. Use damage, combo or average."));
      return;
    }
    List<Map.Entry<UUID, PlayerStats.Stats>> top =
        plugin.getStats().top(config.getInt("leaderboard.display-limit"), board.value());
    if (top.isEmpty()) {
      sender.sendMessage(
          Text.parse("<yellow>The leaderboard is empty. Play more to see statistics!"));
      return;
    }
    String numberFormat = config.getString("leaderboard.number-format." + board.key(), "%.1f");
    String entryFormat = config.getString("leaderboard.display.entry-format", "");
    StringBuilder out = new StringBuilder(config.getString("leaderboard.display.header", ""));
    out.append('\n')
        .append(
            Text.format(
                config.getString("leaderboard.display.title-formats." + board.key(), ""),
                top.size()));
    int rank = 1;
    for (Map.Entry<UUID, PlayerStats.Stats> entry : top) {
      double value = board.value().applyAsDouble(entry.getValue());
      String shown =
          Text.format(numberFormat, board.whole() ? (Object) (int) value : (Object) value);
      String name = entry.getValue().name() != null ? entry.getValue().name() : "Unknown";
      out.append('\n').append(Text.format(entryFormat, rank++, name, shown));
    }
    out.append('\n').append(config.getString("leaderboard.display.footer", ""));
    sender.sendMessage(Text.parse(out.toString()));
  }

  private void reload(CommandSender sender) {
    try {
      plugin.reload();
      send(sender, "config-reloaded");
    } catch (RuntimeException e) {
      plugin.getSLF4JLogger().error("Reload failed", e);
      sender.sendMessage(Text.parse("<red>Reload failed, see the console: " + e.getMessage()));
    }
  }

  private void revive(CommandSender sender, String[] args) {
    Player target = args.length > 1 ? Bukkit.getPlayerExact(args[1]) : null;
    if (target == null) {
      sender.sendMessage(Text.parse("<red>Usage: /vs revive <online player>"));
    } else if (plugin.getKnockdown().revive(target, null)) {
      sender.sendMessage(Text.parse("<green>Revived " + target.getName() + "."));
    } else {
      sender.sendMessage(Text.parse("<yellow>" + target.getName() + " is not downed."));
    }
  }

  private void giveAwakening(CommandSender sender, String[] args) {
    int amount = 1;
    if (args.length > 1) {
      try {
        amount = Integer.parseInt(args[1]);
      } catch (NumberFormatException e) {
        amount = 0;
      }
    }
    if (amount < 1 || amount > 64) {
      sender.sendMessage(Text.parse("<red>Amount must be a number from 1 to 64."));
      return;
    }
    Player target =
        args.length > 2 ? Bukkit.getPlayerExact(args[2]) : sender instanceof Player p ? p : null;
    if (target == null) {
      sender.sendMessage(Text.parse("<red>Specify an online player: /vs va <amount> <player>"));
      return;
    }
    ItemStack stack = plugin.getItems().createVitalAwakening();
    stack.setAmount(amount);
    target
        .getInventory()
        .addItem(stack)
        .values()
        .forEach(left -> target.getWorld().dropItem(target.getLocation(), left));
    sender.sendMessage(
        Text.parse("<green>Gave " + amount + " Vital Awakening to " + target.getName() + "."));
  }

  private void permissions(CommandSender sender, String[] args) {
    if (args.length < 3) {
      sender.sendMessage(
          Text.parse("<red>Usage: /vs perm <add|remove|list> <player> [permission]"));
      return;
    }
    OfflinePlayer target = Bukkit.getOfflinePlayerIfCached(args[2]);
    if (target == null) {
      sender.sendMessage(Text.parse("<red>Unknown player: " + args[2]));
      return;
    }
    String action = args[1].toLowerCase(Locale.ROOT);
    if (action.equals("list")) {
      List<String> grants = plugin.getPlayers().grants(target.getUniqueId());
      sender.sendMessage(
          Text.parse(
              grants.isEmpty()
                  ? "<gray>No stored permissions for " + target.getName()
                  : "<green>"
                      + target.getName()
                      + ": <yellow>"
                      + String.join("<gray>, <yellow>", grants)));
      return;
    }
    if (args.length < 4 || !(action.equals("add") || action.equals("remove"))) {
      sender.sendMessage(
          Text.parse("<red>Usage: /vs perm <add|remove|list> <player> [permission]"));
      return;
    }
    String permission = args[3].startsWith("vitalstrike.") ? args[3] : "vitalstrike." + args[3];
    boolean changed =
        action.equals("add")
            ? plugin.getPlayers().addGrant(target.getUniqueId(), permission)
            : plugin.getPlayers().removeGrant(target.getUniqueId(), permission);
    sender.sendMessage(
        Text.parse(
            changed
                ? "<green>"
                    + (action.equals("add") ? "Added " : "Removed ")
                    + "<yellow>"
                    + permission
                    + "</yellow> for "
                    + target.getName()
                : "<yellow>Nothing to change for " + target.getName()));
  }

  @Override
  public List<String> onTabComplete(
      CommandSender sender, Command command, String alias, String[] args) {
    List<String> options = new ArrayList<>();
    if (args.length == 1) {
      options.add("help");
      PERMISSIONS.forEach(
          (name, permission) -> {
            if (sender.hasPermission(permission)) {
              options.add(name);
            }
          });
    } else if (args.length == 2) {
      switch (ALIASES.getOrDefault(
          args[0].toLowerCase(Locale.ROOT), args[0].toLowerCase(Locale.ROOT))) {
        case "toggle", "hologram" -> options.addAll(List.of("on", "off"));
        case "leaderboard" -> options.addAll(List.of("damage", "combo", "average"));
        case "perm" -> options.addAll(List.of("add", "remove", "list"));
        case "help" -> options.addAll(help.sections());
        case "vitalawakening" -> options.addAll(List.of("1", "8", "16", "64"));
        case "stats", "revive" -> Bukkit.getOnlinePlayers().forEach(p -> options.add(p.getName()));
        default -> {}
      }
    } else if (args.length == 3 && args[0].equalsIgnoreCase("perm")) {
      Bukkit.getOnlinePlayers().forEach(p -> options.add(p.getName()));
    } else if (args.length == 3
        && ALIASES.getOrDefault(args[0].toLowerCase(Locale.ROOT), "").equals("vitalawakening")) {
      Bukkit.getOnlinePlayers().forEach(p -> options.add(p.getName()));
    }
    String typed = args[args.length - 1].toLowerCase(Locale.ROOT);
    return options.stream().filter(o -> o.toLowerCase(Locale.ROOT).startsWith(typed)).toList();
  }
}
