export interface BlogPost {
  id: string;
  description: string;
  date: string;
  changes: string;
  author: string;
  version: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1.2",
    description:
      "VitalStrike v1.2 focuses on performance improvements and code quality. This update includes an enhanced update checker, improved logging system, and optimized code structure for better performance and maintainability.",
    date: "February 15, 2025",
    changes: `
## Added
- Added improved update checker with more detailed version information
- Enhanced error handling for update checking process

## Changed
- Refactored update checking system for better performance
- Improved logging system to avoid duplicate plugin name in log messages
- Optimized code structure to reduce cognitive complexity

## Fixed
- Improved error handling in various parts of the plugin`,
    author: "Stawa",
    version: "1.2",
  },
  {
    id: "1.1",
    description:
      "VitalStrike v1.1 brings exciting new features including player statistics tracking, custom damage sounds, and a new leaderboard system. We've also refactored the core plugin for better organization and fixed various bugs.",
    date: "January 30, 2025",
    changes: `
## Added
- Added PlayerStats class for managing player statistics
- Implemented player stats tracking system
- Added configuration options for stats tracking
- Added custom damage sounds for different damage types
- Implemented statistics tracking and leaderboard system

## Changed
- Refactored main plugin class for better organization
- Updated configuration structure to support stats tracking

## Fixed
- Fixed damage indicator display issues
- Fixed various bugs related to damage calculation and display

## Technical
- Requires Java 21`,
    author: "Stawa",
    version: "1.1",
  },
  {
    id: "1.1-SNAPSHOT",
    description:
      "Initial release of VitalStrike featuring dynamic damage indicators, combo system, and comprehensive configuration options.",
    date: "January 29, 2025",
    changes: `
## Added
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

## Changed
- Updated GitHub Actions workflow to use latest versions:
  - actions/checkout@v4
  - actions/setup-java@v4
  - actions/upload-artifact@v4
- Added "[VitalStrike]" prefix to all logger messages for better identification
- Improved version checker to show when running latest version

## Technical
- Built for Minecraft 1.20+
- Uses Paper API
- Requires Java 17`,
    author: "Stawa",
    version: "1.1-SNAPSHOT",
  },
];
