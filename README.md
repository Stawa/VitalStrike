# VitalStrike

[![Minecraft](https://img.shields.io/badge/Minecraft-1.21.4-brightgreen.svg)](https://www.minecraft.net/)
[![Build](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml/badge.svg)](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/Stawa/VitalStrike?include_prereleases&style=flat)](https://github.com/Stawa/VitalStrike/releases)

VitalStrike is a powerful and highly customizable Minecraft plugin that enhances combat feedback with dynamic damage indicators, combo systems, and comprehensive statistics tracking.

## Documentation

For detailed information about features, installation, and configuration, visit our documentation at [https://vitalstrike.vercel.app/](https://vitalstrike.vercel.app/)

---

## ⚡ Requirements

- Java 21 or higher
- Paper 1.21.4+ or compatible forks

## ✨ Features

- Customizable damage indicators (styles, colors, animations, and directions)
- Dynamic combo system with multipliers, ranks, and hologram displays
- Player combat statistics tracking with leaderboards
- Per-player settings and preferences for a personalized experience
- Supports all damage types and integrates with modern sound systems
- Automatic updates reminder, error handling, and bStats usage tracking
- Easy to configure and use

## 🚀 Quick Start

1. Download the latest version of VitalStrike
2. Place it in your server's `plugins` folder
3. Restart your server
4. Configure the plugin in `plugins/VitalStrike/config.yml`

## 📖 Commands

| Command           | Permission              | Description                 | Default |
| ----------------- | ----------------------- | --------------------------- | ------- |
| `/vs help`        | vitalstrike.use         | Show the help menu          | true    |
| `/vs toggle`      | vitalstrike.use         | Toggle damage indicators    | true    |
| `/vs reload`      | vitalstrike.reload      | Reload plugin configuration | op      |
| `/vs stats`       | vitalstrike.stats       | View combat statistics      | true    |
| `/vs leaderboard` | vitalstrike.leaderboard | View server leaderboards    | true    |
| `/vs hologram`    | vitalstrike.hologram    | Toggle combo holograms      | true    |

Aliases: `/vitalstrike`, `/vs`, `/vs lb` (for leaderboard)

## 🎨 Damage Formats

VitalStrike supports different formats for various types of damage:

```yaml
damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  poison: "<gradient:#50C878:#228B22>-%.1f ☠</gradient>"
  fire: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>"
  magic: "<gradient:#9400D3:#800080>-%.1f ✨</gradient>"
  # ... and many more!
```

## ⚙️ Configuration

### Combo System

```yaml
combo:
  enabled: true
  reset-time: 3
  multiplier:
    enabled: true
    base: 1.0
    per-combo: 0.1
    max: 3.0
  decay:
    enabled: true
    time: 10
    rate: 1
    interval: 1
    minimum: 0
```

### Display Settings

```yaml
display:
  duration: 1.5
  position:
    y: -0.2
    x: -0.5
    random-offset: -1
    direction: "down"
  animation:
    fade-in: 0.25
    fade-out: 0.25
    float-speed: 0.03
    float-curve: 0.02
```

### 🔄 Animation Directions

- `down`: Indicators float downward (default)
- `up`: Indicators float upward
- `left`: Indicators float to the left
- `right`: Indicators float to the right

## 🎮 Player Settings

Players can customize their own damage indicators:

1. Toggle indicators: `/vs toggle`

## 🔧 API

VitalStrike provides a simple API for developers:

```java
// Get plugin instance
VitalStrike plugin = (VitalStrike) Bukkit.getPluginManager().getPlugin("VitalStrike");

// Player management
boolean isEnabled = plugin.getPlayerManager().isEnabled(player);
plugin.getPlayerManager().setStyle(player, "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>");

// Statistics access
PlayerStats playerStats = plugin.getPlayerStats();
PlayerStats.PlayerStatistics stats = playerStats.getPlayerStatistics(player.getUniqueId());

// Combat statistics
int highestCombo = stats.getHighestCombo();
double totalDamage = stats.getTotalDamageDealt();
double avgDamage = stats.getAverageDamagePerHit();
```

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Author: Stawa
- Issues: [GitHub Issues](https://github.com/Stawa/VitalStrike/issues)

---

<div align="center">
  Made with ❤️ for the Minecraft community
</div>
