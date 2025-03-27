package stawa.vitalstrike;

import stawa.vitalstrike.Errors.DatabaseException;
import stawa.vitalstrike.logger.VitalLogger;

import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.ToDoubleFunction;

/**
 * Manages player statistics for the VitalStrike plugin.
 * 
 * This class handles the storage and retrieval of player combat statistics
 * including:
 * <ul>
 * <li>Highest combo achieved</li>
 * <li>Total damage dealt</li>
 * <li>Total hits landed</li>
 * <li>Average damage per hit</li>
 * </ul>
 * Statistics are persisted to a YAML file and loaded on plugin startup.
 * 
 * @author Stawa
 * @version 1.4.0
 */
public class PlayerStats {
    private static final String STATS_FILE = "stats.yml";
    private final File statsFile;
    private final Map<UUID, PlayerStatistics> playerStats;
    private final YamlConfiguration statsConfig;
    private VitalLogger logger;

    /**
     * Creates a new PlayerStats instance.
     * 
     * @param plugin the VitalStrike plugin instance
     * @throws DatabaseException If there is an error accessing or updating the
     *                           database
     */
    public PlayerStats(VitalStrike plugin) throws DatabaseException {
        this.logger = new VitalLogger(plugin);
        this.playerStats = new ConcurrentHashMap<>();
        this.statsFile = new File(plugin.getDataFolder(), STATS_FILE);
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
     * 
     * @throws Errors.DatabaseException if there's an error parsing the stats file
     */
    private void loadAllStats() throws DatabaseException {
        if (!statsFile.exists())
            return;

        try {
            for (String uuidStr : statsConfig.getKeys(false)) {
                UUID uuid = UUID.fromString(uuidStr);
                PlayerStatistics stats = new PlayerStatistics();
                stats.highestCombo = statsConfig.getInt(uuidStr + ".highestCombo", 0);
                stats.totalDamageDealt = statsConfig.getDouble(uuidStr + ".totalDamageDealt", 0);
                stats.totalHits = statsConfig.getInt(uuidStr + ".totalHits", 0);
                playerStats.put(uuid, stats);
            }
        } catch (IllegalArgumentException e) {
            throw new Errors.DatabaseException("Failed to parse UUID in stats file", e);
        }
    }

    /**
     * Saves all player statistics to the stats file.
     * 
     * @throws DatabaseException If there is an error accessing or updating the
     *                           database if there's an error saving the stats file
     */
    public void saveAllStats() throws DatabaseException {
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
            logger.severe(
                    "Failed to save player statistics to " + statsFile.getAbsolutePath() + ": " + e.getMessage());
            e.printStackTrace();
            throw new Errors.DatabaseException("Failed to save player statistics to file: " + statsFile.getName(), e);
        }
    }

    /**
     * Resets statistics for a specific player.
     * 
     * @param uuid the UUID of the player to reset
     */
    public void resetPlayerStats(UUID uuid) {
        playerStats.put(uuid, new PlayerStatistics());
    }

    /**
     * Resets statistics for all players.
     * This will clear all statistics from memory and remove them from the
     * configuration.
     * Note: Changes are not saved to disk until saveAllStats() is called.
     */
    public void resetAllStats() {
        playerStats.clear();
        for (String uuidStr : statsConfig.getKeys(false)) {
            statsConfig.set(uuidStr, null);
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
     * Note: Changes are not saved to disk until saveAllStats() is called.
     * 
     * @param player the player to update
     * @param damage the damage dealt
     * @param combo  the combo achieved
     */
    public void updateStats(Player player, double damage, int combo) {
        PlayerStatistics stats = getPlayerStats(player.getUniqueId());
        stats.updateCombo(combo);
        stats.addDamage(damage);
    }

    /**
     * Gets the top players based on the provided value extractor.
     * 
     * @param limit          the maximum number of players to return
     * @param valueExtractor the function to extract the sorting value from
     *                       PlayerStatistics
     *                       (e.g., PlayerStatistics::getTotalDamageDealt)
     * @return a list of player entries sorted by the extracted value in descending
     *         order,
     *         limited to the specified number of entries
     */
    public List<Map.Entry<UUID, PlayerStatistics>> getTopPlayers(int limit,
            ToDoubleFunction<PlayerStatistics> valueExtractor) {
        return playerStats.entrySet().stream()
                .sorted((a, b) -> Double.compare(valueExtractor.applyAsDouble(b.getValue()),
                        valueExtractor.applyAsDouble(a.getValue())))
                .limit(limit)
                .toList();
    }

    /**
     * Checks if statistics exist for a player.
     * 
     * @param uuid the player's UUID
     * @return true if the player has statistics
     */
    public boolean hasStats(UUID uuid) {
        return playerStats.containsKey(uuid);
    }
}
