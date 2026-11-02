package stawa.vitalstrike.web;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Consumer;
import java.util.regex.Pattern;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.Configuration;
import org.bukkit.configuration.file.FileConfiguration;
import stawa.vitalstrike.Text;
import stawa.vitalstrike.VitalStrike;

/**
 * Edit the config from a web page. {@code /vs config} uploads the current settings to a relay and
 * returns a code; the web editor changes values; {@code /vs config apply <code>} downloads only the
 * changed keys, checks each against the setting it replaces, and applies them.
 *
 * <p>Only existing, plain settings can change, and each must keep its type, so a code leaking
 * cannot add keys or alter anything but values the config already has.
 */
public final class WebEditor {
  private static final Gson GSON = new Gson();
  private static final Pattern CODE = Pattern.compile("[A-Z2-9]{10}");
  private static final String EXCLUDED_PREFIX = "web-editor";
  private static final int MAX_CHANGES = 1000;

  private final VitalStrike plugin;
  private final HttpClient http =
      HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

  public WebEditor(VitalStrike plugin) {
    this.plugin = plugin;
  }

  /** Uploads the settings and tells the sender where to edit them. */
  public void start(CommandSender sender) {
    String api = api();
    if (api.isEmpty()) {
      sender.sendMessage(Text.parse("<red>The web editor is not configured (web-editor.api)."));
      return;
    }
    JsonObject body = new JsonObject();
    body.add("entries", GSON.toJsonTree(collect(plugin.getConfig()).values()));
    sender.sendMessage(Text.parse("<gray>Creating a web editor session..."));
    request(
        sender,
        HttpRequest.newBuilder(URI.create(api + "/sessions"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body.toString())),
        response -> {
          String code = parse(response.body()).get("code").getAsString();
          if (!CODE.matcher(code).matches()) {
            throw new IllegalStateException("relay returned an invalid code");
          }
          String url = editorUrl() + "?code=" + URLEncoder.encode(code, StandardCharsets.UTF_8);
          sender.sendMessage(
              Text.parse(
                  "<green>Web editor ready. <click:open_url:'"
                      + url
                      + "'><aqua><underlined>Click to open</underlined></aqua></click>"));
          sender.sendMessage(
              Text.parse(
                  "<gray>When you have saved there, run <click:suggest_command:'/vs config apply "
                      + code
                      + "'><white>/vs config apply "
                      + code
                      + "</white></click> <gray>(valid for one hour)."));
        });
  }

  /** Downloads the changes saved for {@code code} and applies the ones that are valid. */
  public void apply(CommandSender sender, String rawCode) {
    String code = rawCode.toUpperCase(Locale.ROOT);
    if (!CODE.matcher(code).matches()) {
      sender.sendMessage(Text.parse("<red>That is not a valid editor code."));
      return;
    }
    String api = api();
    if (api.isEmpty()) {
      sender.sendMessage(Text.parse("<red>The web editor is not configured (web-editor.api)."));
      return;
    }
    request(
        sender,
        HttpRequest.newBuilder(URI.create(api + "/sessions/" + code + "/result")).GET(),
        response -> {
          if (response.statusCode() == 404) {
            sender.sendMessage(
                Text.parse("<red>No saved changes for that code (expired, or not saved yet)."));
            return;
          }
          JsonObject changes = parse(response.body()).getAsJsonObject("changes");
          if (changes == null || changes.size() == 0) {
            sender.sendMessage(Text.parse("<yellow>Nothing was changed in the editor."));
            return;
          }
          applyChanges(sender, code, changes);
        });
  }

