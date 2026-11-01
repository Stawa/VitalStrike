package stawa.vitalstrike.items;

import java.util.List;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.Material;
import org.bukkit.NamespacedKey;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.ShapedRecipe;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.persistence.PersistentDataType;
import stawa.vitalstrike.Lookup;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** The Vital Awakening item: a tagged totem that revives its holder when downed. */
public final class CustomItems {
  private final VitalStrike plugin;
  private final NamespacedKey tag;
  private NamespacedKey model;

  public CustomItems(VitalStrike plugin) {
    this.plugin = plugin;
    this.tag = new NamespacedKey(plugin, "vital_awakening");
  }

  /** Re-reads the item model and re-registers the crafting recipe. */
  public void reload(FileConfiguration config) {
    model = Lookup.key(config.getString("knockdown-system.vital-awakening.item-model"));

    plugin.getServer().removeRecipe(tag);
    ShapedRecipe recipe = new ShapedRecipe(tag, createVitalAwakening());
    recipe.shape("GHG", "HTH", "GHG");
    recipe.setIngredient('G', Material.GOLD_INGOT);
    recipe.setIngredient('H', Material.GLISTERING_MELON_SLICE);
    recipe.setIngredient('T', Material.TOTEM_OF_UNDYING);
    plugin.getServer().addRecipe(recipe);
  }

  public void unregister() {
    plugin.getServer().removeRecipe(tag);
  }

  public ItemStack createVitalAwakening() {
    ItemStack item = new ItemStack(Material.TOTEM_OF_UNDYING);
    ItemMeta meta = item.getItemMeta();
    meta.displayName(plain("<gradient:#FF0000:#FFD700><bold>Vital Awakening</bold></gradient>"));
    meta.lore(
        List.of(
            plain("<gray>A mystical item infused with vital energy"),
            plain("<gray>that allows self-revival when downed."),
            Component.empty(),
            plain("<yellow>When Downed:"),
            plain("<green>➤ Right-click to self-revive")));
    meta.getPersistentDataContainer().set(tag, PersistentDataType.BYTE, (byte) 1);
    if (model != null) {
      meta.setItemModel(model);
    }
    item.setItemMeta(meta);
    return item;
  }

  public boolean isVitalAwakening(ItemStack item) {
    return item != null
        && item.getType() == Material.TOTEM_OF_UNDYING
        && item.hasItemMeta()
        && item.getItemMeta().getPersistentDataContainer().has(tag, PersistentDataType.BYTE);
  }

  private static Component plain(String miniMessage) {
    return Text.parse(miniMessage).decoration(TextDecoration.ITALIC, false);
  }
}
