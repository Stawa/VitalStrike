package stawa.vitalstrike;

import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;

import stawa.vitalstrike.Errors.ConfigurationException;
import stawa.vitalstrike.Errors.DatabaseException;
import stawa.vitalstrike.logger.VitalLogger;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages player preferences and settings for the VitalStrike plugin
 * Handles loading, saving, and accessing player-specific configuration
 */
public class PlayerManager {
    private static final String DATABASE_FILE = "playerdata.yml";
    private static final String ENABLED_PATH = ".enabled";
    private static final String PLAYERS_PATH = "players.";
    private static final String STYLE_PATH = ".style";

    private final File databaseFile;
    private final VitalStrike plugin;
    private FileConfiguration database;
    private VitalLogger logger;

    private final HashMap<UUID, String> playerElements = new HashMap<>();
    private final Map<UUID, Boolean> playerSettings;
    private final Map<UUID, String> playerStyles;
    private Map<UUID, Boolean> playerHologramPreferences = new HashMap<>();

    /**
     * Creates a new PlayerManager instance
     * 
     * @param plugin the VitalStrike plugin instance
     * @throws DatabaseException if database initialization fails
     */
    public PlayerManager(VitalStrike plugin) throws DatabaseException {
        this.plugin = plugin;
        this.logger = new VitalLogger(plugin);
        this.databaseFile = new File(plugin.getDataFolder(), DATABASE_FILE);
        this.playerSettings = new ConcurrentHashMap<>();
        this.playerStyles = new ConcurrentHashMap<>();
        initializeDatabase();
    }

    /**
     * Initializes the database and loads the configuration
     * 
     * @throws Errors.DatabaseException if database initialization fails
     */
    private void initializeDatabase() throws DatabaseException {
        try {
            if (!databaseFile.exists()) {
                plugin.saveResource(DATABASE_FILE, false);
            }
            loadDatabase();
        } catch (Exception e) {
            logger.severe("Failed to initialize database: {}", e.getMessage());
            database = new YamlConfiguration();
            throw new Errors.DatabaseException("Failed to initialize player database", e);
        }
    }

    /**
     * Loads the database from file
     * 
     * @throws Errors.DatabaseException if loading fails
     */
    private void loadDatabase() throws DatabaseException {
        try {
            database = YamlConfiguration.loadConfiguration(databaseFile);
        } catch (Exception e) {
            throw new Errors.DatabaseException("Failed to load player database", e);
        }
    }

    /**
     * Saves the database to file
     * 
     * @throws Errors.DatabaseException if saving fails
     */
    public void saveDatabase() throws DatabaseException {
        try {
            database.save(databaseFile);
        } catch (IOException e) {
            logger.warning("Could not save player data", e);
            throw new Errors.DatabaseException("Failed to save player data", e);
        }
    }

    /**
     * Checks if a player's data is loaded in memory
     * 
     * @param player the player to check
     * @return true if the player is loaded
     */
    public boolean isPlayerLoaded(Player player) {
        UUID uuid = player.getUniqueId();
        return playerSettings.containsKey(uuid) && playerStyles.containsKey(uuid);
    }

    /**
     * Loads multiple players' settings into memory
     * 
     * @param players the collection of players to load
     */
    public void loadPlayers(Collection<? extends Player> players) {
        for (Player player : players) {
            loadPlayer(player);
        }
    }

    /**
     * Unloads multiple players' settings from memory
     * 
     * @param players the collection of players to unload
     */
    public void unloadPlayers(Collection<? extends Player> players) {
        for (Player player : players) {
            unloadPlayer(player);
        }
    }

    /**
     * Validates a player style format
     * 
     * @param style the style to validate
     * @return true if the style is valid
     */
    public boolean isValidStyle(String style) {
        return style != null && style.contains("%.1f");
    }

    /**
     * Gets the player's enabled status
     * 
     * @param player the player to check
     * @return true if damage indicators are enabled for the player
     */
    public boolean isEnabled(Player player) {
        return getPlayerSetting(player, true);
    }

    /**
     * Sets whether damage indicators are enabled for a player
     * 
     * @param player  the player to update
     * @param enabled the new enabled status
     */
    public void setEnabled(Player player, boolean enabled) {
        setPlayerSetting(player, enabled);
    }

