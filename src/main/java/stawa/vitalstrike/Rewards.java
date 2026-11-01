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
 * One-time milestone rewards for lifetime damage dealt. Tiers are claimed in ascending order of
 * damage and each tier is paid out once per player.
 */
public final class Rewards {
  private record Tier(double damage, int xp, List<ItemStack> items) {}

  private final VitalStrike plugin;
  private boolean enabled;
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
  }

  private static Number number(Object value, Number fallback) {
    return value instanceof Number n ? n : fallback;
  }

  public void check(Player player, PlayerStats.Stats stats) {
    if (!enabled) {
      return;
    }
    while (stats.rewardsClaimed() < tiers.size()
        && stats.totalDamage() >= tiers.get(stats.rewardsClaimed()).damage()) {
      Tier tier = tiers.get(stats.rewardsClaimed());
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
                  .replace("%damage%", String.valueOf((long) tier.damage()))));
    }
  }
}
