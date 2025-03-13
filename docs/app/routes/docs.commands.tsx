import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Commands - Complete Command Reference";
  const description =
    "Comprehensive guide to all VitalStrike commands, including basic usage, toggles, statistics, and administrative commands.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
};

export default function CommandsPage() {
  useHighlightCode();

  const tableItems = [
    { id: "basic-commands", label: "Basic Commands", icon: "⌨️" },
    { id: "toggle-commands", label: "Toggle Commands", icon: "🔄" },
    { id: "stats-commands", label: "Statistics Commands", icon: "📊" },
    { id: "admin-commands", label: "Admin Commands", icon: "🛠️" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Command Reference
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          VitalStrike Commands
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Complete list of commands and their usage in VitalStrike
        </p>
      </div>

      <TableOfContents items={tableItems} />

      <div className="space-y-10">
        <ConfigSection
          id="basic-commands"
          title="Basic Commands"
          icon="⌨️"
          description="Essential commands for using VitalStrike"
        >
          <ConfigBlock
            title="Help Command"
            code={`/vs help [section]
/vs help combos     # View combo system help
/vs help permissions # View permissions help`}
            tip="Shows the help menu or specific help sections. Use without arguments to see all commands."
            filename={"plugin.yml"}
          />
        </ConfigSection>

        <ConfigSection
          id="toggle-commands"
          title="Toggle Commands"
          icon="🔄"
          description="Commands to toggle plugin features"
        >
          <ConfigBlock
            title="Damage Indicator Toggle"
            code={`/vs toggle [on|off]    # Toggle damage indicators
/vs toggle on       # Enable damage indicators
/vs toggle off      # Disable damage indicators`}
            tip="Toggle damage indicators on or off. Requires vitalstrike.toggle permission."
            filename={"plugin.yml"}
          />
          <ConfigBlock
            title="Hologram Toggle"
            code={`/vs hologram [on|off]   # Toggle combo holograms
/vs hologram on     # Enable combo holograms
/vs hologram off    # Disable combo holograms`}
            tip="Toggle combo hologram display. Requires vitalstrike.hologram permission."
            filename={"plugin.yml"}
          />
        </ConfigSection>

        <ConfigSection
          id="stats-commands"
          title="Statistics Commands"
          icon="📊"
          description="Commands to view statistics and leaderboards"
        >
          <ConfigBlock
            title="Player Statistics"
            code={`/vs stats              # View your combat statistics`}
            tip="Shows your personal combat statistics including highest combo, total damage, and average damage per hit."
            filename={"plugin.yml"}
          />
          <ConfigBlock
            title="Leaderboard Commands"
            code={`/vs leaderboard [type]  # View leaderboards
/vs lb damage       # View top damage dealers
/vs lb combo        # View highest combos
/vs lb average      # View highest average damage`}
            tip="View different types of leaderboards. Requires vitalstrike.leaderboard permission."
            filename={"plugin.yml"}
          />
        </ConfigSection>

        <ConfigSection
          id="admin-commands"
          title="Admin Commands"
          icon="🛠️"
          description="Administrative commands for managing the plugin"
        >
          <ConfigBlock
            title="Configuration Commands"
            code={`/vs reload             # Reload plugin configuration`}
            tip="Reloads the plugin configuration. Requires vitalstrike.reload permission."
            filename={"plugin.yml"}
          />
          <ConfigBlock
            title="Permission Management"
            code={`/vs perm add <player> <permission>    # Add permission
/vs perm remove <player> <permission> # Remove permission
/vs perm list <player>                # List permissions`}
            tip="Manage player permissions. Requires vitalstrike.admin.permissions permission."
            filename={"plugin.yml"}
          />
        </ConfigSection>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Getting Started",
            href: "/docs/getting-started",
          }}
          nextPage={{
            title: "Configuration",
            href: "/docs/configuration",
          }}
        />
      </div>
    </div>
  );
}
