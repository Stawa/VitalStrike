# Changelog

All notable changes to VitalStrike will be documented in this file.

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