    /**
     * Gets the player's custom damage style
     * 
     * @param player the player to check
     * @return the player's custom style, or the default style if none is set
     */
    public String getStyle(Player player) {
        return getPlayerStyle(player);
    }

    /**
     * Sets the player's custom damage style with validation
     * 
     * @param player the player to update
     * @param style  the new style
     * @throws Errors.ConfigurationException if the style is invalid
     */
    public void setStyle(Player player, String style) throws ConfigurationException {
        if (!isValidStyle(style)) {
            throw new Errors.ConfigurationException("Invalid damage style format: " + style);
        }
        setPlayerStyle(player, style);
    }

    /**
     * Loads a player's settings into memory
     * 
     * @param player the player to load
     */
    public void loadPlayer(Player player) {
        UUID uuid = player.getUniqueId();
        String path = PLAYERS_PATH + uuid;
        playerSettings.put(uuid, database.getBoolean(path + ENABLED_PATH, true));
        playerStyles.put(uuid, database.getString(path + STYLE_PATH,
                plugin.getConfig().getString("damage-format", "<red>-%.1f ❤")));
    }

    /**
     * Unloads a player's settings from memory
     * 
     * @param player the player to unload
     */
    public void unloadPlayer(Player player) {
        UUID uuid = player.getUniqueId();
        playerSettings.remove(uuid);
        playerStyles.remove(uuid);
    }

    /**
     * Gets a player setting from cache or database
     */
    private boolean getPlayerSetting(Player player, boolean defaultValue) {
        UUID uuid = player.getUniqueId();
        return playerSettings.computeIfAbsent(uuid,
                key -> database.getBoolean(PLAYERS_PATH + key + ENABLED_PATH, defaultValue));
    }

    /**
     * Sets a player setting and saves to database
     */
    private void setPlayerSetting(Player player, boolean value) {
        UUID uuid = player.getUniqueId();
        playerSettings.put(uuid, value);
        database.set(PLAYERS_PATH + uuid + ENABLED_PATH, value);
        try {
            saveDatabase();
        } catch (DatabaseException e) {
            logger.warning("Failed to save player setting", e);
        }
    }

    /**
     * Gets a player's style from cache or database
     */
    private String getPlayerStyle(Player player) {
        UUID uuid = player.getUniqueId();
        return playerStyles.computeIfAbsent(uuid, key -> database.getString(PLAYERS_PATH + key + STYLE_PATH,
                plugin.getConfig().getString("damage-format", "<red>-%.1f ❤")));
    }

    /**
     * Sets a player's style and saves to database
     */
    private void setPlayerStyle(Player player, String style) {
        UUID uuid = player.getUniqueId();
        playerStyles.put(uuid, style);
        database.set(PLAYERS_PATH + uuid + STYLE_PATH, style);
        try {
            saveDatabase();
        } catch (DatabaseException e) {
            logger.warning("Failed to save player style: {}", e.getMessage());
        }
    }

    /**
     * Gets the player's elemental effect type
     * 
     * @param player the player to check
     * @return the player's element type or null if not set
     */
    public String getPlayerElement(Player player) {
        return playerElements.get(player.getUniqueId());
    }

    /**
     * Sets the player's elemental effect type
     * 
     * @param player  the player to update
     * @param element the element type to set
     */
    public void setPlayerElement(Player player, String element) {
        playerElements.put(player.getUniqueId(), element);
    }

    /**
     * Checks if holograms are enabled for a player
     * 
     * @param player the player to check
     * @return true if holograms are enabled for the player
     */
    public boolean isHologramEnabled(Player player) {
        return playerHologramPreferences.getOrDefault(player.getUniqueId(), true);
    }

    /**
     * Sets whether holograms are enabled for a player
     * 
     * @param player  the player to update
     * @param enabled the new hologram enabled status
     * @throws DatabaseException if saving to database fails
     */
    public void setHologramEnabled(Player player, boolean enabled) throws DatabaseException {
        playerHologramPreferences.put(player.getUniqueId(), enabled);
        saveDatabase();
    }
}
