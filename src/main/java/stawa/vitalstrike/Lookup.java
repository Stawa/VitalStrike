package stawa.vitalstrike;

import java.util.Locale;
import org.bukkit.NamespacedKey;
import org.bukkit.Particle;
import org.bukkit.Registry;
import org.bukkit.Sound;

/** Null-safe registry lookups for names typed into config.yml. Each returns null if unknown. */
public final class Lookup {
  private Lookup() {}

  public static NamespacedKey key(String name) {
    if (name == null || name.isBlank()) {
      return null;
    }
    return NamespacedKey.fromString(name.trim().toLowerCase(Locale.ROOT));
  }

  public static Sound sound(String name) {
    NamespacedKey key = key(name);
    return key == null ? null : Registry.SOUNDS.get(key);
  }

  public static Particle particle(String name) {
    NamespacedKey key = key(name);
    return key == null ? null : Registry.PARTICLE_TYPE.get(key);
  }
}
