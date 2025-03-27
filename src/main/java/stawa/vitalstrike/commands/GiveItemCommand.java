package stawa.vitalstrike.commands;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;

import stawa.vitalstrike.Errors.ConfigurationException;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.items.CustomItems;

/**
 * A command executor that handles the giving of Vital Awakening items to
 * players.
 * This command allows players with appropriate permissions to receive Vital
 * Awakening items,
 * which can be used for self-revival when knocked down.
 */
public class GiveItemCommand implements CommandExecutor {
    private final CustomItems customItems;
    private final VitalStrike plugin;

    /**
     * Creates a new GiveItemCommand instance.
     *
     * @param plugin The VitalStrike plugin instance
     * @throws IllegalStateException if CustomItems initialization fails
     */
    public GiveItemCommand(VitalStrike plugin) {
        this.plugin = plugin;
        try {
            this.customItems = new CustomItems(plugin);
        } catch (ConfigurationException e) {
            String errorMsg = "Failed to initialize CustomItems for command handler: " + e.getMessage();
            plugin.getLogger().severe(errorMsg);
            throw new IllegalStateException(errorMsg, e);
        }
    }

    /**
     * Executes the give command, providing Vital Awakening items to players.
     * Usage: /givevital [amount]
     *
     * @param sender  The command sender (must be a player)
     * @param command The command being executed
     * @param label   The command label used
     * @param args    Command arguments, optional [amount] between 1-64
     * @return true if the command was successful, false otherwise
     */
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage("§cThis command can only be used by players!");
            return false;
        }

        if (!player.hasPermission("vitalstrike.give")) {
            player.sendMessage("§cYou don't have permission to use this command!");
            return false;
        }

        int amount = 1;
        if (args.length > 0) {
            try {
                amount = Integer.parseInt(args[0]);
                if (amount < 1) {
                    player.sendMessage("§cAmount must be at least 1!");
                    return false;
                }
                if (amount > 64) {
                    player.sendMessage("§cMaximum amount is 64!");
                    return false;
                }
            } catch (NumberFormatException e) {
                player.sendMessage("§cInvalid amount! Please use a number between 1 and 64.");
                return false;
            }
        }

        try {
            ItemStack stack = customItems.createVitalAwakening();
            stack.setAmount(amount);
            player.getInventory().addItem(stack);
            player.sendMessage("§aYou received " + amount + " Vital Awakening item(s)!");
            return true;
        } catch (ConfigurationException e) {
            String errorMsg = "Failed to create Vital Awakening item: Configuration error";
            plugin.getLogger().severe(errorMsg + ": " + e.getMessage());
            player.sendMessage("§c" + errorMsg);
            return false;
        } catch (IllegalArgumentException e) {
            String errorMsg = "Failed to create Vital Awakening item: Invalid configuration";
            plugin.getLogger().severe(errorMsg + ": " + e.getMessage());
            player.sendMessage("§c" + errorMsg);
            return false;
        }
    }
}