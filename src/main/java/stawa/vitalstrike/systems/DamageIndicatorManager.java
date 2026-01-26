package stawa.vitalstrike.systems;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Sound;
import org.bukkit.entity.Entity;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.TextDisplay;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.util.Transformation;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;
import stawa.vitalstrike.PermissionManager;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.config.ConfigManager;

/**
 * Manages the display and behavior of damage indicators. Handles indicator spawning, merging,
 * animation, and rewards.
 */
public class DamageIndicatorManager {
  private final VitalStrike plugin;
  private final ConfigManager configManager;
  private final PlayerManager playerManager;
  private final PermissionManager permissionManager;
  private final Map<UUID, Map<UUID, MergedDamageContext>> activeIndicators = new HashMap<>();

  private double displayDuration = 1.5;
  private double displayRandomOffset = 0.5;
  private double displayX = -0.5;
  private double displayY = -0.2;
  private double fadeInDuration = 0.25;
  private double fadeOutDuration = 0.25;
  private double floatSpeed = 0.03;
  private double floatCurve = 0.02;
  private String moveDirection = "down";

  private boolean mergeEnabled = true;
  private long mergeWindow = 2000;

  private boolean rewardsEnabled = false;
  private final List<RewardTier> rewardTiers = new ArrayList<>();

  private static class RewardTier {
    double damageThreshold;
    int xpAmount;
    List<ItemStack> items;

    RewardTier(double damage, int xp, List<ItemStack> items) {
      this.damageThreshold = damage;
      this.xpAmount = xp;
      this.items = items;
    }
  }

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

