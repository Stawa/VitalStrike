package stawa.vitalstrike.config;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import org.bukkit.NamespacedKey;
import org.bukkit.Registry;
import org.bukkit.Sound;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;

/** Manages plugin configuration, loading settings from the config file. */
public class ConfigManager {
  private final JavaPlugin plugin;
  private final Logger logger;

  private boolean enabled = true;
  private boolean updateCheckerEnabled;

  private boolean comboEnabled = true;
  private long comboResetTime = 3000;

  private boolean comboDecayEnabled = true;
  private int comboDecayTime = 10;
  private int comboDecayRate = 1;
  private int comboDecayInterval = 1;
  private int comboDecayMinimum = 0;

  private boolean comboMultiplierEnabled = true;
  private double comboMultiplierBase = 1.0;
  private double comboMultiplierPerCombo = 0.1;
  private double comboMultiplierMax = 3.0;
  private Map<String, Double> rankMultipliers = new HashMap<>();

  private boolean comboHologramEnabled = true;
  private int comboHologramMinCombo = 10;
  private double comboHologramDuration = 3.0;
  private String comboHologramFormat = "<gradient:red:gold><bold>COMBO STREAK!</bold></gradient>";
  private double comboHologramHeight = 2.0;
  private String comboFormat = "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>";
  private String multiplierFormat = " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>";
  private String decayWarningFormat = "<italic><gray>(Decaying in %.1fs)</gray></italic>";

  private boolean comboRankEnabled = true;
  private String rankFormat = "\n<bold>%s</bold>";
  private Map<String, Integer> rankThresholds = new HashMap<>();
  private Map<String, String> rankColors = new HashMap<>();

  private double displayDuration = 1.5;
  private String damageIndicatorType;

  private Map<String, Sound> damageTypeSounds = new HashMap<>();

  /**
   * Creates a new ConfigManager instance.
   *
   * @param plugin The plugin instance
   * @param logger The logger to use for reporting configuration status
   */
  public ConfigManager(JavaPlugin plugin, Logger logger) {
    this.plugin = plugin;
    this.logger = logger;
    loadConfig();
  }

  /** Reloads the configuration from the file. */
  public void reload() {
    plugin.reloadConfig();
    loadConfig();
    loadDamageTypeSounds();
  }

  private void loadConfig() {
    FileConfiguration config = plugin.getConfig();
    loadBasicSettings(config);
    loadComboSettings(config);
    loadDisplaySettings(config);
    loadDamageTypeSounds();
  }

  private void loadBasicSettings(FileConfiguration config) {
    enabled = config.getBoolean("enabled", true);
    updateCheckerEnabled = config.getBoolean("update-checker.enabled", true);
  }

  private void loadComboSettings(FileConfiguration config) {
    loadComboBasicSettings(config);
    loadComboDecaySettings(config);
    loadComboMultiplierSettings(config);
    loadComboDisplaySettings(config);
    loadComboRankSettings(config);
  }

  private void loadComboBasicSettings(FileConfiguration config) {
    comboEnabled = config.getBoolean("combo.enabled", true);
    comboResetTime = config.getLong("combo.reset-time", 3) * 1000;
  }

  private void loadComboDecaySettings(FileConfiguration config) {
    comboDecayEnabled = config.getBoolean("combo.decay.enabled", true);
    comboDecayTime = config.getInt("combo.decay.time", 10);
    comboDecayRate = config.getInt("combo.decay.rate", 1);
    comboDecayInterval = config.getInt("combo.decay.interval", 1);
    comboDecayMinimum = config.getInt("combo.decay.minimum", 0);
  }

  private void loadComboMultiplierSettings(FileConfiguration config) {
    comboMultiplierEnabled = config.getBoolean("combo.multiplier.enabled", true);
    comboMultiplierBase = config.getDouble("combo.multiplier.base", 1.0);
    comboMultiplierPerCombo = config.getDouble("combo.multiplier.per-combo", 0.1);
    comboMultiplierMax = config.getDouble("combo.multiplier.max", 3.0);

    ConfigurationSection rankMultSection = config.getConfigurationSection("combo.multiplier.ranks");
    if (rankMultSection != null) {
      rankMultipliers.clear();
      for (String rank : rankMultSection.getKeys(false)) {
        rankMultipliers.put(rank, rankMultSection.getDouble(rank));
      }
    }
  }