  private void applyChanges(CommandSender sender, String code, JsonObject changes) {
    if (changes.size() > MAX_CHANGES) {
      sender.sendMessage(Text.parse("<red>Too many changes in one session."));
      return;
    }
    FileConfiguration config = plugin.getConfig();
    Map<String, Map<String, Object>> allowed = collect(config);
    Map<String, Object> accepted = new LinkedHashMap<>();
    List<String> rejected = new ArrayList<>();
    for (var change : changes.entrySet()) {
      Map<String, Object> entry = allowed.get(change.getKey());
      String structured = StructuredSettings.typeOf(change.getKey());
      Object value;
      if (entry == null) {
        value = null;
      } else if (structured != null) {
        value = StructuredSettings.parse(structured, change.getValue());
      } else {
        value = coerce(entry.get("value"), change.getValue());
      }
      if (value == null) {
        rejected.add(change.getKey());
      } else if (structured != null || !value.equals(entry.get("value"))) {
        accepted.put(change.getKey(), value);
      }
    }
    if (!accepted.isEmpty()) {
      try {
        Path file = plugin.getDataFolder().toPath().resolve("config.yml");
        if (Files.exists(file)) {
          Files.copy(
              file, file.resolveSibling("config.yml.bak"), StandardCopyOption.REPLACE_EXISTING);
        }
        accepted.forEach(
            (path, value) -> {
              String structured = StructuredSettings.typeOf(path);
              if (structured != null) {
                StructuredSettings.write(config, structured, value);
              } else {
                config.set(path, value);
              }
            });
        plugin.saveConfig();
        plugin.reload();
      } catch (IOException | RuntimeException e) {
        plugin.getSLF4JLogger().error("Could not apply web editor changes", e);
        sender.sendMessage(Text.parse("<red>Could not apply the changes, see the console."));
        return;
      }
      plugin
          .getSLF4JLogger()
          .info(
              "{} applied {} config change(s) from the web editor",
              sender.getName(),
              accepted.size());
    }
    sender.sendMessage(
        Text.parse(
            "<green>Applied "
                + accepted.size()
                + " change(s)."
                + (accepted.isEmpty() ? "" : " <gray>Previous file saved as config.yml.bak.")));
    if (!rejected.isEmpty()) {
      sender.sendMessage(
          Text.parse(
              "<yellow>Ignored "
                  + rejected.size()
                  + " invalid change(s): <white>"
                  + String.join(", ", rejected.stream().limit(5).toList())
                  + (rejected.size() > 5 ? ", ..." : "")));
    }
    delete(api() + "/sessions/" + code);
  }

  /** Every editable setting as path to {path, type, value, comment}. */
  private static Map<String, Map<String, Object>> collect(FileConfiguration config) {
    Configuration defaults = config.getDefaults();
    java.util.Set<String> paths = new java.util.LinkedHashSet<>(config.getKeys(true));
    if (defaults != null) {
      paths.addAll(defaults.getKeys(true));
    }
    paths.add(StructuredSettings.TIERS);
    paths.add(StructuredSettings.WORLDS);
    Map<String, Map<String, Object>> entries = new LinkedHashMap<>();
    for (String path : paths) {
      if (path.equals(EXCLUDED_PREFIX)
          || path.startsWith(EXCLUDED_PREFIX + ".")
          || StructuredSettings.isInside(path)) {
        continue;
      }
      String type = StructuredSettings.typeOf(path);
      Object value = type == null ? config.get(path) : StructuredSettings.read(config, type);
      if (type == null) {
        type = typeOf(value);
      }
      if (type == null) {
        continue;
      }
      List<String> comments = config.getComments(path);
      if ((comments == null || comments.isEmpty()) && defaults != null) {
        comments = defaults.getComments(path);
      }
      Map<String, Object> entry = new LinkedHashMap<>();
      entry.put("path", path);
      entry.put("type", type);
      entry.put("value", value);
      entry.put("comment", join(comments));
      entries.put(path, entry);
    }
    return entries;
  }

  private static String join(List<String> comments) {
    if (comments == null) {
      return "";
    }
    return comments.stream()
        .filter(c -> c != null)
        .map(String::strip)
        .reduce((a, b) -> a + "\n" + b)
        .orElse("")
        .strip();
  }

