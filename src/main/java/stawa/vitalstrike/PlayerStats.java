package stawa.vitalstrike;

import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Manages player statistics for the VitalStrike plugin.
 * <p>
 * This class handles the storage and retrieval of player combat statistics including:
 * <ul>
 *   <li>Highest combo achieved</li>
 *   <li>Total damage dealt</li>
 *   <li>Total hits landed</li>
 *   <li>Average damage per hit</li>
 * </ul>
 * </p>
 * 
 * @author Stawa
 * @version 1.1
 */
public class PlayerStats {
    private final VitalStrike plugin;
    private final Map<UUID, PlayerStatistics> playerStats;
    private final File statsFile;
    private final YamlConfiguration statsConfig;

    /**
     * Creates a new PlayerStats instance.
     * 
     * @param plugin the VitalStrike plugin instance
     */
    public PlayerStats(VitalStrike plugin) {
        this.plugin = plugin;
        this.playerStats = new HashMap<>();
        this.statsFile = new File(plugin.getDataFolder(), "stats.yml");
        this.statsConfig = YamlConfiguration.loadConfiguration(statsFile);
        loadAllStats();
    }

    /**
     * Represents a player's combat statistics.
     */
    public static class PlayerStatistics {
        private int highestCombo;
        private double totalDamageDealt;
        private int totalHits;

        /**
         * Creates a new PlayerStatistics instance.
         */
        public PlayerStatistics() {
            this.highestCombo = 0;
            this.totalDamageDealt = 0;
            this.totalHits = 0;
        }

        /**
         * Gets the highest combo achieved by the player.
         * 
         * @return the highest combo
         */
        public int getHighestCombo() {
            return highestCombo;
        }

        /**
         * Gets the total damage dealt by the player.
         * 
         * @return the total damage dealt
         */
        public double getTotalDamageDealt() {
            return totalDamageDealt;
        }

        /**
         * Gets the average damage per hit.
         * 
         * @return the average damage per hit
         */
        public double getAverageDamagePerHit() {
            return totalHits > 0 ? totalDamageDealt / totalHits : 0;
        }

        /**
         * Gets the total number of hits landed by the player.
         * 
         * @return the total hits
         */
        public int getTotalHits() {
            return totalHits;
        }

        /**
         * Updates the player's highest combo if the provided combo is higher.
         * 
         * @param combo the new combo to check
         */
        public void updateCombo(int combo) {
            if (combo > highestCombo) {
                highestCombo = combo;
            }
        }

        /**
         * Adds damage to the player's total damage dealt and increments the total hits.
         * 
         * @param damage the damage to add
         */
        public void addDamage(double damage) {
            totalDamageDealt += damage;
            totalHits++;
        }
    }

    /**
     * Loads all player statistics from the stats file.
     */
    private void loadAllStats() {
        if (!statsFile.exists())
            return;

        for (String uuidStr : statsConfig.getKeys(false)) {
            UUID uuid = UUID.fromString(uuidStr);
            PlayerStatistics stats = new PlayerStatistics();
            stats.highestCombo = statsConfig.getInt(uuidStr + ".highestCombo", 0);
            stats.totalDamageDealt = statsConfig.getDouble(uuidStr + ".totalDamageDealt", 0);
            stats.totalHits = statsConfig.getInt(uuidStr + ".totalHits", 0);
            playerStats.put(uuid, stats);
        }
    }

    /**
     * Saves all player statistics to the stats file.
     */
    public void saveAllStats() {
        for (Map.Entry<UUID, PlayerStatistics> entry : playerStats.entrySet()) {
            String uuidStr = entry.getKey().toString();
            PlayerStatistics stats = entry.getValue();
            statsConfig.set(uuidStr + ".highestCombo", stats.highestCombo);
            statsConfig.set(uuidStr + ".totalDamageDealt", stats.totalDamageDealt);
            statsConfig.set(uuidStr + ".totalHits", stats.totalHits);
        }

        try {
            statsConfig.save(statsFile);
        } catch (IOException e) {
            plugin.getLogger().warning("Failed to save player statistics: " + e.getMessage());
        }
    }

    /**
     * Gets the player statistics for the specified player.
     * 
     * @param uuid the player's UUID
     * @return the player statistics
     */
    public PlayerStatistics getPlayerStats(UUID uuid) {
        return playerStats.computeIfAbsent(uuid, k -> new PlayerStatistics());
    }

    /**
     * Updates the player's statistics with the provided damage and combo.
     * 
     * @param player the player to update
     * @param damage the damage dealt
     * @param combo the combo achieved
     */
    public void updateStats(Player player, double damage, int combo) {
        PlayerStatistics stats = getPlayerStats(player.getUniqueId());
        stats.updateCombo(combo);
        stats.addDamage(damage);
    }

    /**
     * Gets the top players based on the provided value extractor.
     * 
     * @param limit the maximum number of players to return
     * @param valueExtractor the function to extract the value to sort by
     * @return the top players
     */
    public List<Map.Entry<UUID, PlayerStatistics>> getTopPlayers(int limit,
            Function<PlayerStatistics, Double> valueExtractor) {
        return playerStats.entrySet().stream()
                .sorted((a, b) -> Double.compare(valueExtractor.apply(b.getValue()),
                        valueExtractor.apply(a.getValue())))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
