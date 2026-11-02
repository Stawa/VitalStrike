package stawa.vitalstrike.world;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.bukkit.World;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;

/** Per-world, per-dimension switches and damage multipliers from {@code world-settings}. */
public final class WorldRules {
  private record Dimension(boolean enabled, double multiplier) {}

  private static final Dimension DEFAULT = new Dimension(true, 1.0);

  private boolean perWorld;
  private final Set<String> disabledWorlds = new HashSet<>();
  private final Map<String, Dimension> dimensions = new HashMap<>();
  private final Map<String, Dimension> worlds = new HashMap<>();

  public void reload(FileConfiguration config) {
    perWorld = config.getBoolean("world-settings.enabled");
    disabledWorlds.clear();
    disabledWorlds.addAll(config.getStringList("world-settings.disabled-worlds"));
    read(config.getConfigurationSection("world-settings.dimensions"), dimensions);
    read(config.getConfigurationSection("world-settings.worlds"), worlds);
  }

  private static void read(ConfigurationSection section, Map<String, Dimension> into) {
    into.clear();
    if (section == null) {
      return;
    }
    for (String name : section.getKeys(false)) {
      into.put(
          name,
          new Dimension(
              section.getBoolean(name + ".enabled", true),
              section.getDouble(name + ".damage-multiplier", 1.0)));
    }
  }

  /** Whether VitalStrike (indicators, combos, knockdown) applies in this world. */
  public boolean isActive(World world) {
    return !perWorld || (!disabledWorlds.contains(world.getName()) && dimension(world).enabled());
  }

  public double multiplier(World world) {
    return perWorld ? dimension(world).multiplier() : 1.0;
  }

  /** A world listed under {@code worlds} by its name wins over its dimension's settings. */
  private Dimension dimension(World world) {
    Dimension named = worlds.get(world.getName());
    if (named != null) {
      return named;
    }
    String name =
        switch (world.getEnvironment()) {
          case NETHER -> "nether";
          case THE_END -> "end";
          default -> "overworld";
        };
    return dimensions.getOrDefault(name, DEFAULT);
  }
}
