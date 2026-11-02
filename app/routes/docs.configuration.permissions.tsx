import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { PageHeader } from "~/components/PageHeader";
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
      <div>
        <PageHeader title={<>Permissions Configuration</>}>
          Configure permissions and permission groups for your server.
        </PageHeader>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="group-permissions"
            title="Group Permissions"
            icon={<FaUsers className="text-xl" />}
            description="Permission groups for damage formats"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
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
            />

            <div className="mt-6 p-4 rounded-2xl bg-raised">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Creating Custom Groups
              </h4>
              <p className="text-sm text-ink">
                You can create as many custom groups as you need by adding new entries to the{" "}
                <code>group-damage-formats</code> section. Each group needs a unique identifier, a
                permission node, and custom damage formats. Players with the corresponding
                permission will see damage indicators in the specified format.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-surface rounded-2xl p-4">
                <h4 className="font-medium text-ink mb-2">Example: Water Group</h4>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Permission:{" "}
                    <code className="font-mono bg-raised px-1.5 py-0.5 rounded text-xs">
                      vitalstrike.group.water
                    </code>
                  </p>
                  <div className="bg-surface rounded p-3">
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      Normal damage:{" "}
                      <span className="font-bold inline-flex items-center gap-1">
                        -10.5 <FaTint className="text-sm" />
                      </span>
                    </p>
                    <p className="text-[15px] leading-relaxed text-muted-foreground font-bold">
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
              <div className="bg-surface rounded-2xl p-4">
                <h4 className="font-medium text-ink mb-2">Example: Fire Group</h4>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Permission:{" "}
                    <code className="font-mono bg-raised px-1.5 py-0.5 rounded text-xs">
                      vitalstrike.group.fire
                    </code>
                  </p>
                  <div className="bg-surface rounded p-3">
                    <p className="text-sm text-muted-foreground">
                      Normal damage:{" "}
                      <span className="font-bold inline-flex items-center gap-1">
                        -10.5 <FaFire className="text-sm" />
                      </span>
                    </p>
                    <p className="text-sm text-ink font-bold">
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
            <div className="mb-6 text-muted-foreground">
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
            />

            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Default Permissions
              </h4>
              <p className="text-sm text-ink">
                Most basic features like viewing statistics and toggling indicators are enabled by
                default for all players. Administrative permissions like managing other
                players&apos; permissions and reloading the plugin are restricted to server
                operators by default.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-surface rounded-2xl p-4">
                <h4 className="font-medium text-ink mb-2">Administrative Permissions</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.admin.permissions
                    </span>
                    <span>Manage plugin permissions (op)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.reload
                    </span>
                    <span>Reload plugin configuration (op)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.give
                    </span>
                    <span>Give Vital Awakening items (op)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-surface rounded-2xl p-4">
                <h4 className="font-medium text-ink mb-2">Player Permissions</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.use
                    </span>
                    <span>Use plugin commands</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.toggle
                    </span>
                    <span>Toggle damage indicators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.stats
                    </span>
                    <span>View combat statistics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.leaderboard
                    </span>
                    <span>Access leaderboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
                      vitalstrike.hologram
                    </span>
                    <span>Toggle combo holograms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-xs mr-2 mt-0.5">
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
            <div className="mb-6 text-muted-foreground">
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
            />

            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Permission Storage
              </h4>
              <p className="text-sm text-ink">
                Permissions granted through these commands are stored in the plugin&apos;s database
                file (playerdata.yml). They will persist across server restarts. For more permanent
                permission management, consider using a dedicated permissions plugin like LuckPerms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
              <div className="bg-surface rounded-2xl p-4">
                <h4 className="font-medium text-ink mb-2">Command Examples</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-ink mb-1">Adding a permission:</p>
                    <div className="bg-surface rounded p-2 font-mono text-sm">
                      /vs perm add Steve vitalstrike.group.fire
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This gives Steve the fire group permission, changing their damage indicator
                      format.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink mb-1">Removing a permission:</p>
                    <div className="bg-surface rounded p-2 font-mono text-sm">
                      /vs perm remove Alex vitalstrike.hologram
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This removes Alex&apos;s ability to toggle combo holograms.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink mb-1">Listing permissions:</p>
                    <div className="bg-surface rounded p-2 font-mono text-sm">
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

        <div>
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
      </div>
    </div>
  );
}
