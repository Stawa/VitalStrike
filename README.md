# VitalStrike

[![Minecraft](https://img.shields.io/badge/Minecraft-1.21.4-brightgreen.svg)](https://www.minecraft.net/)
[![Build](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml/badge.svg)](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/Stawa/VitalStrike?include_prereleases&style=flat)](https://github.com/Stawa/VitalStrike/releases)

VitalStrike is a Minecraft plugin that enhances combat by introducing dynamic damage indications, combo multipliers, and a knockdown mechanism. It has leaderboards, customisable damage formats, sound effects, and world dimension controls. With permission-based formatting and extensive customisation, VitalStrike boosts your server's PvP experience.

## Documentation & API

For features, installation, and configuration information, visit our main website at [https://vitalstrike.vercel.app/](https://vitalstrike.vercel.app/)
For developers, we provide a comprehensive API with detailed documentation and examples available in our [JavaDoc Documentation](https://stawa.github.io/VitalStrike/javadoc/), which includes complete documentation of all classes, methods, and interfaces available in the VitalStrike API.

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

### 🌍 World Compatibility

> Flexible dimension control for Nether, End, and Overworld with WorldGuard integration

## 🚀 Quick Start

1. Download the latest version of VitalStrike
2. Place it in your server's `plugins` folder
3. Restart your server
4. Configure the plugin in `plugins/VitalStrike/config.yml`

### 🧪 Development Build Guide

Want to explore the cutting-edge features? Follow these steps to build from source:

<details>
<summary>📦 Build Instructions</summary>

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Stawa/VitalStrike.git
   ```

2. **Enter Project Directory**

   ```bash
   cd VitalStrike
   ```

3. **Compile with Maven**

   ```bash
   mvn clean package
   ```

4. **Locate the Build**
   > Find your compiled JAR at:
   > `target/VitalStrike-{version}.jar`

</details>

#### 📋 Prerequisites

- Java Development Kit (JDK) 21 or newer
- Apache Maven build tool
- Git version control

> 💎 **Pro Tip:** Use an IDE like IntelliJ IDEA or Eclipse for a smoother development experience!

⚠️ **Important:** Development builds are experimental and may contain unstable features. Not recommended for production environments.

## 📖 Commands

| Command                                            | Permission              | Description                    | Default |
| -------------------------------------------------- | ----------------------- | ------------------------------ | ------- |
| `/vs help`                                         | vitalstrike.use         | Show the help menu             | true    |
| `/vs toggle [on-off]`                              | vitalstrike.toggle      | Toggle damage indicators       | true    |
| `/vs reload`                                       | vitalstrike.reload      | Reload plugin configuration    | op      |
| `/vs stats`                                        | vitalstrike.stats       | View combat statistics         | true    |
| `/vs leaderboard [type]`                           | vitalstrike.leaderboard | View damage/combo leaderboards | true    |
| `/vs hologram [on-off]`                            | vitalstrike.hologram    | Toggle combo holograms         | true    |
| `/vs vitalawakening [amount]`                      | vitalstrike.give        | Get Vital Awakening items      | op      |
| `/vs perm <add-remove-list> <player> [permission]` | vitalstrike.admin       | Manage player permissions      | op      |

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

<details>
<summary>Click to View</summary>

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

</details>

### 😵 Knockdown System

<details>
<summary>Click to View</summary>

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

</details>

### 🖥️ Display Settings

<details>
<summary>Click to View</summary>

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

</details>

### 🔄 Animation Directions

<details>
<summary>Click to View</summary>

- `down`: Indicators float downward (default)
- `up`: Indicators float upward
- `left`: Indicators float to the left
- `right`: Indicators float to the right

</details>

## 🎮 Player Settings

Players can customize their experience with the following settings:

1. Toggle damage indicators: `/vs toggle [on|off]`
2. Toggle combo holograms: `/vs hologram [on|off]`
3. View personal statistics: `/vs stats`
4. Check leaderboards: `/vs leaderboard [damage|combo|average]`
5. Use Vital Awakening items for revival

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Author: [Stawa](https://github.com/Stawa)
- Issues: [GitHub Issues](https://github.com/Stawa/VitalStrike/issues)
- Discord: [VitalStrike Community Server](https://discord.com/invite/b4nxvp8NcH)
> I do not accept DMs. Please join the Discord server for support and discussions.

---

<div align="center">
  Made with ❤️ for the Minecraft community
</div>