  private void loadComboDisplaySettings(FileConfiguration config) {
    comboHologramEnabled = config.getBoolean("combo.display.hologram.enabled", true);
    comboHologramMinCombo = config.getInt("combo.display.hologram.min-combo", 10);
    comboHologramDuration = config.getDouble("combo.display.hologram.duration", 3.0);
    comboHologramFormat =
        config.getString(
            "combo.display.hologram.format",
            "<gradient:red:gold><bold>COMBO STREAK!</bold></gradient>");
    comboHologramHeight = config.getDouble("combo.display.hologram.height", 2.0);

    comboFormat =
        config.getString(
            "combo.display.format",
            "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>");
    multiplierFormat =
        config.getString(
            "combo.display.multiplier-format",
            " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>");
    decayWarningFormat =
        config.getString(
            "combo.display.decay-warning", "<italic><gray>(Decaying in %.1fs)</gray></italic>");
  }

  private void loadComboRankSettings(FileConfiguration config) {
    comboRankEnabled = config.getBoolean("combo.display.rank.enabled", true);
    rankFormat = config.getString("combo.display.rank.format", "\n<bold>%s</bold>");
    loadRankThresholds(config);
    loadRankColors(config);
  }

  private void loadRankThresholds(FileConfiguration config) {
    ConfigurationSection thresholds =
        config.getConfigurationSection("combo.display.rank.thresholds");
    if (thresholds != null) {
      rankThresholds.clear();
      for (String rank : thresholds.getKeys(false)) {
        rankThresholds.put(rank, thresholds.getInt(rank));
      }
    }
  }

  private void loadRankColors(FileConfiguration config) {
    ConfigurationSection colors = config.getConfigurationSection("combo.display.rank.colors");
    if (colors != null) {
      rankColors.clear();
      for (String rank : colors.getKeys(false)) {
        rankColors.put(rank, colors.getString(rank));
      }
    }
  }

  private void loadDisplaySettings(FileConfiguration config) {
    displayDuration = config.getDouble("display.duration", 1.5);
    damageIndicatorType = config.getString("damage-indicator", "simple-damage-formats");
  }

  private void loadDamageTypeSounds() {
    damageTypeSounds = new HashMap<>();
    FileConfiguration config = plugin.getConfig();
    ConfigurationSection soundSection = config.getConfigurationSection("damage-type-sounds");
    if (soundSection != null) {
      for (String damageType : soundSection.getKeys(false)) {
        try {
          String soundName = soundSection.getString(damageType);
          if (soundName != null) {
            Sound sound = Registry.SOUNDS.get(NamespacedKey.minecraft(soundName.toLowerCase()));
            damageTypeSounds.put(damageType, sound);
          }
        } catch (IllegalArgumentException e) {
          logger.warning("Invalid sound name for damage type " + damageType);
        }
      }
    }
  }

  /**
   * Checks if the plugin is enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isEnabled() {
    return enabled;
  }

  /**
   * Checks if the update checker is enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isUpdateCheckerEnabled() {
    return updateCheckerEnabled;
  }

  /**
   * Checks if the combo system is enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isComboEnabled() {
    return comboEnabled;
  }

  /**
   * Gets the time in milliseconds before a combo resets.
   *
   * @return The combo reset time in milliseconds
   */
  public long getComboResetTime() {
    return comboResetTime;
  }

  /**
   * Checks if combo decay is enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isComboDecayEnabled() {
    return comboDecayEnabled;
  }

  /**
   * Gets the time in seconds before combo decay starts.
   *
   * @return The combo decay time in seconds
   */
  public int getComboDecayTime() {
    return comboDecayTime;
  }

