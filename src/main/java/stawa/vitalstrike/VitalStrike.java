package stawa.vitalstrike;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.Sound;
import org.bukkit.Particle;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.Arrays;
import java.util.Map;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.TextDisplay;
import org.bukkit.entity.EntityType;
import org.bukkit.configuration.ConfigurationSection;
import org.joml.Vector3f;
import org.joml.AxisAngle4f;
import org.bukkit.util.Transformation;

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
 * @version 1.2
 * @see <a href="https://github.com/Stawa/VitalStrike">GitHub Repository</a>
 */
public class VitalStrike extends JavaPlugin implements Listener {
    private boolean enabled = true;
    private boolean updateCheckerEnabled;
    private HashMap<UUID, Long> lastDamageTime = new HashMap<>();
    private HashMap<UUID, Integer> playerCombos = new HashMap<>();
    private HashMap<UUID, Long> lastComboTime = new HashMap<>();
    private static final long DAMAGE_COOLDOWN = 500;
    private long comboResetTime = 3000;
    private boolean comboEnabled = true;
    private boolean comboRankEnabled = true;
    private boolean comboMultiplierEnabled = true;
    private boolean comboDecayEnabled = true;
    private int comboDecayTime = 10;
    private int comboDecayRate = 1;
    private int comboDecayInterval = 1;
    private int comboDecayMinimum = 0;
    private Map<UUID, Long> lastActionTime = new HashMap<>();
    private Map<UUID, org.bukkit.scheduler.BukkitTask> decayTasks = new HashMap<>();
    private double comboMultiplierBase = 1.0;
    private double comboMultiplierPerCombo = 0.1;
    private double comboMultiplierMax = 3.0;
    private Map<String, Double> rankMultipliers = new HashMap<>();
    private String comboFormat = "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>";
    private String multiplierFormat = " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>";
    private String rankFormat = "\n<bold>%s</bold>";
    private Map<String, Integer> rankThresholds = new HashMap<>();
    private Map<String, String> rankColors = new HashMap<>();
    private PlayerManager playerManager;
    private PlayerStats playerStats;
    private Map<String, Sound> damageTypeSounds;
    private double displayDuration = 1.5;
    private double displayY = -0.2;
    private double displayX = -0.5;
    private double displayRandomOffset = -1;
    private double fadeInDuration = 0.25;
    private double fadeOutDuration = 0.25;
    private double floatSpeed = 0.03;
    private double floatCurve = 0.02;
    private String moveDirection = "down";
    private String decayWarningFormat = "<italic><gray>(Decaying in %.1fs)</gray></italic>";
    private static final String CMD_TOGGLE = "toggle";
    private static final String CMD_RELOAD = "reload";
    private static final String CMD_STATS = "stats";
    private static final String CMD_LEADERBOARD = "leaderboard";
    private static final String CMD_LEADERBOARD_SHORT = "lb";

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
        saveDefaultConfig();
        loadConfig();
        getServer().getPluginManager().registerEvents(this, this);

        if (updateCheckerEnabled) {
            checkForUpdates();
        }

        try {
            playerManager = new PlayerManager(this);
        } catch (Errors.DatabaseException e) {
            getLogger().severe("[VitalStrike] Failed to initialize player manager: " + e.getMessage());
        }
        try {
            playerStats = new PlayerStats(this);
        } catch (Errors.DatabaseException e) {
            getLogger().severe("[VitalStrike] Failed to initialize player statistics: " + e.getMessage());
        }

