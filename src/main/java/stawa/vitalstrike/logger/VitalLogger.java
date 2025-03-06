package stawa.vitalstrike.logger;

import org.bukkit.plugin.Plugin;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Custom logger implementation for VitalStrike plugin.
 * Provides formatted logging with support for parameterized messages and debug
 * mode.
 */
public class VitalLogger implements stawa.vitalstrike.logger.Logger {
    private final Logger bukkitLogger;
    private boolean debugMode;

    /**
     * Creates a new VitalLogger instance.
     *
     * @param plugin The plugin instance to associate with this logger
     */
    public VitalLogger(Plugin plugin) {
        this.bukkitLogger = plugin.getLogger();
        this.debugMode = false;
    }

    @Override
    public void info(String message, Object... args) {
        if (bukkitLogger.isLoggable(Level.INFO)) {
            log(Level.INFO, message, args);
        }
    }

    @Override
    public void warning(String message, Object... args) {
        if (bukkitLogger.isLoggable(Level.WARNING)) {
            log(Level.WARNING, message, args);
        }
    }

    @Override
    public void severe(String message, Object... args) {
        if (bukkitLogger.isLoggable(Level.SEVERE)) {
            log(Level.SEVERE, message, args);
        }
    }

    @Override
    public void debug(String message, Object... args) {
        if (debugMode && bukkitLogger.isLoggable(Level.INFO)) {
            log(Level.INFO, "[Debug] " + message, args);
        }
    }

    /**
     * Internal method to handle log message formatting and output.
     *
     * @param level   The logging level
     * @param message The message to log
     * @param args    Optional arguments for message formatting
     */
    private void log(Level level, String message, Object... args) {
        if (level == null || message == null) {
            return;
        }

        if (!bukkitLogger.isLoggable(level)) {
            return;
        }

        String formattedMessage = formatMessage(message, args);
        bukkitLogger.log(level, formattedMessage);
    }

    /**
     * Formats the message with the provided arguments.
     *
     * @param message The message template
     * @param args    The arguments to format into the message
     * @return The formatted message
     */
    private String formatMessage(String message, Object... args) {
        if (args == null || args.length == 0) {
            return message;
        }
        return String.format(message.replace("{}", "%s"), args);
    }

    /**
     * Enables or disables debug mode logging.
     *
     * @param enabled true to enable debug mode, false to disable
     */
    public void setDebugMode(boolean enabled) {
        this.debugMode = enabled;
    }

    /**
     * Checks if debug mode is enabled.
     *
     * @return true if debug mode is enabled, false otherwise
     */
    public boolean isDebugMode() {
        return debugMode;
    }
}