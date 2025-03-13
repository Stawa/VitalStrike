package stawa.vitalstrike;

import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.permissions.PermissionAttachmentInfo;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Manages permissions for VitalStrike plugin, particularly for group-based
 * damage formats.
 * Handles loading, checking, and retrieving group permissions from
 * configuration.
 */
public class PermissionManager {
    private final JavaPlugin plugin;
    private Map<String, String> groupPermissions;
    private Map<String, Map<String, String>> groupDamageFormats;
    private static final String DEFAULT_GROUP = "default";

    /**
     * Constructs a new PermissionManager.
     *
     * @param plugin the JavaPlugin instance
     */
    public PermissionManager(JavaPlugin plugin) {
        this.plugin = plugin;
        this.groupPermissions = new HashMap<>();
        this.groupDamageFormats = new HashMap<>();
        loadPermissions();
    }

    /**
     * Loads all permission-related settings from the configuration.
     */
    public void loadPermissions() {
        FileConfiguration config = plugin.getConfig();
        loadGroupDamageFormats(config);
    }

    /**
     * Loads group-based damage formats from configuration.
     * Sets up permission-based damage format groups.
     *
     * @param config the plugin configuration
     */
    private void loadGroupDamageFormats(FileConfiguration config) {
        groupDamageFormats = new HashMap<>();
        groupPermissions = new HashMap<>();
        ConfigurationSection groupSection = config.getConfigurationSection("group-damage-formats");

        if (groupSection != null) {
            for (String groupName : groupSection.getKeys(false)) {
                loadGroupFormat(groupSection, groupName);
            }
        }
    }

    /**
     * Loads format settings for a specific group.
     * Processes permission and damage formats for a single group.
     *
     * @param groupSection the configuration section containing group settings
     * @param groupName    the name of the group to load
     */
    private void loadGroupFormat(ConfigurationSection groupSection, String groupName) {
        ConfigurationSection group = groupSection.getConfigurationSection(groupName);
        if (group != null) {
            String permission = group.getString("permission", "");
            if (permission != null && !permission.isEmpty()) {
                groupPermissions.put(groupName, permission);
            } else {
                groupPermissions.put(groupName, "vitalstrike.group." + groupName.toLowerCase());
            }
            loadDamageFormatsForGroup(group, groupName);
        }
    }

    /**
     * Loads damage formats for a specific group.
     * Maps damage types to their display formats for the group.
     *
     * @param group     the configuration section containing the group's settings
     * @param groupName the name of the group
     */
    private void loadDamageFormatsForGroup(ConfigurationSection group, String groupName) {
        Map<String, String> formats = new HashMap<>();
        ConfigurationSection formatSection = group.getConfigurationSection("damage-formats");
        if (formatSection != null) {
            for (String damageType : formatSection.getKeys(false)) {
                formats.put(damageType, formatSection.getString(damageType));
            }
        }
        groupDamageFormats.put(groupName, formats);
    }

    /**
     * Gets the player's damage format group based on permissions.
     *
     * @param player the player to check
     * @return the group name the player belongs to, or "default" if none
     */
    public String getPlayerGroup(Player player) {
        for (Map.Entry<String, String> entry : groupPermissions.entrySet()) {
            if (player.hasPermission(entry.getValue())) {
                return entry.getKey();
            }
        }
        return DEFAULT_GROUP;
    }

    /**
     * Gets the damage format for a player based on their permissions.
     *
     * @param player        the player
     * @param damageType    the type of damage
     * @param defaultFormat the default format to use if no permission-based format
     *                      is found
     * @return the formatted damage string
     */
    public String getDamageFormat(Player player, String damageType, String defaultFormat) {
        String damageIndicatorType = plugin.getConfig().getString("damage-indicator", "simple-damage-formats");

        if ("simple-damage-formats".equals(damageIndicatorType)) {
            String format = plugin.getConfig().getString("simple-damage-formats." + damageType);
            if (format != null) {
                return format;
            }

            format = plugin.getConfig().getString("simple-damage-formats.default");
            if (format != null) {
                return format;
            }

            return defaultFormat;
        }

        ConfigurationSection groupsSection = plugin.getConfig().getConfigurationSection("group-damage-formats");
        if (groupsSection != null) {
            for (String groupKey : groupsSection.getKeys(false)) {
                if (!groupKey.equals("default")) {
                    String permission = "vitalstrike.group." + groupKey;

                    boolean hasPermission = false;
                    if (player instanceof Player) {
                        hasPermission = hasExplicitPermission(player, permission);
                    }

                    if (hasPermission) {
                        String format = plugin.getConfig().getString(
                                "group-damage-formats." + groupKey + ".damage-formats." + damageType);

                        if (format != null) {
                            return format;
                        }

                        format = plugin.getConfig().getString(
                                "group-damage-formats." + groupKey + ".damage-formats.default");

                        if (format != null) {
                            return format;
                        }
                    }
                }
            }

            boolean useSimpleFormats = plugin.getConfig().getBoolean("group-damage-formats.default.use-simple-formats",
                    false);

            if (!useSimpleFormats) {
                String format = plugin.getConfig()
                        .getString("group-damage-formats.default.damage-formats." + damageType);
                if (format != null) {
                    return format;
                }

                format = plugin.getConfig().getString("group-damage-formats.default.damage-formats.default");
                if (format != null) {
                    return format;
                }
            }
        }

        return defaultFormat;
    }

    /**
     * Checks if a player has an explicitly assigned permission (not inherited from
     * OP).
     * 
     * @param player     the player to check
     * @param permission the permission to check
     * @return true if the player has the permission explicitly assigned
     */
    private boolean hasExplicitPermission(Player player, String permission) {
        if (plugin instanceof VitalStrike) {
            VitalStrike vs = (VitalStrike) plugin;
            PlayerManager playerManager = vs.getPlayerManager();
            if (playerManager != null) {
                String path = "players." + player.getUniqueId() + ".permissions";
                if (playerManager.getDatabase().contains(path)) {
                    List<String> permissions = playerManager.getDatabase().getStringList(path);
                    return permissions.contains(permission);
                }
            }
        }

        if (player.isOp()) {
            for (PermissionAttachmentInfo perm : player.getEffectivePermissions()) {
                if (perm.getPermission().equals(permission) &&
                        !perm.getAttachment().getPlugin().getName().equals("bukkit")) {
                    return true;
                }
            }
            return false;
        }

        return player.hasPermission(permission);
    }

    /**
     * Gets all group permissions.
     *
     * @return map of group names to permission strings
     */
    public Map<String, String> getGroupPermissions() {
        return groupPermissions;
    }

    /**
     * Gets all group damage formats.
     *
     * @return map of group names to damage format maps
     */
    public Map<String, Map<String, String>> getGroupDamageFormats() {
        return groupDamageFormats;
    }
}