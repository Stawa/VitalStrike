import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Permissions Configuration";
  const description =
    "Configure user permissions and access control for VitalStrike features.";

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
        "vitalstrike permissions, minecraft plugin permissions, access control, user permissions, group permissions",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function PermissionsConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "basic-permissions", label: "Basic Permissions", icon: "🔑" },
    { id: "admin-permissions", label: "Admin Permissions", icon: "👑" },
    { id: "group-permissions", label: "Group Permissions", icon: "👥" },
    { id: "defaults", label: "Default Settings", icon: "⚙️" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Permissions Configuration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure user permissions and access control for VitalStrike features
        </p>
      </div>

      <TableOfContents items={tableItems} />

      <div className="space-y-10">
        <ConfigSection
          id="basic-permissions"
          title="Basic Permissions"
          icon="🔑"
          description="Essential permissions for basic plugin usage"
        >
          <ConfigBlock
            title="Basic Permission Nodes"
            filename="plugin.yml"
            code={`permissions:
  vitalstrike.use:
    description: Allows using VitalStrike commands
    default: true
  vitalstrike.toggle:
    description: Allows toggling damage indicators for yourself
    default: true
  vitalstrike.stats:
    description: Allows viewing combat statistics
    default: true
  vitalstrike.leaderboard:
    description: Allows viewing the leaderboard
    default: true
  vitalstrike.hologram:
    description: Allows toggling combo hologram display
    default: true`}
            tip="These permissions control access to basic plugin features and are typically granted to all players."
          />
        </ConfigSection>

        <ConfigSection
          id="admin-permissions"
          title="Admin Permissions"
          icon="👑"
          description="Administrative permissions for plugin management"
        >
          <ConfigBlock
            title="Admin Permission Nodes"
            filename="plugin.yml"
            code={`permissions:
  vitalstrike.admin.permissions:
    description: Allows managing VitalStrike permissions
    default: op
  vitalstrike.reload:
    description: Allows reloading the plugin configuration
    default: op`}
            tip="Admin permissions are typically restricted to server operators and administrators."
          />
        </ConfigSection>

        <ConfigSection
          id="group-permissions"
          title="Group Permissions"
          icon="👥"
          description="Custom group-based damage indicator formats"
        >
          <ConfigBlock
            title="Group Format Permissions"
            filename="config.yml"
            code={`group-damage-formats:
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
            tip="Group permissions allow different players to have unique damage indicator styles."
          />
        </ConfigSection>

        <ConfigSection
          id="defaults"
          title="Default Settings"
          icon="⚙️"
          description="Default permission configurations"
        >
          <ConfigBlock
            title="Command Configuration"
            filename="plugin.yml"
            code={`commands:
  vitalstrike:
    permission: vitalstrike.use
    permission-message: §cYou don't have permission to use VitalStrike commands!
    aliases: [vs]`}
            tip="The base command requires the vitalstrike.use permission by default."
          />
          <ConfigBlock
            title="No Permission Message"
            filename="config.yml"
            code={`messages:
  no-permission: "<red>You don't have permission to use this command!"`}
            tip="This message is shown when a player attempts to use a command without the required permission."
          />
        </ConfigSection>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Messages",
            href: "/docs/configuration/messages",
          }}
          nextPage={{
            title: "Full Configuration",
            href: "/docs/configuration/full",
          }}
        />
      </div>
    </div>
  );
}
