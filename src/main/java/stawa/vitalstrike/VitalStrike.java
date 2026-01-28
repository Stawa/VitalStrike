package stawa.vitalstrike;

import org.bukkit.event.HandlerList;
import org.bukkit.plugin.java.JavaPlugin;
import stawa.vitalstrike.commands.CommandManager;
import stawa.vitalstrike.commands.HelpManager;
import stawa.vitalstrike.config.ConfigManager;
import stawa.vitalstrike.items.CustomItems;
import stawa.vitalstrike.listeners.VitalStrikeListener;
import stawa.vitalstrike.logger.VitalLogger;
import stawa.vitalstrike.resources.ResourcePackManager;
import stawa.vitalstrike.systems.ComboManager;
import stawa.vitalstrike.systems.DamageIndicatorManager;
import stawa.vitalstrike.systems.KnockdownManager;
import stawa.vitalstrike.utils.UpdateChecker;
import stawa.vitalstrike.world.DimensionManager;
import stawa.vitalstrike.world.WorldGuardUtil;

/**
 * VitalStrike is a dynamic damage indication plugin for Minecraft servers.
 *
 * <p>This plugin provides customizable damage indicators with various features including:
 *
 * <ul>
 *   <li>Dynamic damage indicators with customizable styles
 *   <li>Combo system with multipliers and ranks
 *   <li>Player statistics tracking
 *   <li>Per-player preferences
 * </ul>
 *
 * The plugin extends JavaPlugin and implements Listener to handle Bukkit events. It manages core
 * functionality including:
 *
 * <ul>
 *   <li>Damage indicator display and customization
 *   <li>Combat combo system with multipliers and ranks
 *   <li>Player statistics and leaderboards
 *   <li>Configuration management
 *   <li>Event handling for combat and player interactions
 *   <li>Hologram management for visual feedback
 * </ul>
 *
 * The plugin requires Paper 1.21.4+ or compatible forks and Java 21 or higher.
 *
 * @author Stawa
 * @version 1.5.0-SNAPSHOT
 */
public class VitalStrike extends JavaPlugin {
  /** Default constructor for VitalStrike plugin. */
  public VitalStrike() {
    super();
  }

  private ConfigManager configManager;
  private ComboManager comboManager;
  private DamageIndicatorManager damageIndicatorManager;
  private KnockdownManager knockdownManager;
  private PermissionManager permissionManager;
  private PlayerManager playerManager;
  private PlayerStats playerStats;
  private ResourcePackManager resourcePackManager;
  private DimensionManager dimensionManager;
  private CustomItems customItems;
  private CommandManager commandManager;
  private HelpManager helpManager;
  private VitalLogger logger;
  private UpdateChecker updateChecker;
  private VitalStrikeListener vitalStrikeListener;

  /** Called when the plugin is enabled. */
  @Override
  public void onEnable() {
    this.logger = new VitalLogger(this);

    String version = getPluginMeta().getVersion();
    if (version.contains("SNAPSHOT")) {
      logger.warning("You are running a SNAPSHOT version of VitalStrike ({}).", version);
      logger.warning("This version may contain bugs or be unstable.");
      logger.warning(
          "If you encounter any issues, please report them on GitHub Issues or our Discord server.");
    }

    saveDefaultConfig();
    this.configManager = new ConfigManager(this, getLogger());

    this.dimensionManager = new DimensionManager(this);
    WorldGuardUtil.init(this);

    try {
      this.knockdownManager = new KnockdownManager(this);
    } catch (Errors.ConfigurationException e) {
      logger.severe("Failed to initialize knockdown manager: " + e.getMessage());
      getServer().getPluginManager().disablePlugin(this);
      return;
    }

    try {
      this.resourcePackManager = new ResourcePackManager(this);
      logger.info("Resource pack manager initialized successfully");
    } catch (Exception e) {
      logger.severe("Failed to initialize resource pack manager: " + e.getMessage());
    }

    try {
      this.customItems = new CustomItems(this);
    } catch (Errors.ConfigurationException e) {
      logger.severe("Failed to initialize custom items: " + e.getMessage());
      getServer().getPluginManager().disablePlugin(this);
      return;
    }

    try {
      this.playerManager = new PlayerManager(this);
    } catch (Errors.DatabaseException e) {
      logger.severe("Failed to initialize player manager: " + e.getMessage());
    }

    try {
      this.playerStats = new PlayerStats(this);
    } catch (Errors.DatabaseException e) {
      logger.severe("Failed to initialize player statistics: " + e.getMessage());
    }

    this.permissionManager = new PermissionManager(this);
    this.comboManager =
        new ComboManager(this, configManager, playerManager, playerStats, getLogger());
    this.damageIndicatorManager =
        new DamageIndicatorManager(this, configManager, playerManager, permissionManager);

    this.vitalStrikeListener =
        new VitalStrikeListener(
            this,
            configManager,
            playerManager,
            knockdownManager,
            resourcePackManager,
            comboManager,
            damageIndicatorManager,
            dimensionManager,
            customItems);
    getServer().getPluginManager().registerEvents(vitalStrikeListener, this);

    this.helpManager = new HelpManager(this);
    this.commandManager =
        new CommandManager(
            this, logger, playerManager, playerStats, helpManager, resourcePackManager);
    getCommand("vitalstrike").setExecutor(commandManager);
    getCommand("vitalstrike").setTabCompleter(commandManager);

    this.updateChecker = new UpdateChecker(this, getLogger());
    if (configManager.isUpdateCheckerEnabled()) {
      updateChecker.checkForUpdates();
    }

    logger.info("VitalStrike has been enabled!");
  }

