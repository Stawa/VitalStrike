package stawa.vitalstrike;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;

/**
 * Per-player preferences and VitalStrike permission grants, stored in {@code playerdata.yml}. The
 * loaded YAML is the cache; it is written back on change-and-save or on the autosave timer.
 */
public final class PlayerManager {
  private final VitalStrike plugin;
  private final File file;
  private final YamlConfiguration data;
  private boolean dirty;

  public PlayerManager(VitalStrike plugin) {
    this.plugin = plugin;
    this.file = new File(plugin.getDataFolder(), "playerdata.yml");
    this.data = YamlConfiguration.loadConfiguration(file);
  }

  private static String path(UUID id, String key) {
    return "players." + id + "." + key;
  }

  public boolean isEnabled(Player player) {
    return data.getBoolean(path(player.getUniqueId(), "enabled"), true);
  }

  public void setEnabled(Player player, boolean enabled) {
    set(path(player.getUniqueId(), "enabled"), enabled);
  }

  public boolean isHologramEnabled(Player player) {
    return data.getBoolean(path(player.getUniqueId(), "hologram"), true);
  }

  public void setHologramEnabled(Player player, boolean enabled) {
    set(path(player.getUniqueId(), "hologram"), enabled);
  }

  /** Permissions granted through {@code /vs perm}; they only affect group damage formats. */
  public List<String> grants(UUID id) {
    return data.getStringList(path(id, "permissions"));
  }

  public boolean addGrant(UUID id, String permission) {
    List<String> grants = new ArrayList<>(grants(id));
    if (grants.contains(permission)) {
      return false;
    }
    grants.add(permission);
    set(path(id, "permissions"), grants);
    return true;
  }

  public boolean removeGrant(UUID id, String permission) {
    List<String> grants = new ArrayList<>(grants(id));
    if (!grants.remove(permission)) {
      return false;
    }
    set(path(id, "permissions"), grants.isEmpty() ? null : grants);
    return true;
  }

  public boolean hasGrant(Player player, String permission) {
    return player.hasPermission(permission) || grants(player.getUniqueId()).contains(permission);
  }

  private void set(String path, Object value) {
    data.set(path, value);
    dirty = true;
    save();
  }

  public void save() {
    if (!dirty) {
      return;
    }
    try {
      data.save(file);
      dirty = false;
    } catch (IOException e) {
      plugin.getSLF4JLogger().error("Could not save {}", file.getName(), e);
    }
  }
}
