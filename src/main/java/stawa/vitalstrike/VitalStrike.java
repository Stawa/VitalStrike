package stawa.vitalstrike;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.Location;
import org.bukkit.Sound;
import org.bukkit.Particle;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import java.io.BufferedReader;
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

public class VitalStrike extends JavaPlugin implements Listener {
    private boolean enabled = true;
    private boolean updateCheckerEnabled;
    private String latestVersion;
    private HashMap<UUID, Long> lastDamageTime = new HashMap<>();
    private HashMap<UUID, Integer> playerCombos = new HashMap<>();
    private HashMap<UUID, Long> lastComboTime = new HashMap<>();
    private static final long DAMAGE_COOLDOWN = 500; // 0.5 seconds cooldown
    private long comboResetTime = 3000; // Default 3 seconds to reset combo
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

    private enum Direction {
        UP(0, 1, 0),
        DOWN(0, -1, 0),
        LEFT(-1, 0, 0),
        RIGHT(1, 0, 0);

        private final double x, y, z;

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

        public static Direction fromString(String dir) {
            try {
                return valueOf(dir.toUpperCase());
            } catch (IllegalArgumentException e) {
                return DOWN; // Default direction
            }
        }
    }

    @Override
    public void onEnable() {
        // Save default config if it doesn't exist
        saveDefaultConfig();

        // Load configuration
        loadConfig();

        // Register events
        getServer().getPluginManager().registerEvents(this, this);

        // Check for updates
        if (updateCheckerEnabled) {
            checkForUpdates();
        }

        playerManager = new PlayerManager(this);
        getLogger().info("[VitalStrike] VitalStrike has been enabled!");
    }

    @Override
    public void onDisable() {
        if (playerManager != null) {
            playerManager.saveDatabase();
        }
        getLogger().info("[VitalStrike] VitalStrike has been disabled!");
    }

    private void loadConfig() {
        FileConfiguration config = getConfig();
        enabled = config.getBoolean("enabled", true);

        // Load combo configuration
        comboEnabled = config.getBoolean("combo.enabled", true);
        comboResetTime = config.getLong("combo.reset-time", 3) * 1000; // Convert to milliseconds

        // Load decay settings
        comboDecayEnabled = config.getBoolean("combo.decay.enabled", true);
        comboDecayTime = config.getInt("combo.decay.time", 10);
        comboDecayRate = config.getInt("combo.decay.rate", 1);
        comboDecayInterval = config.getInt("combo.decay.interval", 1);
        comboDecayMinimum = config.getInt("combo.decay.minimum", 0);

        // Load multiplier settings
        comboMultiplierEnabled = config.getBoolean("combo.multiplier.enabled", true);
        comboMultiplierBase = config.getDouble("combo.multiplier.base", 1.0);
        comboMultiplierPerCombo = config.getDouble("combo.multiplier.per-combo", 0.1);
        comboMultiplierMax = config.getDouble("combo.multiplier.max", 3.0);

        // Load rank multipliers
        ConfigurationSection rankMultSection = config.getConfigurationSection("combo.multiplier.ranks");
        if (rankMultSection != null) {
            for (String rank : rankMultSection.getKeys(false)) {
                rankMultipliers.put(rank, rankMultSection.getDouble(rank));
            }
        }

        // Load display formats
        comboFormat = config.getString("combo.display.format",
                "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>");
        multiplierFormat = config.getString("combo.display.multiplier-format",
                " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>");
        decayWarningFormat = config.getString("combo.display.decay-warning",
                "<italic><gray>(Decaying in %.1fs)</gray></italic>");

        // Load rank configuration
        comboRankEnabled = config.getBoolean("combo.display.rank.enabled", true);
        rankFormat = config.getString("combo.display.rank.format", "\n<bold>%s</bold>");

        // Load rank thresholds
        ConfigurationSection thresholds = config.getConfigurationSection("combo.display.rank.thresholds");
        if (thresholds != null) {
            for (String rank : thresholds.getKeys(false)) {
                rankThresholds.put(rank, thresholds.getInt(rank));
            }
        }

        // Load rank colors
        ConfigurationSection colors = config.getConfigurationSection("combo.display.rank.colors");
        if (colors != null) {
            for (String rank : colors.getKeys(false)) {
                rankColors.put(rank, colors.getString(rank));
            }
        }

        // Load display settings
        displayDuration = config.getDouble("display.duration", 1.5);
        displayY = config.getDouble("display.position.y", -0.2);
        displayX = config.getDouble("display.position.x", -0.5);
        displayRandomOffset = config.getDouble("display.position.random-offset", -1);
        moveDirection = config.getString("display.position.direction", "down");

        // Load animation settings
        fadeInDuration = config.getDouble("display.animation.fade-in", 0.25);
        fadeOutDuration = config.getDouble("display.animation.fade-out", 0.25);
        floatSpeed = config.getDouble("display.animation.float-speed", 0.03);
        floatCurve = config.getDouble("display.animation.float-curve", 0.02);

        // Load update checker settings
        updateCheckerEnabled = config.getBoolean("update-checker.enabled", true);
    }

