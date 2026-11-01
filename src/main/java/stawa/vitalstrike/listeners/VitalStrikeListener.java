package stawa.vitalstrike.listeners;

import java.util.Set;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.attribute.Attribute;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.Entity;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.entity.Projectile;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockBreakEvent;
import org.bukkit.event.block.BlockPlaceEvent;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.entity.EntityDeathEvent;
import org.bukkit.event.entity.EntityRegainHealthEvent;
import org.bukkit.event.entity.EntityTargetLivingEntityEvent;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.event.player.PlayerDropItemEvent;
import org.bukkit.event.player.PlayerInteractEntityEvent;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerMoveEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.inventory.EquipmentSlot;
import org.bukkit.inventory.ItemStack;
import stawa.vitalstrike.PlayerStats;
import stawa.vitalstrike.VitalStrike;

/** Bukkit event wiring for indicators, combos, rewards and the knockdown state. */
public final class VitalStrikeListener implements Listener {
  /** Damage that must always go through, otherwise a downed player could hang in the void. */
  private static final Set<String> UNSAVEABLE = Set.of("VOID", "KILL", "SUICIDE");

  private final VitalStrike plugin;

  public VitalStrikeListener(VitalStrike plugin) {
    this.plugin = plugin;
  }

  private static Player attackerOf(EntityDamageEvent event) {
    if (!(event instanceof EntityDamageByEntityEvent byEntity)) {
      return null;
    }
    Entity damager = byEntity.getDamager();
    if (damager instanceof Projectile projectile
        && projectile.getShooter() instanceof Player shooter) {
      return shooter;
    }
    return damager instanceof Player player ? player : null;
  }

  // --- Damage ----------------------------------------------------------------------------------

  /** Decides the outcome: blocks downed combatants, applies multipliers, and downs lethal hits. */
  @EventHandler(priority = EventPriority.HIGHEST, ignoreCancelled = true)
  public void onDamage(EntityDamageEvent event) {
    if (!plugin.isActive(event.getEntity().getWorld())) {
      return;
    }
    Player attacker = attackerOf(event);
    if (attacker != null && plugin.getKnockdown().isDowned(attacker)) {
      event.setCancelled(true);
      return;
    }
    boolean saveable = !UNSAVEABLE.contains(event.getCause().name());
    if (event.getEntity() instanceof Player downedCandidate
        && plugin.getKnockdown().isDowned(downedCandidate)) {
      event.setCancelled(saveable);
      return;
    }
    if (!(event.getEntity() instanceof LivingEntity victim)) {
      return;
    }

    if (event instanceof EntityDamageByEntityEvent) {
      double multiplier = plugin.getWorlds().multiplier(victim.getWorld());
      if (attacker != null) {
        multiplier *= plugin.getCombos().multiplierForNextHit(attacker);
      }
      if (multiplier != 1.0) {
        event.setDamage(event.getDamage() * multiplier);
      }
    }

    if (victim instanceof Player player
        && saveable
        && event.getFinalDamage() >= player.getHealth()
        && !holdsPlainTotem(player)
        && plugin.getKnockdown().canDown(player)) {
      registerHit(event, victim, attacker);
      plugin.getKnockdown().down(player);
      event.setCancelled(true);
    }
  }

  /** Reports hits that actually landed, so cancelled damage never counts. */
  @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
  public void onDamageLanded(EntityDamageEvent event) {
    if (plugin.isActive(event.getEntity().getWorld())
        && event.getEntity() instanceof LivingEntity victim) {
      registerHit(event, victim, attackerOf(event));
    }
  }

  private void registerHit(EntityDamageEvent event, LivingEntity victim, Player attacker) {
    if (victim instanceof ArmorStand) {
      return;
    }
    double dealt = Math.min(event.getFinalDamage(), victim.getHealth());
    if (dealt < 0.05) {
      return;
    }
    if (attacker != null && !attacker.equals(victim)) {
      PlayerStats.Stats stats = plugin.getStats().recordDamage(attacker, dealt);
      plugin.getRewards().check(attacker, stats);
      plugin.getCombos().onHit(attacker, victim);
    }
    plugin.getIndicators().showDamage(victim, attacker, event, dealt);
    plugin.getHealthBars().touch(victim, true);
  }

