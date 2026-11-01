package stawa.vitalstrike;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.ToDoubleFunction;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;

/** Lifetime combat statistics, persisted to {@code stats.yml}. */
public final class PlayerStats {
  /** Mutable per-player totals. */
  public static final class Stats {
    String name;
    int highestCombo;
    double totalDamage;
    int hits;
    int rewardsClaimed;
    int kills;
    long xp;

    public String name() {
      return name;
    }

    public int highestCombo() {
      return highestCombo;
    }

    public double totalDamage() {
      return totalDamage;
    }

    public int hits() {
      return hits;
    }

    public double averageDamage() {
      return hits > 0 ? totalDamage / hits : 0;
    }

    public int rewardsClaimed() {
      return rewardsClaimed;
    }

    public int kills() {
      return kills;
    }

    /** Lifetime RPG experience; the level is derived from it by {@code Progression}. */
    public long xp() {
      return xp;
    }

    public void claimReward() {
      rewardsClaimed++;
    }
  }

  private static final Stats EMPTY = new Stats();

  private final VitalStrike plugin;
  private final File file;
  private final Map<UUID, Stats> stats = new HashMap<>();
  private boolean dirty;

  public PlayerStats(VitalStrike plugin) {
    this.plugin = plugin;
    this.file = new File(plugin.getDataFolder(), "stats.yml");
    YamlConfiguration yaml = YamlConfiguration.loadConfiguration(file);
    for (String key : yaml.getKeys(false)) {
      try {
        Stats s = new Stats();
        s.name = yaml.getString(key + ".name");
        s.highestCombo = yaml.getInt(key + ".highestCombo");
        s.totalDamage = yaml.getDouble(key + ".totalDamageDealt");
        s.hits = yaml.getInt(key + ".totalHits");
        s.rewardsClaimed = yaml.getInt(key + ".rewardsClaimed");
        s.kills = yaml.getInt(key + ".kills");
        s.xp = yaml.getLong(key + ".xp");
        stats.put(UUID.fromString(key), s);
      } catch (IllegalArgumentException e) {
        plugin.getSLF4JLogger().warn("Ignoring invalid UUID '{}' in {}", key, file.getName());
      }
    }
  }

  /** Stats for a player, or an all-zero placeholder if they have none. Never mutate the result. */
  public Stats find(UUID id) {
    return stats.getOrDefault(id, EMPTY);
  }

  public Stats of(Player player) {
    Stats s = stats.computeIfAbsent(player.getUniqueId(), id -> new Stats());
    s.name = player.getName();
    dirty = true;
    return s;
  }

  public Stats recordDamage(Player player, double damage) {
    Stats s = of(player);
    s.totalDamage += damage;
    s.hits++;
    return s;
  }

  public Stats recordKill(Player player, long xp) {
    Stats s = of(player);
    s.kills++;
    s.xp += xp;
    return s;
  }

  public void recordCombo(Player player, int combo) {
    Stats s = of(player);
    s.highestCombo = Math.max(s.highestCombo, combo);
  }

  public List<Map.Entry<UUID, Stats>> top(int limit, ToDoubleFunction<Stats> value) {
    return stats.entrySet().stream()
        .filter(e -> e.getValue().hits > 0)
        .sorted(
            (a, b) ->
                Double.compare(
                    value.applyAsDouble(b.getValue()), value.applyAsDouble(a.getValue())))
        .limit(limit)
        .toList();
  }

  public void save() {
    if (!dirty) {
      return;
    }
    YamlConfiguration yaml = new YamlConfiguration();
    stats.forEach(
        (id, s) -> {
          String key = id.toString();
          yaml.set(key + ".name", s.name);
          yaml.set(key + ".highestCombo", s.highestCombo);
          yaml.set(key + ".totalDamageDealt", s.totalDamage);
          yaml.set(key + ".totalHits", s.hits);
          yaml.set(key + ".rewardsClaimed", s.rewardsClaimed);
          yaml.set(key + ".kills", s.kills);
          yaml.set(key + ".xp", s.xp);
        });
    try {
      yaml.save(file);
      dirty = false;
    } catch (IOException e) {
      plugin.getSLF4JLogger().error("Could not save {}", file.getName(), e);
    }
  }
}
