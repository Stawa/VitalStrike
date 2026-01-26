/**
 * Command processing and execution logic for VitalStrike plugin.
 *
 * <p>This package handles all user commands issued to the plugin. It includes the main command
 * executor, tab completer, and individual command handlers for various sub-commands.
 *
 * <h2>Features</h2>
 *
 * <ul>
 *   <li>Command routing and dispatching
 *   <li>Permission validation for commands
 *   <li>Tab completion for better user experience
 *   <li>Sub-command implementations (e.g., reload, give, help)
 * </ul>
 *
 * <h2>Key Components</h2>
 *
 * <ul>
 *   <li>{@link stawa.vitalstrike.commands.CommandManager Central command executor}
 *   <li>{@link stawa.vitalstrike.commands.HelpManager Command help generation}
 * </ul>
 */
package stawa.vitalstrike.commands;
