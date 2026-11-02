# VitalStrike

[![Minecraft](https://img.shields.io/badge/Minecraft-26.1+-brightgreen.svg)](https://www.minecraft.net/)
[![Build](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml/badge.svg)](https://github.com/Stawa/VitalStrike/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/Stawa/VitalStrike?include_prereleases&style=flat)](https://github.com/Stawa/VitalStrike/releases)
[![Discord](https://img.shields.io/discord/1334869596196311101?logo=discord&logoColor=white&style=flat)](https://discord.com/invite/b4nxvp8NcH)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-yellow?logo=buymeacoffee&logoColor=white&style=flat)](https://buymeacoffee.com/stawa)

VitalStrike makes combat on a Paper server easier to read and more rewarding. Hits show floating damage numbers, mobs and players get a health bar, and chaining hits builds a combo with ranks and a damage bonus. Kills earn RPG-style XP and levels. Lethal damage knocks a player down instead of killing them, and a teammate can revive them.

Every feature can be turned off or restyled in `config.yml`.

> [!IMPORTANT]
> 2.0.0 needs **Paper 26.1+ and Java 25**. Servers still on 1.21.x should stay on VitalStrike 1.4.0.
>
> Upgrading keeps your `config.yml`. Options you don't have yet use the bundled defaults, so new features are on
> after the update. Delete the file only if you want the new defaults and comments back.

## Features

- **Damage numbers:** floating text per hit, styled by damage type, merged on rapid hits, green for heals.
- **Health bars:** current and max health above anything you hit or heal.
- **Combos:** chain hits for ranks D to SSS, a damage bonus, and a streak hologram.
- **Kills and levels:** a "SLAIN" marker on kills, XP from the victim's max health, saved levels.
- **Knockdown:** lethal damage downs a player, and teammates can revive them.
- **Rewards:** items and XP at lifetime-damage milestones.
- **Stats and leaderboards:** damage, hits, best combo, kills and level.
- **World control:** disable per world or dimension, and scale damage per dimension.
- **Light on the server:** display entities, one shared task, nothing left behind after a crash.

Everything is configurable and can be switched off in `config.yml`. Per-group damage styles are set with permissions.

## Requirements

- Java 25 or newer
- [Paper](https://papermc.io) 26.1 or newer, or a Paper fork. Spigot and Bukkit are not supported.

## Installation

1. Download the latest JAR from the [Releases page](https://github.com/Stawa/VitalStrike/releases).
2. Put it in your server's `plugins` folder.
3. Start the server. This creates `plugins/VitalStrike/config.yml`.
4. Edit the config, then run `/vs reload`.

## Commands

The command is `/vitalstrike`, or `/vs` for short. Short names: `top`, `holo`, `give`, `pack`. The older names (`leaderboard`, `hologram`, `vitalawakening`, `resourcepack`, `lb`, `va`, `rp`) still work.

| Command                      | Permission                      | What it does                                   |
| :--------------------------- | :------------------------------ | :--------------------------------------------- |
| `/vs help [section]`         | `vitalstrike.use`               | Shows the help menu.                           |
| `/vs toggle [on/off]`        | `vitalstrike.toggle`            | Turns your own indicators on or off.           |
| `/vs holo [on/off]`          | `vitalstrike.hologram`          | Turns your combo hologram on or off.           |
| `/vs stats [player]`         | `vitalstrike.stats`             | Shows level, kills and combat stats.           |
| `/vs top [type]`             | `vitalstrike.leaderboard`       | Shows the `damage`, `combo` or `average` top.  |
| `/vs pack`                   | `vitalstrike.resourcepack`      | Loads the optional resource pack.              |
| `/vs reload`                 | `vitalstrike.reload`            | Reloads the config and clears floating text.   |
| `/vs clear`                  | `vitalstrike.clear`             | Removes all floating text, including strays.   |
| `/vs revive <player>`        | `vitalstrike.revive`            | Revives a downed player.                       |
| `/vs give [n] [p]`           | `vitalstrike.give`              | Gives Vital Awakening items.                   |
| `/vs perm <action> <player>` | `vitalstrike.admin.permissions` | Manages stored group permissions.              |
| `/vs config [apply <code>]`  | `vitalstrike.admin.config`      | Edits the config in your browser (web editor). |

Admin permissions (`reload`, `clear`, `give`, `revive`, `admin.permissions`) default to operators. `vitalstrike.admin` grants all of them.

To give a player a damage style from `group-damage-formats`, grant `vitalstrike.group.<name>`.

## Configuration

Everything lives in `plugins/VitalStrike/config.yml`, and the file is commented. The main sections are:

| Section                           | Controls                                                       |
| :-------------------------------- | :------------------------------------------------------------- |
| `display`                         | Damage number duration, position, animation and merging.       |
| `simple-damage-formats`           | Text for each damage type.                                     |
| `group-damage-formats`            | Different styles per permission group.                         |
| `damage-type-sounds`              | Sound played for each damage type.                             |
| `health-bar`                      | Bar length, height, duration and text.                         |
| `combo`                           | Reset time, decay, damage multipliers, ranks, hologram.        |
| `kill-indicator` and `levels`     | Kill marker text, XP rate, level curve and level-up effects.   |
| `knockdown-system`                | Down time, downed health, revive time and messages.            |
| `rewards`                         | Damage milestones and what they pay.                           |
| `world-settings`                  | Disabled worlds and per-dimension damage scaling.              |

Text uses [MiniMessage](https://docs.advntr.dev/minimessage/format.html), and `&` color codes also work.

More guides: [website](https://vitalstrike.vercel.app/) and [JavaDoc](https://stawa.github.io/VitalStrike/javadoc/).

## Building from source

You don't need a JDK installed. The Gradle wrapper downloads Java 25 for you.

```bash
git clone https://github.com/Stawa/VitalStrike.git
cd VitalStrike
./gradlew build
```

The JAR ends up in `build/libs/`. The scripts in `scripts/` do the same build and print the JAR name: `scripts/build.sh` on Linux and macOS, `scripts/build.bat` on Windows.

## Support

VitalStrike is maintained by one person, so replies can take a while, but bug reports and ideas are welcome.

- Bugs and feature requests: [GitHub Issues](https://github.com/Stawa/VitalStrike/issues)
- Questions and chat: [Discord](https://discord.com/invite/b4nxvp8NcH)
- Support development: [Buy Me a Coffee](https://buymeacoffee.com/stawa)

## License

GNU General Public License v3.0. See [LICENSE](LICENSE).
