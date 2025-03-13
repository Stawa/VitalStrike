package stawa.vitalstrike;

import stawa.vitalstrike.commands.CommandManager;
import stawa.vitalstrike.logger.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;

import org.bukkit.Location;
import org.bukkit.NamespacedKey;
import org.bukkit.Particle;
import org.bukkit.Registry;
import org.bukkit.Sound;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Entity;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.TextDisplay;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.util.Transformation;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

/**
 * VitalStrike is a dynamic damage indication plugin for Minecraft servers.
 * <p>
 * This plugin provides customizable damage indicators with various features
 * including:
 * <ul>
 * <li>Dynamic damage indicators with customizable styles</li>
 * <li>Combo system with multipliers and ranks</li>
 * <li>Player statistics tracking</li>
 * <li>Per-player preferences</li>
 * </ul>
 * </p>
 * 
 * @author Stawa
 * @version 1.4.0
 * @see <a href="https://github.com/Stawa/VitalStrike">GitHub Repository</a>
 */
public class VitalStrike extends JavaPlugin implements Listener {
    private static final long DAMAGE_COOLDOWN = 500;

    private Map<UUID, TextDisplay> activeHolograms = new HashMap<>();
    private Map<UUID, org.bukkit.scheduler.BukkitTask> decayTasks = new HashMap<>();
    private Map<UUID, Long> lastActionTime = new HashMap<>();
    private HashMap<UUID, Long> lastComboTime = new HashMap<>();
    private HashMap<UUID, Long> lastDamageTime = new HashMap<>();
    private HashMap<UUID, Integer> playerCombos = new HashMap<>();

    private boolean comboDecayEnabled = true;
    private boolean comboEnabled = true;
    private boolean comboHologramEnabled = true;
    private boolean comboMultiplierEnabled = true;
    private boolean comboRankEnabled = true;
    private boolean enabled = true;
    private boolean updateCheckerEnabled;

    private double comboHologramDuration = 3.0;
    private double comboHologramHeight = 2.0;
    private int comboHologramMinCombo = 10;
    private double comboMultiplierBase = 1.0;
    private double comboMultiplierMax = 3.0;
    private double comboMultiplierPerCombo = 0.1;
    private long comboResetTime = 3000;

    private int comboDecayInterval = 1;
    private int comboDecayMinimum = 0;
    private int comboDecayRate = 1;
    private int comboDecayTime = 10;

    private double displayDuration = 1.5;
    private double displayRandomOffset = -1;
    private double displayX = -0.5;
    private double displayY = -0.2;
    private double fadeInDuration = 0.25;
    private double fadeOutDuration = 0.25;
    private double floatCurve = 0.02;
    private double floatSpeed = 0.03;
    private String moveDirection = "down";

    private String comboFormat = "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>";
    private String comboHologramFormat = "<gradient:red:gold><bold>COMBO STREAK!</bold></gradient>";
    private String decayWarningFormat = "<italic><gray>(Decaying in %.1fs)</gray></italic>";
    private String multiplierFormat = " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>";
    private String rankFormat = "\n<bold>%s</bold>";

    private String damageIndicatorType;
    private PermissionManager permissionManager;
    private CommandManager commandManager;

    private Map<String, Sound> damageTypeSounds;
    private Map<String, String> rankColors = new HashMap<>();
    private Map<String, Double> rankMultipliers = new HashMap<>();
    private Map<String, Integer> rankThresholds = new HashMap<>();
    private Map<UUID, Map<String, String>> damageFormatCache;

    private VitalLogger logger;
    private PlayerManager playerManager;
    private PlayerStats playerStats;

    /**
     * Enum representing the direction of movement for the damage indicators.
     */
    private enum Direction {
        UP(0, 1, 0),
        DOWN(0, -1, 0),
        LEFT(-1, 0, 0),
        RIGHT(1, 0, 0);

        private final double x;
        private final double y;
        private final double z;

        Direction(double x, double y, double z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public double getX() {
            return x;
        }

        public double getY() {
            return y;
        }

        public double getZ() {
            return z;
        }

        /**
         * Returns the direction from a string representation.
         * 
         * @param dir the string representation of the direction
         * @return the direction enum
         */
        public static Direction fromString(String dir) {
            try {
                return valueOf(dir.toUpperCase());
            } catch (IllegalArgumentException e) {
                return DOWN;
            }
        }
    }

    /**
     * Called when the plugin is enabled.
     */
    @Override
    public void onEnable() {
        HelpManager helpManager;
        this.logger = new VitalLogger(this);
        saveDefaultConfig();
        loadConfig();
        getServer().getPluginManager().registerEvents(this, this);

        try {
            playerManager = new PlayerManager(this);
        } catch (Errors.DatabaseException e) {
            logger.severe(" Failed to initialize player manager: " + e.getMessage());
        }

        try {
            playerStats = new PlayerStats(this);
        } catch (Errors.DatabaseException e) {
            logger.severe(" Failed to initialize player statistics: " + e.getMessage());
        }

        helpManager = new HelpManager(this);
        commandManager = new CommandManager(this, logger, playerManager, playerStats, helpManager);
        permissionManager = new PermissionManager(this);
        damageFormatCache = new HashMap<>();
        damageIndicatorType = getConfig().getString("damage-indicator", "simple-damage-formats");

        if (updateCheckerEnabled) {
            checkForUpdates();
        }

        loadDamageTypeSounds();
        logger.info("VitalStrike has been enabled!");
    }

    /**
     * Called when the plugin is disabled.
     */
    @Override
    public void onDisable() {
        for (TextDisplay hologram : activeHolograms.values()) {
            if (hologram != null && hologram.isValid()) {
                hologram.remove();
            }
        }
        activeHolograms.clear();
        if (playerManager != null) {
            try {
                playerManager.saveDatabase();
            } catch (Errors.DatabaseException e) {
                logger.severe(" Failed to save player database: " + e.getMessage());
            }
        }
        if (playerStats != null) {
            try {
                playerStats.saveAllStats();
            } catch (Errors.DatabaseException e) {
                logger.severe("Failed to save player statistics: " + e.getMessage());
            }
        }
        logger.info("VitalStrike has been disabled!");
    }

    /**
     * Reloads the plugin configuration and related components.
     */
    public void reload() {
        reloadConfig();
        loadConfig();
        loadDamageTypeSounds();
    }

