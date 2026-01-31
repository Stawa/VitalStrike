import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import {
  FaCrosshairs,
  FaFire,
  FaInfoCircle,
  FaTint,
  FaUserCog,
  FaUserLock,
  FaUsers,
  FaWater,
} from "react-icons/fa";
import BackToTop from "~/components/BackToTop";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Permissions Configuration";
  const description = "Configure permissions and permission groups for VitalStrike plugin.";

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
        "vitalstrike permissions, minecraft plugin permissions, permission groups, admin permissions",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function PermissionsConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "group-permissions", label: "Group Permissions", icon: <FaUsers /> },
    { id: "plugin-permissions", label: "Plugin Permissions", icon: <FaUserLock /> },
    { id: "permission-commands", label: "Permission Commands", icon: <FaUserCog /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Permissions{" "}
            <span className="text-primary-600 dark:text-primary-400">Configuration</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Configure permissions and permission groups for your server.
          </p>
        </header>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="group-permissions"
            title="Group Permissions"
            icon={<FaUsers className="text-xl" />}
            description="Permission groups for damage formats"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Group permissions allow you to assign different damage indicator formats to
                different player groups. This feature enables you to create visually distinct damage
                indicators for different ranks or classes on your server.
              </p>
            </div>

            <ConfigBlock
              title="Group Permission Configuration"
              filename="config.yml"
              code={`group-damage-formats:
  default: # Used when no permission matches
    use-simple-formats: true # Set to true to use simple-damage-formats instead
    
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
              tip="Group permissions allow you to assign different damage indicator formats to different player groups."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-pink-200 dark:border-pink-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800/40">
              <h4 className="text-sm font-medium text-pink-800 dark:text-pink-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Creating Custom Groups
              </h4>
              <p className="text-sm text-pink-700 dark:text-pink-400">
                You can create as many custom groups as you need by adding new entries to the{" "}
                <code>group-damage-formats</code> section. Each group needs a unique identifier, a
                permission node, and custom damage formats. Players with the corresponding
                permission will see damage indicators in the specified format.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">
                  Example: Water Group
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permission:{" "}
                    <code className="font-mono bg-pink-100 dark:bg-pink-900/50 px-1.5 py-0.5 rounded text-xs">
                      vitalstrike.group.water
                    </code>
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                    <p className="text-sm text-blue-500 dark:text-blue-400">
                      Normal damage:{" "}
                      <span className="font-bold inline-flex items-center gap-1">
                        -10.5 <FaTint className="text-sm" />
                      </span>
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-bold">
                      Critical damage:{" "}
                      <span className="inline-flex items-center gap-1">
                        -15.0 <FaWater className="text-sm" />
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Players with the water group permission will see blue-themed damage indicators.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">
                  Example: Fire Group
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permission:{" "}
                    <code className="font-mono bg-pink-100 dark:bg-pink-900/50 px-1.5 py-0.5 rounded text-xs">
                      vitalstrike.group.fire
                    </code>
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                    <p className="text-sm text-orange-500 dark:text-orange-400">
                      Normal damage:{" "}
                      <span className="font-bold inline-flex items-center gap-1">
                        -10.5 <FaFire className="text-sm" />
                      </span>
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400 font-bold">
                      Critical damage:{" "}
                      <span className="inline-flex items-center gap-1">
                        -15.0 <FaCrosshairs className="text-sm" />
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Players with the fire group permission will see red/orange-themed damage
                    indicators.
                  </p>
                </div>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="plugin-permissions"
            title="Plugin Permissions"
            icon={<FaUserCog className="text-xl" />}
            description="Core permissions for VitalStrike functionality"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                VitalStrike uses a permission-based system to control access to various features.
                Some permissions are granted by default to all players, while others are restricted
                to server operators.
              </p>
            </div>

            <ConfigBlock
              title="Permission Configuration"
              filename="plugin.yml"
              code={`permissions:
  vitalstrike.admin.permissions:
    description: Allows managing VitalStrike permissions
    default: op
  vitalstrike.reload:
    description: Allows reloading the plugin configuration
    default: op
  vitalstrike.give:
    description: Allows giving Vital Awakening items
    default: op
  vitalstrike.use:
    description: Allows using VitalStrike commands
    default: true
  vitalstrike.toggle:
    description: Allows toggling damage indicators
    default: true
  vitalstrike.stats:
    description: Allows viewing combat statistics
    default: true
  vitalstrike.leaderboard:
    description: Allows viewing the leaderboard
    default: true
  vitalstrike.hologram:
    description: Allows toggling combo hologram display
    default: true
  vitalstrike.resourcepack:
    description: Allows players to use the resource pack command
    default: true`}
              tip="Permissions control access to plugin features and commands"
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Default Permissions
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Most basic features like viewing statistics and toggling indicators are enabled by
                default for all players. Administrative permissions like managing other
                players&apos; permissions and reloading the plugin are restricted to server
                operators by default.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200 dark:border-amber-800/40 shadow-sm">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Administrative Permissions
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.admin.permissions
                    </span>
                    <span>Manage plugin permissions (op)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.reload
                    </span>
                    <span>Reload plugin configuration (op)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.give
                    </span>
                    <span>Give Vital Awakening items (op)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200 dark:border-amber-800/40 shadow-sm">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Player Permissions
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.use
                    </span>
                    <span>Use plugin commands</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.toggle
                    </span>
                    <span>Toggle damage indicators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.stats
                    </span>
                    <span>View combat statistics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.leaderboard
                    </span>
                    <span>Access leaderboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.hologram
                    </span>
                    <span>Toggle combo holograms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.resourcepack
                    </span>
                    <span>Use the resource pack command</span>
                  </li>
                </ul>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="permission-commands"
            title="Permission Commands"
            icon={<FaUserLock className="text-xl" />}
            description="Commands for managing permissions"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                VitalStrike provides commands for managing player permissions directly in-game.
                These commands allow administrators to grant or revoke permissions without editing
                configuration files.
              </p>
            </div>

            <ConfigBlock
              title="Permission Command Usage"
              filename="config.yml"
              code={`# Permission Commands
/vs perm add <player> <permission> # Add a permission to a player
/vs perm remove <player> <permission> # Remove a permission from a player
/vs perm list <player> # List all permissions for a player

# Examples:
/vs perm add Steve vitalstrike.toggle
/vs perm remove Alex vitalstrike.hologram
/vs perm list Steve`}
              tip="These commands allow administrators to manage player permissions in-game."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-green-200 dark:border-green-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Permission Storage
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Permissions granted through these commands are stored in the plugin&apos;s database
                file (playerdata.yml). They will persist across server restarts. For more permanent
                permission management, consider using a dedicated permissions plugin like LuckPerms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-800/40 shadow-sm">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  Command Examples
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adding a permission:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-sm">
                      /vs perm add Steve vitalstrike.group.fire
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This gives Steve the fire group permission, changing their damage indicator
                      format.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Removing a permission:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-sm">
                      /vs perm remove Alex vitalstrike.hologram
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This removes Alex&apos;s ability to toggle combo holograms.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Listing permissions:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-sm">
                      /vs perm list Steve
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This shows all VitalStrike permissions that Steve currently has.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ConfigSection>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <DocsNavigation
            previousPage={{
              title: "Messages",
              href: "/docs/configuration/messages",
            }}
            nextPage={{
              title: "Knockdown System",
              href: "/docs/configuration/knockdown",
            }}
          />
        </div>
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
