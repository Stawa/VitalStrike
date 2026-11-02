# Changelog

All notable changes to VitalStrike will be documented in this file.

## [2.0.0] - Unreleased
Platform update, a web config editor and a broad bug-fix pass. Requires **Paper 26.1+ and Java 25**.

### Breaking changes
- Requires Paper 26.1+ and Java 25. Servers on 1.21.x should stay on 1.4.0.
- The WorldGuard dependency and the `respect-worldguard-pvp` option are removed.
- Rewards are one-time milestones instead of re-farmable (see Changed).
- `knockdown-system.vital-awakening.item-model` is replaced by `custom-model-data`. Existing Vital Awakening items are migrated automatically.
- Config paths that were silently ignored before now take effect (see Fixed): custom damage formats, merge settings, combo hologram settings and sound volume/pitch. Check them after upgrading.
- Canonical command names are now `give`, `pack`, `top` and `holo`. The old names and shortcuts still work.

### Changed
- Built against Paper API 26.3 with Java 25; Gradle 9.8; CI actions updated.
- Hits are now counted at `MONITOR` priority, so damage cancelled by other plugins (WorldGuard PvP flags, spawn protection) no longer creates combos, stats, indicators or rewards. The WorldGuard dependency and `respect-worldguard-pvp` option are gone.
- Rewards are one-time lifetime-damage milestones (previously re-farmable every merge window).
- Combo decay now works: with decay enabled the combo is no longer hard-reset after `reset-time`.
- Downed players are held in place with an event lock instead of `setInvulnerable`, and effects are refreshed with a short duration, so nothing sticks after a crash or restart.
- All settings are re-read on `/vs reload` (knockdown and combo values used to need a restart).
- Commands consolidated into one class; `/vs perm` now only manages stored group grants and works for offline players.
- The resource pack is hashed off the main thread and its URL is configurable (`resource-pack.url`).
- The resource pack hash is refreshed every 10 minutes and after a failed load, so a republished pack no longer fails with a stale SHA-1 until the next restart.
- VitalAwakening pack now declares formats 46-97 (1.21.4 through 26.3), and its CI builds a reproducible, validated zip.

