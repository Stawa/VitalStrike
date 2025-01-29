package stawa.vitalstrike;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.Location;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;

import java.util.HashMap;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.Arrays;

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
    private HashMap<UUID, Long> lastDamageTime = new HashMap<>();
    private static final long DAMAGE_COOLDOWN = 500; // 0.5 seconds cooldown
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
        saveDefaultConfig();
        loadConfig();
        playerManager = new PlayerManager(this);
        getServer().getPluginManager().registerEvents(this, this);
        getLogger().info("VitalStrike has been enabled!");
    }

    @Override
    public void onDisable() {
        if (playerManager != null) {
            playerManager.saveDatabase();
        }
        getLogger().info("VitalStrike has been disabled!");
    }

    private void loadConfig() {
        FileConfiguration config = getConfig();
        enabled = config.getBoolean("enabled", true);

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
        String damageType = "default";
        if (event instanceof org.bukkit.event.entity.EntityDamageByEntityEvent) {
            org.bukkit.event.entity.EntityDamageByEntityEvent eEvent = (org.bukkit.event.entity.EntityDamageByEntityEvent) event;
            // Check for critical hits (1.5x normal damage is usually considered critical)
            if (eEvent.getDamager() instanceof Player && ((Player) eEvent.getDamager()).isSprinting()) {
                damageType = "critical";
            }
        }

        // Check various damage causes
        switch (event.getCause()) {
            case ENTITY_ATTACK:
                if (Math.random() < 0.2) { // 20% chance for critical hit
                    damageType = getConfig().getString("damage-formats.critical", "<dark_red><bold>-%.1f ⚡</bold>");
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
