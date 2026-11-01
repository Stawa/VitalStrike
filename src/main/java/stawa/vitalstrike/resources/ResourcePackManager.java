package stawa.vitalstrike.resources;

import java.net.URI;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import net.kyori.adventure.resource.ResourcePackInfo;
import net.kyori.adventure.resource.ResourcePackRequest;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.event.player.PlayerResourcePackStatusEvent;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/**
 * Offers the optional VitalAwakening resource pack. The pack's SHA-1 is computed off the main
 * thread the first time it is needed.
 */
public final class ResourcePackManager implements Listener {
  private final VitalStrike plugin;
  private final Set<UUID> loaded = new HashSet<>();
  private String url = "";
  private CompletableFuture<ResourcePackInfo> pack;

  public ResourcePackManager(VitalStrike plugin) {
    this.plugin = plugin;
  }

  public void reload() {
    String configured = plugin.getConfig().getString("resource-pack.url", "");
    if (!configured.equals(url)) {
      url = configured;
      pack = null;
    }
  }

  private CompletableFuture<ResourcePackInfo> pack() {
    if (pack == null || pack.isCompletedExceptionally()) {
      pack =
          ResourcePackInfo.resourcePackInfo()
              .id(UUID.nameUUIDFromBytes(url.getBytes()))
              .uri(URI.create(url))
              .computeHashAndBuild();
    }
    return pack;
  }

  public void send(Player player) {
    if (url.isBlank()) {
      player.sendMessage(Text.parse("<red>No resource pack is configured on this server."));
      return;
    }
    if (loaded.contains(player.getUniqueId())) {
      player.sendMessage(Text.parse("<yellow>You already have the resource pack loaded!"));
      return;
    }
    pack()
        .whenComplete(
            (info, error) ->
                plugin
                    .getServer()
                    .getScheduler()
                    .runTask(
                        plugin,
                        () -> {
                          if (!player.isOnline()) {
                            return;
                          }
                          if (error != null) {
                            plugin
                                .getSLF4JLogger()
                                .warn("Could not prepare resource pack: {}", error.getMessage());
                            player.sendMessage(
                                Text.parse("<red>The resource pack is unavailable right now."));
                            return;
                          }
                          player.sendResourcePacks(
                              ResourcePackRequest.resourcePackRequest()
                                  .packs(info)
                                  .required(false)
                                  .build());
                        }));
  }

  @EventHandler
  public void onJoin(PlayerJoinEvent event) {
    Player player = event.getPlayer();
    var config = plugin.getConfig();
    if (config.getBoolean("resource-pack.auto-send")) {
      send(player);
    } else if (config.getBoolean("resource-pack.hint.enabled")) {
      player.sendMessage(Text.parse(config.getString("resource-pack.hint.message", "")));
    }
  }

  @EventHandler
  public void onQuit(PlayerQuitEvent event) {
    loaded.remove(event.getPlayer().getUniqueId());
  }

  @EventHandler
  public void onStatus(PlayerResourcePackStatusEvent event) {
    if (pack == null || !pack.isDone() || pack.isCompletedExceptionally()) {
      return;
    }
    if (!event.getID().equals(pack.join().id())) {
      return;
    }
    Player player = event.getPlayer();
    switch (event.getStatus()) {
      case SUCCESSFULLY_LOADED -> {
        loaded.add(player.getUniqueId());
        player.sendMessage(Text.parse("<green>Resource pack loaded successfully!"));
      }
      case DECLINED ->
          player.sendMessage(
              Text.parse(
                  "<yellow>You can load the resource pack later with <white>/vs resourcepack</white>"));
      case FAILED_DOWNLOAD, INVALID_URL, FAILED_RELOAD, DISCARDED ->
          player.sendMessage(
              Text.parse(
                  "<yellow>The resource pack could not be loaded; some items may look wrong."));
      default -> {}
    }
  }
}