### Added
- `/vs config` web editor: edit the config in your browser, then `/vs config apply <code>`. Runs through the relay on the VitalStrike website (`web-editor` config section).
- Looping reward tiers: `rewards.loop.enabled` repeats the tiers after the last one, each lap needing `rewards.loop.cycle-damage` more damage (default: the last tier's damage).
- Per-world settings: `world-settings.worlds` lets you give any world, by name, its own on/off switch and damage multiplier. They win over the dimension settings.
- The web editor edits reward tiers (damage, XP and items per tier) and custom worlds directly.
- Shorter commands: `/vs give`, `/vs pack`, `/vs top`, `/vs holo`. The old names still work.
- Heal indicators (`display.show-heals`), using the existing `heal` format.
- Real critical-hit detection (the `critical` format and sound were previously a 20% dice roll).
- Bow/trident/other projectile hits are credited to the shooter for combos, stats and per-group formats.
- `/vs revive <player>`, `/vs stats [player]`, and `/vs va [amount] [player]`.
- Downed players crawl, cannot attack, place, drop, interact or walk, and mobs stop targeting them. Mobs that were after the player, or hit them, are calmed down when they are revived (wolves, bees and zombified piglins lose their anger; others lose their target).
- Damage numbers on large mobs (ender dragon, ghast, ravager, wither, big slimes) appear on the side the attacker is looking at and scale up with the mob, instead of above its centre.
- Update notice for players with `vitalstrike.update-notify`.
- `knockdown-system.vital-awakening.custom-model-data` (replaces `item-model`): the item is tagged with custom model data instead of a custom item model, so players without the resource pack see a normal totem rather than a missing-model cube. Totems from older versions (legacy model, or untagged) are migrated automatically when their holder joins, picks them up or opens a container.

### Fixed
- Config paths that never matched: custom damage formats (`simple-damage-formats`), merge settings (`display.merge`), combo hologram settings (`combo.hologram`) and sound volume/pitch were silently ignored.
- Indicators and the multiplier ignored `disabled-worlds` and dimension `enabled`.
- Quitting removed every text display within 32 blocks, including other plugins'. Indicators are now non-persistent instead.
- A 500 ms per-entity cooldown dropped damage that merging should have summed; its map also leaked.
- Downed state survived death (void, `/kill`) and kept the player "downed" after respawn.
- A downed player could still be hurt by the void forever-loop; void/kill/suicide now always go through.
- Revive quit-handling looked up state after clearing it; the revive item was never consumed when `require-vital-awakening` was on.
- Resource pack: hash was Base64 instead of hex, the status listener was never registered, the pack was downloaded on the main thread during startup, and loaded state never reset on quit.
- Update checker could not parse GitHub's JSON and treated any version difference (including SNAPSHOT) as an update.
- Stats were only saved on clean shutdown; they now autosave every 5 minutes and store player names so the leaderboard no longer skips offline players.
- Vital Awakening recipe/instances were created three times; lore is no longer italic.

### Removed
- Dead code: element system (no way to set it), per-player style, custom exception hierarchy, custom logger, WorldGuard shim, duplicated config cache, and boilerplate `package-info` files.

## [1.4.0] - 2025-03-17
VitalStrike v1.4.0 brings important bug fixes and enhanced damage indicator customization.

### Added
- Added support for multiple damage indicator formats:
  - Simple damage formats (default)
  - Customizable group-based damage formats with permission system
- Added permission-based damage format groups:
  - Custom group formats can be defined in config
  - Each group can have unique damage indicators
  - Format: `vitalstrike.group.<groupname>`

### Changed
- Refactored combo system for better performance
- Improved error handling in configuration loading
- Enhanced damage indicator format caching
- Updated configuration validation system

### Fixed
- Fixed critical bug where combo system remained active after plugin disable
- Fixed combo counter continuing when plugin is disabled
- Fixed damage indicator persistence issues
- Improved error handling for invalid configurations

### Technical
- Improved code organization and maintainability
- Enhanced error handling system
- Updated configuration validation
- Optimized damage format caching system

## [1.3.1] - 2024-03-10
VitalStrike v1.3.1 focuses on modernizing the plugin for Minecraft 1.21.4 and improving code quality with better logging and sound handling.

### Added
- Implemented custom VitalLogger system for better logging management
- Added comprehensive error handling for sound systems

### Changed
- Updated Minecraft API support from 1.20.x to 1.21.4
- Modernized sound names to match current Minecraft standards
- Improved code readability and structure
- Updated deprecated API calls to use modern alternatives
- Enhanced error handling for plugin initialization

### Fixed
- Fixed invalid sound names in configuration
- Resolved deprecated method calls from older API versions
- Fixed logger initialization sequence
- Corrected sound registry lookups for 1.21.4

### Technical
- Now supports Minecraft 1.21.4
- Updated Paper API dependencies

## [1.3] - 2025-03-05
VitalStrike v1.3 introduces bStats integration, custom hologram displays, and comprehensive documentation improvements along with various bug fixes and performance enhancements.

### Added
- Integrated bStats for anonymous usage statistics
- Added custom hologram display for specific combo thresholds (default: 10+)
- Added comprehensive JavaDoc documentation for all major classes and methods
- Added detailed parameter and return value documentation
- Added class-level documentation explaining core functionality

### Changed
- Refactored code for better performance and maintainability
- Updated Maven dependencies to support Java 21
- Improved code documentation structure and formatting
- Enhanced method descriptions for better clarity
- Updated class documentation with detailed examples and usage information

### Fixed
- Fixed combo HUD not respecting player toggle settings
- Fixed combo sounds playing even when damage indicators are disabled
- Ensured all visual and audio elements properly respect player preferences
- Fixed missing or incomplete method documentation
- Standardized documentation format across all classes

## [1.2] - 2025-03-02
VitalStrike v1.2 focuses on performance improvements and code quality. This update includes an enhanced update checker, improved logging system, and optimized code structure for better performance and maintainability.

### Added
- Added improved update checker with more detailed version information
- Enhanced error handling for update checking process

### Changed
- Refactored update checking system for better performance
- Improved logging system to avoid duplicate plugin name in log messages
- Optimized code structure to reduce cognitive complexity

### Fixed
- Improved error handling in various parts of the plugin

### Technical
- Requires Java 21

## [1.1] - 2025-01-30
VitalStrike v1.1 brings exciting new features including player statistics tracking, custom damage sounds, and a new leaderboard system. We've also refactored the core plugin for better organization and fixed various bugs.

### Added
- Added PlayerStats class for managing player statistics
- Implemented player stats tracking system
- Added configuration options for stats tracking
- Added custom damage sounds for different damage types
- Implemented statistics tracking and leaderboard system

### Changed
- Refactored main plugin class for better organization
- Updated configuration structure to support stats tracking

### Fixed
- Fixed damage indicator display issues
- Fixed various bugs related to damage calculation and display

## [1.1-SNAPSHOT] - 2025-01-29
Initial release of VitalStrike featuring dynamic damage indicators, combo system, and comprehensive configuration options.

### Added
- Initial release of VitalStrike
- Dynamic damage indicators with customizable formats
- Combo system with ranks (D through SSS)
- Damage multiplier system based on combo count and ranks
- Combo decay system with configurable settings
- Visual effects (particles and sounds) for combo milestones
- Action bar display for combo information
- Customizable display settings (position, animation, duration)
- Support for MiniMessage format and gradient colors
- Comprehensive configuration system

### Changed
- Updated GitHub Actions workflow to use latest versions:
  - actions/checkout@v4
  - actions/setup-java@v4
  - actions/upload-artifact@v4
- Improved version checker to show when running latest version

### Technical
- Built for Minecraft 1.20+
- Uses Paper API
- Requires Java 17
