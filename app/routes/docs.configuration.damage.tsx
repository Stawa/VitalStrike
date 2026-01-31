import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { FaUsers, FaSkull, FaVolumeUp, FaInfoCircle } from "react-icons/fa";
import { PiGradientFill } from "react-icons/pi";
import BackToTop from "~/components/BackToTop";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Damage Configuration";
  const description =
    "Configure damage indicators, formats, and visual effects for different damage types in VitalStrike.";

  return [
    { rel: "icon", href: "/icon.png", type: "image/png" },
    { property: "og:image", content: "/og-preview.png" },
    { name: "twitter:image", content: "/og-preview.png" },
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "VitalStrike" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content:
        "vitalstrike damage, minecraft damage indicators, damage configuration, damage types, custom sounds",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function DamageConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "simple-formats", label: "Simple Damage Formats", icon: <PiGradientFill /> },
    { id: "group-formats", label: "Group-Based Formats", icon: <FaUsers /> },
    { id: "damage-types", label: "Damage Types", icon: <FaSkull /> },
    { id: "custom-sounds", label: "Custom Sounds", icon: <FaVolumeUp /> },
    { id: "formatting-guide", label: "Formatting Guide", icon: <FaInfoCircle /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Damage <span className="text-primary-600 dark:text-primary-400">Indicators</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Configure damage indicators, formats, and visual effects for different damage types.
          </p>
        </header>

        <div className="mb-12">
          <TableOfContents items={tableItems} />
        </div>

        <div className="space-y-16">
          <ConfigSection
            id="simple-formats"
            title="Simple Damage Formats"
            icon={<PiGradientFill className="text-xl" />}
            description="Basic damage indicator formats for different types of damage"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Simple formats provide an easy way to customize how damage appears above entities.
                Each damage type can have its own unique appearance with colors, gradients, and
                symbols.
              </p>
            </div>

            <ConfigBlock
              title="Basic Format Configuration"
              filename="config.yml"
              code={`damage-indicator: "simple-damage-formats" # Default damage indicator format

simple-damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  poison: "<gradient:#50C878:#228B22>-%.1f ☠</gradient>"
  fire: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>"
  magic: "<gradient:#9400D3:#800080>-%.1f ✨</gradient>"
  heal: "<green>+%.1f ❤"`}
              tip="Use %.1f as a placeholder for the damage amount. The .1f means it will show one decimal place."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-red-200 dark:border-red-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Format Tips
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                You can use{" "}
                <code className="px-1 py-0.5 bg-red-100 dark:bg-red-900/50 rounded">%.0f</code> for
                whole numbers,
                <code className="px-1 py-0.5 bg-red-100 dark:bg-red-900/50 rounded">%.2f</code> for
                two decimal places, etc. Combine with formatting tags like{" "}
                <code className="px-1 py-0.5 bg-red-100 dark:bg-red-900/50 rounded">
                  &lt;bold&gt;
                </code>{" "}
                and
                <code className="px-1 py-0.5 bg-red-100 dark:bg-red-900/50 rounded">
                  &lt;italic&gt;
                </code>{" "}
                for more customization.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="group-formats"
            title="Group-Based Formats"
            icon={<FaUsers className="text-xl" />}
            description="Permission-based damage indicator formats"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Group formats allow different players to have different damage indicator styles
                based on their permissions. This is perfect for creating unique visual effects for
                donors, staff, or different player classes.
              </p>
            </div>

            <ConfigBlock
              title="Group Format Configuration"
              filename="config.yml"
              code={`group-damage-formats:
  default: # Used when no permission matches
    # You can either define specific formats here or use simple-damage-formats
    use-simple-formats: true # Set to true to use simple-damage-formats instead of defining formats here
    damage-formats: # These will be used only if use-simple-formats is false
      default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
      
  water:
    permission: "vitalstrike.group.water"
    damage-formats:
      default: "<gradient:#1E90FF:#00BFFF>-%.1f 💧</gradient>"
      critical: "<bold><gradient:#0000FF:#000080>-%.1f 🌊</gradient></bold>"
      
  fire:
    permission: "vitalstrike.group.fire"
    damage-formats:
      default: "<gradient:#FF4500:#FF8C00>-%.1f 🔥</gradient>"
      critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚔</gradient></bold>"`}
              tip="Players will see the format from the first group where they have the required permission."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800/40 shadow-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200 dark:border-blue-800/40 shadow-sm">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Default Group</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The default group is used when a player doesn&apos;t have permission for any other
                  group. Setting <code>use-simple-formats: true</code> will make it use your simple
                  formats.
                </p>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200 dark:border-blue-800/40 shadow-sm">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Custom Groups</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create as many custom groups as you need. Each group needs a unique permission
                  node and can override any damage type format.
                </p>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="damage-types"
            title="Damage Types"
            icon={<FaSkull className="text-xl" />}
            description="Configure formats for specific damage types"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                VitalStrike supports all Minecraft damage types, allowing you to create unique
                visual indicators for each type of damage a player can receive. This helps players
                quickly identify what&apos;s damaging them.
              </p>
            </div>

            <ConfigBlock
              title="Damage Type Formats"
              filename="config.yml"
              code={`simple-damage-formats:
  # Environmental damage types
  fall: "<gradient:#A9A9A9:#696969>-%.1f 💨</gradient>"
  drown: "<gradient:#1E90FF:#0000CD>-%.1f 💧</gradient>"
  explosion: "<gradient:#FF4500:#8B0000>-%.1f 💥</gradient>"
  contact: "<green>-%.1f 🌵"
  cramming: "<gray>-%.1f 📦"
  dragon: "<dark_purple>-%.1f 🐉"
  dryout: "<yellow>-%.1f 🌊"
  sweep: "<red>-%.1f ⚔"
  falling_block: "<gray>-%.1f 🧱"
  wall: "<gray>-%.1f 💫"
  freeze: "<aqua>-%.1f ❄"
  hot_floor: "<gold>-%.1f 🔥"
  lava: "<dark_red>-%.1f 🌋"
  lightning: "<yellow>-%.1f ⚡"
  projectile: "<gray>-%.1f 🏹"
  sonic_boom: "<dark_aqua>-%.1f 📢"
  starvation: "<gold>-%.1f 🍖"
  suffocation: "<gray>-%.1f ⬛"
  thorns: "<green>-%.1f 🌹"
  void: "<dark_gray>-%.1f ⬇"
  wither: "<dark_gray>-%.1f 💀"
  border: "<red>-%.1f 🌐"`}
              tip="Each damage type can have its own unique format and emoji indicator to help players quickly identify what's damaging them."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-orange-200 dark:border-orange-800/40 shadow-md"
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/40">
                <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                  Environmental
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Fall damage</li>
                  <li>Drowning</li>
                  <li>Suffocation</li>
                  <li>Fire & Lava</li>
                  <li>Void damage</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/40">
                <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Combat</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Melee attacks</li>
                  <li>Projectiles</li>
                  <li>Explosions</li>
                  <li>Magic damage</li>
                  <li>Thorns damage</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/40">
                <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Special</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Dragon breath</li>
                  <li>Sonic boom</li>
                  <li>World border</li>
                  <li>Lightning</li>
                  <li>Wither effect</li>
                </ul>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="custom-sounds"
            title="Custom Sounds"
            icon={<FaVolumeUp className="text-xl" />}
            description="Configure sounds for different damage types"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Enhance the player experience by adding custom sounds for each damage type. When a
                player takes damage, they&apos;ll hear a sound that matches the damage source.
              </p>
            </div>

            <ConfigBlock
              title="Sound Configuration"
              filename="config.yml"
              code={`damage-type-sounds:
  entity_attack: "entity.player.attack.strong"
  critical: "entity.player.attack.crit"
  poison: "entity.spider.hurt"
  fire: "block.fire.ambient"
  fire_tick: "block.fire.ambient"
  kill: "entity.player.death"
  magic: "entity.illusioner.cast_spell"
  fall: "entity.player.small_fall"
  drowning: "block.water.ambient"
  block_explosion: "entity.generic.explode"
  entity_explosion: "entity.generic.explode"
  contact: "block.grass.break"
  cramming: "entity.player.hurt"
  dragon_breath: "entity.ender_dragon.growl"
  dryout: "block.water.ambient"
  entity_sweep_attack: "entity.player.attack.sweep"
  falling_block: "block.stone.break"
  fly_into_wall: "entity.player.hurt"
  freeze: "block.glass.break"
  hot_floor: "block.fire.ambient"
  lava: "block.lava.ambient"
  lightning: "entity.lightning_bolt.thunder"
  projectile: "entity.arrow.hit"
  sonic_boom: "entity.warden.sonic_boom"
  thorns: "block.sweet_berry_bush.hurt"
  void: "entity.player.hurt"
  wither: "entity.wither.ambient"
  world_border: "entity.elder_guardian.curse"`}
              tip="Use Minecraft sound IDs to specify the sounds. These are the same IDs used in commands like /playsound."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Sound Volume & Pitch
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                By default, sounds play at normal volume and pitch. In future updates, you&apos;ll
                be able to customize volume and pitch for each sound type.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="formatting-guide"
            title="Formatting Guide"
            icon={<FaInfoCircle className="text-xl" />}
            description="Learn how to use color codes and formatting tags"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                VitalStrike supports two different formatting systems: MiniMessage format and
                traditional Minecraft color codes. Here&apos;s how to use both systems to create
                beautiful damage indicators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-teal-200 dark:border-teal-800/40 shadow-sm">
                <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">
                  MiniMessage Format
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Modern tag-based format with support for gradients and advanced formatting.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">
                      &lt;red&gt;Text&lt;/red&gt;
                    </code>{" "}
                    - Red text
                  </div>
                  <div>
                    <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">
                      &lt;bold&gt;Text&lt;/bold&gt;
                    </code>{" "}
                    - Bold text
                  </div>
                  <div>
                    <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">
                      &lt;gradient:#FF0000:#0000FF&gt;Text&lt;/gradient&gt;
                    </code>{" "}
                    - Gradient
                  </div>
                </div>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-teal-200 dark:border-teal-800/40 shadow-sm">
                <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">
                  Minecraft Color Codes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Traditional color codes using the ampersand (&) symbol.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">
                      &amp;c
                    </code>{" "}
                    - Red text
                  </div>
                  <div>
                    <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">
                      &amp;l
                    </code>{" "}
                    - Bold text
                  </div>
                  <div>
                    <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">
                      &amp;c&amp;l
                    </code>{" "}
                    - Bold red text
                  </div>
                </div>
              </div>
            </div>

            <ConfigBlock
              title="Example Formats"
              filename="config.yml"
              code={`# MiniMessage Examples
simple-damage-formats:
  example1: "<red>-%.1f ❤</red>"
  example2: "<bold><blue>-%.1f</blue></bold>"
  example3: "<gradient:red:gold>-%.1f ⚔</gradient>"
  example4: "<italic><gradient:green:aqua>-%.1f</gradient></italic>"

# Minecraft Color Code Examples
simple-damage-formats:
  example5: "&c-%.1f ❤"
  example6: "&l&9-%.1f"
  example7: "&6-%.1f &e⚔"
  example8: "&o&a-%.1f"`}
              tip="We recommend using MiniMessage format for the most flexibility and visual options."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-teal-200 dark:border-teal-800/40 shadow-md"
            />
          </ConfigSection>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <DocsNavigation
            previousPage={{
              title: "Basic Settings",
              href: "/docs/configuration/basic",
            }}
            nextPage={{
              title: "Combo System",
              href: "/docs/configuration/combo",
            }}
          />
        </div>
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
