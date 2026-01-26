package stawa.vitalstrike.items;

import java.util.Arrays;
import java.util.List;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Material;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.ShapedRecipe;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.persistence.PersistentDataType;
import stawa.vitalstrike.Errors;
import stawa.vitalstrike.VitalStrike;

/**
 * Manages custom items for the VitalStrike plugin. This class handles creation and validation of
 * special items.
 */
public class CustomItems {
  private final VitalStrike plugin;
  private final NamespacedKey vitalAwakeningKey;

  /**
   * Constructs a new CustomItems instance.
   *
   * @param plugin The VitalStrike plugin instance
   * @throws Errors.ConfigurationException If there's an error in the configuration
   */
  public CustomItems(VitalStrike plugin) throws Errors.ConfigurationException {
    if (plugin == null) {
      throw new Errors.ConfigurationException("Plugin instance cannot be null");
    }
    this.plugin = plugin;
    this.vitalAwakeningKey = new NamespacedKey(plugin, "vital_awakening");
    plugin
        .getServer()
        .getScheduler()
        .runTask(
            plugin,
            () -> {
              try {
                registerRecipes();
              } catch (Errors.ConfigurationException e) {
                plugin
                    .getLogger()
                    .warning("Failed to register Vital Awakening recipe: " + e.getMessage());
              }
            });
  }

  /**
   * Registers the crafting recipe for the Vital Awakening item. Removes any existing recipe with
   * the same key before adding the new one.
   *
   * @throws Errors.ConfigurationException If there's an error registering the recipe
   */
  private void registerRecipes() throws Errors.ConfigurationException {
    try {
      plugin.getServer().removeRecipe(vitalAwakeningKey);

      ItemStack vitalAwakening = createVitalAwakening();
      ShapedRecipe recipe = new ShapedRecipe(vitalAwakeningKey, vitalAwakening);
      recipe.shape("GHG", "HTH", "GHG");
      recipe.setIngredient('G', Material.GOLD_INGOT);
      recipe.setIngredient('H', Material.GLISTERING_MELON_SLICE);
      recipe.setIngredient('T', Material.TOTEM_OF_UNDYING);

      if (!plugin.getServer().addRecipe(recipe)) {
        plugin
            .getLogger()
            .warning("Failed to add Vital Awakening recipe - recipe may already exist");
      } else {
        plugin.getLogger().info("Successfully registered Vital Awakening recipe");
      }
    } catch (Exception e) {
      throw new Errors.ConfigurationException(
          "Failed to register custom item recipes: " + e.getMessage(), e);
    }
  }

  /**
   * Creates a new Vital Awakening item with custom properties and lore.
   *
   * @return A new ItemStack representing the Vital Awakening item
   * @throws Errors.ConfigurationException If there's an error creating the item
   */
  public ItemStack createVitalAwakening() throws Errors.ConfigurationException {
    try {
      ItemStack item = new ItemStack(Material.TOTEM_OF_UNDYING);
      ItemMeta meta = item.getItemMeta();

      if (meta == null) {
        throw new Errors.ConfigurationException("Failed to get ItemMeta for Vital Awakening");
      }

      meta.displayName(
          MiniMessage.miniMessage()
              .deserialize("<gradient:#FF0000:#FFD700><bold>Vital Awakening</bold></gradient>"));
      List<Component> lore =
          Arrays.asList(
              MiniMessage.miniMessage()
                  .deserialize("<gray>A mystical item infused with vital energy"),
              MiniMessage.miniMessage().deserialize("<gray>that allows self-revival when downed."),
              MiniMessage.miniMessage().deserialize(""),
              MiniMessage.miniMessage().deserialize("<yellow>When Downed:"),
              MiniMessage.miniMessage().deserialize("<green>➤ Right-click to self-revive"));
      meta.lore(lore);
      meta.getPersistentDataContainer().set(vitalAwakeningKey, PersistentDataType.BYTE, (byte) 1);
      meta.setItemModel(new NamespacedKey("template", "vs"));

      item.setItemMeta(meta);
      return item;
    } catch (Exception e) {
      throw new Errors.ConfigurationException("Failed to create Vital Awakening item", e);
    }
  }

  /**
   * Attempts to use a Vital Awakening item from the player's main or off hand. If successful,
   * reduces the item count by 1.
   *
   * @param player The player attempting to use the Vital Awakening
   * @return true if the item was successfully used, false otherwise
   */
  public boolean useVitalAwakening(Player player) {
    ItemStack item = player.getInventory().getItemInMainHand();
    if (item.getType() != Material.TOTEM_OF_UNDYING) {
      item = player.getInventory().getItemInOffHand();
    }

    if (isVitalAwakening(item)) {
      item.setAmount(item.getAmount() - 1);
      return true;
    }
    return false;
  }

  /**
   * Checks if the given ItemStack is a Vital Awakening item.
   *
   * @param item The ItemStack to check
   * @return true if the item is a valid Vital Awakening item, false if the item is null, not a
   *     TOTEM_OF_UNDYING, has no metadata, or lacks the Vital Awakening tag
   */
  public boolean isVitalAwakening(ItemStack item) {
    if (item == null || item.getType() != Material.TOTEM_OF_UNDYING || !item.hasItemMeta()) {
      return false;
    }
    return item.getItemMeta()
        .getPersistentDataContainer()
        .has(vitalAwakeningKey, PersistentDataType.BYTE);
  }
}