    /**
     * Loads the damage type sounds from the configuration.
     */
    private void loadDamageTypeSounds() {
        damageTypeSounds = new HashMap<>();
        FileConfiguration config = getConfig();
        ConfigurationSection soundSection = config.getConfigurationSection("damage-type-sounds");
        if (soundSection != null) {
            for (String damageType : soundSection.getKeys(false)) {
                try {
                    String soundName = soundSection.getString(damageType);
                    if (soundName != null) {
                        Sound sound = Registry.SOUNDS.get(NamespacedKey.minecraft(soundName.toLowerCase()));
                        damageTypeSounds.put(damageType, sound);
                    }
                } catch (IllegalArgumentException e) {
                    logger.warning("Invalid sound name for damage type " + damageType);
                }
            }
        }
    }

    /**
     * Loads the configuration from the config.yml file.
     */
    private void loadConfig() {
        FileConfiguration config = getConfig();
        loadBasicSettings(config);
        loadComboSettings(config);
        loadDisplaySettings(config);
    }

    /**
     * Loads basic plugin settings from configuration.
     * Includes core settings like plugin enabled state and update checker.
     * 
     * @param config the plugin configuration
     */
    private void loadBasicSettings(FileConfiguration config) {
        enabled = config.getBoolean("enabled", true);
        updateCheckerEnabled = config.getBoolean("update-checker.enabled", true);
    }

    /**
     * Loads all combo-related settings from configuration.
     * This is a master method that calls specialized methods for different combo
     * aspects.
     * 
     * @param config the plugin configuration
     */
    private void loadComboSettings(FileConfiguration config) {
        loadComboBasicSettings(config);
        loadComboDecaySettings(config);
        loadComboMultiplierSettings(config);
        loadComboDisplaySettings(config);
        loadComboRankSettings(config);
    }

    /**
     * Loads basic combo system settings from configuration.
     * Includes combo enabled state and reset time.
     * 
     * @param config the plugin configuration
     */
    private void loadComboBasicSettings(FileConfiguration config) {
        comboEnabled = config.getBoolean("combo.enabled", true);
        comboResetTime = config.getLong("combo.reset-time", 3) * 1000;
    }

    /**
     * Loads combo decay settings from configuration.
     * Controls how combos decay over time when player is inactive.
     * 
     * @param config the plugin configuration
     */
    private void loadComboDecaySettings(FileConfiguration config) {
        comboDecayEnabled = config.getBoolean("combo.decay.enabled", true);
        comboDecayTime = config.getInt("combo.decay.time", 10);
        comboDecayRate = config.getInt("combo.decay.rate", 1);
        comboDecayInterval = config.getInt("combo.decay.interval", 1);
        comboDecayMinimum = config.getInt("combo.decay.minimum", 0);
    }

    /**
     * Loads combo multiplier settings from configuration.
     * Controls how combos affect damage multipliers and loads rank-specific
     * multipliers.
     * 
     * @param config the plugin configuration
     */
    private void loadComboMultiplierSettings(FileConfiguration config) {
        comboMultiplierEnabled = config.getBoolean("combo.multiplier.enabled", true);
        comboMultiplierBase = config.getDouble("combo.multiplier.base", 1.0);
        comboMultiplierPerCombo = config.getDouble("combo.multiplier.per-combo", 0.1);
        comboMultiplierMax = config.getDouble("combo.multiplier.max", 3.0);

        ConfigurationSection rankMultSection = config.getConfigurationSection("combo.multiplier.ranks");
        if (rankMultSection != null) {
            rankMultipliers.clear();
            for (String rank : rankMultSection.getKeys(false)) {
                rankMultipliers.put(rank, rankMultSection.getDouble(rank));
            }
        }
    }

    /**
     * Loads combo display settings from configuration.
     * Controls how combos are visually displayed to players including holograms and
     * formats.
     * 
     * @param config the plugin configuration
     */
    private void loadComboDisplaySettings(FileConfiguration config) {
        comboHologramEnabled = config.getBoolean("combo.display.hologram.enabled", true);
        comboHologramMinCombo = config.getInt("combo.display.hologram.min-combo", 10);
        comboHologramDuration = config.getDouble("combo.display.hologram.duration", 3.0);
        comboHologramFormat = config.getString("combo.display.hologram.format",
                "<gradient:red:gold><bold>COMBO STREAK!</bold></gradient>");
        comboHologramHeight = config.getDouble("combo.display.hologram.height", 2.0);

        comboFormat = config.getString("combo.display.format",
                "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>");
        multiplierFormat = config.getString("combo.display.multiplier-format",
                " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>");
        decayWarningFormat = config.getString("combo.display.decay-warning",
                "<italic><gray>(Decaying in %.1fs)</gray></italic>");
    }

    /**
     * Loads combo rank settings from configuration.
     * Controls the rank system for combos including thresholds and visual
     * appearance.
     * 
     * @param config the plugin configuration
     */
    private void loadComboRankSettings(FileConfiguration config) {
        comboRankEnabled = config.getBoolean("combo.display.rank.enabled", true);
        rankFormat = config.getString("combo.display.rank.format", "\n<bold>%s</bold>");
        loadRankThresholds(config);
        loadRankColors(config);
    }

    /**
     * Loads rank thresholds from configuration.
     * Defines the combo count required to achieve each rank.
     * 
     * @param config the plugin configuration
     */
    private void loadRankThresholds(FileConfiguration config) {
        ConfigurationSection thresholds = config.getConfigurationSection("combo.display.rank.thresholds");
        if (thresholds != null) {
            rankThresholds.clear();
            for (String rank : thresholds.getKeys(false)) {
                rankThresholds.put(rank, thresholds.getInt(rank));
            }
        }
    }

    /**
     * Loads rank colors from configuration.
     * Defines the color formatting for each rank.
     * 
     * @param config the plugin configuration
     */
    private void loadRankColors(FileConfiguration config) {
        ConfigurationSection colors = config.getConfigurationSection("combo.display.rank.colors");
        if (colors != null) {
            rankColors.clear();
            for (String rank : colors.getKeys(false)) {
                rankColors.put(rank, colors.getString(rank));
            }
        }
    }

