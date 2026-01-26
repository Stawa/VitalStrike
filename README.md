# VitalStrike

[![Minecraft](https://img.shields.io/badge/Minecraft-v1.21+-brightgreen.svg)](https://www.minecraft.net/)
[![Build](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml/badge.svg)](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/Stawa/VitalStrike?include_prereleases&style=flat)](https://github.com/Stawa/VitalStrike/releases)

VitalStrike is a comprehensive combat enhancement plugin for Minecraft servers, designed to introduce dynamic damage indicators, combo systems, and knockdown mechanics. It offers extensive customization options, including per-world settings, permission-based damage formatting, and performance-optimized rendering using display entities.

> [!IMPORTANT]
> Certain updates include adjustments that are incompatible with previous configuration files.
> Before updating, back up your config and delete the existing config file so it can be regenerated.

## Documentation

- **Website:** [vitalstrike.vercel.app](https://vitalstrike.vercel.app/)
- **JavaDoc:** [API Documentation](https://stawa.github.io/VitalStrike/javadoc/)

## Requirements

- **Java:** 21 or higher
- **Server Software:** Paper 1.21.4+ (or compatible forks)

## Features

- **Dynamic Damage Indicators:** Highly customizable damage numbers with support for gradients, animations, and permission-based styles.
- **Combat Combo System:** Advanced combo tracking with damage multipliers, rank progression, and visual feedback including holograms.
- **Knockdown Mechanics:** Implements a downed state for players with revival mechanics, custom items, and configurable durations.
- **World Management:** Granular control over plugin activation and damage multipliers across different dimensions (Overworld, Nether, End) and WorldGuard regions.
- **Performance Optimized:** Utilizes packet-based display entities and a smart damage merging system to maintain server performance under heavy load.
- **Leaderboards & Statistics:** Built-in tracking for damage dealt, combo streaks, and other combat metrics.

## Installation

1. Download the latest release from the [Releases Page](https://github.com/Stawa/VitalStrike/releases).
2. Place the JAR file into your server's `plugins` directory.
3. Restart the server to generate the default configuration files.
4. Edit `plugins/VitalStrike/config.yml` to customize the plugin to your needs.

## Commands and Permissions

| Command                       | Permission                | Description                             |
| :---------------------------- | :------------------------ | :-------------------------------------- |
| `/vs help`                    | `vitalstrike.use`         | Displays the help menu.                 |
| `/vs toggle [on/off]`         | `vitalstrike.toggle`      | Toggles damage indicators for the user. |
| `/vs reload`                  | `vitalstrike.reload`      | Reloads the plugin configuration.       |
| `/vs stats`                   | `vitalstrike.stats`       | Views personal combat statistics.       |
| `/vs leaderboard [type]`      | `vitalstrike.leaderboard` | Displays the specified leaderboard.     |
| `/vs hologram [on/off]`       | `vitalstrike.hologram`    | Toggles combo holograms.                |
| `/vs vitalawakening [amount]` | `vitalstrike.give`        | Spawns Vital Awakening items.           |
| `/vs perm <action> <player>`  | `vitalstrike.admin`       | Manages player permissions.             |

**Aliases:** `/vitalstrike`, `/vs`

## Configuration

VitalStrike is designed to be fully configurable. The main configuration file `config.yml` allows you to adjust:

- **Display Settings:** Animation speed, offsets, and durations.
- **Damage Formats:** Define unique text formats for different damage sources (e.g., Fire, Poison, Critical).
- **Combo System:** Configure multipliers, decay rates, and rank thresholds.
- **Knockdown Settings:** Adjust downed health, revival time, and penalties.

Refer to the [Documentation](https://vitalstrike.vercel.app/) for detailed configuration guides.

## Building from Source

To build the project locally, ensure you have JDK 21 installed.
This project uses Gradle (Wrapper), so no global Gradle installation is required.

```bash
git clone https://github.com/Stawa/VitalStrike.git
cd VitalStrike
./gradlew build
```

The compiled JAR will be located in the `build/libs/` directory.

## Support & Feedback

VitalStrike is developed and maintained by a single developer, so support may take a while—but all feedback is welcome. If you have any questions, encounter any issues, or wish to suggest new features, reach out to us using the channels listed below.

- **Issues:** [GitHub Issues](https://github.com/Stawa/VitalStrike/issues)
- **Community & Help:** [Discord Server](https://discord.com/invite/b4nxvp8NcH)

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ for the Minecraft community
</div>