  /** Called when the plugin is disabled. */
  @Override
  public void onDisable() {
    if (knockdownManager != null) {
      knockdownManager.cleanup();
    }

    if (playerManager != null) {
      try {
        playerManager.saveDatabase();
      } catch (Errors.DatabaseException e) {
        logger.severe("Failed to save player database: " + e.getMessage());
      }
    }

    if (playerStats != null) {
      try {
        playerStats.saveAllStats();
      } catch (Errors.DatabaseException e) {
        logger.severe("Failed to save player statistics: " + e.getMessage());
      }
    }

    HandlerList.unregisterAll(this);
    logger.info("VitalStrike has been disabled!");
  }

  /** Reloads the plugin configuration and related components. */
  public void reload() {
    configManager.reload();
    dimensionManager.reload();
    if (damageIndicatorManager != null) {
      damageIndicatorManager.reloadSettings();
    }
    if (permissionManager != null) {
      permissionManager.loadPermissions();
    }
  }

  /**
   * Gets the configuration manager.
   *
   * @return The ConfigManager instance
   */
  public ConfigManager getConfigManager() {
    return configManager;
  }

  /**
   * Gets the combo manager.
   *
   * @return The ComboManager instance
   */
  public ComboManager getComboManager() {
    return comboManager;
  }

  /**
   * Gets the damage indicator manager.
   *
   * @return The DamageIndicatorManager instance
   */
  public DamageIndicatorManager getDamageIndicatorManager() {
    return damageIndicatorManager;
  }

  /**
   * Gets the knockdown manager.
   *
   * @return The KnockdownManager instance
   */
  public KnockdownManager getKnockdownManager() {
    return knockdownManager;
  }

  /**
   * Gets the permission manager.
   *
   * @return The PermissionManager instance
   */
  public PermissionManager getPermissionManager() {
    return permissionManager;
  }

  /**
   * Gets the player manager.
   *
   * @return The PlayerManager instance
   */
  public PlayerManager getPlayerManager() {
    return playerManager;
  }

  /**
   * Gets the player statistics manager.
   *
   * @return The PlayerStats instance
   */
  public PlayerStats getPlayerStats() {
    return playerStats;
  }

  /**
   * Gets the resource pack manager.
   *
   * @return The ResourcePackManager instance
   */
  public ResourcePackManager getResourcePackManager() {
    return resourcePackManager;
  }

  /**
   * Gets the dimension manager.
   *
   * @return The DimensionManager instance
   */
  public DimensionManager getDimensionManager() {
    return dimensionManager;
  }

  /**
   * Gets the custom items manager.
   *
   * @return The CustomItems instance
   */
  public CustomItems getCustomItems() {
    return customItems;
  }

  /**
   * Gets the command manager.
   *
   * @return The CommandManager instance
   */
  public CommandManager getCommandManager() {
    return commandManager;
  }
}
