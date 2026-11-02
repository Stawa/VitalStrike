package stawa.vitalstrike.systems;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import net.kyori.adventure.bossbar.BossBar;
import net.kyori.adventure.text.Component;
import org.bukkit.GameMode;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.attribute.Attribute;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Bee;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Mob;
import org.bukkit.entity.PigZombie;
import org.bukkit.entity.Player;
import org.bukkit.entity.Pose;
import org.bukkit.entity.Wolf;
import org.bukkit.inventory.EquipmentSlot;
import org.bukkit.inventory.ItemStack;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitTask;
import stawa.vitalstrike.Lookup;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.items.CustomItems;

/**
 * Knockdown system: lethal damage puts a player into a timed "downed" state instead of killing
 * them. Others (or a Vital Awakening item) can revive them before the timer runs out.
 */
public final class KnockdownManager {
  private static final String MESSAGES = "knockdown-system.effects.messages.";
  private static final String BARS = "knockdown-system.effects.boss-bar.";
  private static final double CALM_RADIUS = 32;

  private static final class Downed {
    long deadline;
    long lastTick;
    BossBar bar;
    // Mobs that targeted or hit the player while downed; calmed again when the state ends.
    final Set<UUID> aggressors = new HashSet<>();
  }

  /**
   * A revival in progress. {@code reviver} equals {@code target} for a Vital Awakening self-use.
   */
  private static final class Revival {
    final UUID reviver;
    final UUID target;
    final EquipmentSlot hand;
    final Location origin;
    final int totalTicks;
    int ticks;
    BukkitTask task;
    BossBar reviverBar;
    BossBar targetBar;

    Revival(UUID reviver, UUID target, EquipmentSlot hand, Location origin, int totalTicks) {
      this.reviver = reviver;
      this.target = target;
      this.hand = hand;
      this.origin = origin;
      this.totalTicks = Math.max(1, totalTicks);
    }

    boolean isSelf() {
      return reviver.equals(target);
    }
  }

  private final VitalStrike plugin;
  private final CustomItems items;
  private final Map<UUID, Downed> downed = new HashMap<>();
  private final Map<UUID, Revival> byTarget = new HashMap<>();
  private final Map<UUID, Revival> byReviver = new HashMap<>();
  private BukkitTask ticker;

  private boolean enabled;
  private int downSeconds;
  private double downedHealth;
  private double reviveRange;
  private int reviveTicks;
  private int useTicks;
  private boolean instantUse;
  private boolean requireItem;
  private int slowness;
  private int blindness;
  private boolean reviverBar;
  private Particle reviveParticle;
  private Sound reviveSound;

  public KnockdownManager(VitalStrike plugin, CustomItems items) {
    this.plugin = plugin;
    this.items = items;
  }

  public void reload(FileConfiguration c) {
    String root = "knockdown-system.";
    enabled = c.getBoolean(root + "enabled");
    downSeconds = Math.max(1, c.getInt(root + "down-duration"));
    downedHealth = Math.max(1, c.getDouble(root + "downed-health"));
    reviveRange = c.getDouble(root + "external-revive.range");
    reviveTicks = (int) (c.getDouble(root + "external-revive.duration") * 20);
    requireItem = c.getBoolean(root + "external-revive.require-vital-awakening");
    useTicks = (int) (c.getDouble(root + "vital-awakening.use-duration") * 20);
    instantUse = c.getBoolean(root + "vital-awakening.instant-use");
    slowness = c.getInt(root + "effects.down.slowness");
    blindness = c.getInt(root + "effects.down.blindness");
    reviverBar = c.getBoolean(root + "effects.reviver.show_bossbar");

    reviveParticle = Lookup.particle(c.getString(root + "effects.reviver.particle_effect"));
    reviveSound = Lookup.sound(c.getString(root + "effects.reviver.sound_effect"));

    if (!enabled) {
      shutdown();
    }
  }

  public boolean isEnabled() {
    return enabled;
  }

  public boolean isDowned(Player player) {
    return downed.containsKey(player.getUniqueId());
  }

  public double reviveRange() {
    return reviveRange;
  }

  // --- Downing ---------------------------------------------------------------------------------

  public boolean canDown(Player player) {
    return enabled
        && !isDowned(player)
        && player.getGameMode() != GameMode.CREATIVE
        && player.getGameMode() != GameMode.SPECTATOR;
  }

