package stawa.vitalstrike;

import org.bukkit.World;
import org.bukkit.command.PluginCommand;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.TextDisplay;
import org.bukkit.plugin.java.JavaPlugin;
import stawa.vitalstrike.commands.HelpManager;
import stawa.vitalstrike.commands.VitalCommand;
import stawa.vitalstrike.items.CustomItems;
import stawa.vitalstrike.listeners.VitalStrikeListener;
import stawa.vitalstrike.resources.ResourcePackManager;
import stawa.vitalstrike.systems.ComboManager;
import stawa.vitalstrike.systems.DamageIndicatorManager;
import stawa.vitalstrike.systems.HealthBarManager;
import stawa.vitalstrike.systems.KnockdownManager;
import stawa.vitalstrike.utils.UpdateChecker;
import stawa.vitalstrike.web.WebEditor;
import stawa.vitalstrike.world.WorldRules;

/**
 * VitalStrike: floating damage indicators, combos, statistics and a knockdown/revive system for
 * Paper servers.
 */
public final class VitalStrike extends JavaPlugin {
  /** Scoreboard tag on every floating text this plugin spawns, so strays can be found. */
  public static final String TEXT_TAG = "vitalstrike_text";

  private static final long AUTOSAVE_TICKS = 5 * 60 * 20L;

  private PlayerManager players;
  private PlayerStats stats;
  private Rewards rewards;
  private Progression progression;
  private WorldRules worlds;
  private CustomItems items;
  private DamageIndicatorManager indicators;
  private HealthBarManager healthBars;
  private ComboManager combos;
  private KnockdownManager knockdown;
  private ResourcePackManager resourcePacks;
  private WebEditor webEditor;
  private HelpManager help;
  private boolean enabled;

  @Override
  public void onEnable() {
    saveDefaultConfig();

    players = new PlayerManager(this);
    stats = new PlayerStats(this);
    rewards = new Rewards(this);
    progression = new Progression(this);
    worlds = new WorldRules();
    items = new CustomItems(this);
    indicators = new DamageIndicatorManager(this, players);
    healthBars = new HealthBarManager(this, indicators);
    combos = new ComboManager(this, players, stats);
    knockdown = new KnockdownManager(this, items);
    resourcePacks = new ResourcePackManager(this);
    webEditor = new WebEditor(this);
    help = new HelpManager(this);
    UpdateChecker updateChecker = new UpdateChecker(this);
    loadSettings();

    var events = getServer().getPluginManager();
    events.registerEvents(new VitalStrikeListener(this), this);
    events.registerEvents(resourcePacks, this);
    events.registerEvents(items, this);
    events.registerEvents(updateChecker, this);

    PluginCommand command = getCommand("vitalstrike");
    VitalCommand handler = new VitalCommand(this, help);
    command.setExecutor(handler);
    command.setTabCompleter(handler);

    getServer().getScheduler().runTaskTimer(this, this::saveData, AUTOSAVE_TICKS, AUTOSAVE_TICKS);
    if (getConfig().getBoolean("update-checker.enabled")) {
      updateChecker.check();
    }
    if (getPluginMeta().getVersion().contains("SNAPSHOT")) {
      getSLF4JLogger()
          .warn("Running a SNAPSHOT build ({}); expect rough edges.", getPluginMeta().getVersion());
    }
  }

  @Override
  public void onDisable() {
    if (help == null) {
      return;
    }
    knockdown.shutdown();
    combos.shutdown();
    indicators.shutdown();
    healthBars.shutdown();
    items.unregister();
    saveData();
  }

  /** Re-reads config.yml and help.yml and applies them to every component. */
  public void reload() {
    clearText();
    reloadConfig();
    loadSettings();
    help.reload();
  }

  /** Removes all floating damage and combo text, including strays; returns how many strays. */
  public int clearText() {
    indicators.shutdown();
    healthBars.shutdown();
    combos.clearHolograms();
    int strays = 0;
    for (World world : getServer().getWorlds()) {
      for (TextDisplay display : world.getEntitiesByClass(TextDisplay.class)) {
        if (display.getScoreboardTags().contains(TEXT_TAG)) {
          display.remove();
          strays++;
        }
      }
    }
    return strays;
  }

  private void loadSettings() {
    FileConfiguration config = getConfig();
    enabled = config.getBoolean("enabled");
    worlds.reload(config);
    rewards.reload(config);
    progression.reload(config);
    indicators.reload(config);
    healthBars.reload(config);
    combos.reload(config);
    knockdown.reload(config);
    items.reload(config);
    resourcePacks.reload();
  }

  private void saveData() {
    players.save();
    stats.save();
  }

  /** Whether VitalStrike should act on events in this world. */
  public boolean isActive(World world) {
    return enabled && worlds.isActive(world);
  }

  public PlayerManager getPlayers() {
    return players;
  }

  public PlayerStats getStats() {
    return stats;
  }

  public Rewards getRewards() {
    return rewards;
  }

  public Progression getProgression() {
    return progression;
  }

  public WorldRules getWorlds() {
    return worlds;
  }

  public CustomItems getItems() {
    return items;
  }

  public HealthBarManager getHealthBars() {
    return healthBars;
  }

  public DamageIndicatorManager getIndicators() {
    return indicators;
  }

  public ComboManager getCombos() {
    return combos;
  }

  public KnockdownManager getKnockdown() {
    return knockdown;
  }

  public WebEditor getWebEditor() {
    return webEditor;
  }

  public ResourcePackManager getResourcePacks() {
    return resourcePacks;
  }
}
