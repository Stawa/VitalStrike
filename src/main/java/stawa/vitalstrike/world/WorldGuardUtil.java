package stawa.vitalstrike.world;

import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.regions.RegionContainer;
import com.sk89q.worldguard.protection.regions.RegionQuery;
import org.bukkit.Location;
import org.bukkit.entity.Player;
import stawa.vitalstrike.VitalStrike;

/**
 * Utility class for WorldGuard integration in VitalStrike.
 * Handles PvP region checks and WorldGuard-specific functionality.
 */
public class WorldGuardUtil {
    private static boolean worldGuardEnabled = false;
    private static VitalStrike plugin;

    /**
     * Private constructor to prevent instantiation of utility class.
     */
    private WorldGuardUtil() {
        // Private constructor to hide implicit public one
    }

    /**
     * Initializes the WorldGuard integration.
     * Checks if WorldGuard is present and enables functionality accordingly.
     *
     * @param plugin The VitalStrike plugin instance
     */
    public static void init(VitalStrike plugin) {
        WorldGuardUtil.plugin = plugin;
        try {
            Class.forName("com.sk89q.worldguard.WorldGuard");
            worldGuardEnabled = true;
        } catch (ClassNotFoundException e) {
            worldGuardEnabled = false;
        }
    }

    /**
     * Checks if PvP is allowed at a player's location.
     * Takes into account WorldGuard regions and plugin configuration.
     *
     * @param player The player to check PvP status for
     * @return true if PvP is allowed, false otherwise
     */
    public static boolean isPvPAllowed(Player player) {
        if (!worldGuardEnabled || !plugin.getConfig().getBoolean("world-settings.respect-worldguard-pvp", true)) {
            return true;
        }

        try {
            Location loc = player.getLocation();
            RegionContainer container = WorldGuard.getInstance().getPlatform().getRegionContainer();
            RegionQuery query = container.createQuery();
            com.sk89q.worldguard.protection.ApplicableRegionSet set = query.getApplicableRegions(
                    com.sk89q.worldedit.bukkit.BukkitAdapter.adapt(loc));
            return set.testState(null, Flags.PVP);
        } catch (Exception e) {
            return true;
        }
    }
}