    public static Direction fromString(String str) {
      try {
        return valueOf(str.toUpperCase());
      } catch (Exception e) {
        return DOWN;
      }
    }
  }

  private static class MergedDamageContext {
    double totalDamage;
    TextDisplay display;
    org.bukkit.scheduler.BukkitTask animationTask;
    long lastHitTime;
    Location baseLocation;
    double baseWaveX;
    double baseWaveZ;
    double randomX;
    double randomZ;
    int currentTick = 0;
    Set<Integer> claimedTiers = new HashSet<>();
    java.lang.ref.WeakReference<Entity> victimRef;

    MergedDamageContext(
        double damage,
        TextDisplay display,
        String format,
        Location loc,
        double randomX,
        double randomZ,
        Entity victim) {
      this.totalDamage = damage;
      this.display = display;
      this.lastHitTime = System.currentTimeMillis();
      this.baseLocation = loc;
      this.randomX = randomX;
      this.randomZ = randomZ;
      this.victimRef = new java.lang.ref.WeakReference<>(victim);
    }
  }

  /**
   * Creates a new DamageIndicatorManager instance.
   *
   * @param plugin The plugin instance
   * @param configManager The configuration manager
   * @param playerManager The player manager
   * @param permissionManager The permission manager
   */
  public DamageIndicatorManager(
      VitalStrike plugin,
      ConfigManager configManager,
      PlayerManager playerManager,
      PermissionManager permissionManager) {
    this.plugin = plugin;
    this.configManager = configManager;
    this.playerManager = playerManager;
    this.permissionManager = permissionManager;
    reloadSettings();
  }

  /** Reloads the damage indicator settings from the configuration. */
  public void reloadSettings() {
    var config = plugin.getConfig();
    displayDuration = config.getDouble("display.duration", 1.5);
    displayY = config.getDouble("display.position.y", -0.2);
    displayX = config.getDouble("display.position.x", -0.5);
    displayRandomOffset = config.getDouble("display.position.random-offset", -1);
    moveDirection = config.getString("display.position.direction", "down");
    fadeInDuration = config.getDouble("display.animation.fade-in", 0.25);
    fadeOutDuration = config.getDouble("display.animation.fade-out", 0.25);
    floatSpeed = config.getDouble("display.animation.float-speed", 0.03);
    floatCurve = config.getDouble("display.animation.float-curve", 0.02);

    mergeEnabled = config.getBoolean("display.animation.merge.enabled", true);
    mergeWindow = config.getLong("display.animation.merge.window", 2000);

    rewardsEnabled = config.getBoolean("rewards.enabled", false);
    rewardTiers.clear();
    if (config.isList("rewards.tiers")) {
      List<Map<?, ?>> tiers = config.getMapList("rewards.tiers");
      for (Map<?, ?> tierMap : tiers) {
        double damage = 0;
        if (tierMap.containsKey("damage")) {
          Object dmgObj = tierMap.get("damage");
          damage = (dmgObj instanceof Number) ? ((Number) dmgObj).doubleValue() : 0;
        }

        int xp = 0;
        if (tierMap.containsKey("xp")) {
          Object xpObj = tierMap.get("xp");
          xp = (xpObj instanceof Number) ? ((Number) xpObj).intValue() : 0;
        }

        List<ItemStack> items = new ArrayList<>();
        if (tierMap.containsKey("items") && tierMap.get("items") instanceof List) {
          List<?> itemList = (List<?>) tierMap.get("items");
          for (Object itemObj : itemList) {
            if (itemObj instanceof Map) {
              Map<?, ?> itemMap = (Map<?, ?>) itemObj;
              Object matObj = itemMap.get("material");
              String matName = (matObj instanceof String) ? (String) matObj : "AIR";

              Object amountObj = itemMap.get("amount");
              int amount = (amountObj instanceof Number) ? ((Number) amountObj).intValue() : 1;

              Material mat = Material.getMaterial(matName);
              if (mat != null) {
                items.add(new ItemStack(mat, amount));
              }
            }
          }
        }

        rewardTiers.add(new RewardTier(damage, xp, items));
      }
    }
  }

  /**
   * Displays a damage indicator for an entity based on the event.
   *
   * @param entity The entity taking damage
   * @param event The damage event
   */
  public void displayDamageIndicator(Entity entity, EntityDamageEvent event) {
    if (!shouldShowDamageIndicator(entity)) {
      return;
    }

    double damage = event.getFinalDamage();
    Location loc = entity.getLocation().add(0, entity.getHeight() + 0.5, 0);

    Player damager = null;
    if (event instanceof EntityDamageByEntityEvent damageByEntityEvent) {
      Entity damagerEntity = damageByEntityEvent.getDamager();
      if (damagerEntity instanceof Player player) {
        damager = player;
      }
    }

    String damageType = event.getCause().name().toLowerCase();
    String damageFormat;

    if (damager != null && playerManager.isEnabled(damager)) {
      damageFormat =
          permissionManager.getDamageFormat(
              damager, damageType, getSimpleDamageFormat(event.getCause()));
    } else {
      damageFormat = getSimpleDamageFormat(event.getCause());
    }

    displayDamage(entity, damager, damage, damageFormat);

    playDamageTypeSound(entity, event.getCause(), loc);
  }

  /**
   * Displays a damage indicator with a specific value and format. Handles merging if enabled.
   *
   * @param victim The entity taking damage
   * @param attacker The entity dealing damage (can be null)
   * @param damage The amount of damage
   * @param damageFormat The format string for the indicator
   */
  public void displayDamage(Entity victim, Entity attacker, double damage, String damageFormat) {
    UUID victimId = victim.getUniqueId();
    UUID attackerId = (attacker != null) ? attacker.getUniqueId() : new UUID(0, 0);

    if (!mergeEnabled) {
      spawnNewIndicator(victim, attacker, damage, damageFormat);
      return;
    }

    activeIndicators.putIfAbsent(victimId, new HashMap<>());
    Map<UUID, MergedDamageContext> victimIndicators = activeIndicators.get(victimId);
    MergedDamageContext context = victimIndicators.get(attackerId);

    long currentTime = System.currentTimeMillis();

    if (context != null
        && context.display.isValid()
        && (currentTime - context.lastHitTime < mergeWindow)) {
      context.totalDamage += damage;
      context.lastHitTime = currentTime;
      updateIndicator(context, damageFormat, victim);

      if (attacker instanceof Player player) {
        checkRewards(player, context);
      }
    } else {
      if (context != null) {
        cleanupContext(context);
      }
      spawnNewIndicator(victim, attacker, damage, damageFormat);
    }
  }

  /**
   * Checks if a damage indicator should be shown for the given entity.
   *
   * @param entity The entity to check
   * @return true if an indicator should be shown, false otherwise
   */
  public boolean shouldShowDamageIndicator(Entity entity) {
    if (!(entity instanceof LivingEntity)) {
      return false;
    }

    if (entity.getType() == EntityType.ARMOR_STAND) {
      return false;
    }

    if (entity instanceof TextDisplay
        || entity.getType() == EntityType.ARMOR_STAND
        || entity.getType() == EntityType.ITEM_FRAME
        || entity.getType() == EntityType.GLOW_ITEM_FRAME
        || entity.getType() == EntityType.PAINTING
        || entity.getType() == EntityType.ITEM_DISPLAY
        || entity.getType() == EntityType.BLOCK_DISPLAY) {
      return false;
    }

    return !entity.getScoreboardTags().contains("nodamage");
  }

  private String getSimpleDamageFormat(EntityDamageEvent.DamageCause cause) {
    var config = plugin.getConfig();
    switch (cause) {
      case ENTITY_ATTACK:
        if (Math.random() < 0.2) {
          return config.getString("damage-formats.critical", "<dark_red><bold>-%.1f ⚡</bold>");
        } else {
          return config.getString("damage-formats.default", "<red>-%.1f ❤");
        }
      case POISON:
        return config.getString("damage-formats.poison", "<dark_green>-%.1f ☠");
      case FIRE, FIRE_TICK:
        return config.getString("damage-formats.fire", "<gold>-%.1f 🔥");
      case KILL:
        return config.getString("damage-formats.kill", "<dark_red>-%.1f ☠");
      case MAGIC:
        return config.getString("damage-formats.magic", "<dark_purple>-%.1f ✨");
      case FALL:
        return config.getString("damage-formats.fall", "<gray>-%.1f 💨");
      case DROWNING:
        return config.getString("damage-formats.drown", "<blue>-%.1f 💧");
      case BLOCK_EXPLOSION, ENTITY_EXPLOSION:
        return config.getString("damage-formats.explosion", "<red>-%.1f 💥");
      case CONTACT:
        return config.getString("damage-formats.contact", "<green>-%.1f 🌵");
      case CRAMMING:
        return config.getString("damage-formats.cramming", "<gray>-%.1f 📦");
      case DRAGON_BREATH:
        return config.getString("damage-formats.dragon", "<light_purple>-%.1f 🐉");
      case DRYOUT:
        return config.getString("damage-formats.dryout", "<yellow>-%.1f 🌊");
      case ENTITY_SWEEP_ATTACK:
        return config.getString("damage-formats.sweep", "<red>-%.1f ⚔");
      case FALLING_BLOCK:
        return config.getString("damage-formats.falling_block", "<gray>-%.1f 🧱");
      case FLY_INTO_WALL:
        return config.getString("damage-formats.wall", "<gray>-%.1f 💫");
      case FREEZE:
        return config.getString("damage-formats.freeze", "<aqua>-%.1f ❄");
      case HOT_FLOOR:
        return config.getString("damage-formats.hot_floor", "<gold>-%.1f 🔥");
      case LAVA:
        return config.getString("damage-formats.lava", "<dark_red>-%.1f 🌋");
      case LIGHTNING:
        return config.getString("damage-formats.lightning", "<yellow>-%.1f ⚡");
      case PROJECTILE:
        return config.getString("damage-formats.projectile", "<gray>-%.1f 🏹");
      case SONIC_BOOM:
        return config.getString("damage-formats.sonic_boom", "<dark_aqua>-%.1f 📢");
      case STARVATION:
        return config.getString("damage-formats.starvation", "<gold>-%.1f 🍖");
      case SUFFOCATION:
        return config.getString("damage-formats.suffocation", "<gray>-%.1f ⬛");
      case THORNS:
        return config.getString("damage-formats.thorns", "<green>-%.1f 🌹");
      case VOID:
        return config.getString("damage-formats.void", "<dark_gray>-%.1f ⬇");
      case WITHER:
        return config.getString("damage-formats.wither", "<dark_gray>-%.1f 💀");
      case WORLD_BORDER:
        return config.getString("damage-formats.border", "<red>-%.1f 🌐");
      default:
        return config.getString("damage-formats.default", "<red>-%.1f ❤");
    }
  }

  private void playDamageTypeSound(
      Entity entity, EntityDamageEvent.DamageCause cause, Location location) {
    Map<String, Sound> damageTypeSounds = configManager.getDamageTypeSounds();
    if (damageTypeSounds == null || damageTypeSounds.isEmpty()) {
      return;
    }

    String damageType = cause.name().toLowerCase();
    Sound sound = damageTypeSounds.get(damageType);

    if (sound != null) {
      float volume =
          (float) plugin.getConfig().getDouble("damage-type-sounds-settings.volume", 1.0f);
      float pitch = (float) plugin.getConfig().getDouble("damage-type-sounds-settings.pitch", 1.0f);

      entity.getWorld().getNearbyEntities(location, 20, 20, 20).stream()
          .filter(Player.class::isInstance)
          .map(e -> (Player) e)
          .filter(player -> playerManager.isEnabled(player))
          .forEach(player -> player.playSound(location, sound, volume, pitch));
    }
  }

  private void spawnNewIndicator(
      Entity victim, Entity attacker, double damage, String damageFormat) {
    Location loc = victim.getLocation().add(0, victim.getHeight() + 0.5, 0);

    double randomX = 0;
    double randomZ = 0;
    if (displayRandomOffset >= 0) {
      randomX = (Math.random() - 0.5) * displayRandomOffset;
      randomZ = (Math.random() - 0.5) * displayRandomOffset;
      loc.add(randomX, 0, randomZ);
    }

    TextDisplay display = createTextDisplay(loc, formatDamage(damageFormat, damage));

    MergedDamageContext context =
        new MergedDamageContext(damage, display, damageFormat, loc, randomX, randomZ, victim);
    context.baseWaveX = randomX * floatCurve;
    context.baseWaveZ = randomZ * floatCurve;

    if (attacker instanceof Player player) {
      checkRewards(player, context);
    }

    if (mergeEnabled) {
      UUID attackerId = (attacker != null) ? attacker.getUniqueId() : new UUID(0, 0);
      activeIndicators.putIfAbsent(victim.getUniqueId(), new HashMap<>());
      activeIndicators.get(victim.getUniqueId()).put(attackerId, context);
      startAnimation(context, victim.getUniqueId(), attackerId);
    } else {
      startAnimation(context, victim.getUniqueId(), null);
    }
  }

  private TextDisplay createTextDisplay(Location loc, Component text) {
    TextDisplay display = (TextDisplay) loc.getWorld().spawnEntity(loc, EntityType.TEXT_DISPLAY);
    display.text(text);
    display.setBillboard(org.bukkit.entity.Display.Billboard.CENTER);
    display.setDefaultBackground(false);
    display.setShadowed(true);
    display.setVisibleByDefault(false);

    double range = 48.0;
    loc.getWorld().getNearbyEntities(loc, range, range, range).stream()
        .filter(Player.class::isInstance)
        .map(Player.class::cast)
        .forEach(
            player -> {
              if (playerManager.isEnabled(player)) {
                player.showEntity(plugin, display);
              }
            });

    return display;
  }

  private Component formatDamage(String format, double damage) {
    String rawText = String.format(format, damage);

    if (rawText.contains("&") && !rawText.contains("<")) {
      return LegacyComponentSerializer.legacyAmpersand().deserialize(rawText);
    }

    return MiniMessage.miniMessage().deserialize(rawText);
  }

  private void updateIndicator(MergedDamageContext context, String format, Entity victim) {
    context.display.text(formatDamage(format, context.totalDamage));
    Location newBase = victim.getLocation().add(0, victim.getHeight() + 0.5, 0);
    if (floatCurve != 0) {
      newBase.add(context.baseWaveX / floatCurve, 0, context.baseWaveZ / floatCurve);
    }

    context.baseLocation = newBase;

    int fadeInTicks = (int) (fadeInDuration * 20);
    if (context.currentTick > fadeInTicks) {
      context.currentTick = fadeInTicks;
    }

    pulseScale(context.display);
  }

  private void pulseScale(TextDisplay display) {
    display.setInterpolationDuration(5);
    display.setTransformation(
        new Transformation(
            new Vector3f(), new AxisAngle4f(), new Vector3f(1.3f, 1.3f, 1.3f), new AxisAngle4f()));

    Bukkit.getScheduler()
        .runTaskLater(
            plugin,
            () -> {
              if (display.isValid()) {
                display.setInterpolationDuration(5);
                display.setTransformation(
                    new Transformation(
                        new Vector3f(),
                        new AxisAngle4f(),
                        new Vector3f(1f, 1f, 1f),
                        new AxisAngle4f()));
              }
            },
            5L);
  }

  private void startAnimation(MergedDamageContext context, UUID victimId, UUID attackerId) {
    TextDisplay textDisplay = context.display;

    Location displayLoc = context.baseLocation.clone();
    displayLoc.add(displayX, displayY, 0);
    textDisplay.teleport(displayLoc);

    int fadeInTicks = (int) (fadeInDuration * 20);
    int fadeOutTicks = (int) (fadeOutDuration * 20);
    int totalTicks = (int) (displayDuration * 20);
    int startFadeOutAt = totalTicks - fadeOutTicks;

    Direction direction = Direction.fromString(moveDirection);

    context.animationTask =
        new BukkitRunnable() {
          @Override
          public void run() {
            if (!textDisplay.isValid()) {
              this.cancel();
              return;
            }

            Entity victim = context.victimRef.get();
            if (victim != null && victim.isValid() && !victim.isDead()) {
              Location newBase = victim.getLocation().add(0, victim.getHeight() + 0.5, 0);
              newBase.add(context.randomX, 0, context.randomZ);
              context.baseLocation = newBase;
            }

            if (context.currentTick >= totalTicks) {
              this.cancel();
              cleanupAndRemove(context, victimId, attackerId);
              return;
            }

            float scale =
                calculateScale(context.currentTick, fadeInTicks, startFadeOutAt, fadeOutTicks);

            double progress = context.currentTick / 20.0;
            double waveX = context.baseWaveX * Math.sin(progress * Math.PI);
            double waveZ = context.baseWaveZ * Math.cos(progress * Math.PI);

            double moveX = direction.getX() * floatSpeed * context.currentTick + waveX;
            double moveY = direction.getY() * floatSpeed * context.currentTick;
            double moveZ = direction.getZ() * floatSpeed * context.currentTick + waveZ;

            Location newLoc =
                context.baseLocation.clone().add(displayX, displayY, 0).add(moveX, moveY, moveZ);

            textDisplay.setTeleportDuration(1);
            textDisplay.teleport(newLoc);

            updateDisplayTransformation(textDisplay, scale);

            context.currentTick++;
          }
        }.runTaskTimer(plugin, 0L, 1L);
  }

  private void cleanupAndRemove(MergedDamageContext context, UUID victimId, UUID attackerId) {
    if (context.display.isValid()) {
      context.display.remove();
    }
    if (mergeEnabled && victimId != null) {
      Map<UUID, MergedDamageContext> map = activeIndicators.get(victimId);
      if (map != null) {
        map.remove(attackerId);
        if (map.isEmpty()) {
          activeIndicators.remove(victimId);
        }
      }
    }
  }

  private void cleanupContext(MergedDamageContext context) {
    if (context.animationTask != null) context.animationTask.cancel();
    if (context.display.isValid()) context.display.remove();
  }

  private float calculateScale(
      int currentTick, int fadeInTicks, int startFadeOutAt, int fadeOutTicks) {
    if (currentTick < fadeInTicks) {
      return (float) currentTick / fadeInTicks;
    } else if (currentTick > startFadeOutAt) {
      return 1.0f - ((float) (currentTick - startFadeOutAt) / fadeOutTicks);
    }
    return 1.0f;
  }

  private void updateDisplayTransformation(TextDisplay textDisplay, float scale) {
    textDisplay.setInterpolationDuration(1);
    textDisplay.setTransformation(
        new Transformation(
            new Vector3f(),
            new AxisAngle4f(),
            new Vector3f(scale, scale, scale),
            new AxisAngle4f()));
  }

  private void checkRewards(Player player, MergedDamageContext context) {
    if (!rewardsEnabled) return;

    double damage = context.totalDamage;

    for (int i = 0; i < rewardTiers.size(); i++) {
      RewardTier tier = rewardTiers.get(i);
      if (damage >= tier.damageThreshold && !context.claimedTiers.contains(i)) {
        if (tier.xpAmount > 0) {
          player.giveExp(tier.xpAmount);
          player.sendMessage(
              MiniMessage.miniMessage()
                  .deserialize(
                      "<green>+"
                          + tier.xpAmount
                          + " XP for reaching "
                          + tier.damageThreshold
                          + " damage!"));
        }

        if (tier.items != null && !tier.items.isEmpty()) {
          for (ItemStack item : tier.items) {
            player.getInventory().addItem(item.clone());
          }
          player.sendMessage(
              MiniMessage.miniMessage().deserialize("<gold>Reward received for massive damage!"));
        }

        context.claimedTiers.add(i);
      }
    }
  }
}