  /**
   * Gets the amount of combo points to lose per decay interval.
   *
   * @return The combo decay rate
   */
  public int getComboDecayRate() {
    return comboDecayRate;
  }

  /**
   * Gets the interval in seconds between decay ticks.
   *
   * @return The combo decay interval in seconds
   */
  public int getComboDecayInterval() {
    return comboDecayInterval;
  }

  /**
   * Gets the minimum combo value that decay will not go below.
   *
   * @return The minimum combo value
   */
  public int getComboDecayMinimum() {
    return comboDecayMinimum;
  }

  /**
   * Checks if combo multipliers are enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isComboMultiplierEnabled() {
    return comboMultiplierEnabled;
  }

  /**
   * Gets the base multiplier value.
   *
   * @return The base multiplier
   */
  public double getComboMultiplierBase() {
    return comboMultiplierBase;
  }

  /**
   * Gets the multiplier increase per combo point.
   *
   * @return The multiplier increase per combo
   */
  public double getComboMultiplierPerCombo() {
    return comboMultiplierPerCombo;
  }

  /**
   * Gets the maximum allowed multiplier.
   *
   * @return The maximum multiplier
   */
  public double getComboMultiplierMax() {
    return comboMultiplierMax;
  }

  /**
   * Gets the map of rank-specific multipliers.
   *
   * @return A map of rank names to multiplier values
   */
  public Map<String, Double> getRankMultipliers() {
    return rankMultipliers;
  }

  /**
   * Checks if combo holograms are enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isComboHologramEnabled() {
    return comboHologramEnabled;
  }

  /**
   * Gets the minimum combo required to show a hologram.
   *
   * @return The minimum combo for hologram
   */
  public int getComboHologramMinCombo() {
    return comboHologramMinCombo;
  }

  /**
   * Gets the duration in seconds for the combo hologram.
   *
   * @return The hologram duration in seconds
   */
  public double getComboHologramDuration() {
    return comboHologramDuration;
  }

  /**
   * Gets the format string for the combo hologram.
   *
   * @return The hologram format
   */
  public String getComboHologramFormat() {
    return comboHologramFormat;
  }

  /**
   * Gets the height offset for the combo hologram.
   *
   * @return The height offset
   */
  public double getComboHologramHeight() {
    return comboHologramHeight;
  }

  /**
   * Gets the format string for the combo display in action bar.
   *
   * @return The combo display format
   */
  public String getComboFormat() {
    return comboFormat;
  }

  /**
   * Gets the format string for the multiplier display.
   *
   * @return The multiplier display format
   */
  public String getMultiplierFormat() {
    return multiplierFormat;
  }

  /**
   * Gets the format string for the decay warning.
   *
   * @return The decay warning format
   */
  public String getDecayWarningFormat() {
    return decayWarningFormat;
  }

  /**
   * Checks if combo ranks are enabled.
   *
   * @return true if enabled, false otherwise
   */
  public boolean isComboRankEnabled() {
    return comboRankEnabled;
  }

  /**
   * Gets the format string for rank display.
   *
   * @return The rank display format
   */
  public String getRankFormat() {
    return rankFormat;
  }

  /**
   * Gets the map of rank thresholds.
   *
   * @return A map of rank names to combo thresholds
   */
  public Map<String, Integer> getRankThresholds() {
    return rankThresholds;
  }

  /**
   * Gets the map of rank colors.
   *
   * @return A map of rank names to color codes/formats
   */
  public Map<String, String> getRankColors() {
    return rankColors;
  }

  /**
   * Gets the duration in seconds for general displays (like action bar).
   *
   * @return The display duration in seconds
   */
  public double getDisplayDuration() {
    return displayDuration;
  }

  /**
   * Gets the configured damage indicator type.
   *
   * @return The damage indicator type string
   */
  public String getDamageIndicatorType() {
    return damageIndicatorType;
  }

  /**
   * Gets the map of sounds for different damage types.
   *
   * @return A map of damage type strings to Sound objects
   */
  public Map<String, Sound> getDamageTypeSounds() {
    return damageTypeSounds;
  }
}