    /**
     * Loads display settings from configuration.
     * Controls how damage indicators are positioned and animated.
     * 
     * @param config the plugin configuration
     */
    private void loadDisplaySettings(FileConfiguration config) {
        displayDuration = config.getDouble("display.duration", 1.5);
        displayY = config.getDouble("display.position.y", -0.2);
        displayX = config.getDouble("display.position.x", -0.5);
        displayRandomOffset = config.getDouble("display.position.random-offset", -1);
        moveDirection = config.getString("display.position.direction", "down");

        fadeInDuration = config.getDouble("display.animation.fade-in", 0.25);
        fadeOutDuration = config.getDouble("display.animation.fade-out", 0.25);
        floatSpeed = config.getDouble("display.animation.float-speed", 0.03);
        floatCurve = config.getDouble("display.animation.float-curve", 0.02);
    }

    /**
     * Checks for updates on the GitHub repository.
     * 
     * @throws Errors.UpdateException if there's an error checking for updates
     */
    private void checkForUpdates() {
        getServer().getScheduler().runTaskAsynchronously(this, () -> {
            try {
                String jsonResponse = fetchLatestReleaseData();
                processVersionInfo(jsonResponse);
            } catch (Errors.UpdateException e) {
                logger.warning(e.getMessage());
            } catch (Exception e) {
                logger.warning("Failed to check for updates: " + e.getMessage());
                Errors.UpdateException updateException = new Errors.UpdateException("Failed to check for updates", e);
                logger.warning("Error code: " + updateException.getErrorCode().getCode());
            }
        });
    }

    /**
     * Fetches the latest release data from GitHub API.
     * 
     * @return JSON response from GitHub API
     * @throws Errors.UpdateException if there's an error fetching the data
     */
    private String fetchLatestReleaseData() throws Errors.UpdateException {
        try {
            URI uri = URI.create("https://api.github.com/repos/Stawa/VitalStrike/releases/latest");
            HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/vnd.github.v3+json");

            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new Errors.UpdateException(
                        "Failed to connect to GitHub API: HTTP " + connection.getResponseCode());
            }

            return readResponseFromConnection(connection);
        } catch (IOException e) {
            throw new Errors.UpdateException("Failed to connect to GitHub API", e);
        }
    }

