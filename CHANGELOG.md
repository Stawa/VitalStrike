# Changelog

All notable changes to VitalStrike will be documented in this file.

## [1.2] - 2025-03-02

### Added
- Added improved update checker with more detailed version information
- Enhanced error handling for update checking process

### Changed
- Refactored update checking system for better performance
- Improved logging system to avoid duplicate plugin name in log messages
- Optimized code structure to reduce cognitive complexity

### Fixed
- Improved error handling in various parts of the plugin

## [1.1] - 2025-01-30

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