  /** Puts the player into the downed state. Returns false if they cannot be downed. */
  public boolean down(Player player) {
    if (!canDown(player)) {
      return false;
    }
    long now = System.currentTimeMillis();
    Downed d = new Downed();
    d.deadline = now + downSeconds * 1000L;
    d.lastTick = now;
    d.bar =
        BossBar.bossBar(downedTitle(downSeconds), 1f, BossBar.Color.RED, BossBar.Overlay.PROGRESS);
    downed.put(player.getUniqueId(), d);

    player.setHealth(Math.min(downedHealth, player.getAttribute(Attribute.MAX_HEALTH).getValue()));
    player.setFireTicks(0);
    player.setPose(Pose.SWIMMING, true);
    applyEffects(player);
    player.showBossBar(d.bar);
    calmNearby(player, d);
    player.sendMessage(
        Text.parse(message("downed").replace("%time%", String.valueOf(downSeconds))));

    if (ticker == null) {
      ticker = plugin.getServer().getScheduler().runTaskTimer(plugin, this::tick, 20L, 20L);
    }
    return true;
  }

  private Component downedTitle(long seconds) {
    return Text.parse("<red><bold>Downed! " + seconds + "s remaining");
  }

  private void applyEffects(Player player) {
    if (slowness > 0) {
      player.addPotionEffect(
          new PotionEffect(PotionEffectType.SLOWNESS, 60, slowness, false, false, false));
    }
    if (blindness > 0) {
      player.addPotionEffect(
          new PotionEffect(PotionEffectType.BLINDNESS, 60, blindness, false, false, false));
    }
  }

