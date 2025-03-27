package stawa.vitalstrike;

/**
 * Centralized error handling for VitalStrike plugin
 * Provides a hierarchy of custom exceptions for different types of errors
 */
public class Errors {

    private Errors() {
        // Private constructor to prevent instantiation
    }

    /**
     * Base exception for all VitalStrike errors
     */
    public static class VitalStrikeException extends Exception {
        /**
         * The error code indicating the type of error that occurred.
         */
        private final ErrorCode errorCode;

        /**
         * Creates a new VitalStrikeException with the specified message
         * 
         * @param message the error message
         */
        public VitalStrikeException(String message) {
            this(message, ErrorCode.UNKNOWN);
        }

        /**
         * Creates a new VitalStrikeException with the specified message and error code
         * 
         * @param message   the error message
         * @param errorCode the error code
         */
        public VitalStrikeException(String message, ErrorCode errorCode) {
            super(message);
            this.errorCode = errorCode;
        }

        /**
         * Creates a new VitalStrikeException with the specified message and cause
         * 
         * @param message the error message
         * @param cause   the cause of the error
         */
        public VitalStrikeException(String message, Throwable cause) {
            this(message, cause, ErrorCode.UNKNOWN);
        }

        /**
         * Creates a new VitalStrikeException with the specified message, cause, and
         * error code
         * 
         * @param message   the error message
         * @param cause     the cause of the error
         * @param errorCode the error code
         */
        public VitalStrikeException(String message, Throwable cause, ErrorCode errorCode) {
            super(message, cause);
            this.errorCode = errorCode;
        }

        /**
         * Gets the error code associated with this exception
         * 
         * @return the error code
         */
        public ErrorCode getErrorCode() {
            return errorCode;
        }
    }

    /**
     * Exception for database-related errors
     */
    public static class DatabaseException extends VitalStrikeException {
        /**
         * Creates a new DatabaseException with the specified message
         * 
         * @param message the error message
         */
        public DatabaseException(String message) {
            super(message, ErrorCode.DATABASE_ERROR);
        }

        /**
         * Creates a new DatabaseException with the specified message and cause
         * 
         * @param message the error message
         * @param cause   the cause of the error
         */
        public DatabaseException(String message, Throwable cause) {
            super(message, cause, ErrorCode.DATABASE_ERROR);
        }

        /**
         * Creates a new DatabaseException with the specified message and error code
         * 
         * @param message           the error message
         * @param specificErrorCode the specific error code for this exception
         */
        public DatabaseException(String message, ErrorCode specificErrorCode) {
            super(message, specificErrorCode);
        }
    }

    /**
     * Exception for configuration-related errors
     */
    public static class ConfigurationException extends VitalStrikeException {
        /**
         * Creates a new ConfigurationException with the specified message
         * 
         * @param message the error message
         */
        public ConfigurationException(String message) {
            super(message, ErrorCode.CONFIG_ERROR);
        }

        /**
         * Creates a new ConfigurationException with the specified message and cause
         * 
         * @param message the error message
         * @param cause   the cause of the error
         */
        public ConfigurationException(String message, Throwable cause) {
            super(message, cause, ErrorCode.CONFIG_ERROR);
        }

        /**
         * Creates a new ConfigurationException with the specified message and error
         * code
         * 
         * @param message           the error message
         * @param specificErrorCode the specific error code for this exception
         */
        public ConfigurationException(String message, ErrorCode specificErrorCode) {
            super(message, specificErrorCode);
        }
    }

    /**
     * Exception for player-related errors
     */
    public static class PlayerException extends VitalStrikeException {
        /**
         * The name of the player involved in the error.
         */
        private final String playerName;

        /**
         * Creates a new PlayerException with the specified message and player name
         * 
         * @param message    the error message
         * @param playerName the name of the player associated with this error
         */
        public PlayerException(String message, String playerName) {
            super(message, ErrorCode.PLAYER_ERROR);
            this.playerName = playerName;
        }

        /**
         * Creates a new PlayerException with the specified message, player name, and
         * cause
         * 
         * @param message    the error message
         * @param playerName the name of the player associated with this error
         * @param cause      the cause of the error
         */
        public PlayerException(String message, String playerName, Throwable cause) {
            super(message, cause, ErrorCode.PLAYER_ERROR);
            this.playerName = playerName;
        }

        /**
         * Gets the name of the player associated with this error
         * 
         * @return the player name
         */
        public String getPlayerName() {
            return playerName;
        }
    }

