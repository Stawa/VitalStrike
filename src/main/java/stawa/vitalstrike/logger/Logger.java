package stawa.vitalstrike.logger;

/**
 * Interface for VitalStrike's logging system.
 * Provides methods for different logging levels with support for parameterized
 * messages.
 */
public interface Logger {
    /**
     * Logs an informational message.
     *
     * @param message The message to log
     * @param args    Optional arguments to format into the message using {}
     *                placeholders
     */
    void info(String message, Object... args);

    /**
     * Logs a warning message.
     *
     * @param message The warning message to log
     * @param args    Optional arguments to format into the message using {}
     *                placeholders
     */
    void warning(String message, Object... args);

    /**
     * Logs a severe error message.
     *
     * @param message The error message to log
     * @param args    Optional arguments to format into the message using {}
     *                placeholders
     */
    void severe(String message, Object... args);

    /**
     * Logs a debug message when debug mode is enabled.
     *
     * @param message The debug message to log
     * @param args    Optional arguments to format into the message using {}
     *                placeholders
     */
    void debug(String message, Object... args);
}