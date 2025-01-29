# VitalStrike

[![Minecraft](https://img.shields.io/badge/Minecraft-1.20+-brightgreen.svg)](https://www.minecraft.net/)
[![Build](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml/badge.svg)](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/Stawa/VitalStrike?include_prereleases&style=flat)](https://github.com/Stawa/VitalStrike/releases)

VitalStrike is a customizable Minecraft plugin that provides dynamic damage indications, allowing you to adjust combat feedback to match your server's style.

---

## ⚡ Requirements

- Java 17 or higher
- Paper 1.20+ or compatible forks

## ✨ Features

- Customizable damage indicators with different styles and colors
- Smooth animations with configurable directions
- Per-player settings and preferences
- Easy to configure and use
- Support for all damage types

## 🚀 Quick Start

1. Download the latest version of VitalStrike
2. Place it in your server's `plugins` folder
3. Restart your server
4. Configure the plugin in `plugins/VitalStrike/config.yml`

## 📖 Commands

| Command      | Permission         | Description                     | Default |
| ------------ | ------------------ | ------------------------------- | ------- |
| `/vs help`   | vitalstrike.use    | Show the help menu              | true    |
| `/vs toggle` | vitalstrike.use    | Toggle damage indicators on/off | true    |
| `/vs reload` | vitalstrike.reload | Reload the plugin configuration | op      |

Aliases: `/vitalstrike`, `/vs`

## 🎨 Damage Formats

VitalStrike supports different formats for various types of damage:

```yaml
damage-formats:
  default: "<red>-%.1f ⚔"
  critical: "<dark_red><bold>-%.1f ⚡</bold>"
  poison: "<dark_green>-%.1f ☠"
  fire: "<gold>-%.1f 🔥"
  fall: "<gray>-%.1f 💨"
  # ... and many more!
```

## ⚙️ Configuration

### Display Settings

```yaml
display:
  duration: 1.5 # How long indicators stay visible
  position:
    y: -0.2 # Vertical offset
    x: -0.5 # Horizontal offset
    random-offset: -1 # Random variation (-1 to disable)
    direction: "down" # Direction (up/down/left/right)
  animation:
    fade-in: 0.25 # Fade in duration
    fade-out: 0.25 # Fade out duration
    float-speed: 0.03 # Movement speed
    float-curve: 0.02 # Wave motion intensity
```

### 🔄 Animation Directions

- `down`: Indicators float downward (default)
- `up`: Indicators float upward
- `left`: Indicators float to the left
- `right`: Indicators float to the right

## 🎮 Player Settings

Players can customize their own damage indicators:

1. Toggle indicators: `/vs toggle`
2. Set custom style: `/vs style <format>`

Example styles:

- Basic: `/vs style <red>-%.1f ❤`
- Fancy: `/vs style <gradient:red:gold>-%.1f ⚔</gradient>`
- Critical: `/vs style <dark_red><bold>-%.1f 🗡</bold>`

## 🔧 API

VitalStrike provides a simple API for developers:

```java
// Get the plugin instance
VitalStrike plugin = (VitalStrike) Bukkit.getPluginManager().getPlugin("VitalStrike");

// Check if indicators are enabled for a player
boolean isEnabled = plugin.getPlayerManager().isEnabled(player);

// Set custom style for a player
plugin.getPlayerManager().setStyle(player, "<red>-%.1f ⚔");
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