    /**
     * Reads response from HTTP connection.
     * 
     * @param connection the HTTP connection
     * @return response as string
     * @throws IOException if there's an error reading the response
     */
    private String readResponseFromConnection(HttpURLConnection connection) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            return response.toString();
        }
    }

    /**
     * Processes version information from GitHub API response.
     * Extracts version tag and compares with current plugin version.
     * 
     * @param jsonResponse the JSON response from GitHub API
     * @throws Errors.UpdateException if there's an error processing the version
     *                                info
     */
    private void processVersionInfo(String jsonResponse) throws Errors.UpdateException {
        String latestVersion;
        if (!jsonResponse.contains("\"tag_name\":")) {
            throw new Errors.UpdateException("Failed to parse version information from GitHub API response");
        }

        latestVersion = jsonResponse.split("\"tag_name\":\"")[1].split("\"")[0];
        String currentVersion = getPluginMeta().getVersion();

        logVersionInfo(currentVersion, latestVersion);
    }

    /**
     * Logs version comparison information to the server console.
     * Notifies if a new version is available or confirms running the latest
     * version.
     * 
     * @param currentVersion the current plugin version
     * @param latestVersion  the latest available version from GitHub
     */
    private void logVersionInfo(String currentVersion, String latestVersion) {
        if (!currentVersion.equals(latestVersion)) {
            String newVersionMessage = String.format("New version available: %s", latestVersion);
            String currentVersionMessage = String.format("You are running version: %s", currentVersion);
            String downloadMessage = String.format(
                    "Download the latest version from: %s",
                    "https://modrinth.com/plugin/vitalstrike");
            logger.info(newVersionMessage);
            logger.info(currentVersionMessage);
            logger.info(downloadMessage);
        } else {
            String latestVersionMessage = String.format("You are running the latest version: %s", latestVersion);
            logger.info(latestVersionMessage);
        }
    }

    /**
     * Handles the player join event.
     * 
     * @param event the player join event
     */
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        playerManager.loadPlayer(event.getPlayer());
    }

    /**
     * Handles the player quit event.
     * 
     * @param event the player quit event
     */
    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        playerManager.unloadPlayer(event.getPlayer());
    }

    /**
     * Handles the entity damage event.
     * 
     * @param event the entity damage event
     */
    @EventHandler
    public void onEntityDamage(EntityDamageEvent event) {
        if (!enabled)
            return;

        reloadDisplaySettings();

        Entity entity = event.getEntity();
        if (!(entity instanceof org.bukkit.entity.LivingEntity))
            return;

        UUID entityId = entity.getUniqueId();
        long currentTime = System.currentTimeMillis();

        if (event instanceof org.bukkit.event.entity.EntityDamageByEntityEvent entitydamagebyentityevent) {
            handlePlayerCombos(entitydamagebyentityevent, currentTime);
        }

        if (isOnCooldown(entityId, currentTime))
            return;

        lastDamageTime.put(entityId, currentTime);

        displayDamageIndicator(entity, event);
    }

    /**
     * Reloads display and animation settings from config.
     */
    private void reloadDisplaySettings() {
        displayDuration = getConfig().getDouble("display.duration", 1.5);
        displayY = getConfig().getDouble("display.position.y", -0.2);
        displayX = getConfig().getDouble("display.position.x", -0.5);
        displayRandomOffset = getConfig().getDouble("display.position.random-offset", -1);
        moveDirection = getConfig().getString("display.position.direction", "down");

        fadeInDuration = getConfig().getDouble("display.animation.fade-in", 0.25);
        fadeOutDuration = getConfig().getDouble("display.animation.fade-out", 0.25);
        floatSpeed = getConfig().getDouble("display.animation.float-speed", 0.03);
        floatCurve = getConfig().getDouble("display.animation.float-curve", 0.02);
    }

    /**
     * Checks if an entity is on damage cooldown.
     * 
     * @param entityId    the entity UUID
     * @param currentTime the current time
     * @return true if on cooldown
     */
    private boolean isOnCooldown(UUID entityId, long currentTime) {
        return lastDamageTime.containsKey(entityId) &&
                currentTime - lastDamageTime.get(entityId) < DAMAGE_COOLDOWN;
    }

    /**
     * Handles player combo system for entity damage events.
     * Processes combo counting, decay, multipliers, and effects when a player
     * damages an entity.
     * Ignores non-combat entities like holograms, armor stands, and display
     * entities.
     * 
     * @param event       the damage event
     * @param currentTime the current time in milliseconds
     */
    private void handlePlayerCombos(org.bukkit.event.entity.EntityDamageByEntityEvent event, long currentTime) {
        Entity damager = event.getDamager();
        Entity target = event.getEntity();

        if (!(damager instanceof Player))
            return;

        if (target instanceof TextDisplay ||
                target.getType() == EntityType.ARMOR_STAND ||
                target.getType() == EntityType.ITEM_FRAME ||
                target.getType() == EntityType.GLOW_ITEM_FRAME ||
                target.getType() == EntityType.PAINTING ||
                target.getType() == EntityType.ITEM_DISPLAY ||
                target.getType() == EntityType.BLOCK_DISPLAY) {
            return;
        }

        Player player = (Player) damager;
        UUID playerId = player.getUniqueId();

        updatePlayerCombo(playerId, currentTime);
        handleComboDecay(player, playerId);
        applyDamageMultiplier(player, playerId, event);
        playComboEffects(player, playerId);

        playerStats.updateStats(player, event.getFinalDamage(), playerCombos.get(playerId));

        displayComboHUD(player, event.getEntity());
    }

    /**
     * Updates a player's combo counter.
     * 
     * @param playerId    the player UUID
     * @param currentTime the current time
     */
    private void updatePlayerCombo(UUID playerId, long currentTime) {
        Long lastCombo = lastComboTime.getOrDefault(playerId, 0L);
        if (currentTime - lastCombo > comboResetTime) {
            playerCombos.put(playerId, 1);
        } else {
            int currentCombo = playerCombos.getOrDefault(playerId, 0);
            playerCombos.put(playerId, currentCombo + 1);
        }

        lastComboTime.put(playerId, currentTime);

        lastActionTime.put(playerId, currentTime);
    }

    /**
     * Handles combo decay for a player.
     * 
     * @param player   the player
     * @param playerId the player UUID
     */
    private void handleComboDecay(Player player, UUID playerId) {
        if (!comboDecayEnabled)
            return;

        org.bukkit.scheduler.BukkitTask existingTask = decayTasks.remove(playerId);
        if (existingTask != null) {
            existingTask.cancel();
        }

        org.bukkit.scheduler.BukkitTask decayTask = getServer().getScheduler().runTaskTimer(this, () -> {
            long timeSinceLastAction = (System.currentTimeMillis() - lastActionTime.get(playerId)) / 1000;

            if (timeSinceLastAction >= comboDecayTime) {
                int currentCombo = playerCombos.getOrDefault(playerId, 0);
                if (currentCombo > comboDecayMinimum) {
                    playerCombos.put(playerId, Math.max(currentCombo - comboDecayRate, comboDecayMinimum));
                    displayComboHUD(player, null);
                }
            }
        }, comboDecayTime * 20L, comboDecayInterval * 20L);

        decayTasks.put(playerId, decayTask);
    }

    /**
     * Applies damage multiplier based on combo.
     * 
     * @param playerId the player UUID
     * @param event    the damage event
     */
    private void applyDamageMultiplier(Player player, UUID playerId, EntityDamageEvent event) {
        if (!comboMultiplierEnabled)
            return;

        int combo = playerCombos.get(playerId);
        String rank = getComboRank(combo).replace("[", "").replace("]", "");

        double multiplier = comboMultiplierBase + (combo * comboMultiplierPerCombo);

        double rankMultiplier = rankMultipliers.getOrDefault(rank, comboMultiplierBase);
        multiplier = Math.max(multiplier, rankMultiplier);
        applyElementalEffects(player, event.getEntity(), combo);

        multiplier = Math.min(multiplier, comboMultiplierMax);

        event.setDamage(event.getDamage() * multiplier);
    }

    /**
     * Applies elemental effects based on player's selected element and combo count.
     * Different elements provide different combat effects:
     * - Fire: Sets the target on fire with duration based on combo count
     * - Ice: Applies slowness effect with strength and duration based on combo
     * count
     * - Lightning: Has a chance to strike lightning at the target location on
     * milestone combos
     * 
     * @param player the player applying the effect
     * @param target the target entity receiving the effect
     * @param combo  the current combo count which affects effect strength
     */
    private void applyElementalEffects(Player player, Entity target, int combo) {
        String element = playerManager.getPlayerElement(player);
        if (element == null)
            return;

        switch (element.toLowerCase()) {
            case "fire":
                target.setFireTicks(combo * 20);
                break;
            case "ice":
                if (target instanceof LivingEntity livingEntity) {
                    livingEntity.addPotionEffect(new PotionEffect(
                            PotionEffectType.SLOWNESS, combo * 20, combo / 5));
                }
                break;
            case "lightning":
                if (combo % 10 == 0) {
                    target.getWorld().strikeLightning(target.getLocation());
                }
                break;
            default:
                break;
        }
    }

    /**
     * Plays combo effects for a player.
     * 
     * @param player   the player
     * @param playerId the player UUID
     */
    private void playComboEffects(Player player, UUID playerId) {
        if (!getConfig().getBoolean("combo.effects.enabled", true) || !playerManager.isEnabled(player))
            return;

        playComboSound(player, playerId);
        spawnComboParticles(player);
    }

    /**
     * Plays combo sounds for a player.
     * 
     * @param player   the player
     * @param playerId the player UUID
     */
    private void playComboSound(Player player, UUID playerId) {
        if (!getConfig().getBoolean("combo.effects.sound.enabled", true))
            return;

        try {
            String soundName = getConfig().getString("combo.effects.sound.combo-up", "ENTITY_EXPERIENCE_ORB_PICKUP");
            Sound sound = Registry.SOUNDS.get(NamespacedKey.minecraft(soundName.toLowerCase()));
            if (sound == null) {
                logger.warning("Invalid sound name in config: " + soundName);
                return;
            }

            float volume = (float) getConfig().getDouble("combo.effects.sound.volume", 1.0);
            float pitch = (float) getConfig().getDouble("combo.effects.sound.pitch", 1.0);
            Location location = player.getLocation();
            if (location != null) {
                player.playSound(location, sound, volume, pitch);
            }

            int prevCombo = playerCombos.getOrDefault(playerId, 0) - 1;
            String prevRank = getComboRank(prevCombo).replace("[", "").replace("]", "");
            String newRank = getComboRank(playerCombos.get(playerId)).replace("[", "").replace("]", "");

            if (!prevRank.equals(newRank)) {
                String milestoneSoundName = getConfig().getString("combo.effects.sound.combo-milestone",
                        "ENTITY_PLAYER_LEVELUP");
                Sound milestoneSound = Registry.SOUNDS.get(NamespacedKey.minecraft(milestoneSoundName.toLowerCase()));
                if (milestoneSound == null) {
                    logger.warning("Invalid milestone sound name in config: " + milestoneSoundName);
                    return;
                }

                Location playerLoc = player.getLocation();
                if (playerLoc != null) {
                    player.playSound(playerLoc, milestoneSound, volume * 1.2f, pitch * 1.2f);
                }
            }
        } catch (IllegalArgumentException e) {
            logger.warning("Invalid sound name in config: " + e.getMessage());
        }
    }

    /**
     * Spawns combo particles for a player.
     * 
     * @param player the player
     */
    private void spawnComboParticles(Player player) {
        if (!getConfig().getBoolean("combo.effects.particles.enabled", true))
            return;

        try {
            String particleType = getConfig().getString("combo.effects.particles.type", "CRIT");
            int count = getConfig().getInt("combo.effects.particles.count", 10);
            Location playerLocation = player.getLocation();

            if (playerLocation != null) {
                Location particleLocation = playerLocation.clone().add(0, 1, 0);
                player.getWorld().spawnParticle(Particle.valueOf(particleType.toUpperCase()),
                        particleLocation, count, 0.5, 0.5, 0.5, 0);
            }

        } catch (IllegalArgumentException e) {
            logger.warning("Invalid particle type in config: " + e.getMessage());
        }
    }

    /**
     * Displays damage indicator for an entity.
     * 
     * @param entity the damaged entity
     * @param event  the damage event
     */
    private void displayDamageIndicator(Entity entity, EntityDamageEvent event) {
        if (!shouldShowDamageIndicator(entity)) {
            return;
        }

        double damage = event.getFinalDamage();
        Location loc = entity.getLocation().add(0, entity.getHeight() + 0.5, 0);

        Player damager = null;
        if (event instanceof EntityDamageByEntityEvent damageByEntityEvent) {
            Entity damagerEntity = damageByEntityEvent.getDamager();
            if (damagerEntity instanceof Player) {
                damager = (Player) damagerEntity;
            }
        }

        String damageType = event.getCause().name().toLowerCase();

        String damageFormat;
        if (damager != null && playerManager.isEnabled(damager)) {
            damageFormat = permissionManager.getDamageFormat(damager, damageType,
                    getSimpleDamageFormat(event.getCause()));
        } else {
            damageFormat = getSimpleDamageFormat(event.getCause());
        }

        entity.getWorld().getNearbyEntities(loc, 20, 20, 20).stream()
                .filter(Player.class::isInstance)
                .map(e -> (Player) e)
                .filter(player -> playerManager.isEnabled(player))
                .forEach(player -> createDamageDisplay(loc, damageFormat, damage));

        playDamageTypeSound(entity, event.getCause(), loc);
    }

    /**
     * Gets the damage format string based on damage cause and player permissions.
     * 
     * @param cause  the damage cause
     * @param entity the damaged entity
     * @return the format string
     */
    private String getDamageFormat(EntityDamageEvent.DamageCause cause, Entity entity) {
        String damageType = cause.name().toLowerCase();

        if ("simple-damage-formats".equals(damageIndicatorType)) {
            return getSimpleDamageFormat(cause);
        }

        Player player = null;
        if (entity instanceof Player) {
            player = (Player) entity;
        } else if (entity.getLastDamageCause() instanceof EntityDamageByEntityEvent damageByEntityEvent) {
            Entity damager = damageByEntityEvent.getDamager();
            if (damager instanceof Player) {
                player = (Player) damager;
            }
        }

        if (player == null) {
            return getSimpleDamageFormat(cause);
        }

        return permissionManager.getDamageFormat(player, damageType, getSimpleDamageFormat(cause));
    }

    /**
     * Checks if an entity should receive damage indicators.
     * 
     * @param entity the entity to check
     * @return true if the entity should receive damage indicators, false otherwise
     */
    public boolean shouldShowDamageIndicator(Entity entity) {
        if (!(entity instanceof LivingEntity)) {
            return false;
        }

        if (entity.getType() == EntityType.ARMOR_STAND) {
            return false;
        }

        if (entity instanceof TextDisplay ||
                entity.getType() == EntityType.ARMOR_STAND ||
                entity.getType() == EntityType.ITEM_FRAME ||
                entity.getType() == EntityType.GLOW_ITEM_FRAME ||
                entity.getType() == EntityType.PAINTING ||
                entity.getType() == EntityType.ITEM_DISPLAY ||
                entity.getType() == EntityType.BLOCK_DISPLAY) {
            return false;
        }

        if (entity.getScoreboardTags().contains("nodamage")) {
            return false;
        }

        return true;
    }

    /**
     * Gets the simple damage format based on damage cause.
     * 
     * @param cause the damage cause
     * @return the format string
     */
    private String getSimpleDamageFormat(EntityDamageEvent.DamageCause cause) {
        switch (cause) {
            case ENTITY_ATTACK:
                if (Math.random() < 0.2) {
                    return getConfig().getString("damage-formats.critical", "<dark_red><bold>-%.1f ⚡</bold>");
                } else {
                    return getConfig().getString("damage-formats.default", "<red>-%.1f ❤");
                }
            case POISON:
                return getConfig().getString("damage-formats.poison", "<dark_green>-%.1f ☠");
            case FIRE, FIRE_TICK:
                return getConfig().getString("damage-formats.fire", "<gold>-%.1f 🔥");
            case KILL:
                return getConfig().getString("damage-formats.kill", "<dark_red>-%.1f ☠");
            case MAGIC:
                return getConfig().getString("damage-formats.magic", "<dark_purple>-%.1f ✨");
            case FALL:
                return getConfig().getString("damage-formats.fall", "<gray>-%.1f 💨");
            case DROWNING:
                return getConfig().getString("damage-formats.drown", "<blue>-%.1f 💧");
            case BLOCK_EXPLOSION, ENTITY_EXPLOSION:
                return getConfig().getString("damage-formats.explosion", "<red>-%.1f 💥");
            case CONTACT:
                return getConfig().getString("damage-formats.contact", "<green>-%.1f 🌵");
            case CRAMMING:
                return getConfig().getString("damage-formats.cramming", "<gray>-%.1f 📦");
            case DRAGON_BREATH:
                return getConfig().getString("damage-formats.dragon", "<light_purple>-%.1f 🐉");
            case DRYOUT:
                return getConfig().getString("damage-formats.dryout", "<yellow>-%.1f 🌊");
            case ENTITY_SWEEP_ATTACK:
                return getConfig().getString("damage-formats.sweep", "<red>-%.1f ⚔");
            case FALLING_BLOCK:
                return getConfig().getString("damage-formats.falling_block", "<gray>-%.1f 🧱");
            case FLY_INTO_WALL:
                return getConfig().getString("damage-formats.wall", "<gray>-%.1f 💫");
            case FREEZE:
                return getConfig().getString("damage-formats.freeze", "<aqua>-%.1f ❄");
            case HOT_FLOOR:
                return getConfig().getString("damage-formats.hot_floor", "<gold>-%.1f 🔥");
            case LAVA:
                return getConfig().getString("damage-formats.lava", "<dark_red>-%.1f 🌋");
            case LIGHTNING:
                return getConfig().getString("damage-formats.lightning", "<yellow>-%.1f ⚡");
            case PROJECTILE:
                return getConfig().getString("damage-formats.projectile", "<gray>-%.1f 🏹");
            case SONIC_BOOM:
                return getConfig().getString("damage-formats.sonic_boom", "<dark_aqua>-%.1f 📢");
            case STARVATION:
                return getConfig().getString("damage-formats.starvation", "<gold>-%.1f 🍖");
            case SUFFOCATION:
                return getConfig().getString("damage-formats.suffocation", "<gray>-%.1f ⬛");
            case THORNS:
                return getConfig().getString("damage-formats.thorns", "<green>-%.1f 🌹");
            case VOID:
                return getConfig().getString("damage-formats.void", "<dark_gray>-%.1f ⬇");
            case WITHER:
                return getConfig().getString("damage-formats.wither", "<dark_gray>-%.1f 💀");
            case WORLD_BORDER:
                return getConfig().getString("damage-formats.border", "<red>-%.1f 🌐");
            default:
                return getConfig().getString("damage-formats.default", "<red>-%.1f ❤");
        }
    }

    /**
     * Creates and displays a damage indicator.
     * 
     * @param loc          the location to display at
     * @param damageFormat the format string for the damage
     * @param damage       the damage amount
     */
    private void createDamageDisplay(Location loc, String damageFormat, double damage) {
        String rawText = String.format(damageFormat, damage);
        String displayFormat = formatColorCodes(rawText);
        Component damageText = MiniMessage.miniMessage().deserialize(displayFormat);

        TextDisplay textDisplay = createTextDisplay(loc, damageText);

        setupDisplayAnimation(textDisplay, loc);
    }

    /**
     * Formats legacy color codes to MiniMessage format.
     * Converts both ampersand (&) and section symbol (§) color codes to MiniMessage
     * tags.
     * 
     * @param text the text containing legacy color codes
     * @return the text with color codes converted to MiniMessage format
     */
    private String formatColorCodes(String text) {
        return text.replace("&c", "<red>")
                .replace("&4", "<dark_red>")
                .replace("&2", "<dark_green>")
                .replace("&6", "<gold>")
                .replace("&5", "<dark_purple>")
                .replace("&7", "<gray>")
                .replace("&9", "<blue>")
                .replace("&l", "<bold>")
                .replace("§c", "<red>")
                .replace("§4", "<dark_red>")
                .replace("§2", "<dark_green>")
                .replace("§6", "<gold>")
                .replace("§5", "<dark_purple>")
                .replace("§7", "<gray>")
                .replace("§9", "<blue>")
                .replace("§l", "<bold>");
    }

    /**
     * Creates a text display entity at the specified location.
     */
    private TextDisplay createTextDisplay(Location loc, Component text) {
        TextDisplay display = (TextDisplay) loc.getWorld().spawnEntity(loc, EntityType.TEXT_DISPLAY);
        display.text(text);
        display.setBillboard(org.bukkit.entity.Display.Billboard.CENTER);
        display.setDefaultBackground(false);
        display.setShadowed(true);
        display.setVisibleByDefault(true);
        return display;
    }

    /**
     * Sets up the animation for a damage display.
     */
    private void setupDisplayAnimation(TextDisplay textDisplay, Location baseLoc) {
        Location displayLoc = baseLoc.clone();
        double randomX = 0;
        double randomZ = 0;

        if (displayRandomOffset >= 0) {
            randomX = (Math.random() - 0.5) * displayRandomOffset;
            randomZ = (Math.random() - 0.5) * displayRandomOffset;
            displayLoc.add(randomX, 0, randomZ);
        }

        displayLoc.add(displayX, displayY, 0);
        textDisplay.teleport(displayLoc);

        int fadeInTicks = (int) (fadeInDuration * 20);
        int fadeOutTicks = (int) (fadeOutDuration * 20);
        int totalTicks = (int) (displayDuration * 20);
        int startFadeOutAt = totalTicks - fadeOutTicks;

        Direction direction = Direction.fromString(moveDirection);

        AnimationSettings settings = new AnimationSettings(
                fadeInTicks, fadeOutTicks, totalTicks, startFadeOutAt, direction);

        animateDisplay(textDisplay, randomX, randomZ, settings);
    }

    /**
     * Animation settings container class.
     */
    private static class AnimationSettings {
        final int fadeInTicks;
        final int fadeOutTicks;
        final int totalTicks;
        final int startFadeOutAt;
        final Direction direction;

        AnimationSettings(int fadeInTicks, int fadeOutTicks, int totalTicks,
                int startFadeOutAt, Direction direction) {
            this.fadeInTicks = fadeInTicks;
            this.fadeOutTicks = fadeOutTicks;
            this.totalTicks = totalTicks;
            this.startFadeOutAt = startFadeOutAt;
            this.direction = direction;
        }
    }

    /**
     * Handles the animation of a damage display.
     */
    private void animateDisplay(TextDisplay textDisplay, double baseX, double baseZ, AnimationSettings settings) {
        double baseWaveX = baseX * floatCurve;
        double baseWaveZ = baseZ * floatCurve;

        for (int tick = 0; tick < settings.totalTicks; tick++) {
            final int currentTick = tick;
            getServer().getScheduler().runTaskLater(this, () -> {
                if (!textDisplay.isValid())
                    return;

                float scale = calculateScale(currentTick, settings.fadeInTicks, settings.startFadeOutAt,
                        settings.fadeOutTicks);
                updateDisplayPosition(textDisplay, currentTick, baseWaveX, baseWaveZ, settings.direction);
                updateDisplayTransformation(textDisplay, scale);
            }, tick);
        }

        getServer().getScheduler().runTaskLater(this, () -> {
            if (textDisplay.isValid()) {
                textDisplay.remove();
            }
        }, settings.totalTicks);
    }

    /**
     * Calculates the scale for a display based on animation progress.
     */
    private float calculateScale(int currentTick, int fadeInTicks, int startFadeOutAt, int fadeOutTicks) {
        if (currentTick < fadeInTicks) {
            return (float) currentTick / fadeInTicks;
        } else if (currentTick > startFadeOutAt) {
            return 1.0f - ((float) (currentTick - startFadeOutAt) / fadeOutTicks);
        }
        return 1.0f;
    }

    /**
     * Updates the position of a display during animation.
     */
    private void updateDisplayPosition(TextDisplay textDisplay, int currentTick,
            double baseWaveX, double baseWaveZ, Direction direction) {
        double progress = currentTick / 20.0;
        double waveX = baseWaveX * Math.sin(progress * Math.PI);
        double waveZ = baseWaveZ * Math.cos(progress * Math.PI);

        double moveX = direction.getX() * floatSpeed + waveX;
        double moveY = direction.getY() * floatSpeed;
        double moveZ = direction.getZ() * floatSpeed + waveZ;

        Location newLoc = textDisplay.getLocation();
        newLoc.add(moveX, moveY, moveZ);
        textDisplay.teleport(newLoc);
    }

    /**
     * Updates the transformation of a display.
     */
    private void updateDisplayTransformation(TextDisplay textDisplay, float scale) {
        textDisplay.setTransformation(new Transformation(
                new Vector3f(),
                new AxisAngle4f(),
                new Vector3f(scale, scale, scale),
                new AxisAngle4f()));
    }

    /**
     * Plays a sound based on the damage type.
     * 
     * @param entity   the damaged entity
     * @param cause    the damage cause
     * @param location the location to play the sound
     */
    private void playDamageTypeSound(Entity entity, EntityDamageEvent.DamageCause cause, Location location) {
        if (damageTypeSounds == null || damageTypeSounds.isEmpty()) {
            return;
        }

        String damageType = cause.name().toLowerCase();
        Sound sound = damageTypeSounds.get(damageType);

        if (sound != null) {
            float volume = (float) getConfig().getDouble("damage-type-sounds-settings.volume", 1.0f);
            float pitch = (float) getConfig().getDouble("damage-type-sounds-settings.pitch", 1.0f);

            entity.getWorld().getNearbyEntities(location, 20, 20, 20).stream()
                    .filter(Player.class::isInstance)
                    .map(e -> (Player) e)
                    .filter(player -> playerManager.isEnabled(player))
                    .forEach(player -> player.playSound(location, sound, volume, pitch));
        }
    }

    /**
     * Returns the rank for the given combo.
     * 
     * @param combo the combo
     * @return the rank
     */
    private String getComboRank(int combo) {
        String currentRank = "D";
        int highestThreshold = -1;

        for (Map.Entry<String, Integer> entry : rankThresholds.entrySet()) {
            if (combo >= entry.getValue() && entry.getValue() > highestThreshold) {
                currentRank = entry.getKey();
                highestThreshold = entry.getValue();
            }
        }

        String rankColor = rankColors.getOrDefault(currentRank, "<white>");
        return String.format(rankFormat, rankColor + currentRank);
    }

    /**
     * Displays the combo HUD for the given player.
     * 
     * @param player the player
     */
    private void displayComboHUD(Player player, Entity target) {
        if (!comboEnabled || !playerManager.isEnabled(player))
            return;

        int combo = playerCombos.getOrDefault(player.getUniqueId(), 0);
        if (combo <= 0)
            return;

        String displayText = buildComboHudText(player, combo);

        Component message = MiniMessage.miniMessage().deserialize(displayText);
        player.sendActionBar(message);

        if (comboHologramEnabled && combo >= comboHologramMinCombo && target != null) {
            createComboHologram(player, combo, target);
        }

        scheduleActionBarClear(player, combo);
    }

    /**
     * Creates a hologram display above the target showing combo information.
     * Only displays for combos that meet or exceed the minimum threshold.
     * 
     * @param player the player who achieved the combo
     * @param combo  the current combo count
     * @param target the target entity to display above
     */
    private void createComboHologram(Player player, int combo, Entity target) {
        UUID playerId = player.getUniqueId();

        if (activeHolograms.containsKey(playerId)) {
            TextDisplay existing = activeHolograms.get(playerId);
            if (existing != null && existing.isValid()) {
                existing.remove();
            }
            activeHolograms.remove(playerId);
        }

        Location loc = target.getLocation().add(0, target.getHeight() + comboHologramHeight, 0);
        TextDisplay hologram = (TextDisplay) loc.getWorld().spawnEntity(loc, EntityType.TEXT_DISPLAY);

        String formattedText = comboHologramFormat.replace("%combo%", String.valueOf(combo));
        hologram.text(MiniMessage.miniMessage().deserialize(formattedText));

        hologram.setBillboard(org.bukkit.entity.Display.Billboard.CENTER);
        hologram.setAlignment(TextDisplay.TextAlignment.CENTER);
        hologram.setSeeThrough(true);
        hologram.setShadowed(true);
        hologram.setPersistent(false);

        activeHolograms.put(playerId, hologram);

        int removalTicks = (int) (comboHologramDuration * 20);
        getServer().getScheduler().runTaskLater(this, () -> {
            if (hologram.isValid()) {
                hologram.remove();
                activeHolograms.remove(playerId);
            }
        }, removalTicks);
    }

    /**
     * Builds the combo HUD text with all components.
     * 
     * @param player the player
     * @param combo  the current combo count
     * @return the formatted HUD text
     */
    private String buildComboHudText(Player player, int combo) {
        StringBuilder display = new StringBuilder();

        display.append(String.format(comboFormat, combo));

        if (comboRankEnabled) {
            display.append(getComboRank(combo));
        }

        if (comboMultiplierEnabled) {
            display.append(getComboMultiplierText(combo));
        }

        if (comboDecayEnabled) {
            display.append(getDecayWarningText(player));
        }

        return display.toString();
    }

    /**
     * Gets the formatted multiplier text for the combo.
     * 
     * @param combo the current combo count
     * @return the formatted multiplier text
     */
    private String getComboMultiplierText(int combo) {
        String rank = getComboRank(combo).replace("[", "").replace("]", "");
        double multiplier = comboMultiplierBase + (combo * comboMultiplierPerCombo);
        double rankMultiplier = rankMultipliers.getOrDefault(rank, comboMultiplierBase);
        multiplier = Math.clamp(multiplier, rankMultiplier, comboMultiplierMax);
        return String.format(multiplierFormat, multiplier);
    }

    /**
     * Gets the decay warning text if applicable.
     * 
     * @param player the player
     * @return the decay warning text or empty string
     */
    private String getDecayWarningText(Player player) {
        UUID playerId = player.getUniqueId();
        if (!lastActionTime.containsKey(playerId)) {
            return "";
        }

        long timeSinceLastAction = (System.currentTimeMillis() - lastActionTime.get(playerId)) / 1000;
        if (timeSinceLastAction >= comboDecayTime - 3) {
            float timeUntilDecay = (float) comboDecayTime - timeSinceLastAction;
            if (timeUntilDecay > 0) {
                return " " + String.format(decayWarningFormat, timeUntilDecay);
            }
        }
        return "";
    }

    /**
     * Schedules clearing the action bar after the display duration.
     * 
     * @param player       the player
     * @param currentCombo the current combo count
     */
    private void scheduleActionBarClear(Player player, int currentCombo) {
        int durationTicks = (int) (displayDuration * 20);
        getServer().getScheduler().runTaskLater(this, () -> {
            if (playerCombos.getOrDefault(player.getUniqueId(), 0) == currentCombo) {
                player.sendActionBar(Component.empty());
            }
        }, durationTicks);
    }

    /**
     * Handles the command.
     * 
     * @param sender  the command sender
     * @param command the command
     * @param label   the label
     * @param args    the arguments
     * @return true if the command was handled, false otherwise
     */
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        return commandManager.onCommand(sender, command, label, args);
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        return commandManager.onTabComplete(sender, command, alias, args);
    }

    /**
     * Gets the player manager instance.
     * 
     * @return the player manager
     */
    public PlayerManager getPlayerManager() {
        return playerManager;
    }

    /**
     * Gets the player stats instance.
     * 
     * @return the player stats
     */
    public PlayerStats getPlayerStats() {
        return playerStats;
    }

    /**
     * Gets the appropriate damage format for a player based on their permissions.
     * 
     * @param player     the player
     * @param damageType the type of damage
     * @return the formatted damage string
     */
    public String getDamageFormat(Player player, String damageType) {
        UUID playerId = player.getUniqueId();
        if (damageFormatCache.containsKey(playerId)) {
            Map<String, String> playerFormats = damageFormatCache.get(playerId);
            if (playerFormats.containsKey(damageType)) {
                return playerFormats.get(damageType);
            }
        }

        String format = null;

        if (getConfig().contains("group-damage-formats")) {
            ConfigurationSection groupsSection = getConfig().getConfigurationSection("group-damage-formats");
            if (groupsSection != null) {
                for (String groupKey : groupsSection.getKeys(false)) {
                    if (!groupKey.equals("default")) {
                        String permission = "vitalstrike.group." + groupKey;
                        if (player.hasPermission(permission)) {
                            format = getConfig().getString(
                                    "group-damage-formats." + groupKey + ".damage-formats." + damageType);

                            if (format != null) {
                                cacheFormat(playerId, damageType, format);
                                return format;
                            }

                            format = getConfig().getString(
                                    "group-damage-formats." + groupKey + ".damage-formats.default");

                            if (format != null) {
                                cacheFormat(playerId, damageType, format);
                                return format;
                            }
                        }
                    }
                }
            }

            format = getConfig().getString("group-damage-formats.default.damage-formats." + damageType);
            if (format != null) {
                cacheFormat(playerId, damageType, format);
                return format;
            }

            format = getConfig().getString("group-damage-formats.default.damage-formats.default");
            if (format != null) {
                cacheFormat(playerId, damageType, format);
                return format;
            }
        }

        format = getConfig().getString(damageIndicatorType + "." + damageType);
        if (format != null) {
            cacheFormat(playerId, damageType, format);
            return format;
        }

        format = getConfig().getString(damageIndicatorType + ".default", "<red>-%.1f ❤</red>");
        cacheFormat(playerId, damageType, format);
        return format;
    }

    /**
     * Caches a damage format for a player.
     * 
     * @param playerId   the player UUID
     * @param damageType the damage type
     * @param format     the format string
     */
    private void cacheFormat(UUID playerId, String damageType, String format) {
        damageFormatCache.computeIfAbsent(playerId, k -> new HashMap<>()).put(damageType, format);
    }

    /**
     * Refreshes a player's damage format based on their permissions.
     * Call this when a player's permissions change.
     * 
     * @param player the player to refresh damage format for
     */
    public void refreshPlayerDamageFormat(Player player) {
        damageFormatCache.remove(player.getUniqueId());
        logger.info("Refreshed damage format for player: " + player.getName());
    }

    /**
     * Resets a player's combo counter
     * 
     * @param playerId the UUID of the player
     */
    public void resetPlayerCombo(UUID playerId) {
        playerCombos.put(playerId, 0);
        lastComboTime.remove(playerId);
        lastActionTime.remove(playerId);

        org.bukkit.scheduler.BukkitTask existingTask = decayTasks.remove(playerId);
        if (existingTask != null) {
            existingTask.cancel();
        }

        TextDisplay hologram = activeHolograms.remove(playerId);
        if (hologram != null && hologram.isValid()) {
            hologram.remove();
        }
    }
}
