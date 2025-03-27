# VitalStrike

[![Minecraft](https://img.shields.io/badge/Minecraft-1.21.4-brightgreen.svg)](https://www.minecraft.net/)
[![Build](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml/badge.svg)](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/Stawa/VitalStrike?include_prereleases&style=flat)](https://github.com/Stawa/VitalStrike/releases)

VitalStrike is a powerful and highly customizable Minecraft plugin that enhances combat feedback with dynamic damage indicators, combo systems, and comprehensive statistics tracking. With support for permission-based damage format groups and modern sound systems, it provides an immersive combat experience for your server.

## Documentation

For detailed information about features, installation, and configuration, visit our documentation at [https://vitalstrike.vercel.app/](https://vitalstrike.vercel.app/)

---

## ⚡ Requirements

- Java 21 or higher
- Paper 1.21.4+ or compatible forks

## ✨ Features

### 💫 Customizable Damage Indicators

> Permission-based format groups with multiple styles, gradients, and animations

### ⚔️ Dynamic Combat System

> Advanced combo mechanism with multipliers, ranks, and hologram displays

### 👤 Player Experience

> Personalized settings, detailed combat statistics, and comprehensive leaderboards

### 🔧 Technical Excellence

> Advanced sound integration, robust performance, automatic updates, and easy configuration

## 🚀 Quick Start

1. Download the latest version of VitalStrike
2. Place it in your server's `plugins` folder
3. Restart your server
4. Configure the plugin in `plugins/VitalStrike/config.yml`

## 📖 Commands

| Command                       | Permission              | Description                    | Default |
| ----------------------------- | ----------------------- | ------------------------------ | ------- |
| `/vs help`                    | vitalstrike.use         | Show the help menu             | true    |
| `/vs toggle [on-off]`         | vitalstrike.toggle      | Toggle damage indicators       | true    |
| `/vs reload`                  | vitalstrike.reload      | Reload plugin configuration    | op      |
| `/vs stats`                   | vitalstrike.stats       | View combat statistics         | true    |
| `/vs leaderboard [type]`      | vitalstrike.leaderboard | View damage/combo leaderboards | true    |
| `/vs hologram [on-off]`       | vitalstrike.hologram    | Toggle combo holograms         | true    |
| `/vs vitalawakening [amount]` | vitalstrike.give        | Get Vital Awakening items      | op      |

Aliases: `/vitalstrike`, `/vs`, `/vs lb` (for leaderboard)

## 🎨 Damage Formats

VitalStrike supports different formats for various types of damage:

```yaml
simple-damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>" # Normal damage
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>" # Critical hits
  poison: "<gradient:#50C878:#228B22>-%.1f ☠</gradient>" # Poison damage
  fire: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>" # Fire damage
  magic: "<gradient:#9400D3:#800080>-%.1f ✨</gradient>" # Magic damage
  heal: "<green>+%.1f ❤</green>" # Healing amount
  void: "<dark_gray>-%.1f ⬇</dark_gray>" # Void damage
  wither: "<dark_gray>-%.1f 💀</dark_gray>" # Wither effect
  # ... and many more!
```

## ⚙️ Configuration

### ✊ Combo System

```yaml
combo:
  enabled: true
  reset-time: 3 # Time in seconds before combo resets
  multiplier:
    enabled: true
    base: 1.0 # Base damage multiplier
    per-combo: 0.1 # Additional multiplier per combo
    max: 3.0 # Maximum damage multiplier
  decay:
    enabled: true
    time: 10 # Time before decay starts
    rate: 1 # Combo points lost per interval
    interval: 1 # Decay check interval
    minimum: 0 # Minimum combo value
  display:
    format: "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>"
    rank:
      enabled: true
      thresholds:
        D: 0
        C: 5
        B: 10
        A: 15
        S: 25
        SS: 40
        SSS: 60
```

### 😵 Knockdown System

```yaml
knockdown-system:
  enabled: true
  down-duration: 30 # Duration in seconds
  revive-duration: 5.0 # Time to revive
  revive-range: 3.0 # Range for revival
  downed-health: 20.0 # Health when downed
  vital-awakening:
    instant-use: false # Hold to use setting
    use-duration: 4.0 # Hold duration
```

### 🖥️ Display Settings

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

Players can customize their experience with the following settings:

1. Toggle damage indicators: `/vs toggle [on|off]`
2. Toggle combo holograms: `/vs hologram [on|off]`
3. View personal statistics: `/vs stats`
4. Check leaderboards: `/vs leaderboard [damage|combo|average]`
5. Use Vital Awakening items for revival

## 🔧 API

VitalStrike provides a comprehensive API for developers, with detailed documentation and examples available in our [JavaDoc documentation](https://stawa.github.io/VitalStrike/javadoc/), which includes complete documentation of all classes, methods, and interfaces available in the VitalStrike API.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Author: [Stawa](https://github.com/Stawa)
- Issues: [GitHub Issues](https://github.com/Stawa/VitalStrike/issues)
- Discord: [VitalStrike Community Server](https://discord.com/invite/b4nxvp8NcH)

---

<div align="center">
  Made with ❤️ for the Minecraft community
</div>
