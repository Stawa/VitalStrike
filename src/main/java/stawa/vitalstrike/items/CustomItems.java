package stawa.vitalstrike.items;

import java.util.Arrays;
import java.util.List;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Material;
import org.bukkit.NamespacedKey;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.ShapedRecipe;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.persistence.PersistentDataType;
import stawa.vitalstrike.Errors;
import stawa.vitalstrike.VitalStrike;

/**
 * Manages custom items for the VitalStrike plugin.
 * This class handles creation and validation of special items.
 */
public class CustomItems {
    private final VitalStrike plugin;
    private final NamespacedKey vitalAwakeningKey;

    /**
     * Constructs a new CustomItems instance.
     *
     * @param plugin The VitalStrike plugin instance
     * @throws Errors.ConfigurationException If there's an error in the
     *                                       configuration
     */
    public CustomItems(VitalStrike plugin) throws Errors.ConfigurationException {
        if (plugin == null) {
            throw new Errors.ConfigurationException("Plugin instance cannot be null");
        }
        this.plugin = plugin;
        this.vitalAwakeningKey = new NamespacedKey(plugin, "vital_awakening");
        try {
            registerRecipes();
        } catch (IllegalStateException e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate recipe")) {
                plugin.getLogger().info("Vital Awakening recipe already registered, skipping...");
            } else {
                throw new Errors.ConfigurationException("Failed to register custom item recipes", e);
            }
        } catch (Exception e) {
            throw new Errors.ConfigurationException("Failed to register custom item recipes", e);
        }
    }

    private void registerRecipes() throws Errors.ConfigurationException {
        plugin.getServer().removeRecipe(vitalAwakeningKey);

        ItemStack vitalAwakening = createVitalAwakening();
        ShapedRecipe recipe = new ShapedRecipe(vitalAwakeningKey, vitalAwakening);
        recipe.shape("GHG", "HTH", "GHG");
        recipe.setIngredient('G', Material.GOLD_INGOT);
        recipe.setIngredient('H', Material.GLISTERING_MELON_SLICE);
        recipe.setIngredient('T', Material.TOTEM_OF_UNDYING);

        try {
            plugin.getServer().addRecipe(recipe);
        } catch (IllegalStateException e) {
            throw new Errors.ConfigurationException("Failed to register recipe for Vital Awakening", e);
        }
    }

    /**
     * Creates a new Vital Awakening item with custom properties and lore.
     * This special item allows downed players to self-revive when used.
     *
     * @return A new ItemStack representing the Vital Awakening item
     * @throws Errors.ConfigurationException If there's an error creating the item
     *                                       or setting its metadata
     */
    public ItemStack createVitalAwakening() throws Errors.ConfigurationException {
        try {
            ItemStack item = new ItemStack(Material.TOTEM_OF_UNDYING);
            ItemMeta meta = item.getItemMeta();
            if (meta == null) {
                throw new Errors.ConfigurationException("Failed to get ItemMeta for Vital Awakening");
            }

            meta.displayName(MiniMessage.miniMessage()
                    .deserialize("<gradient:#FF0000:#FFD700><bold>Vital Awakening</bold></gradient>"));

            List<Component> lore = Arrays.asList(
                    MiniMessage.miniMessage().deserialize("<gray>A mystical item infused with vital energy"),
                    MiniMessage.miniMessage().deserialize("<gray>that allows self-revival when downed."),
                    MiniMessage.miniMessage().deserialize(""),
                    MiniMessage.miniMessage().deserialize("<yellow>When Downed:"),
                    MiniMessage.miniMessage().deserialize("<green>➤ Right-click to self-revive"));
            meta.lore(lore);

            meta.getPersistentDataContainer().set(vitalAwakeningKey, PersistentDataType.BYTE, (byte) 1);
            item.setItemMeta(meta);

            return item;
        } catch (Exception e) {
            throw new Errors.ConfigurationException("Failed to create Vital Awakening item", e);
        }
    }

    /**
     * Checks if the given ItemStack is a Vital Awakening item.
     *
     * @param item The ItemStack to check
     * @return true if the item is a Vital Awakening item, false otherwise
     */
    public boolean isVitalAwakening(ItemStack item) {
        if (item == null || !item.hasItemMeta())
            return false;
        return item.getItemMeta().getPersistentDataContainer()
                .has(vitalAwakeningKey, PersistentDataType.BYTE);
    }
}