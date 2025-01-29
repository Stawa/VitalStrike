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

public class PlayerStats {
    private final VitalStrike plugin;
    private final Map<UUID, PlayerStatistics> playerStats;
    private final File statsFile;
    private final YamlConfiguration statsConfig;

    public PlayerStats(VitalStrike plugin) {
        this.plugin = plugin;
        this.playerStats = new HashMap<>();
        this.statsFile = new File(plugin.getDataFolder(), "stats.yml");
        this.statsConfig = YamlConfiguration.loadConfiguration(statsFile);
        loadAllStats();
    }

    public static class PlayerStatistics {
        private int highestCombo;
        private double totalDamageDealt;
        private int totalHits;

        public PlayerStatistics() {
            this.highestCombo = 0;
            this.totalDamageDealt = 0;
            this.totalHits = 0;
        }

        public int getHighestCombo() {
            return highestCombo;
        }

        public double getTotalDamageDealt() {
            return totalDamageDealt;
        }

        public double getAverageDamagePerHit() {
            return totalHits > 0 ? totalDamageDealt / totalHits : 0;
        }

        public int getTotalHits() {
            return totalHits;
        }

        public void updateCombo(int combo) {
            if (combo > highestCombo) {
                highestCombo = combo;
            }
        }

        public void addDamage(double damage) {
            totalDamageDealt += damage;
            totalHits++;
        }
    }

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

    public PlayerStatistics getPlayerStats(UUID uuid) {
        return playerStats.computeIfAbsent(uuid, k -> new PlayerStatistics());
    }

    public void updateStats(Player player, double damage, int combo) {
        PlayerStatistics stats = getPlayerStats(player.getUniqueId());
        stats.updateCombo(combo);
        stats.addDamage(damage);
    }

    public List<Map.Entry<UUID, PlayerStatistics>> getTopPlayers(int limit,
            Function<PlayerStatistics, Double> valueExtractor) {
        return playerStats.entrySet().stream()
                .sorted((a, b) -> Double.compare(valueExtractor.apply(b.getValue()),
                        valueExtractor.apply(a.getValue())))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
