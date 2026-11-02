package stawa.vitalstrike.web;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.bukkit.Material;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;

/**
 * The two settings that are lists or maps rather than single values, so the web editor gets them as
 * structured data: reward {@code tiers} and per-world {@code worlds}. Everything coming back from
 * the web is checked field by field before it can reach the config.
 */
final class StructuredSettings {
  static final String TIERS = "rewards.tiers";
  static final String WORLDS = "world-settings.worlds";

  private static final int MAX_TIERS = 50;
  private static final int MAX_ITEMS = 36;
  private static final int MAX_WORLDS = 100;
  private static final double MAX_DAMAGE = 1e12;
  private static final Pattern WORLD_NAME = Pattern.compile("[A-Za-z0-9_\\-]{1,64}");
  private static final Pattern MATERIAL = Pattern.compile("[A-Za-z0-9_:]{1,64}");

  private StructuredSettings() {}

  /** "tiers" or "worlds" if the path is one of the structured settings, otherwise null. */
  static String typeOf(String path) {
    if (path.equals(TIERS)) {
      return "tiers";
    }
    return path.equals(WORLDS) ? "worlds" : null;
  }

  /** True for the individual keys inside {@code worlds}, which are edited as a whole instead. */
  static boolean isInside(String path) {
    return path.startsWith(WORLDS + ".");
  }

  /** The current value as plain maps and lists, ready to send to the editor. */
  static Object read(FileConfiguration config, String type) {
    return type.equals("tiers") ? readTiers(config) : readWorlds(config);
  }

  private static List<Map<String, Object>> readTiers(FileConfiguration config) {
    List<Map<String, Object>> tiers = new ArrayList<>();
    for (Map<?, ?> raw : config.getMapList(TIERS)) {
      List<Map<String, Object>> items = new ArrayList<>();
      if (raw.get("items") instanceof List<?> list) {
        for (Object entry : list) {
          if (entry instanceof Map<?, ?> item) {
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("material", String.valueOf(item.get("material")));
            out.put("amount", number(item.get("amount"), 1).intValue());
            items.add(out);
          }
        }
      }
      Map<String, Object> tier = new LinkedHashMap<>();
      tier.put("damage", number(raw.get("damage"), 0).doubleValue());
      tier.put("xp", number(raw.get("xp"), 0).intValue());
      tier.put("items", items);
      tiers.add(tier);
    }
    return tiers;
  }

  private static Map<String, Map<String, Object>> readWorlds(FileConfiguration config) {
    Map<String, Map<String, Object>> worlds = new LinkedHashMap<>();
    ConfigurationSection section = config.getConfigurationSection(WORLDS);
    if (section != null) {
      for (String name : section.getKeys(false)) {
        Map<String, Object> world = new LinkedHashMap<>();
        world.put("enabled", section.getBoolean(name + ".enabled", true));
        world.put("damage-multiplier", section.getDouble(name + ".damage-multiplier", 1.0));
        worlds.put(name, world);
      }
    }
    return worlds;
  }

  /** Validates incoming JSON and converts it to config values, or returns null if invalid. */
  static Object parse(String type, JsonElement incoming) {
    return type.equals("tiers") ? parseTiers(incoming) : parseWorlds(incoming);
  }

  private static List<Map<String, Object>> parseTiers(JsonElement incoming) {
    if (!incoming.isJsonArray() || ((JsonArray) incoming).size() > MAX_TIERS) {
      return null;
    }
    List<Map<String, Object>> tiers = new ArrayList<>();
    for (JsonElement element : incoming.getAsJsonArray()) {
      if (!element.isJsonObject()) {
        return null;
      }
      JsonObject raw = element.getAsJsonObject();
      Double damage = decimal(raw.get("damage"), 0, MAX_DAMAGE);
      Integer xp = whole(raw.get("xp"), 0, 1_000_000);
      if (damage == null || xp == null || !(raw.get("items") instanceof JsonArray list)) {
        return null;
      }
      if (list.size() > MAX_ITEMS) {
        return null;
      }
      List<Map<String, Object>> items = new ArrayList<>();
      for (JsonElement itemElement : list) {
        if (!itemElement.isJsonObject()) {
          return null;
        }
        JsonObject item = itemElement.getAsJsonObject();
        Integer amount = whole(item.get("amount"), 1, 64);
        String material = text(item.get("material"), MATERIAL);
        Material resolved = material == null ? null : Material.matchMaterial(material);
        if (amount == null || resolved == null || resolved.isAir() || !resolved.isItem()) {
          return null;
        }
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("material", resolved.name());
        out.put("amount", amount);
        items.add(out);
      }
      Map<String, Object> tier = new LinkedHashMap<>();
      tier.put("damage", damage);
      tier.put("xp", xp);
      tier.put("items", items);
      tiers.add(tier);
    }
    return tiers;
  }

  private static Map<String, Map<String, Object>> parseWorlds(JsonElement incoming) {
    if (!incoming.isJsonObject() || incoming.getAsJsonObject().size() > MAX_WORLDS) {
      return null;
    }
    Map<String, Map<String, Object>> worlds = new LinkedHashMap<>();
    for (var entry : incoming.getAsJsonObject().entrySet()) {
      if (!WORLD_NAME.matcher(entry.getKey()).matches() || !entry.getValue().isJsonObject()) {
        return null;
      }
      JsonObject raw = entry.getValue().getAsJsonObject();
      Double multiplier = decimal(raw.get("damage-multiplier"), 0, 100);
      if (multiplier == null
          || !(raw.get("enabled") instanceof JsonPrimitive flag)
          || !flag.isBoolean()) {
        return null;
      }
      Map<String, Object> world = new LinkedHashMap<>();
      world.put("enabled", flag.getAsBoolean());
      world.put("damage-multiplier", multiplier);
      worlds.put(entry.getKey(), world);
    }
    return worlds;
  }

  /** Replaces the whole structured setting with a value that {@link #parse} accepted. */
  static void write(FileConfiguration config, String type, Object parsed) {
    if (type.equals("tiers")) {
      config.set(TIERS, parsed);
    } else {
      config.set(WORLDS, null);
      @SuppressWarnings("unchecked")
      Map<String, Object> worlds = (Map<String, Object>) (Map<?, ?>) parsed;
      config.createSection(WORLDS, worlds);
    }
  }

  private static Number number(Object value, Number fallback) {
    return value instanceof Number n ? n : fallback;
  }

  private static Double decimal(JsonElement element, double min, double max) {
    if (!(element instanceof JsonPrimitive p) || !p.isNumber()) {
      return null;
    }
    double d = p.getAsDouble();
    return Double.isFinite(d) && d >= min && d <= max ? d : null;
  }

  private static Integer whole(JsonElement element, int min, int max) {
    Double d = decimal(element, min, max);
    return d != null && d == Math.rint(d) ? (Integer) d.intValue() : null;
  }

  private static String text(JsonElement element, Pattern pattern) {
    if (!(element instanceof JsonPrimitive p) || !p.isString()) {
      return null;
    }
    String s = p.getAsString().strip();
    return pattern.matcher(s).matches() ? s : null;
  }
}
