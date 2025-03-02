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
        private final ErrorCode errorCode;

        public VitalStrikeException(String message) {
            this(message, ErrorCode.UNKNOWN);
        }

        public VitalStrikeException(String message, ErrorCode errorCode) {
            super(message);
            this.errorCode = errorCode;
        }

        public VitalStrikeException(String message, Throwable cause) {
            this(message, cause, ErrorCode.UNKNOWN);
        }

        public VitalStrikeException(String message, Throwable cause, ErrorCode errorCode) {
            super(message, cause);
            this.errorCode = errorCode;
        }

        public ErrorCode getErrorCode() {
            return errorCode;
        }
    }

    /**
     * Exception for database-related errors
     */
    public static class DatabaseException extends VitalStrikeException {
        public DatabaseException(String message) {
            super(message, ErrorCode.DATABASE_ERROR);
        }

        public DatabaseException(String message, Throwable cause) {
            super(message, cause, ErrorCode.DATABASE_ERROR);
        }

        public DatabaseException(String message, ErrorCode specificErrorCode) {
            super(message, specificErrorCode);
        }
    }

    /**
     * Exception for configuration-related errors
     */
    public static class ConfigurationException extends VitalStrikeException {
        public ConfigurationException(String message) {
            super(message, ErrorCode.CONFIG_ERROR);
        }

        public ConfigurationException(String message, Throwable cause) {
            super(message, cause, ErrorCode.CONFIG_ERROR);
        }

        public ConfigurationException(String message, ErrorCode specificErrorCode) {
            super(message, specificErrorCode);
        }
    }

    /**
     * Exception for player-related errors
     */
    public static class PlayerException extends VitalStrikeException {
        private final String playerName;

        public PlayerException(String message, String playerName) {
            super(message, ErrorCode.PLAYER_ERROR);
            this.playerName = playerName;
        }

        public PlayerException(String message, String playerName, Throwable cause) {
            super(message, cause, ErrorCode.PLAYER_ERROR);
            this.playerName = playerName;
        }

        public String getPlayerName() {
            return playerName;
        }
    }

    /**
     * Exception for invalid command usage
     */
    public static class CommandException extends VitalStrikeException {
        private final String command;

        public CommandException(String message, String command) {
            super(message, ErrorCode.COMMAND_ERROR);
            this.command = command;
        }

        public CommandException(String message, String command, Throwable cause) {
            super(message, cause, ErrorCode.COMMAND_ERROR);
            this.command = command;
        }

        public String getCommand() {
            return command;
        }
    }

    /**
     * Exception for update-related errors
     */
    public static class UpdateException extends VitalStrikeException {
        private final String currentVersion;
        private final String latestVersion;

        public UpdateException(String message) {
            super(message, ErrorCode.UPDATE_ERROR);
            this.currentVersion = null;
            this.latestVersion = null;
        }

        public UpdateException(String message, String currentVersion, String latestVersion) {
            super(message, ErrorCode.UPDATE_ERROR);
            this.currentVersion = currentVersion;
            this.latestVersion = latestVersion;
        }

        public UpdateException(String message, Throwable cause) {
            super(message, cause, ErrorCode.UPDATE_ERROR);
            this.currentVersion = null;
            this.latestVersion = null;
        }

        public String getCurrentVersion() {
            return currentVersion;
        }

        public String getLatestVersion() {
            return latestVersion;
        }

        public boolean isUpdateAvailable() {
            return currentVersion != null && latestVersion != null && !currentVersion.equals(latestVersion);
        }
    }

    /**
     * Enum representing different types of errors that can occur in VitalStrike
     */
    public enum ErrorCode {
        UNKNOWN(1000, "Unknown error occurred"),
        DATABASE_ERROR(2000, "Database operation failed"),
        CONFIG_ERROR(3000, "Configuration error"),
        PLAYER_ERROR(4000, "Player-related error"),
        COMMAND_ERROR(5000, "Invalid command usage"),
        PERMISSION_ERROR(6000, "Permission denied"),
        NETWORK_ERROR(7000, "Network operation failed"),
        PLUGIN_ERROR(8000, "Plugin operation failed"),
        UPDATE_ERROR(9000, "Update operation failed");

        private final int code;
        private final String defaultMessage;

        ErrorCode(int code, String defaultMessage) {
            this.code = code;
            this.defaultMessage = defaultMessage;
        }

        public int getCode() {
            return code;
        }

        public String getDefaultMessage() {
            return defaultMessage;
        }
    }
}