    /**
     * Exception for invalid command usage
     */
    public static class CommandException extends VitalStrikeException {
        /**
         * The command that caused the error.
         */
        private final String command;

        /**
         * Creates a new CommandException with the specified message and command
         * 
         * @param message the error message
         * @param command the command that caused this error
         */
        public CommandException(String message, String command) {
            super(message, ErrorCode.COMMAND_ERROR);
            this.command = command;
        }

        /**
         * Creates a new CommandException with the specified message, command, and cause
         * 
         * @param message the error message
         * @param command the command that caused this error
         * @param cause   the cause of the error
         */
        public CommandException(String message, String command, Throwable cause) {
            super(message, cause, ErrorCode.COMMAND_ERROR);
            this.command = command;
        }

        /**
         * Gets the command that caused this error
         * 
         * @return the command string
         */
        public String getCommand() {
            return command;
        }
    }

    /**
     * Exception for update-related errors
     */
    public static class UpdateException extends VitalStrikeException {
        /**
         * The current version of the plugin.
         */
        private final String currentVersion;
        /**
         * The latest available version of the plugin.
         */
        private final String latestVersion;

        /**
         * Creates a new UpdateException with the specified message
         * 
         * @param message the error message
         */
        public UpdateException(String message) {
            super(message, ErrorCode.UPDATE_ERROR);
            this.currentVersion = null;
            this.latestVersion = null;
        }

        /**
         * Creates a new UpdateException with the specified message and version
         * information
         * 
         * @param message        the error message
         * @param currentVersion the current version of the plugin
         * @param latestVersion  the latest available version
         */
        public UpdateException(String message, String currentVersion, String latestVersion) {
            super(message, ErrorCode.UPDATE_ERROR);
            this.currentVersion = currentVersion;
            this.latestVersion = latestVersion;
        }

        /**
         * Creates a new UpdateException with the specified message and cause
         * 
         * @param message the error message
         * @param cause   the cause of the error
         */
        public UpdateException(String message, Throwable cause) {
            super(message, cause, ErrorCode.UPDATE_ERROR);
            this.currentVersion = null;
            this.latestVersion = null;
        }

        /**
         * Gets the current version of the plugin
         * 
         * @return the current version string, or null if not available
         */
        public String getCurrentVersion() {
            return currentVersion;
        }

        /**
         * Gets the latest available version of the plugin
         * 
         * @return the latest version string, or null if not available
         */
        public String getLatestVersion() {
            return latestVersion;
        }

        /**
         * Checks if a newer version of the plugin is available
         * 
         * @return true if both current and latest versions are available and different,
         *         false otherwise
         */
        public boolean isUpdateAvailable() {
            return currentVersion != null && latestVersion != null && !currentVersion.equals(latestVersion);
        }
    }

    /**
     * Enum representing different types of errors that can occur in VitalStrike
     */
    public enum ErrorCode {
        /** Represents an unknown or unspecified error with code 1000 */
        UNKNOWN(1000, "Unknown error occurred"),

        /** Represents a database operation failure with code 2000 */
        DATABASE_ERROR(2000, "Database operation failed"),

        /** Represents a configuration-related error with code 3000 */
        CONFIG_ERROR(3000, "Configuration error"),

        /** Represents a player-related error with code 4000 */
        PLAYER_ERROR(4000, "Player-related error"),

        /** Represents an invalid command usage error with code 5000 */
        COMMAND_ERROR(5000, "Invalid command usage"),

        /** Represents a permission denied error with code 6000 */
        PERMISSION_ERROR(6000, "Permission denied"),

        /** Represents a network operation failure with code 7000 */
        NETWORK_ERROR(7000, "Network operation failed"),

        /** Represents a plugin operation failure with code 8000 */
        PLUGIN_ERROR(8000, "Plugin operation failed"),

        /** Represents an update operation failure with code 9000 */
        UPDATE_ERROR(9000, "Update operation failed");

        private final int code;
        private final String defaultMessage;

        ErrorCode(int code, String defaultMessage) {
            this.code = code;
            this.defaultMessage = defaultMessage;
        }

        /**
         * Gets the numeric code associated with this error type
         * 
         * @return the error code
         */
        public int getCode() {
            return code;
        }

        /**
         * Gets the default message associated with this error type
         * 
         * @return the default error message
         */
        public String getDefaultMessage() {
            return defaultMessage;
        }
    }
}