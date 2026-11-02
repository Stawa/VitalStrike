package stawa.vitalstrike.items;

import java.util.ArrayList;
import java.util.List;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.Material;
import org.bukkit.NamespacedKey;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityPickupItemEvent;
import org.bukkit.event.inventory.InventoryOpenEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.ShapedRecipe;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.persistence.PersistentDataType;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** The Vital Awakening item: a tagged totem that revives its holder when downed. */
public final class CustomItems implements Listener {
  private final VitalStrike plugin;
  private final NamespacedKey tag;
  private static final NamespacedKey LEGACY_MODEL = new NamespacedKey("template", "vs");
  private String modelData = "";

  public CustomItems(VitalStrike plugin) {
    this.plugin = plugin;
    this.tag = new NamespacedKey(plugin, "vital_awakening");
  }

  /** Re-reads the custom model data string and re-registers the crafting recipe. */
  public void reload(FileConfiguration config) {
    // No explicit default: a config saved by an older version lacks this key, and the bundled
    // default must apply. An explicit "" in the config still disables tagging.
    String configured = config.getString("knockdown-system.vital-awakening.custom-model-data");
    modelData = configured == null ? "" : configured.trim();

    plugin.getServer().getOnlinePlayers().forEach(this::upgradePlayer);

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
    if (!modelData.isEmpty()) {
      // Players without the resource pack see a plain totem: the pack, not the item, picks the
      // model.
      var data = meta.getCustomModelDataComponent();
      data.setStrings(List.of(modelData));
      meta.setCustomModelDataComponent(data);
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

  /**
   * Migrates a Vital Awakening from older versions: drops the legacy {@code template:vs} item model
   * (a missing-model cube without the pack) and adds the custom model data the pack matches on.
   */
  public boolean upgrade(ItemStack item) {
    if (modelData.isEmpty() || !isVitalAwakening(item)) {
      return false;
    }
    ItemMeta meta = item.getItemMeta();
    var data = meta.getCustomModelDataComponent();
    boolean tagged = data.getStrings().contains(modelData);
    boolean legacy = meta.hasItemModel() && LEGACY_MODEL.equals(meta.getItemModel());
    if (tagged && !legacy) {
      return false;
    }
    if (legacy) {
      meta.setItemModel(null);
    }
    if (!tagged) {
      List<String> strings = new ArrayList<>(data.getStrings());
      strings.add(modelData);
      data.setStrings(strings);
      meta.setCustomModelDataComponent(data);
    }
    item.setItemMeta(meta);
    return true;
  }

  private boolean upgradeAll(Inventory inventory) {
    boolean changed = false;
    for (ItemStack item : inventory.getContents()) {
      changed |= upgrade(item);
    }
    return changed;
  }

  private void upgradePlayer(Player player) {
    if (upgradeAll(player.getInventory())) {
      player.updateInventory();
    }
  }

  @EventHandler
  public void onJoin(PlayerJoinEvent event) {
    upgradePlayer(event.getPlayer());
  }

  @EventHandler
  public void onOpen(InventoryOpenEvent event) {
    upgradeAll(event.getInventory());
    if (event.getPlayer() instanceof Player player) {
      upgradePlayer(player);
    }
  }

  @EventHandler
  public void onPickup(EntityPickupItemEvent event) {
    if (event.getEntity() instanceof Player) {
      ItemStack stack = event.getItem().getItemStack();
      if (upgrade(stack)) {
        event.getItem().setItemStack(stack);
      }
    }
  }

  private static Component plain(String miniMessage) {
    return Text.parse(miniMessage).decoration(TextDecoration.ITALIC, false);
  }
}