    private void checkForUpdates() {
        getServer().getScheduler().runTaskAsynchronously(this, () -> {
            try {
                URL url = new URL("https://api.github.com/repos/Stawa/VitalStrike/releases/latest");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("Accept", "application/vnd.github.v3+json");

                if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;

                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    // Parse JSON response to get tag_name
                    String jsonResponse = response.toString();
                    if (jsonResponse.contains("\"tag_name\":")) {
                        latestVersion = jsonResponse.split("\"tag_name\":\"")[1].split("\"")[0];
                        String currentVersion = getPluginMeta().getVersion();

                        if (!currentVersion.equals(latestVersion)) {
                            getLogger().info("[VitalStrike] New version available: " + latestVersion);
                            getLogger().info("[VitalStrike] You are running version: " + currentVersion);
                            getLogger().info(
                                    "[VitalStrike] Download the latest version from: https://github.com/Stawa/VitalStrike/releases");
                        } else {
                            getLogger().info("[VitalStrike] You are running the latest version: " + latestVersion);
                        }
                    }
                }
            } catch (Exception e) {
                getLogger().warning("[VitalStrike] Failed to check for updates: " + e.getMessage());
            }
        });
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        playerManager.loadPlayer(event.getPlayer());
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        playerManager.unloadPlayer(event.getPlayer());
    }

    @EventHandler
    public void onEntityDamage(EntityDamageEvent event) {
        if (!enabled)
            return;

        // Reload display settings each time to get latest values
        displayDuration = getConfig().getDouble("display.duration", 1.5);
        displayY = getConfig().getDouble("display.position.y", -0.2);
        displayX = getConfig().getDouble("display.position.x", -0.5);
        displayRandomOffset = getConfig().getDouble("display.position.random-offset", -1);
        moveDirection = getConfig().getString("display.position.direction", "down");

        // Reload animation settings
        fadeInDuration = getConfig().getDouble("display.animation.fade-in", 0.25);
        fadeOutDuration = getConfig().getDouble("display.animation.fade-out", 0.25);
        floatSpeed = getConfig().getDouble("display.animation.float-speed", 0.03);
        floatCurve = getConfig().getDouble("display.animation.float-curve", 0.02);

        Entity entity = event.getEntity();
        if (!(entity instanceof org.bukkit.entity.LivingEntity))
            return;

        UUID entityId = entity.getUniqueId();
        long currentTime = System.currentTimeMillis();

        // Update combo system
        if (event instanceof org.bukkit.event.entity.EntityDamageByEntityEvent) {
            org.bukkit.event.entity.EntityDamageByEntityEvent damageEvent = (org.bukkit.event.entity.EntityDamageByEntityEvent) event;
            Entity damager = damageEvent.getDamager();

            if (damager instanceof Player) {
                Player player = (Player) damager;
                UUID playerId = player.getUniqueId();

                // Check if combo should reset due to time
                Long lastCombo = lastComboTime.getOrDefault(playerId, 0L);
                if (currentTime - lastCombo > comboResetTime) {
                    playerCombos.put(playerId, 1);
                } else {
                    // Increment combo
                    int currentCombo = playerCombos.getOrDefault(playerId, 0);
                    playerCombos.put(playerId, currentCombo + 1);
                }

                // Update last combo time
                lastComboTime.put(playerId, currentTime);

                // Update last action time
                lastActionTime.put(playerId, currentTime);

                // Cancel existing decay task if any
                org.bukkit.scheduler.BukkitTask existingTask = decayTasks.remove(playerId);
                if (existingTask != null) {
                    existingTask.cancel();
                }

                // Schedule new decay task if enabled
                if (comboDecayEnabled) {
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

                // Apply damage multiplier if enabled
                if (comboMultiplierEnabled) {
                    int combo = playerCombos.get(playerId);
                    String rank = getComboRank(combo).replace("[", "").replace("]", "");

                    // Calculate combo-based multiplier
                    double multiplier = comboMultiplierBase + (combo * comboMultiplierPerCombo);

                    // Apply rank-based multiplier if higher
                    double rankMultiplier = rankMultipliers.getOrDefault(rank, comboMultiplierBase);
                    multiplier = Math.max(multiplier, rankMultiplier);

                    // Cap at maximum multiplier
                    multiplier = Math.min(multiplier, comboMultiplierMax);

                    // Apply multiplier to damage
                    event.setDamage(event.getDamage() * multiplier);
                }

                // Play effects if enabled
                if (getConfig().getBoolean("combo.effects.enabled", true)) {
                    if (getConfig().getBoolean("combo.effects.sound.enabled", true)) {
                        try {
                            String soundName = getConfig().getString("combo.effects.sound.combo-up",
                                    "ENTITY_EXPERIENCE_ORB_PICKUP");
                            Sound sound = Sound.valueOf(soundName.toUpperCase());
                            float volume = (float) getConfig().getDouble("combo.effects.sound.volume", 1.0);
                            float pitch = (float) getConfig().getDouble("combo.effects.sound.pitch", 1.0);
                            player.playSound(player.getLocation(), sound, volume, pitch);

                            // Play milestone sound if reached new rank
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

                    if (getConfig().getBoolean("combo.effects.particles.enabled", true)) {
                        try {
                            String particleType = getConfig().getString("combo.effects.particles.type", "CRIT");
                            int count = getConfig().getInt("combo.effects.particles.count", 10);
                            player.getWorld().spawnParticle(Particle.valueOf(particleType.toUpperCase()),
                                    player.getLocation().add(0, 1, 0), count, 0.5, 0.5, 0.5, 0);
                        } catch (IllegalArgumentException e) {
                            getLogger().warning("[VitalStrike] Invalid particle type in config: " + e.getMessage());
                        }
                    }
                }

                // Display combo HUD
                displayComboHUD(player);
            }
        }

        // Check cooldown
        if (lastDamageTime.containsKey(entityId)) {
            if (currentTime - lastDamageTime.get(entityId) < DAMAGE_COOLDOWN) {
                return;
            }
        }

        lastDamageTime.put(entityId, currentTime);
        double damage = event.getFinalDamage();
        Location loc = entity.getLocation().add(0, entity.getHeight() + 0.5, 0);

        // Determine damage type and format
        String damageType = getConfig().getString("damage-formats.default", "<red>-%.1f ❤");
        if (event instanceof org.bukkit.event.entity.EntityDamageByEntityEvent) {
            org.bukkit.event.entity.EntityDamageByEntityEvent eEvent = (org.bukkit.event.entity.EntityDamageByEntityEvent) event;
            // Check for critical hits (1.5x normal damage is usually considered critical)
            if (eEvent.getDamager() instanceof Player && ((Player) eEvent.getDamager()).isSprinting()) {
                damageType = getConfig().getString("damage-formats.critical", "<dark_red><bold>-%.1f ⚡</bold>");
            }
        }

        // Check various damage causes
        switch (event.getCause()) {
            case ENTITY_ATTACK:
                if (Math.random() < 0.2) { // 20% chance for critical hit
                    damageType = getConfig().getString("damage-formats.critical", "<dark_red><bold>-%.1f ⚡</bold>");
                } else {
                    damageType = getConfig().getString("damage-formats.default", "<red>-%.1f ❤");
                }
                break;
            case POISON:
                damageType = getConfig().getString("damage-formats.poison", "<dark_green>-%.1f ☠");
                break;
            case FIRE:
            case FIRE_TICK:
                damageType = getConfig().getString("damage-formats.fire", "<gold>-%.1f 🔥");
                break;
            case KILL:
                damageType = getConfig().getString("damage-formats.kill", "<dark_red>-%.1f ☠");
                break;
            case MAGIC:
                damageType = getConfig().getString("damage-formats.magic", "<dark_purple>-%.1f ✨");
                break;
            case FALL:
                damageType = getConfig().getString("damage-formats.fall", "<gray>-%.1f 💨");
                break;
            case DROWNING:
                damageType = getConfig().getString("damage-formats.drown", "<blue>-%.1f 💧");
                break;
            case BLOCK_EXPLOSION:
            case ENTITY_EXPLOSION:
                damageType = getConfig().getString("damage-formats.explosion", "<red>-%.1f 💥");
                break;
            case CONTACT:
                damageType = getConfig().getString("damage-formats.contact", "<green>-%.1f 🌵");
                break;
            case CRAMMING:
                damageType = getConfig().getString("damage-formats.cramming", "<gray>-%.1f 📦");
                break;
            case DRAGON_BREATH:
                damageType = getConfig().getString("damage-formats.dragon", "<dark_purple>-%.1f 🐉");
                break;
            case DRYOUT:
                damageType = getConfig().getString("damage-formats.dryout", "<yellow>-%.1f 🌊");
                break;
            case ENTITY_SWEEP_ATTACK:
                damageType = getConfig().getString("damage-formats.sweep", "<red>-%.1f ⚔");
                break;
            case FALLING_BLOCK:
                damageType = getConfig().getString("damage-formats.falling_block", "<gray>-%.1f 🧱");
                break;
            case FLY_INTO_WALL:
                damageType = getConfig().getString("damage-formats.wall", "<gray>-%.1f 💫");
                break;
            case FREEZE:
                damageType = getConfig().getString("damage-formats.freeze", "<aqua>-%.1f ❄");
                break;
            case HOT_FLOOR:
                damageType = getConfig().getString("damage-formats.hot_floor", "<gold>-%.1f 🔥");
                break;
            case LAVA:
                damageType = getConfig().getString("damage-formats.lava", "<dark_red>-%.1f 🌋");
                break;
            case LIGHTNING:
                damageType = getConfig().getString("damage-formats.lightning", "<yellow>-%.1f ⚡");
                break;
            case PROJECTILE:
                damageType = getConfig().getString("damage-formats.projectile", "<gray>-%.1f 🏹");
                break;
            case SONIC_BOOM:
                damageType = getConfig().getString("damage-formats.sonic_boom", "<dark_aqua>-%.1f 📢");
                break;
            case STARVATION:
                damageType = getConfig().getString("damage-formats.starvation", "<gold>-%.1f 🍖");
                break;
            case SUFFOCATION:
                damageType = getConfig().getString("damage-formats.suffocation", "<gray>-%.1f ⬛");
                break;
            case THORNS:
                damageType = getConfig().getString("damage-formats.thorns", "<green>-%.1f 🌹");
                break;
            case VOID:
                damageType = getConfig().getString("damage-formats.void", "<dark_gray>-%.1f ⬇");
                break;
            case WITHER:
                damageType = getConfig().getString("damage-formats.wither", "<dark_gray>-%.1f 💀");
                break;
            case WORLD_BORDER:
                damageType = getConfig().getString("damage-formats.border", "<red>-%.1f 🌐");
                break;
            default:
                break;
        }

        final String finalDamageType = damageType;
        // Show damage indicator to each nearby player based on their settings
        entity.getWorld().getNearbyEntities(loc, 20, 20, 20).stream()
                .filter(e -> e instanceof Player)
                .map(e -> (Player) e)
                .filter(player -> playerManager.isEnabled(player))
                .forEach(player -> {
                    // Get damage format from config and replace legacy color codes
                    String format = getConfig().getString("damage-formats." + finalDamageType);
                    if (format == null) {
                        format = getConfig().getString("damage-formats.default", "&c-%.1f ❤");
                    }

                    // Format the damage string first
                    String rawText = String.format(format, damage);

                    // Then convert color codes
                    String damageFormat = rawText
                            .replace("&c", "<red>")
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

                    // Add closing tags if needed
                    if (damageFormat.contains("<bold>") && !damageFormat.contains("</bold>")) {
                        damageFormat += "</bold>";
                    }

                    Component damageText = MiniMessage.miniMessage().deserialize(damageFormat);

                    // Create text display entity
                    TextDisplay textDisplay = (TextDisplay) loc.getWorld().spawnEntity(loc, EntityType.TEXT_DISPLAY);
                    textDisplay.text(damageText);
                    textDisplay.setBillboard(TextDisplay.Billboard.CENTER);
                    textDisplay.setDefaultBackground(false);
                    textDisplay.setShadowed(true);
                    textDisplay.setVisibleByDefault(true);

                    // Calculate position with configurable offsets
                    Location displayLoc = loc.clone();
                    double randomX = 0;
                    double randomZ = 0;

                    // Add random offset if enabled (not -1)
                    if (displayRandomOffset >= 0) {
                        randomX = (Math.random() - 0.5) * displayRandomOffset;
                        randomZ = (Math.random() - 0.5) * displayRandomOffset;
                        displayLoc.add(randomX, 0, randomZ);
                    }

                    // Apply configured offsets
                    displayLoc.add(displayX, displayY, 0);
                    textDisplay.teleport(displayLoc);

                    // Initial setup
                    textDisplay.setTransformation(new Transformation(
                            new Vector3f(0, 0, 0),
                            new AxisAngle4f(0, 0, 0, 0),
                            new Vector3f(0, 0, 0), // Start invisible
                            new AxisAngle4f(0, 0, 0, 0)));

                    // Calculate animation timings
                    int fadeInTicks = (int) (fadeInDuration * 20);
                    int fadeOutTicks = (int) (fadeOutDuration * 20);
                    int totalTicks = (int) (displayDuration * 20);
                    int startFadeOutAt = totalTicks - fadeOutTicks;

                    // Get movement direction
                    Direction direction = Direction.fromString(moveDirection);

                    // Smooth sine wave motion
                    double baseX = randomX * floatCurve;
                    double baseZ = randomZ * floatCurve;

                    // Animation task
                    for (int tick = 0; tick < totalTicks; tick++) {
                        final int currentTick = tick;
                        getServer().getScheduler().runTaskLater(this, () -> {
                            if (!textDisplay.isValid())
                                return;

                            // Calculate scale based on fade in/out
                            float scale;
                            if (currentTick < fadeInTicks) {
                                scale = (float) currentTick / fadeInTicks;
                            } else if (currentTick > startFadeOutAt) {
                                scale = 1.0f - ((float) (currentTick - startFadeOutAt) / fadeOutTicks);
                            } else {
                                scale = 1.0f;
                            }

                            // Apply smooth floating motion with direction
                            double progress = (double) currentTick / 20.0; // Time in seconds
                            double waveX = baseX * Math.sin(progress * Math.PI);
                            double waveZ = baseZ * Math.cos(progress * Math.PI);

                            // Calculate movement based on direction
                            double moveX = direction.getX() * floatSpeed + waveX;
                            double moveY = direction.getY() * floatSpeed;
                            double moveZ = direction.getZ() * floatSpeed + waveZ;

                            Location newLoc = textDisplay.getLocation();
                            newLoc.add(moveX, moveY, moveZ);
                            textDisplay.teleport(newLoc);

                            // Update transformation for scaling
                            textDisplay.setTransformation(new Transformation(
                                    new Vector3f(0, 0, 0),
                                    new AxisAngle4f(0, 0, 0, 0),
                                    new Vector3f(scale, scale, scale),
                                    new AxisAngle4f(0, 0, 0, 0)));
                        }, tick);
                    }

                    // Remove the text display after animation
                    getServer().getScheduler().runTaskLater(this, () -> {
                        if (textDisplay.isValid()) {
                            textDisplay.remove();
                        }
                    }, totalTicks);
                });
    }

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

    private void displayComboHUD(Player player) {
        if (!comboEnabled)
            return;

        int combo = playerCombos.getOrDefault(player.getUniqueId(), 0);
        if (combo > 0) {
            StringBuilder display = new StringBuilder();

            // Add combo counter
            display.append(String.format(comboFormat, combo));

            // Add rank if enabled
            if (comboRankEnabled) {
                display.append(getComboRank(combo));
            }

            // Add multiplier if enabled
            if (comboMultiplierEnabled) {
                String rank = getComboRank(combo).replace("[", "").replace("]", "");
                double multiplier = comboMultiplierBase + (combo * comboMultiplierPerCombo);
                double rankMultiplier = rankMultipliers.getOrDefault(rank, comboMultiplierBase);
                multiplier = Math.min(Math.max(multiplier, rankMultiplier), comboMultiplierMax);
                display.append(String.format(multiplierFormat, multiplier));
            }

            // Add decay warning if enabled and applicable
            if (comboDecayEnabled) {
                UUID playerId = player.getUniqueId();
                long timeSinceLastAction = (System.currentTimeMillis() - lastActionTime.get(playerId)) / 1000;
                if (timeSinceLastAction >= comboDecayTime - 3) { // Show warning 3 seconds before decay
                    float timeUntilDecay = comboDecayTime - timeSinceLastAction;
                    if (timeUntilDecay > 0) {
                        display.append(" ").append(String.format(decayWarningFormat, timeUntilDecay));
                    }
                }
            }

            Component message = MiniMessage.miniMessage().deserialize(display.toString());
            player.sendActionBar(message);

            // Schedule the action bar to be cleared after displayDuration seconds
            int durationTicks = (int) (displayDuration * 20);
            getServer().getScheduler().runTaskLater(this, () -> {
                if (playerCombos.getOrDefault(player.getUniqueId(), 0) == combo) {
                    player.sendActionBar(Component.empty());
                }
            }, durationTicks);
        }
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!command.getName().equalsIgnoreCase("vitalstrike"))
            return false;

        if (args.length == 0 || args[0].equalsIgnoreCase("help")) {
            sendHelpMenu(sender);
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "toggle":
                if (!(sender instanceof Player)) {
                    sender.sendMessage(
                            MiniMessage.miniMessage().deserialize("<red>This command can only be used by players!"));
                    return true;
                }
                if (!sender.hasPermission("vitalstrike.use")) {
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            getConfig().getString("messages.no-permission",
                                    "<red>You don't have permission to use this command!")));
                    return true;
                }
                Player player = (Player) sender;
                boolean currentState = playerManager.isEnabled(player);

                // Handle specific toggle on/off commands
                if (args.length > 1) {
                    if (args[1].equalsIgnoreCase("on")) {
                        if (currentState) {
                            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                                    getConfig().getString("messages.already-enabled",
                                            "<yellow>VitalStrike damage indicators are already enabled for you!")));
                            return true;
                        }
                        playerManager.setEnabled(player, true);
                        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                                getConfig().getString("messages.enabled-personal")));
                        return true;
                    } else if (args[1].equalsIgnoreCase("off")) {
                        if (!currentState) {
                            sender.sendMessage(MiniMessage.miniMessage().deserialize(
                                    getConfig().getString("messages.already-disabled",
                                            "<yellow>VitalStrike damage indicators are already disabled for you!")));
                            return true;
                        }
                        playerManager.setEnabled(player, false);
                        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                                getConfig().getString("messages.disabled-personal")));
                        return true;
                    }
                }

                // Handle simple toggle
                playerManager.setEnabled(player, !currentState);
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        getConfig()
                                .getString("messages." + (!currentState ? "enabled-personal" : "disabled-personal"))));
                return true;

            case "reload":
                if (!sender.hasPermission("vitalstrike.reload")) {
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            getConfig().getString("messages.no-permission",
                                    "<red>You don't have permission to use this command!")));
                    return true;
                }
                reloadConfig();
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        getConfig().getString("messages.config-reloaded",
                                "<green>Configuration reloaded successfully!")));
                return true;

            case "style":
                if (!(sender instanceof Player)) {
                    sender.sendMessage(
                            MiniMessage.miniMessage().deserialize("<red>This command can only be used by players!"));
                    return true;
                }
                if (!sender.hasPermission("vitalstrike.use")) {
                    sender.sendMessage(MiniMessage.miniMessage().deserialize(
                            getConfig().getString("messages.no-permission",
                                    "<red>You don't have permission to use this command!")));
                    return true;
                }
                if (args.length < 2) {
                    sender.sendMessage(MiniMessage.miniMessage().deserialize("<red>Usage: /vs style <format>"));
                    return true;
                }
                String style = String.join(" ", args).substring(6);
                playerManager.setStyle((Player) sender, style);
                sender.sendMessage(MiniMessage.miniMessage().deserialize(
                        getConfig().getString("messages.style-updated")));
                return true;
        }

        return false;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (command.getName().equalsIgnoreCase("vitalstrike")) {
            if (args.length == 1) {
                List<String> completions = new ArrayList<>();
                if (sender.hasPermission("vitalstrike.toggle"))
                    completions.add("toggle");
                if (sender.hasPermission("vitalstrike.reload"))
                    completions.add("reload");
                if (sender.hasPermission("vitalstrike.help"))
                    completions.add("help");
                return completions.stream()
                        .filter(s -> s.toLowerCase().startsWith(args[0].toLowerCase()))
                        .collect(Collectors.toList());
            } else if (args.length == 2 && args[0].equalsIgnoreCase("toggle")) {
                return Arrays.asList("on", "off");
            }
        }
        return Collections.emptyList();
    }

    private void sendHelpMenu(CommandSender sender) {
        FileConfiguration config = getConfig();

        // Send header
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.header",
                        "<dark_gray><strikethrough>                    </strikethrough>")));

        // Send title
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.title", "<gold><bold>VitalStrike Commands</bold></gold>")));

        // Send commands
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

        // Send footer
        sender.sendMessage(MiniMessage.miniMessage().deserialize(
                config.getString("help-menu.footer",
                        "<dark_gray><strikethrough>                    </strikethrough>")));
    }
}
