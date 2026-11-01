package stawa.vitalstrike.systems;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import org.bukkit.attribute.Attribute;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.TextDisplay;
import org.bukkit.scheduler.BukkitTask;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** A health bar that follows an entity for a few seconds after it is hit or healed. */
public final class HealthBarManager {
  private static final class Bar {
    final LivingEntity victim;
    final TextDisplay display;
    long expires;

    Bar(LivingEntity victim, TextDisplay display) {
      this.victim = victim;
      this.display = display;
    }
  }

  private final VitalStrike plugin;
  private final DamageIndicatorManager indicators;
  private final Map<UUID, Bar> bars = new HashMap<>();
  private BukkitTask ticker;

  private boolean enabled;
  private long durationMs;
  private double height;
  private int length;
  private String format;

  public HealthBarManager(VitalStrike plugin, DamageIndicatorManager indicators) {
    this.plugin = plugin;
    this.indicators = indicators;
  }

  public void reload(FileConfiguration c) {
    enabled = c.getBoolean("health-bar.enabled");
    durationMs = (long) (c.getDouble("health-bar.duration") * 1000);
    height = c.getDouble("health-bar.height");
    length = Math.max(1, c.getInt("health-bar.length"));
    format = c.getString("health-bar.format", "%bar%");
    if (!enabled) {
      shutdown();
    }
  }

  /**
   * Refreshes the bar once the entity's health has settled (damage is applied after its event).
   * With {@code create} false only an already visible bar is updated.
   */
  public void touch(LivingEntity victim, boolean create) {
    if (enabled && !(victim instanceof ArmorStand)) {
      plugin.getServer().getScheduler().runTask(plugin, () -> refresh(victim, create));
    }
  }

  private void refresh(LivingEntity victim, boolean create) {
    Bar bar = bars.get(victim.getUniqueId());
    if (!victim.isValid() || victim.getHealth() <= 0) {
      if (bar != null) {
        bar.display.remove();
        bars.remove(victim.getUniqueId());
      }
      return;
    }
    if (bar == null || !bar.display.isValid()) {
      if (!create) {
        return;
      }
      bar = new Bar(victim, indicators.spawnDisplay(victim, Text.parse(render(victim))));
      bar.display.setTransformation(DamageIndicatorManager.scale(1f));
      bars.put(victim.getUniqueId(), bar);
    }
    bar.display.text(Text.parse(render(victim)));
    bar.expires = System.currentTimeMillis() + durationMs;
    place(bar);
    if (ticker == null) {
      ticker = plugin.getServer().getScheduler().runTaskTimer(plugin, this::tick, 1L, 1L);
    }
  }

  private String render(LivingEntity victim) {
    var attribute = victim.getAttribute(Attribute.MAX_HEALTH);
    double max = attribute == null ? Math.max(1, victim.getHealth()) : attribute.getValue();
    double health = Math.min(victim.getHealth(), max);
    double ratio = health / max;
    int filled = Math.max(health > 0 ? 1 : 0, (int) Math.round(length * ratio));
    String color = ratio > 0.5 ? "<green>" : ratio > 0.25 ? "<yellow>" : "<red>";
    String bar =
        color + "█".repeat(filled) + "<dark_gray>" + "░".repeat(length - filled) + "<reset>";
    return format
        .replace("%bar%", bar)
        .replace("%health%", String.valueOf((int) Math.ceil(health)))
        .replace("%max%", String.valueOf((int) Math.ceil(max)));
  }

  private void place(Bar bar) {
    var box = bar.victim.getBoundingBox();
    var to = bar.display.getLocation();
    to.set(box.getCenterX(), box.getMaxY() + height, box.getCenterZ());
    bar.display.teleport(to);
  }

  private void tick() {
    long now = System.currentTimeMillis();
    for (Iterator<Bar> it = bars.values().iterator(); it.hasNext(); ) {
      Bar bar = it.next();
      try {
        if (now >= bar.expires || !bar.victim.isValid() || !bar.display.isValid()) {
          bar.display.remove();
          it.remove();
        } else {
          place(bar);
        }
      } catch (RuntimeException e) {
        plugin.getSLF4JLogger().warn("Dropping a broken health bar", e);
        bar.display.remove();
        it.remove();
      }
    }
    if (bars.isEmpty() && ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }

  /** Removes every live bar, e.g. on disable, reload or /vs clear. */
  public void shutdown() {
    bars.values().forEach(b -> b.display.remove());
    bars.clear();
    if (ticker != null) {
      ticker.cancel();
      ticker = null;
    }
  }
}
