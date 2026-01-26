package stawa.vitalstrike.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.logging.Logger;
import org.bukkit.plugin.java.JavaPlugin;
import stawa.vitalstrike.Errors;

/** Checks for updates to the VitalStrike plugin by querying the GitHub API. */
public class UpdateChecker {

  private final JavaPlugin plugin;
  private final Logger logger;

  /**
   * Creates a new UpdateChecker instance.
   *
   * @param plugin The plugin instance
   * @param logger The logger to use for reporting update status
   */
  public UpdateChecker(JavaPlugin plugin, Logger logger) {
    this.plugin = plugin;
    this.logger = logger;
  }

  /** Asynchronously checks for updates and logs the result. */
  public void checkForUpdates() {
    plugin
        .getServer()
        .getScheduler()
        .runTaskAsynchronously(
            plugin,
            () -> {
              try {
                String jsonResponse = fetchLatestReleaseData();
                processVersionInfo(jsonResponse);
              } catch (Errors.UpdateException e) {
                logger.warning(e.getMessage());
              } catch (Exception e) {
                logger.warning("Failed to check for updates: " + e.getMessage());
                Errors.UpdateException updateException =
                    new Errors.UpdateException("Failed to check for updates", e);
                logger.warning("Error code: " + updateException.getErrorCode().getCode());
              }
            });
  }

  private String fetchLatestReleaseData() throws Errors.UpdateException {
    try {
      URI uri = URI.create("https://api.github.com/repos/Stawa/VitalStrike/releases/latest");
      HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();
      connection.setRequestMethod("GET");
      connection.setRequestProperty("Accept", "application/vnd.github.v3+json");

      if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
        throw new Errors.UpdateException(
            "Failed to connect to GitHub API: HTTP " + connection.getResponseCode());
      }

      return readResponseFromConnection(connection);
    } catch (IOException e) {
      throw new Errors.UpdateException("Failed to connect to GitHub API", e);
    }
  }

  private String readResponseFromConnection(HttpURLConnection connection) throws IOException {
    try (BufferedReader reader =
        new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
      StringBuilder response = new StringBuilder();
      String line;

      while ((line = reader.readLine()) != null) {
        response.append(line);
      }

      return response.toString();
    }
  }

  private void processVersionInfo(String jsonResponse) throws Errors.UpdateException {
    String latestVersion;
    if (!jsonResponse.contains("\"tag_name\":")) {
      throw new Errors.UpdateException(
          "Failed to parse version information from GitHub API response");
    }

    latestVersion = jsonResponse.split("\"tag_name\":\"")[1].split("\"")[0];
    String currentVersion = plugin.getPluginMeta().getVersion();

    logVersionInfo(currentVersion, latestVersion);
  }

  private void logVersionInfo(String currentVersion, String latestVersion) {
    if (!currentVersion.equals(latestVersion)) {
      String newVersionMessage = String.format("New version available: %s", latestVersion);
      String currentVersionMessage = String.format("You are running version: %s", currentVersion);
      String downloadMessage =
          String.format(
              "Download the latest version from: %s", "https://modrinth.com/plugin/vitalstrike");
      logger.info(newVersionMessage);
      logger.info(currentVersionMessage);
      logger.info(downloadMessage);
    } else {
      String latestVersionMessage =
          String.format("You are running the latest version: %s", latestVersion);
      logger.info(latestVersionMessage);
    }
  }
}
