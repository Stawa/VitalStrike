package stawa.vitalstrike.utils;

import com.google.gson.JsonParser;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/** Checks GitHub for a newer release and tells the console and permitted players about it. */
public final class UpdateChecker implements Listener {
  private static final URI LATEST =
      URI.create("https://api.github.com/repos/Stawa/VitalStrike/releases/latest");
  private static final String DOWNLOAD = "https://modrinth.com/plugin/vitalstrike";
  private static final Pattern VERSION = Pattern.compile("(\\d+(?:\\.\\d+)*)");

  private final VitalStrike plugin;
  private volatile String newerVersion;

  public UpdateChecker(VitalStrike plugin) {
    this.plugin = plugin;
  }

  public void check() {
    HttpRequest request =
        HttpRequest.newBuilder(LATEST)
            .header("Accept", "application/vnd.github+json")
            .header("User-Agent", "VitalStrike/" + plugin.getPluginMeta().getVersion())
            .timeout(Duration.ofSeconds(10))
            .build();
    HttpClient.newHttpClient()
        .sendAsync(request, HttpResponse.BodyHandlers.ofString())
        .thenAccept(this::handle)
        .exceptionally(
            e -> {
              plugin.getSLF4JLogger().warn("Update check failed: {}", e.getMessage());
              return null;
            });
  }

  private void handle(HttpResponse<String> response) {
    if (response.statusCode() != 200) {
      plugin.getSLF4JLogger().warn("Update check failed: HTTP {}", response.statusCode());
      return;
    }
    String latest =
        JsonParser.parseString(response.body()).getAsJsonObject().get("tag_name").getAsString();
    String current = plugin.getPluginMeta().getVersion();
    if (compare(latest, current) > 0) {
      newerVersion = latest;
      plugin
          .getSLF4JLogger()
          .info("Version {} is available (you run {}): {}", latest, current, DOWNLOAD);
    } else {
      plugin.getSLF4JLogger().info("VitalStrike is up to date ({}).", current);
    }
  }

  /**
   * Compares the numeric parts of two version strings; qualifiers such as -SNAPSHOT are ignored.
   */
  static int compare(String a, String b) {
    int[] x = numbers(a);
    int[] y = numbers(b);
    for (int i = 0; i < Math.max(x.length, y.length); i++) {
      int diff = Integer.compare(i < x.length ? x[i] : 0, i < y.length ? y[i] : 0);
      if (diff != 0) {
        return diff;
      }
    }
    return 0;
  }

  private static int[] numbers(String version) {
    Matcher m = VERSION.matcher(version);
    if (!m.find()) {
      return new int[0];
    }
    String[] parts = m.group(1).split("\\.");
    int[] result = new int[parts.length];
    for (int i = 0; i < parts.length; i++) {
      result[i] = Integer.parseInt(parts[i]);
    }
    return result;
  }

  @EventHandler
  public void onJoin(PlayerJoinEvent event) {
    Player player = event.getPlayer();
    if (newerVersion != null && player.hasPermission("vitalstrike.update-notify")) {
      player.sendMessage(
          Text.parse(
              "<gold>VitalStrike <yellow>"
                  + newerVersion
                  + "</yellow> is available: <click:open_url:"
                  + DOWNLOAD
                  + "><aqua>download</aqua></click>"));
    }
  }
}