  private static String typeOf(Object value) {
    if (value instanceof Boolean) {
      return "boolean";
    } else if (value instanceof Integer || value instanceof Long) {
      return "integer";
    } else if (value instanceof Number) {
      return "number";
    } else if (value instanceof String) {
      return "string";
    } else if (value instanceof List<?> list && list.stream().allMatch(WebEditor::scalar)) {
      return "list";
    }
    return null;
  }

  private static boolean scalar(Object o) {
    return o instanceof String || o instanceof Number || o instanceof Boolean;
  }

  /** The new value converted to the type of {@code current}, or null if it does not fit. */
  private static Object coerce(Object current, JsonElement incoming) {
    if (current instanceof List<?>) {
      if (!incoming.isJsonArray()) {
        return null;
      }
      List<Object> list = new ArrayList<>();
      for (JsonElement item : (JsonArray) incoming) {
        Object value = item.isJsonPrimitive() ? primitive(item.getAsJsonPrimitive()) : null;
        if (value == null) {
          return null;
        }
        list.add(value);
      }
      return list;
    }
    if (!incoming.isJsonPrimitive()) {
      return null;
    }
    JsonPrimitive p = incoming.getAsJsonPrimitive();
    if (current instanceof Boolean) {
      return p.isBoolean() ? (Object) p.getAsBoolean() : null;
    } else if (current instanceof Integer || current instanceof Long) {
      if (!p.isNumber() || p.getAsDouble() != Math.rint(p.getAsDouble())) {
        return null;
      }
      long whole = p.getAsLong();
      return whole >= Integer.MIN_VALUE && whole <= Integer.MAX_VALUE
          ? (Object) (int) whole
          : whole;
    } else if (current instanceof Number) {
      return p.isNumber() ? (Object) p.getAsDouble() : null;
    } else if (current instanceof String) {
      return p.isString() ? p.getAsString() : null;
    }
    return null;
  }

  private static Object primitive(JsonPrimitive p) {
    if (p.isBoolean()) {
      return p.getAsBoolean();
    } else if (p.isNumber()) {
      double d = p.getAsDouble();
      return d == Math.rint(d) && Math.abs(d) < Integer.MAX_VALUE ? (Object) (int) d : d;
    }
    return p.getAsString();
  }

  private void request(
      CommandSender sender, HttpRequest.Builder builder, Consumer<HttpResponse<String>> onSuccess) {
    http.sendAsync(
            builder.timeout(Duration.ofSeconds(15)).build(),
            HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8))
        .whenComplete(
            (response, error) ->
                plugin
                    .getServer()
                    .getScheduler()
                    .runTask(
                        plugin,
                        () -> {
                          try {
                            if (error != null) {
                              throw new IOException(error.getMessage(), error);
                            }
                            int status = response.statusCode();
                            if (status != 404 && (status < 200 || status >= 300)) {
                              throw new IOException("relay answered HTTP " + status);
                            }
                            onSuccess.accept(response);
                          } catch (IOException | RuntimeException e) {
                            plugin
                                .getSLF4JLogger()
                                .warn("Web editor request failed: {}", e.getMessage());
                            sender.sendMessage(
                                Text.parse("<red>Could not reach the web editor service."));
                          }
                        }));
  }

  private void delete(String url) {
    http.sendAsync(
        HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(10)).DELETE().build(),
        HttpResponse.BodyHandlers.discarding());
  }

  private static JsonObject parse(String json) {
    return JsonParser.parseString(json).getAsJsonObject();
  }

  private String api() {
    String api = plugin.getConfig().getString("web-editor.api");
    return api == null ? "" : api.strip().replaceAll("/+$", "");
  }

  private String editorUrl() {
    String url = plugin.getConfig().getString("web-editor.url");
    return url == null ? "" : url.strip();
  }
}
