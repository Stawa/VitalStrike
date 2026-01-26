package stawa.vitalstrike.listeners;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.entity.Entity;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.TextDisplay;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.block.Action;
import org.bukkit.event.block.BlockBreakEvent;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.player.PlayerInteractEntityEvent;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.inventory.ItemStack;
import stawa.vitalstrike.PlayerManager;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.config.ConfigManager;
import stawa.vitalstrike.items.CustomItems;
import stawa.vitalstrike.resources.ResourcePackManager;
import stawa.vitalstrike.systems.ComboManager;
import stawa.vitalstrike.systems.DamageIndicatorManager;
import stawa.vitalstrike.systems.KnockdownManager;
import stawa.vitalstrike.world.DimensionManager;

/** Handles all Bukkit events for the VitalStrike plugin. */
public class VitalStrikeListener implements Listener {

  private final VitalStrike plugin;
  private final ConfigManager configManager;
  private final PlayerManager playerManager;
  private final KnockdownManager knockdownManager;
  private final ResourcePackManager resourcePackManager;
  private final ComboManager comboManager;
  private final DamageIndicatorManager damageIndicatorManager;
  private final DimensionManager dimensionManager;
  private final CustomItems customItems;

  private final Map<UUID, Long> lastDamageTime = new HashMap<>();
  private static final long DAMAGE_COOLDOWN = 500;

  /**
   * Constructs a new VitalStrikeListener.
   *
   * @param plugin The main plugin instance
   * @param configManager The configuration manager
   * @param playerManager The player manager
   * @param knockdownManager The knockdown manager
   * @param resourcePackManager The resource pack manager
   * @param comboManager The combo manager
   * @param damageIndicatorManager The damage indicator manager
   * @param dimensionManager The dimension manager
   * @param customItems The custom items manager
   */
  public VitalStrikeListener(
      VitalStrike plugin,
      ConfigManager configManager,
      PlayerManager playerManager,
      KnockdownManager knockdownManager,
      ResourcePackManager resourcePackManager,
      ComboManager comboManager,
      DamageIndicatorManager damageIndicatorManager,
      DimensionManager dimensionManager,
      CustomItems customItems) {
    this.plugin = plugin;
    this.configManager = configManager;
    this.playerManager = playerManager;
    this.knockdownManager = knockdownManager;
    this.resourcePackManager = resourcePackManager;
    this.comboManager = comboManager;
    this.damageIndicatorManager = damageIndicatorManager;
    this.dimensionManager = dimensionManager;
    this.customItems = customItems;
  }

