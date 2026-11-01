package stawa.vitalstrike;

import java.time.Duration;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.title.Title;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.SoundCategory;
import org.bukkit.attribute.Attribute;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;

/**
 * Kill feedback and RPG levelling. Every kill pops a "slain" marker over the victim and pays
 * experience scaled to the victim's max health; the level is derived from lifetime experience.
 */
public final class Progression {
  /** A player's standing: current level, experience into it, and what the next level costs. */
  public record Progress(int level, long into, long needed) {}

  private static final int BAR_WIDTH = 10;

  private final VitalStrike plugin;
  private boolean killEnabled;
  private boolean levelsEnabled;
  private String indicatorFormat;
  private String actionbarFormat;
  private String levelUpTitle;
  private String levelUpSubtitle;
  private Sound killSound;
  private Sound levelUpSound;
  private double xpPerHealth;
  private double baseXp;
  private double exponent;
  private int maxLevel;

  public Progression(VitalStrike plugin) {
    this.plugin = plugin;
  }

  public void reload(FileConfiguration c) {
    killEnabled = c.getBoolean("kill-indicator.enabled");
    indicatorFormat = c.getString("kill-indicator.format", "");
    actionbarFormat = c.getString("kill-indicator.actionbar", "");
    killSound = Lookup.sound(c.getString("kill-indicator.sound"));

    levelsEnabled = c.getBoolean("levels.enabled");
    xpPerHealth = c.getDouble("levels.xp-per-health");
    baseXp = Math.max(1, c.getDouble("levels.base-xp"));
    exponent = c.getDouble("levels.exponent");
    maxLevel = Math.max(1, c.getInt("levels.max-level"));
    levelUpTitle = c.getString("levels.level-up.title", "");
    levelUpSubtitle = c.getString("levels.level-up.subtitle", "");
    levelUpSound = Lookup.sound(c.getString("levels.level-up.sound"));
  }

  /** Experience needed to climb from {@code level} to the next one. */
  private long needed(int level) {
    return Math.max(1, Math.round(baseXp * Math.pow(level, exponent)));
  }

  public Progress progress(long xp) {
    int level = 1;
    while (level < maxLevel && xp >= needed(level)) {
      xp -= needed(level++);
    }
    return level >= maxLevel ? new Progress(level, 0, 0) : new Progress(level, xp, needed(level));
  }

  public void onKill(Player killer, LivingEntity victim) {
    if (!killEnabled || victim instanceof ArmorStand || victim.equals(killer)) {
      return;
    }
    var maxHealth = victim.getAttribute(Attribute.MAX_HEALTH);
    long gain =
        levelsEnabled && maxHealth != null ? Math.round(maxHealth.getValue() * xpPerHealth) : 0;
    PlayerStats.Stats before = plugin.getStats().of(killer);
    int oldLevel = progress(before.xp()).level();
    PlayerStats.Stats stats = plugin.getStats().recordKill(killer, gain);
    Progress now = progress(stats.xp());

    if (!plugin.getPlayers().isEnabled(killer)) {
      return;
    }
    String victimName = victim.getName().replace("<", "").replace(">", "");
    plugin.getIndicators().showKill(victim, fill(indicatorFormat, victimName, gain, now));
    killer.sendActionBar(fill(actionbarFormat, victimName, gain, now));
    if (killSound != null) {
      killer.playSound(killer, killSound, SoundCategory.PLAYERS, 1f, 1f);
    }
    if (levelsEnabled && now.level() > oldLevel) {
      levelUp(killer, now.level());
    }
  }

  private Component fill(String format, String victim, long xp, Progress p) {
    int filled = p.needed() == 0 ? BAR_WIDTH : (int) (BAR_WIDTH * p.into() / p.needed());
    String bar =
        "<green>" + "█".repeat(filled) + "<dark_gray>" + "░".repeat(BAR_WIDTH - filled) + "<reset>";
    return Text.parse(
        format
            .replace("%victim%", victim)
            .replace("%xp%", String.valueOf(xp))
            .replace("%level%", String.valueOf(p.level()))
            .replace("%bar%", bar));
  }

  private void levelUp(Player player, int level) {
    String shown = String.valueOf(level);
    player.showTitle(
        Title.title(
            Text.parse(levelUpTitle.replace("%level%", shown)),
            Text.parse(levelUpSubtitle.replace("%level%", shown)),
            Title.Times.times(
                Duration.ofMillis(200), Duration.ofSeconds(2), Duration.ofMillis(500))));
    if (levelUpSound != null) {
      player.playSound(player, levelUpSound, SoundCategory.PLAYERS, 1f, 1f);
    }
    player
        .getWorld()
        .spawnParticle(
            Particle.TOTEM_OF_UNDYING, player.getLocation().add(0, 1, 0), 60, 0.5, 1, 0.5, 0.4);
  }
}
