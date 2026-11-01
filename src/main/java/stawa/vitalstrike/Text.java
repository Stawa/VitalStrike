package stawa.vitalstrike;

import java.util.IllegalFormatException;
import java.util.Locale;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;

/** Parses user-configurable text, which may be MiniMessage or legacy {@code &} codes. */
public final class Text {
  private static final MiniMessage MINI = MiniMessage.miniMessage();
  private static final LegacyComponentSerializer LEGACY =
      LegacyComponentSerializer.legacyAmpersand();

  private Text() {}

  public static Component parse(String text) {
    if (text.indexOf('&') >= 0 && text.indexOf('<') < 0) {
      return LEGACY.deserialize(text);
    }
    return MINI.deserialize(text);
  }

  /** Applies {@link String#format}, returning the raw template if the admin's format is invalid. */
  public static String format(String template, Object... args) {
    try {
      return String.format(Locale.ROOT, template, args);
    } catch (IllegalFormatException e) {
      return template;
    }
  }
}
