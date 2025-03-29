package stawa.vitalstrike.world;

import org.bukkit.World.Environment;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.entity.Entity;
import stawa.vitalstrike.VitalStrike;

import java.util.HashMap;
import java.util.Map;

/**
 * Manages dimension-specific settings and multipliers for VitalStrike.
 * Handles configuration loading and application of dimension-based rules.
 */
public class DimensionManager {
    private final VitalStrike plugin;
    private final Map<String, Boolean> dimensionEnabled;
    private final Map<String, Double> dimensionMultipliers;

    /**
     * Constructs a new DimensionManager instance.
     *
     * @param plugin The VitalStrike plugin instance
     */
    public DimensionManager(VitalStrike plugin) {
        this.plugin = plugin;
        this.dimensionEnabled = new HashMap<>();
        this.dimensionMultipliers = new HashMap<>();
        loadDimensionSettings();
    }

    /**
     * Loads dimension settings from the plugin configuration.
     * Initializes enabled states and damage multipliers for each dimension.
     */
    private void loadDimensionSettings() {
        ConfigurationSection dimensions = plugin.getConfig().getConfigurationSection("world-settings.dimensions");
        if (dimensions == null) {
            return;
        }

        for (String dimension : dimensions.getKeys(false)) {
            boolean enabled = dimensions.getBoolean(dimension + ".enabled", true);
            double multiplier = dimensions.getDouble(dimension + ".damage-multiplier", 1.0);
            dimensionEnabled.put(dimension, enabled);
            dimensionMultipliers.put(dimension, multiplier);
        }
    }

    /**
     * Checks if damage indicators are enabled for the given entity's dimension.
     *
     * @param entity The entity to check dimension settings for
     * @return true if damage indicators are enabled in the dimension, false
     *         otherwise
     */
    public boolean isDimensionEnabled(Entity entity) {
        String dimension = getDimensionName(entity.getWorld().getEnvironment());
        return dimensionEnabled.getOrDefault(dimension, true);
    }

    /**
     * Gets the damage multiplier for the given entity's dimnsion.
     *
     * @param entity The entity to get the dimension multiplier for
     * @return The damage multiplier for the dimension
     */
    public double getDimensionMultiplier(Entity entity) {
        String dimension = getDimensionName(entity.getWorld().getEnvironment());
        return dimensionMultipliers.getOrDefault(dimension, 1.0);
    }

    /**
     * Converts a Bukkit Environment to a dimension name string.
     *
     * @param environment The Bukkit Environment to convert
     * @return The dimension name as used in configuration
     */
    private String getDimensionName(Environment environment) {
        // Fix case sensitivity issue for dimension names
        return switch (environment) {
            case NORMAL -> "overworld";
            case NETHER -> "nether";
            case THE_END -> "end";
            default -> "overworld";
        };
    }

    /**
     * Reloads dimension settings from the configuration.
     * Clears existing settings and reloads from config.
     */
    public void reload() {
        dimensionEnabled.clear();
        dimensionMultipliers.clear();
        loadDimensionSettings();
    }
}