  /**
   * Handles player join events. Loads player data, handles knockdown state, and sends resource pack
   * prompts.
   *
   * @param event The player join event
   */
  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent event) {
    if (!configManager.isEnabled()) return;

    Player player = event.getPlayer();
    playerManager.loadPlayer(player);
    knockdownManager.handlePlayerJoin(player);

    if (plugin.getConfig().getBoolean("resource-pack.auto-send", false)) {
      try {
        resourcePackManager.sendResourcePack(player);
        plugin.getLogger().info("Sent resource pack to player: " + player.getName());
      } catch (Exception e) {
        plugin
            .getLogger()
            .warning("Failed to send resource pack to " + player.getName() + ": " + e.getMessage());
      }
    } else {
      if (plugin.getConfig().getBoolean("resource-pack.hint.enabled", false)) {
        player.sendMessage(
            MiniMessage.miniMessage()
                .deserialize(
                    plugin
                        .getConfig()
                        .getString(
                            "resource-pack.hint.message",
                            "<yellow>You can use <click:suggest_command:/vs resourcepack>/vs resourcepack</click> or <click:suggest_command:/vs rp>/vs rp</click> to load the resource pack!")));
      }
    }
  }

  /**
   * Handles block break events. Prevents downed players from breaking blocks.
   *
   * @param event The block break event
   */
  @EventHandler
  public void onBlockBreak(BlockBreakEvent event) {
    Player player = event.getPlayer();
    if (knockdownManager.isPlayerDowned(player)) {
      event.setCancelled(true);
    }
  }

  /**
   * Handles player quit events. Cleans up player data, holograms, and knockdown state.
   *
   * @param event The player quit event
   */
  @EventHandler
  public void onPlayerQuit(PlayerQuitEvent event) {
    Player player = event.getPlayer();
    comboManager.cleanup(player.getUniqueId());
    cleanupPlayerTextDisplays(player);
    playerManager.unloadPlayer(event.getPlayer());
    knockdownManager.handlePlayerQuit(event.getPlayer());
  }

  private void cleanupPlayerTextDisplays(Player player) {
    Location loc = player.getLocation();
    double radius = 32;
    for (Entity entity : loc.getWorld().getNearbyEntities(loc, radius, radius, radius)) {
      if (entity instanceof TextDisplay td && td.isValid()) {
        td.remove();
      }
    }
  }

  /**
   * Handles entity damage events. Applies damage multipliers, handles knockdown, and displays
   * damage indicators.
   *
   * @param event The entity damage event
   */
  @EventHandler(priority = EventPriority.LOWEST)
  public void onEntityDamage(EntityDamageEvent event) {
    if (!configManager.isEnabled()) return;

    Entity entity = event.getEntity();
    if (!(entity instanceof LivingEntity)) return;

    boolean worldSettingsEnabled = plugin.getConfig().getBoolean("world-settings.enabled", true);
    double damageMultiplier = 1.0;

    if (worldSettingsEnabled) {
      List<String> disabledWorlds =
          plugin.getConfig().getStringList("world-settings.disabled-worlds");
      if (!disabledWorlds.contains(entity.getWorld().getName())
          && dimensionManager.isDimensionEnabled(entity)) {
        damageMultiplier = dimensionManager.getDimensionMultiplier(entity);
      }
    }

    if (entity instanceof Player player) {
      if (knockdownManager.isPlayerDowned(player)) {
        event.setCancelled(true);
        return;
      }

      double finalDamage = event.getFinalDamage();
      double currentHealth = player.getHealth();

      if (currentHealth - finalDamage <= 0) {
        ItemStack mainHand = player.getInventory().getItemInMainHand();
        ItemStack offHand = player.getInventory().getItemInOffHand();

        if (mainHand.getType() == Material.TOTEM_OF_UNDYING
                && !customItems.isVitalAwakening(mainHand)
            || offHand.getType() == Material.TOTEM_OF_UNDYING
                && !customItems.isVitalAwakening(offHand)) {
          return;
        }

        event.setCancelled(true);
        knockdownManager.handlePlayerDeath(player);
        return;
      }
    }

    UUID entityId = entity.getUniqueId();
    long currentTime = System.currentTimeMillis();

    if (event instanceof EntityDamageByEntityEvent entityDamageByEntityEvent) {
      if (entityDamageByEntityEvent.getDamager() instanceof Player damager) {
        comboManager.handlePlayerCombos(damager, event, currentTime);
      }
      double originalDamage = event.getDamage();
      double modifiedDamage = originalDamage * damageMultiplier;
      event.setDamage(modifiedDamage);
    }

    if (!isOnCooldown(entityId, currentTime)) {
      lastDamageTime.put(entityId, currentTime);
      damageIndicatorManager.displayDamageIndicator(entity, event);
    }
  }

  /**
   * Handles player interaction events. Prevents downed players from reviving themselves or others.
   *
   * @param event The player interact entity event
   */
  @EventHandler
  public void onPlayerInteractEntity(PlayerInteractEntityEvent event) {
    if (!configManager.isEnabled() || !(event.getRightClicked() instanceof Player target)) {
      return;
    }

    Player player = event.getPlayer();

    if (knockdownManager.isAttemptingRevive(player)) {
      return;
    }

    if (knockdownManager.isPlayerDowned(player)) {
      event.setCancelled(true);
      ItemStack mainHand = player.getInventory().getItemInMainHand();
      ItemStack offHand = player.getInventory().getItemInOffHand();

      if ((mainHand.getType() == Material.TOTEM_OF_UNDYING
              && customItems.isVitalAwakening(mainHand))
          || (offHand.getType() == Material.TOTEM_OF_UNDYING
              && customItems.isVitalAwakening(offHand))) {
        knockdownManager.attemptSelfRevive(player);
      }
      return;
    }

    Location targetLoc = target.getLocation();
    Location playerLoc = player.getLocation();

    if (targetLoc != null
        && playerLoc != null
        && knockdownManager.isPlayerDowned(target)
        && targetLoc.distance(playerLoc) <= knockdownManager.getReviveRange()) {
      event.setCancelled(true);
      knockdownManager.startRevive(player, target);
    }
  }

  /**
   * Handles player interaction events. Manages self-revive attempts when using specific items.
   *
   * @param event The player interact event
   */
  @EventHandler
  public void onPlayerInteract(PlayerInteractEvent event) {
    if (!configManager.isEnabled()
        || (event.getAction() != Action.RIGHT_CLICK_AIR
            && event.getAction() != Action.RIGHT_CLICK_BLOCK)) {
      return;
    }

    Player player = event.getPlayer();

    if (knockdownManager.isAttemptingRevive(player)) {
      return;
    }

    if (knockdownManager.isPlayerDowned(player)) {
      event.setCancelled(true);
      ItemStack mainHand = player.getInventory().getItemInMainHand();
      ItemStack offHand = player.getInventory().getItemInOffHand();

      if ((mainHand.getType() == Material.TOTEM_OF_UNDYING
              && customItems.isVitalAwakening(mainHand))
          || (offHand.getType() == Material.TOTEM_OF_UNDYING
              && customItems.isVitalAwakening(offHand))) {
        knockdownManager.attemptSelfRevive(player);
      }
    }
  }

  private boolean isOnCooldown(UUID entityId, long currentTime) {
    return lastDamageTime.containsKey(entityId)
        && currentTime - lastDamageTime.get(entityId) < DAMAGE_COOLDOWN;
  }
}