  @EventHandler(priority = EventPriority.MONITOR)
  public void onKill(EntityDeathEvent event) {
    Player killer = event.getEntity().getKiller();
    if (killer != null && plugin.isActive(event.getEntity().getWorld())) {
      plugin.getProgression().onKill(killer, event.getEntity());
    }
  }

  @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
  public void onHeal(EntityRegainHealthEvent event) {
    if (event.getRegainReason() == EntityRegainHealthEvent.RegainReason.SATIATED
        || !(event.getEntity() instanceof LivingEntity entity)
        || !plugin.isActive(entity.getWorld())) {
      return;
    }
    var maxHealth = entity.getAttribute(Attribute.MAX_HEALTH);
    double missing =
        maxHealth == null ? event.getAmount() : maxHealth.getValue() - entity.getHealth();
    plugin.getIndicators().showHeal(entity, Math.min(event.getAmount(), missing));
    plugin.getHealthBars().touch(entity, false);
  }

  private boolean holdsPlainTotem(Player player) {
    return isPlainTotem(player.getInventory().getItemInMainHand())
        || isPlainTotem(player.getInventory().getItemInOffHand());
  }

  private boolean isPlainTotem(ItemStack item) {
    return item.getType() == Material.TOTEM_OF_UNDYING && !plugin.getItems().isVitalAwakening(item);
  }

  // --- Downed players --------------------------------------------------------------------------

  @EventHandler
  public void onInteractEntity(PlayerInteractEntityEvent event) {
    Player player = event.getPlayer();
    if (plugin.getKnockdown().isDowned(player)) {
      event.setCancelled(true);
      plugin.getKnockdown().startSelfRevive(player, event.getHand());
    } else if (event.getHand() == EquipmentSlot.HAND
        && event.getRightClicked() instanceof Player target
        && plugin.getKnockdown().isDowned(target)) {
      event.setCancelled(true);
      plugin.getKnockdown().startRevive(player, target);
    }
  }

  @EventHandler
  public void onInteract(PlayerInteractEvent event) {
    Player player = event.getPlayer();
    if (plugin.getKnockdown().isDowned(player)) {
      event.setCancelled(true);
      if (event.getAction().isRightClick() && event.getHand() != null) {
        plugin.getKnockdown().startSelfRevive(player, event.getHand());
      }
    }
  }

  @EventHandler(ignoreCancelled = true)
  public void onBlockBreak(BlockBreakEvent event) {
    event.setCancelled(plugin.getKnockdown().isDowned(event.getPlayer()));
  }

  @EventHandler(ignoreCancelled = true)
  public void onBlockPlace(BlockPlaceEvent event) {
    event.setCancelled(plugin.getKnockdown().isDowned(event.getPlayer()));
  }

  @EventHandler(ignoreCancelled = true)
  public void onDrop(PlayerDropItemEvent event) {
    event.setCancelled(plugin.getKnockdown().isDowned(event.getPlayer()));
  }

  @EventHandler(ignoreCancelled = true)
  public void onTarget(EntityTargetLivingEntityEvent event) {
    if (event.getTarget() instanceof Player player && plugin.getKnockdown().isDowned(player)) {
      event.setCancelled(true);
    }
  }

  /** Downed players can look around and fall, but not walk or jump. */
  @EventHandler(ignoreCancelled = true)
  public void onMove(PlayerMoveEvent event) {
    if (!event.hasChangedPosition() || !plugin.getKnockdown().isDowned(event.getPlayer())) {
      return;
    }
    Location from = event.getFrom();
    Location to = event.getTo();
    Location pinned = from.clone();
    pinned.setYaw(to.getYaw());
    pinned.setPitch(to.getPitch());
    if (to.getY() < from.getY()) {
      pinned.setY(to.getY());
    }
    event.setTo(pinned);
  }

  // --- Lifecycle -------------------------------------------------------------------------------

  @EventHandler
  public void onJoin(PlayerJoinEvent event) {
    plugin.getKnockdown().onJoin(event.getPlayer());
  }

  @EventHandler
  public void onQuit(PlayerQuitEvent event) {
    plugin.getCombos().cleanup(event.getPlayer().getUniqueId());
    plugin.getKnockdown().onQuit(event.getPlayer());
  }

  @EventHandler
  public void onDeath(PlayerDeathEvent event) {
    plugin.getKnockdown().onDeath(event.getPlayer());
  }
}
