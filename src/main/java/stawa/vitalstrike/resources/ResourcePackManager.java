package stawa.vitalstrike.resources;

import java.io.InputStream;
import java.net.URI;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import net.kyori.adventure.resource.ResourcePackInfo;
import net.kyori.adventure.resource.ResourcePackRequest;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.PlayerResourcePackStatusEvent;
import stawa.vitalstrike.VitalStrike;
import stawa.vitalstrike.logger.VitalLogger;

/**
 * Manages the custom resource pack functionality for the VitalStrike plugin. Handles resource pack
 * initialization, distribution, and status monitoring.
 */
public class ResourcePackManager {
  private static final String RESOURCE_PACK_URL_TEMPLATE =
      "https://github.com/Stawa/VitalAwakening/raw/refs/heads/main/output/VitalAwakening_%s.zip";
  private final Set<UUID> packedPlayers = new HashSet<>();
  private final VitalLogger logger;
  private byte[] resourcePackHash;
  private String resourcePackUrl;

  /**
   * Constructs a new ResourcePackManager instance.
   *
   * @param plugin The VitalStrike plugin instance
   */
  public ResourcePackManager(VitalStrike plugin) {
    this.logger = new VitalLogger(plugin);
    this.resourcePackUrl =
        String.format(RESOURCE_PACK_URL_TEMPLATE, plugin.getPluginMeta().getVersion());
    initializeResourcePack();
  }

  /**
   * Initializes the resource pack by downloading and computing its SHA-1 hash. The hash is used for
   * verification when sending the pack to players.
   */
  private void initializeResourcePack() {
    try {
      logger.info("Initializing resource pack from URL: {}", resourcePackUrl);
      URI uri = URI.create(resourcePackUrl);
      try (InputStream is = uri.toURL().openStream()) {
        resourcePackHash = MessageDigest.getInstance("SHA-1").digest(is.readAllBytes());
        logger.info("Successfully initialized resource pack hash");
      }
    } catch (Exception e) {
      logger.severe("Failed to initialize resource pack: {}", e.getMessage());
    }
  }

  /**
   * Sends the resource pack to a specific player if they haven't received it yet. Includes
   * automatic reinitialization if the resource pack hash is not available.
   *
   * @param player The player to send the resource pack to
   */
  public void sendResourcePack(Player player) {
    UUID playerId = player.getUniqueId();

    if (packedPlayers.contains(playerId)) {
      player.sendMessage(
          MiniMessage.miniMessage()
              .deserialize("<yellow>You already have the resource pack loaded!"));
      return;
    }

    if (resourcePackHash == null) {
      logger.warning("Resource pack hash not initialized, attempting to reinitialize...");
      initializeResourcePack();
      if (resourcePackHash == null) {
        logger.severe("Failed to send resource pack to {}: Hash not available", player.getName());
        return;
      }
    }

    try {
      String base64Hash = Base64.getEncoder().encodeToString(resourcePackHash);

      ResourcePackInfo packInfo =
          ResourcePackInfo.resourcePackInfo()
              .hash(base64Hash)
              .uri(new URI(resourcePackUrl))
              .build();

      ResourcePackRequest request =
          ResourcePackRequest.resourcePackRequest().required(false).packs(packInfo).build();

      player.sendResourcePacks(request);
      packedPlayers.add(playerId);
      logger.info("Sent resource pack to player: {}", player.getName());
    } catch (Exception e) {
      logger.severe("Failed to send resource pack to {}: {}", player.getName(), e.getMessage());
    }
  }

  /**
   * Handles resource pack status change events from players. Monitors acceptance, decline,
   * successful loading, and download failures. Provides appropriate feedback and logging for each
   * status.
   *
   * @param event The resource pack status event
   */
  @EventHandler
  public void onResourcePackStatus(PlayerResourcePackStatusEvent event) {
    Player player = event.getPlayer();
    PlayerResourcePackStatusEvent.Status status = event.getStatus();

    switch (status) {
      case SUCCESSFULLY_LOADED:
        logger.info("Player {} successfully loaded the resource pack", player.getName());
        player.sendMessage(
            MiniMessage.miniMessage().deserialize("<green>Resource pack loaded successfully!"));
        break;
      case DECLINED:
        logger.info("Player {} declined the resource pack", player.getName());
        player.sendMessage(
            MiniMessage.miniMessage()
                .deserialize(
                    "<yellow>You can load the resource pack later using <white>/vs resourcepack</white>"));
        break;
      case FAILED_DOWNLOAD:
        logger.warning("Player {} failed to download the resource pack", player.getName());
        player.sendMessage(
            "§eNote: Failed to download resource pack. Some features may not display correctly.");
        player.sendMessage(
            "§eYou can download the resource pack manually at: §6https://github.com/Stawa/VitalAwakening");
        break;
      case ACCEPTED:
        logger.info("Player {} accepted the resource pack", player.getName());
        break;
      default:
        break;
    }
  }

  /**
   * Removes a player from the tracked set of players who have received the resource pack.
   *
   * @param playerId The UUID of the player to remove
   */
  public void removePlayer(UUID playerId) {
    packedPlayers.remove(playerId);
  }

  /**
   * Checks if a player has the resource pack loaded.
   *
   * @param playerId The UUID of the player to check, or null for general check
   * @return true if the player has the resource pack, false otherwise
   */
  public boolean hasResourcePack(UUID playerId) {
    return playerId != null && packedPlayers.contains(playerId);
  }
}