  private void tick() {
    long now = System.currentTimeMillis();
    for (UUID id : List.copyOf(downed.keySet())) {
      Downed d = downed.get(id);
      if (byTarget.containsKey(id)) {
        d.deadline += now - d.lastTick;
      }
      d.lastTick = now;
      Player player = plugin.getServer().getPlayer(id);
      if (player == null) {
        continue;
      }
      long left = d.deadline - now;
      if (left <= 0) {
        downed.remove(id);
        release(player, d);
        player.setHealth(0);
        continue;
      }
      applyEffects(player);
      calmNearby(player, d);
      d.bar.progress(Math.min(1f, (float) left / (downSeconds * 1000f)));
      d.bar.name(downedTitle((left + 999) / 1000));
    }
    if (downed.isEmpty() && ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }

  /** Undoes everything the downed state applied to the player. */
  private void release(Player player, Downed d) {
    cancelRevivals(player.getUniqueId());
    forgive(player, d);
    player.hideBossBar(d.bar);
    player.removePotionEffect(PotionEffectType.SLOWNESS);
    player.removePotionEffect(PotionEffectType.BLINDNESS);
    player.setPose(Pose.STANDING, false);
  }

  // --- Mobs ------------------------------------------------------------------------------------

  /** Remembers a mob that hit the downed player, so it can be calmed down when they get up. */
  public void noteAggressor(Player player, Entity source) {
    Downed d = downed.get(player.getUniqueId());
    if (d != null && source instanceof Mob mob) {
      d.aggressors.add(mob.getUniqueId());
      calm(mob, player);
    }
  }

  /** Makes every mob that is chasing the downed player stop, and remembers it. */
  private void calmNearby(Player player, Downed d) {
    for (Entity nearby : player.getNearbyEntities(CALM_RADIUS, CALM_RADIUS, CALM_RADIUS)) {
      if (nearby instanceof Mob mob && player.equals(mob.getTarget())) {
        d.aggressors.add(mob.getUniqueId());
      }
    }
    for (UUID id : d.aggressors) {
      if (plugin.getServer().getEntity(id) instanceof Mob mob) {
        calm(mob, player);
      }
    }
  }

  /** When the downed state ends the mobs that were after the player go back to normal. */
  private void forgive(Player player, Downed d) {
    for (UUID id : d.aggressors) {
      if (plugin.getServer().getEntity(id) instanceof Mob mob) {
        calm(mob, player);
      }
    }
    d.aggressors.clear();
  }

  /**
   * Drops the mob's target if it is the player, and clears its anger where the API allows. Mobs
   * that only expose a target (iron golem, piglin, enderman) lose their own rage timer by
   * themselves, since it only runs down while they have no target.
   */
  private static void calm(Mob mob, Player player) {
    if (player.equals(mob.getTarget())) {
      mob.setTarget(null);
      mob.getPathfinder().stopPathfinding();
    }
    switch (mob) {
      case Wolf wolf -> wolf.setAngry(false);
      case Bee bee -> bee.setAnger(0);
      case PigZombie pigZombie -> pigZombie.setAnger(0);
      default -> {}
    }
  }

  // --- Reviving --------------------------------------------------------------------------------

  /** Another player starts reviving {@code target}. */
  public void startRevive(Player reviver, Player target) {
    if (!enabled || reviver.equals(target) || !isDowned(target) || isDowned(reviver)) {
      return;
    }
    if (byTarget.containsKey(target.getUniqueId())
        || byReviver.containsKey(reviver.getUniqueId())) {
      return;
    }
    EquipmentSlot hand = requireItem ? heldAwakening(reviver) : null;
    boolean inRange =
        reviver.getWorld().equals(target.getWorld())
            && reviver.getLocation().distanceSquared(target.getLocation())
                <= reviveRange * reviveRange;
    if (!inRange || (requireItem && hand == null)) {
      reviver.sendMessage(Text.parse(message("cannot-revive")));
      return;
    }
    begin(reviver, target, hand, reviveTicks);
    reviver.sendMessage(
        Text.parse(message("reviving-player").replace("%player%", target.getName())));
    target.sendMessage(Text.parse(message("being-revived").replace("%player%", reviver.getName())));
  }

  /** A downed player uses the Vital Awakening item held in {@code hand}. */
  public void startSelfRevive(Player player, EquipmentSlot hand) {
    UUID id = player.getUniqueId();
    if (!isDowned(player)
        || byTarget.containsKey(id)
        || byReviver.containsKey(id)
        || !items.isVitalAwakening(player.getInventory().getItem(hand))) {
      return;
    }
    if (instantUse) {
      consume(player, hand);
      revive(player, player);
    } else {
      begin(player, player, hand, useTicks);
    }
  }

  private EquipmentSlot heldAwakening(Player player) {
    if (items.isVitalAwakening(player.getInventory().getItemInMainHand())) {
      return EquipmentSlot.HAND;
    }
    return items.isVitalAwakening(player.getInventory().getItemInOffHand())
        ? EquipmentSlot.OFF_HAND
        : null;
  }

  private void begin(Player reviver, Player target, EquipmentSlot hand, int ticks) {
    Revival r =
        new Revival(
            reviver.getUniqueId(), target.getUniqueId(), hand, reviver.getLocation(), ticks);
    r.targetBar = bar(r.isSelf() ? "self-reviving" : "being-revived", reviver.getName());
    target.showBossBar(r.targetBar);
    if (!r.isSelf() && reviverBar) {
      r.reviverBar = bar("reviving", target.getName());
      reviver.showBossBar(r.reviverBar);
    }
    byTarget.put(r.target, r);
    byReviver.put(r.reviver, r);
    r.task = plugin.getServer().getScheduler().runTaskTimer(plugin, () -> step(r), 1L, 1L);
  }

  private BossBar bar(String type, String playerName) {
    String path = BARS + type + ".";
    BossBar.Color color = BossBar.Color.YELLOW;
    BossBar.Overlay overlay = BossBar.Overlay.PROGRESS;
    try {
      color =
          BossBar.Color.valueOf(
              plugin.getConfig().getString(path + "color", "YELLOW").toUpperCase(Locale.ROOT));
      String style = plugin.getConfig().getString(path + "style", "SOLID").toUpperCase(Locale.ROOT);
      overlay =
          style.equals("SOLID")
              ? BossBar.Overlay.PROGRESS
              : BossBar.Overlay.valueOf(style.replace("SEGMENTED", "NOTCHED"));
    } catch (IllegalArgumentException e) {
      plugin.getSLF4JLogger().warn("Invalid boss bar color/style under '{}'", path);
    }
    String title = plugin.getConfig().getString(path + "title", "").replace("%player%", playerName);
    return BossBar.bossBar(Text.parse(title), 0f, color, overlay);
  }

  private void step(Revival r) {
    Player reviver = plugin.getServer().getPlayer(r.reviver);
    Player target = plugin.getServer().getPlayer(r.target);
    if (reviver == null
        || target == null
        || !isDowned(target)
        || (!r.isSelf() && isDowned(reviver))) {
      fail(r, reviver);
      return;
    }
    if (!r.isSelf()) {
      Location now = reviver.getLocation();
      boolean moved =
          !now.getWorld().equals(r.origin.getWorld()) || now.distanceSquared(r.origin) > 0.25;
      boolean tooFar =
          !now.getWorld().equals(target.getWorld())
              || now.distanceSquared(target.getLocation()) > reviveRange * reviveRange;
      if (moved || tooFar) {
        fail(r, reviver);
        return;
      }
    }
    if (r.hand != null && !items.isVitalAwakening(reviver.getInventory().getItem(r.hand))) {
      fail(r, reviver);
      return;
    }
    float progress = (float) ++r.ticks / r.totalTicks;
    r.targetBar.progress(Math.min(1f, progress));
    if (r.reviverBar != null) {
      r.reviverBar.progress(Math.min(1f, progress));
    }
    if (r.ticks >= r.totalTicks) {
      cancelRevival(r);
      if (r.hand != null) {
        consume(reviver, r.hand);
      }
      revive(target, r.isSelf() ? target : reviver);
    }
  }

  private void fail(Revival r, Player reviver) {
    cancelRevival(r);
    if (reviver != null) {
      reviver.sendMessage(Text.parse(message("revive-failed")));
    }
  }

  private void consume(Player player, EquipmentSlot hand) {
    ItemStack stack = player.getInventory().getItem(hand);
    player.getInventory().setItem(hand, stack.getAmount() > 1 ? stack.subtract() : null);
  }

  /**
   * Brings a downed player back at full health.
   *
   * @param reviver who revived them; the target itself for a self-revive, or null for an admin
   * @return false if the player was not downed
   */
  public boolean revive(Player target, Player reviver) {
    Downed d = downed.remove(target.getUniqueId());
    if (d == null) {
      return false;
    }
    release(target, d);
    target.setHealth(target.getAttribute(Attribute.MAX_HEALTH).getValue());

    if (reviver != null && reviver.equals(target)) {
      target.sendMessage(Text.parse(message("self-revived")));
    } else {
      String name = reviver == null ? "an administrator" : reviver.getName();
      target.sendMessage(Text.parse(message("revive-complete").replace("%player%", name)));
      if (reviver != null) {
        reviver.sendMessage(
            Text.parse(message("reviver-complete").replace("%player%", target.getName())));
        if (reviveSound != null) {
          reviver.playSound(reviver.getLocation(), reviveSound, 1f, 1f);
        }
      }
    }
    if (reviveParticle != null) {
      target
          .getWorld()
          .spawnParticle(reviveParticle, target.getLocation().add(0, 1.5, 0), 8, 0.4, 0.4, 0.4, 0);
    }
    return true;
  }

  private void cancelRevival(Revival r) {
    r.task.cancel();
    byTarget.remove(r.target, r);
    byReviver.remove(r.reviver, r);
    Player target = plugin.getServer().getPlayer(r.target);
    if (target != null) {
      target.hideBossBar(r.targetBar);
    }
    Player reviver = plugin.getServer().getPlayer(r.reviver);
    if (reviver != null && r.reviverBar != null) {
      reviver.hideBossBar(r.reviverBar);
    }
  }

  private void cancelRevivals(UUID player) {
    Revival asTarget = byTarget.get(player);
    if (asTarget != null) {
      cancelRevival(asTarget);
    }
    Revival asReviver = byReviver.get(player);
    if (asReviver != null) {
      cancelRevival(asReviver);
    }
  }

  // --- Lifecycle hooks -------------------------------------------------------------------------

  public void onQuit(Player player) {
    cancelRevivals(player.getUniqueId());
  }

  /** A downed player who rejoins resumes the countdown, or dies if it ran out while offline. */
  public void onJoin(Player player) {
    Downed d = downed.get(player.getUniqueId());
    if (d == null) {
      return;
    }
    long now = System.currentTimeMillis();
    d.lastTick = now;
    if (d.deadline <= now) {
      downed.remove(player.getUniqueId());
      plugin.getServer().getScheduler().runTask(plugin, () -> player.setHealth(0));
      return;
    }
    player.setPose(Pose.SWIMMING, true);
    player.showBossBar(d.bar);
    applyEffects(player);
  }

  public void onDeath(Player player) {
    Downed d = downed.remove(player.getUniqueId());
    if (d != null) {
      release(player, d);
    }
    cancelRevivals(player.getUniqueId());
  }

  /** Restores every downed player and drops all pending work; used on disable and reload. */
  public void shutdown() {
    for (UUID id : List.copyOf(downed.keySet())) {
      Downed d = downed.remove(id);
      Player player = plugin.getServer().getPlayer(id);
      if (player != null) {
        release(player, d);
      }
    }
    List.copyOf(byTarget.values()).forEach(this::cancelRevival);
    if (ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }

  private String message(String key) {
    return plugin.getConfig().getString(MESSAGES + key, "");
  }
}