        loadDamageTypeSounds();
        getLogger().info("[VitalStrike] VitalStrike has been enabled!");
    }

    /**
     * Called when the plugin is disabled.
     */
    @Override
    public void onDisable() {
        if (playerManager != null) {
            try {
                playerManager.saveDatabase();
            } catch (Errors.DatabaseException e) {
                getLogger().severe("[VitalStrike] Failed to save player database: " + e.getMessage());
            }
        }
        if (playerStats != null) {
            try {
                playerStats.saveAllStats();
            } catch (Errors.DatabaseException e) {
                getLogger().severe("[VitalStrike] Failed to save player statistics: " + e.getMessage());
            }
        }
        getLogger().info("[VitalStrike] VitalStrike has been disabled!");
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
                        Sound sound = Sound.valueOf(soundName.toUpperCase());
                        damageTypeSounds.put(damageType, sound);
                    }
                } catch (IllegalArgumentException e) {
                    getLogger().warning("[VitalStrike] Invalid sound name for damage type " + damageType);
                }
            }
        }
    }

    /**
     * Loads the configuration from the config.yml file.
     */
    private void loadConfig() {
        FileConfiguration config = getConfig();
        enabled = config.getBoolean("enabled", true);

        comboEnabled = config.getBoolean("combo.enabled", true);
        comboResetTime = config.getLong("combo.reset-time", 3) * 1000;

        comboDecayEnabled = config.getBoolean("combo.decay.enabled", true);
        comboDecayTime = config.getInt("combo.decay.time", 10);
        comboDecayRate = config.getInt("combo.decay.rate", 1);
        comboDecayInterval = config.getInt("combo.decay.interval", 1);
        comboDecayMinimum = config.getInt("combo.decay.minimum", 0);

        comboMultiplierEnabled = config.getBoolean("combo.multiplier.enabled", true);
        comboMultiplierBase = config.getDouble("combo.multiplier.base", 1.0);
        comboMultiplierPerCombo = config.getDouble("combo.multiplier.per-combo", 0.1);
        comboMultiplierMax = config.getDouble("combo.multiplier.max", 3.0);

        ConfigurationSection rankMultSection = config.getConfigurationSection("combo.multiplier.ranks");
        if (rankMultSection != null) {
            for (String rank : rankMultSection.getKeys(false)) {
                rankMultipliers.put(rank, rankMultSection.getDouble(rank));
            }
        }

        comboFormat = config.getString("combo.display.format",
                "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>");
        multiplierFormat = config.getString("combo.display.multiplier-format",
                " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>");
        decayWarningFormat = config.getString("combo.display.decay-warning",
                "<italic><gray>(Decaying in %.1fs)</gray></italic>");

        comboRankEnabled = config.getBoolean("combo.display.rank.enabled", true);
        rankFormat = config.getString("combo.display.rank.format", "\n<bold>%s</bold>");

        ConfigurationSection thresholds = config.getConfigurationSection("combo.display.rank.thresholds");
        if (thresholds != null) {
            for (String rank : thresholds.getKeys(false)) {
                rankThresholds.put(rank, thresholds.getInt(rank));
            }
        }

        ConfigurationSection colors = config.getConfigurationSection("combo.display.rank.colors");
        if (colors != null) {
            for (String rank : colors.getKeys(false)) {
                rankColors.put(rank, colors.getString(rank));
            }
        }

        displayDuration = config.getDouble("display.duration", 1.5);
        displayY = config.getDouble("display.position.y", -0.2);
        displayX = config.getDouble("display.position.x", -0.5);
        displayRandomOffset = config.getDouble("display.position.random-offset", -1);
        moveDirection = config.getString("display.position.direction", "down");

        fadeInDuration = config.getDouble("display.animation.fade-in", 0.25);
        fadeOutDuration = config.getDouble("display.animation.fade-out", 0.25);
        floatSpeed = config.getDouble("display.animation.float-speed", 0.03);
        floatCurve = config.getDouble("display.animation.float-curve", 0.02);

        updateCheckerEnabled = config.getBoolean("update-checker.enabled", true);
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
                getLogger().warning("[VitalStrike] " + e.getMessage());
            } catch (Exception e) {
                getLogger().warning("[VitalStrike] Failed to check for updates: " + e.getMessage());
                Errors.UpdateException updateException = new Errors.UpdateException("Failed to check for updates", e);
                getLogger().warning("[VitalStrike] Error code: " + updateException.getErrorCode().getCode());
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
            URL url = new URL("https://api.github.com/repos/Stawa/VitalStrike/releases/latest");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
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
     * Logs version information.
     * 
     * @param currentVersion the current plugin version
     * @param latestVersion  the latest available version
     */
    private void logVersionInfo(String currentVersion, String latestVersion) {
        if (!currentVersion.equals(latestVersion)) {
            getLogger().info("New version available: " + latestVersion);
            getLogger().info("You are running version: " + currentVersion);
            getLogger().info(
                    "Download the latest version from: https://github.com/Stawa/VitalStrike/releases");
        } else {
            getLogger().info("You are running the latest version: " + latestVersion);
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

        if (event instanceof org.bukkit.event.entity.EntityDamageByEntityEvent) {
            handlePlayerCombos((org.bukkit.event.entity.EntityDamageByEntityEvent) event, currentTime);
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
     * 
     * @param event       the damage event
     * @param currentTime the current time
     */
    private void handlePlayerCombos(org.bukkit.event.entity.EntityDamageByEntityEvent event, long currentTime) {
        Entity damager = event.getDamager();
        if (!(damager instanceof Player))
            return;

        Player player = (Player) damager;
        UUID playerId = player.getUniqueId();

        updatePlayerCombo(playerId, currentTime);
        handleComboDecay(player, playerId);
        applyDamageMultiplier(playerId, event);
        playComboEffects(player, playerId);

        playerStats.updateStats(player, event.getFinalDamage(), playerCombos.get(playerId));

        displayComboHUD(player);
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
                    displayComboHUD(player);
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
    private void applyDamageMultiplier(UUID playerId, EntityDamageEvent event) {
        if (!comboMultiplierEnabled)
            return;

        int combo = playerCombos.get(playerId);
        String rank = getComboRank(combo).replace("[", "").replace("]", "");

        double multiplier = comboMultiplierBase + (combo * comboMultiplierPerCombo);

        double rankMultiplier = rankMultipliers.getOrDefault(rank, comboMultiplierBase);
        multiplier = Math.max(multiplier, rankMultiplier);

        multiplier = Math.min(multiplier, comboMultiplierMax);

        event.setDamage(event.getDamage() * multiplier);
    }

    /**
     * Plays combo effects for a player.
     * 
     * @param player   the player
     * @param playerId the player UUID
     */
    private void playComboEffects(Player player, UUID playerId) {
        if (!getConfig().getBoolean("combo.effects.enabled", true))
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
            Sound sound = Sound.valueOf(soundName.toUpperCase());
            float volume = (float) getConfig().getDouble("combo.effects.sound.volume", 1.0);
            float pitch = (float) getConfig().getDouble("combo.effects.sound.pitch", 1.0);
            player.playSound(player.getLocation(), sound, volume, pitch);

            int prevCombo = playerCombos.getOrDefault(playerId, 0) - 1;
            String prevRank = getComboRank(prevCombo).replace("[", "").replace("]", "");
            String newRank = getComboRank(playerCombos.get(playerId)).replace("[", "").replace("]", "");

            if (!prevRank.equals(newRank)) {
                String milestoneSoundName = getConfig().getString("combo.effects.sound.combo-milestone",
                        "ENTITY_PLAYER_LEVELUP");
                Sound milestoneSound = Sound.valueOf(milestoneSoundName.toUpperCase());
                player.playSound(player.getLocation(), milestoneSound, volume * 1.2f, pitch * 1.2f);
            }
        } catch (IllegalArgumentException e) {
            getLogger().warning("[VitalStrike] Invalid sound name in config: " + e.getMessage());
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
            player.getWorld().spawnParticle(Particle.valueOf(particleType.toUpperCase()),
                    player.getLocation().add(0, 1, 0), count, 0.5, 0.5, 0.5, 0);
        } catch (IllegalArgumentException e) {
            getLogger().warning("[VitalStrike] Invalid particle type in config: " + e.getMessage());
        }
    }

    /**
     * Displays damage indicator for an entity.
     * 
     * @param entity the damaged entity
     * @param event  the damage event
     */
    private void displayDamageIndicator(Entity entity, EntityDamageEvent event) {
        double damage = event.getFinalDamage();
        Location loc = entity.getLocation().add(0, entity.getHeight() + 0.5, 0);

        String damageFormat = getDamageFormat(event.getCause());

        entity.getWorld().getNearbyEntities(loc, 20, 20, 20).stream()
                .filter(Player.class::isInstance)
                .map(e -> (Player) e)
                .filter(player -> playerManager.isEnabled(player))
                .forEach(player -> createDamageDisplay(loc, damageFormat, damage));

        playDamageTypeSound(entity, event.getCause(), loc);
    }

    /**
     * Gets the damage format string based on damage cause.
     * 
     * @param cause the damage cause
     * @return the format string
     */
    private String getDamageFormat(EntityDamageEvent.DamageCause cause) {
        switch (cause) {
            case ENTITY_ATTACK:
                if (Math.random() < 0.2) {
                    return getConfig().getString("damage-formats.critical", "<dark_red><bold>-%.1f ⚡</bold>");
                } else {
                    return getConfig().getString("damage-formats.default", "<red>-%.1f ❤");
                }
            case POISON:
                return getConfig().getString("damage-formats.poison", "<dark_green>-%.1f ☠");
            case FIRE:
            case FIRE_TICK:
                return getConfig().getString("damage-formats.fire", "<gold>-%.1f 🔥");
            case KILL:
                return getConfig().getString("damage-formats.kill", "<dark_red>-%.1f ☠");
            case MAGIC:
                return getConfig().getString("damage-formats.magic", "<dark_purple>-%.1f ✨");
            case FALL:
                return getConfig().getString("damage-formats.fall", "<gray>-%.1f 💨");
            case DROWNING:
                return getConfig().getString("damage-formats.drown", "<blue>-%.1f 💧");
            case BLOCK_EXPLOSION:
            case ENTITY_EXPLOSION:
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
    private void displayComboHUD(Player player) {
        if (!comboEnabled)
            return;

        int combo = playerCombos.getOrDefault(player.getUniqueId(), 0);
        if (combo <= 0)
            return;

        String displayText = buildComboHudText(player, combo);

        Component message = MiniMessage.miniMessage().deserialize(displayText);
        player.sendActionBar(message);

        scheduleActionBarClear(player, combo);
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
        multiplier = Math.min(Math.max(multiplier, rankMultiplier), comboMultiplierMax);
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
        if (!command.getName().equalsIgnoreCase("vitalstrike")) {
            return false;
        }

        if (args.length == 0 || args[0].equalsIgnoreCase("help")) {
            sendHelpMenu(sender);
            return true;
        }

        String subCommand = args[0].toLowerCase();

        switch (subCommand) {
            case CMD_TOGGLE:
                return handleToggleCommand(sender, args);
            case CMD_RELOAD:
                return handleReloadCommand(sender);
            case CMD_STATS:
                return handleStatsCommand(sender);
            case CMD_LEADERBOARD:
            case CMD_LEADERBOARD_SHORT:
                return handleLeaderboardCommand(sender, args);
            default:
                return false;
        }
    }

    /**
     * Handles the toggle command.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleToggleCommand(CommandSender sender, String[] args) {
        if (!(sender instanceof Player)) {
            sendPlayerOnlyMessage(sender);
            return false;
        }

        if (!hasPermission(sender, "vitalstrike.use")) {
            return false;
        }

        Player player = (Player) sender;
        boolean currentState = playerManager.isEnabled(player);

        if (args.length > 1) {
            return handleSpecificToggle(player, args[1], currentState);
        }

        playerManager.setEnabled(player, !currentState);
        sendToggleMessage(player, !currentState);
        return true;
    }

    /**
     * Handles specific on/off toggle commands.
     */
    private boolean handleSpecificToggle(Player player, String toggleType, boolean currentState) {
        switch (toggleType.toLowerCase()) {
            case "on":
                if (currentState) {
                    sendAlreadyEnabledMessage(player);
                    return false;
                }
                playerManager.setEnabled(player, true);
                sendToggleMessage(player, true);
                return true;

            case "off":
                if (!currentState) {
                    sendAlreadyDisabledMessage(player);
                    return false;
                }
                playerManager.setEnabled(player, false);
                sendToggleMessage(player, false);
                return true;

            default:
                player.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>Invalid toggle option. Use 'on' or 'off'."));
                return false;
        }
    }

    /**
     * Handles the reload command.
     * 
     * @param sender the command sender
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleReloadCommand(CommandSender sender) {
        if (!hasPermission(sender, "vitalstrike.reload")) {
            return false;
        }

        try {
            reloadConfig();
            loadConfig();
            loadDamageTypeSounds();
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    getConfig().getString("messages.config-reloaded",
                            "<green>Configuration reloaded successfully!")));
            return true;
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to reload configuration: " + e.getMessage()));
            getLogger().severe("[VitalStrike] Error reloading configuration: " + e.getMessage());
            return false;
        }
    }

    /**
     * Handles the stats command.
     * 
     * @param sender the command sender
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleStatsCommand(CommandSender sender) {
        if (!(sender instanceof Player)) {
            sendPlayerOnlyMessage(sender);
            return false;
        }

        if (!hasPermission(sender, "vitalstrike.stats")) {
            return false;
        }

        try {
            Player statsPlayer = (Player) sender;
            PlayerStats.PlayerStatistics stats = playerStats.getPlayerStats(statsPlayer.getUniqueId());

            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<dark_gray><strikethrough>                    </strikethrough>\n" +
                            "<gold><bold>Your Combat Statistics</bold></gold>\n" +
                            "<yellow>Highest Combo: <white>" + stats.getHighestCombo() + "\n" +
                            "<yellow>Total Damage Dealt: <white>" +
                            String.format("%.1f", stats.getTotalDamageDealt()) + "\n" +
                            "<yellow>Average Damage/Hit: <white>" +
                            String.format("%.1f", stats.getAverageDamagePerHit()) + "\n" +
                            "<yellow>Total Hits: <white>" + stats.getTotalHits() + "\n" +
                            "<dark_gray><strikethrough>                    </strikethrough>"));
            return true;
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to retrieve statistics: " + e.getMessage()));
            getLogger().severe("[VitalStrike] Error retrieving player statistics: " + e.getMessage());
            return false;
        }
    }

    /**
     * Handles the leaderboard command.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return true if the command was handled successfully, false otherwise
     */
    private boolean handleLeaderboardCommand(CommandSender sender, String[] args) {
        if (!hasPermission(sender, "vitalstrike.leaderboard")) {
            return false;
        }

        try {
            String type = args.length > 1 ? args[1].toLowerCase()
                    : getConfig().getString("leaderboard.default-type", "damage");

            LeaderboardData data = getLeaderboardData(type);
            if (data == null) {
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<red>Invalid leaderboard type! Use: damage, combo, or average"));
                return false;
            }

            if (data.leaderboard.isEmpty()) {
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        "<yellow>No data available for this leaderboard type yet."));
                return true;
            }

            sender.sendMessage(MiniMessage.miniMessage().deserialize(buildLeaderboardMessage(data)));
            return true;
        } catch (Exception e) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    "<red>Failed to retrieve leaderboard data: " + e.getMessage()));
            getLogger().severe("[VitalStrike] Error retrieving leaderboard data: " + e.getMessage());
            return false;
        }
    }

    /**
     * Container class for leaderboard data.
     */
    private class LeaderboardData {
        final List<Map.Entry<UUID, PlayerStats.PlayerStatistics>> leaderboard;
        final String title;
        final String valueFormat;
        final java.util.function.Function<PlayerStats.PlayerStatistics, Double> valueExtractor;

        LeaderboardData(List<Map.Entry<UUID, PlayerStats.PlayerStatistics>> leaderboard,
                String title, String valueFormat,
                java.util.function.Function<PlayerStats.PlayerStatistics, Double> valueExtractor) {
            this.leaderboard = leaderboard;
            this.title = title;
            this.valueFormat = valueFormat;
            this.valueExtractor = valueExtractor;
        }
    }

    /**
     * Gets leaderboard data based on type.
     */
    private LeaderboardData getLeaderboardData(String type) {
        int limit = getConfig().getInt("leaderboard.display-limit", 10);

        switch (type) {
            case "damage":
            case "dmg":
                return new LeaderboardData(
                        playerStats.getTopPlayers(limit, PlayerStats.PlayerStatistics::getTotalDamageDealt),
                        getConfig().getString("leaderboard.display.title-formats.damage",
                                "<gold><bold>Top %d Damage Dealers</bold></gold>"),
                        getConfig().getString("leaderboard.number-format.damage", "%.1f"),
                        PlayerStats.PlayerStatistics::getTotalDamageDealt);
            case "combo":
            case "combos":
                return new LeaderboardData(
                        playerStats.getTopPlayers(limit, stats -> (double) stats.getHighestCombo()),
                        getConfig().getString("leaderboard.display.title-formats.combo",
                                "<gold><bold>Top %d Highest Combos</bold></gold>"),
                        getConfig().getString("leaderboard.number-format.combo", "%d"),
                        stats -> (double) stats.getHighestCombo());
            case "average":
            case "avg":
                return new LeaderboardData(
                        playerStats.getTopPlayers(limit, PlayerStats.PlayerStatistics::getAverageDamagePerHit),
                        getConfig().getString("leaderboard.display.title-formats.average",
                                "<gold><bold>Top %d Average Damage</bold></gold>"),
                        getConfig().getString("leaderboard.number-format.average", "%.1f"),
                        PlayerStats.PlayerStatistics::getAverageDamagePerHit);
            default:
                return null;
        }
    }

    /**
     * Builds the leaderboard message.
     */
    private String buildLeaderboardMessage(LeaderboardData data) {
        StringBuilder message = new StringBuilder();
        String header = getConfig().getString("leaderboard.display.header",
                "<dark_gray><strikethrough>                    </strikethrough>");
        String footer = getConfig().getString("leaderboard.display.footer",
                "<dark_gray><strikethrough>                    </strikethrough>");
        String entryFormat = getConfig().getString("leaderboard.display.entry-format",
                "<yellow>#%d <white>%s: <gold>%s");

        int limit = getConfig().getInt("leaderboard.display-limit", 10);

        message.append(header).append("\n")
                .append(String.format(data.title, limit)).append("\n");

        int rank = 1;
        for (Map.Entry<UUID, PlayerStats.PlayerStatistics> entry : data.leaderboard) {
            String playerName = Bukkit.getOfflinePlayer(entry.getKey()).getName();
            if (playerName == null)
                continue;

            double value = data.valueExtractor.apply(entry.getValue());
            String formattedValue = String.format(data.valueFormat, value);

            message.append(String.format(entryFormat, rank++, playerName, formattedValue)).append("\n");
        }

        message.append(footer);
        return message.toString();
    }

    /**
     * Checks if sender has permission and sends message if not.
     */
    private boolean hasPermission(CommandSender sender, String permission) {
        if (!sender.hasPermission(permission)) {
            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                    getConfig().getString("messages.no-permission",
                            "<red>You don't have permission to use this command!")));
            return false;
        }
        return true;
    }

    /**
     * Sends player-only command message.
     */
    private void sendPlayerOnlyMessage(CommandSender sender) {
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                "<red>This command can only be used by players!"));
    }

    /**
     * Sends toggle state message.
     */
    private void sendToggleMessage(Player player, boolean enabled) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                getConfig().getString("messages." + (enabled ? "enabled-personal" : "disabled-personal"))));
    }

    /**
     * Sends already enabled message.
     */
    private void sendAlreadyEnabledMessage(Player player) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                getConfig().getString("messages.already-enabled",
                        "<yellow>VitalStrike damage indicators are already enabled for you!")));
    }

    /**
     * Sends already disabled message.
     */
    private void sendAlreadyDisabledMessage(Player player) {
        player.sendMessage(MiniMessage.miniMessage().deserialize(
                getConfig().getString("messages.already-disabled",
                        "<yellow>VitalStrike damage indicators are already disabled for you!")));
    }

    /**
     * Handles the tab completion.
     * 
     * @param sender  the command sender
     * @param command the command
     * @param alias   the alias
     * @param args    the arguments
     * @return the list of completions
     */
    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (!command.getName().equalsIgnoreCase("vitalstrike")) {
            return Collections.emptyList();
        }

        return getCompletionsForArgument(sender, args);
    }

    /**
     * Gets completions based on argument position.
     * 
     * @param sender the command sender
     * @param args   the command arguments
     * @return list of tab completions
     */
    private List<String> getCompletionsForArgument(CommandSender sender, String[] args) {
        if (args.length == 1) {
            return getFirstArgumentCompletions(sender, args[0]);
        }

        if (args.length == 2) {
            return getSecondArgumentCompletions(args[0], args[1]);
        }

        return Collections.emptyList();
    }

    /**
     * Gets completions for the first argument.
     * 
     * @param sender the command sender
     * @param arg    the current argument
     * @return list of filtered completions
     */
    private List<String> getFirstArgumentCompletions(CommandSender sender, String arg) {
        List<String> completions = new ArrayList<>();

        if (sender.hasPermission("vitalstrike.toggle"))
            completions.add(CMD_TOGGLE);
        if (sender.hasPermission("vitalstrike.reload"))
            completions.add(CMD_RELOAD);
        if (sender.hasPermission("vitalstrike.help"))
            completions.add("help");
        if (sender.hasPermission("vitalstrike.stats"))
            completions.add(CMD_STATS);
        if (sender.hasPermission("vitalstrike.leaderboard")) {
            completions.add(CMD_LEADERBOARD);
            completions.add(CMD_LEADERBOARD_SHORT);
        }

        return filterCompletions(completions, arg);
    }

    /**
     * Gets completions for the second argument.
     * 
     * @param firstArg  the first argument
     * @param secondArg the current argument
     * @return list of filtered completions
     */
    private List<String> getSecondArgumentCompletions(String firstArg, String secondArg) {
        if (firstArg.equalsIgnoreCase(CMD_TOGGLE)) {
            return filterCompletions(Arrays.asList("on", "off"), secondArg);
        }

        if (firstArg.equalsIgnoreCase(CMD_LEADERBOARD) || firstArg.equalsIgnoreCase(CMD_LEADERBOARD_SHORT)) {
            return filterCompletions(Arrays.asList("damage", "combo", "average"), secondArg);
        }

        return Collections.emptyList();
    }

    /**
     * Filters completions based on the current argument.
     * 
     * @param completions list of possible completions
     * @param currentArg  the current argument
     * @return filtered list of completions
     */
    private List<String> filterCompletions(List<String> completions, String currentArg) {
        return completions.stream()
                .filter(s -> s.toLowerCase().startsWith(currentArg.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Sends the help menu to the sender.
     * 
     * @param sender the sender
     */
    private void sendHelpMenu(CommandSender sender) {
        FileConfiguration config = getConfig();

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.header",
                        "<dark_gray><strikethrough>                    </strikethrough>")));

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.title", "<gold><bold>VitalStrike Commands</bold></gold>")));

        ConfigurationSection commandsSection = config.getConfigurationSection("help-menu.commands");
        if (commandsSection != null) {
            for (String key : commandsSection.getKeys(false)) {
                if (sender.hasPermission("vitalstrike." + key)) {
                    String command = commandsSection.getString(key + ".command", "");
                    String description = commandsSection.getString(key + ".description", "");
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            "<yellow>" + command + " <gray>- " + description));
                }
            }
        }

        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.footer",
                        "<dark_gray><strikethrough>                    </strikethrough>")));
    }
}
