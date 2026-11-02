package stawa.vitalstrike;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.bukkit.Material;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;

/**
 * Milestone rewards for lifetime damage dealt. Tiers are claimed in ascending order of damage. Each
 * is paid once per player, unless looping is on: then the list starts over after the last tier,
 * with every lap needing {@code cycle} more damage than the one before.
 */
public final class Rewards {
  private record Tier(double damage, int xp, List<ItemStack> items) {}

  private final VitalStrike plugin;
  private static final int MAX_PAYOUTS_PER_CHECK = 1000;

  private boolean enabled;
  private boolean loop;
  private double cycle;
  private List<Tier> tiers = List.of();

  public Rewards(VitalStrike plugin) {
    this.plugin = plugin;
  }

  public void reload(FileConfiguration config) {
    enabled = config.getBoolean("rewards.enabled");
    List<Tier> loaded = new ArrayList<>();
    for (Map<?, ?> raw : config.getMapList("rewards.tiers")) {
      List<ItemStack> items = new ArrayList<>();
      if (raw.get("items") instanceof List<?> list) {
        for (Object entry : list) {
          if (entry instanceof Map<?, ?> item) {
            Material material = Material.matchMaterial(String.valueOf(item.get("material")));
            if (material == null || material.isAir()) {
              plugin.getSLF4JLogger().warn("Unknown reward material '{}'", item.get("material"));
              continue;
            }
            items.add(new ItemStack(material, number(item.get("amount"), 1).intValue()));
          }
        }
      }
      loaded.add(
          new Tier(
              number(raw.get("damage"), 0).doubleValue(),
              number(raw.get("xp"), 0).intValue(),
              items));
    }
    loaded.sort(Comparator.comparingDouble(Tier::damage));
    tiers = loaded;
    readLoop(config);
  }

  /**
   * The damage added per lap defaults to the last tier's damage, so tiers at 50, 100 and 150 give
   * tier 1 again at 200, tier 2 at 250 and so on. It can never be shorter than the span of the
   * tiers themselves, or a later lap would start before the previous one ended.
   */
  private void readLoop(FileConfiguration config) {
    loop = config.getBoolean("rewards.loop.enabled") && !tiers.isEmpty();
    cycle = 0;
    if (!loop) {
      return;
    }
    double first = tiers.get(0).damage();
    double last = tiers.get(tiers.size() - 1).damage();
    double configured = config.getDouble("rewards.loop.cycle-damage");
    cycle = configured > 0 ? configured : last;
    if (cycle < last - first) {
      plugin
          .getSLF4JLogger()
          .warn("rewards.loop.cycle-damage is shorter than the tiers; using {}", last);
      cycle = last;
    }
    if (cycle <= 0) {
      plugin.getSLF4JLogger().warn("Reward looping needs tiers with damage above 0; it is off");
      loop = false;
    }
  }

  private static Number number(Object value, Number fallback) {
    return value instanceof Number n ? n : fallback;
  }

  public void check(Player player, PlayerStats.Stats stats) {
    if (!enabled) {
      return;
    }
    for (int paid = 0; paid < MAX_PAYOUTS_PER_CHECK && !tiers.isEmpty(); paid++) {
      int claimed = stats.rewardsClaimed();
      if (!loop && claimed >= tiers.size()) {
        return;
      }
      Tier tier = tiers.get(claimed % tiers.size());
      double needed = tier.damage() + (claimed / tiers.size()) * cycle;
      if (stats.totalDamage() < needed) {
        return;
      }
      stats.claimReward();
      if (tier.xp() > 0) {
        player.giveExp(tier.xp());
      }
      for (ItemStack item : tier.items()) {
        player
            .getInventory()
            .addItem(item.clone())
            .values()
            .forEach(left -> player.getWorld().dropItem(player.getLocation(), left));
      }
      player.sendMessage(
          Text.parse(
              plugin
                  .getConfig()
                  .getString("messages.reward-claimed")
                  .replace("%damage%", String.valueOf((long) needed))));
    }
  }
}
