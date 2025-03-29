import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Messages Configuration";
  const description =
    "Configure system messages, help menus, and text formatting in VitalStrike.";

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
        "vitalstrike messages, minecraft plugin messages, text formatting, help menu, system messages",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function MessagesConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "system-messages", label: "System Messages", icon: "💬" },
    { id: "color-formats", label: "Color Formats", icon: "🎨" },
    { id: "help-sections", label: "Help Sections", icon: "❔" },
    { id: "command-help", label: "Command Help", icon: "📝" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Messages Configuration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure system messages, help menus, and text formatting
        </p>
      </div>

      <TableOfContents items={tableItems} />

      <div className="space-y-10">
        <ConfigSection
          id="system-messages"
          title="System Messages"
          icon="💬"
          description="Configure basic system messages"
        >
          <ConfigBlock
            title="Basic Messages Configuration"
            filename="config.yml"
            code={`messages:
  no-permission: "<red>You don't have permission to use this command!"
  enabled-personal: "<green>VitalStrike damage indicators enabled for you!"
  disabled-personal: "<red>VitalStrike damage indicators disabled for you!"
  already-enabled: "<yellow>VitalStrike damage indicators are already enabled for you!"
  already-disabled: "<yellow>VitalStrike damage indicators are already disabled for you!"
  config-reloaded: "<green>Configuration reloaded successfully!"`}
            tip="System messages are displayed to players when they interact with the plugin's commands and features."
          />
        </ConfigSection>

        <ConfigSection
          id="color-formats"
          title="Color Formats"
          icon="🎨"
          description="Available color and formatting options"
        >
          <ConfigBlock
            title="Color Format Guide"
            filename="config.yml"
            code={`# Color Formats Available:
# Basic Colors:
# <red>, <dark_red> - Red variants
# <blue>, <dark_blue> - Blue variants
# <green>, <dark_green> - Green variants
# <aqua>, <dark_aqua> - Aqua variants
# <purple>, <dark_purple> - Purple variants
# <yellow>, <gold> - Yellow/gold variants
# <gray>, <dark_gray> - Gray variants
# <black>, <white> - Black and white

# Formatting:
# <bold> - Bold text
# <italic> - Italic text
# <underlined> - Underlined text
# <strikethrough> - Strikethrough text
# <obfuscated> - Obfuscated text

# Gradients:
# <gradient:color1:color2>text</gradient>`}
            tip="Use these color codes and formatting options to customize any message in the plugin."
          />
        </ConfigSection>

        <ConfigSection
          id="help-sections"
          title="Help Sections"
          icon="❔"
          description="Configure help menu sections"
        >
          <ConfigBlock
            title="Help Sections Configuration"
            filename="config.yml"
            code={`help-menu:
  sections:
    combos:
      title: "<gold><bold>Combo System Help</bold></gold>"
      content:
        1: "<yellow>Combos increase when you hit enemies in succession"
        2: "<yellow>Higher combos give damage multipliers"
        3: "<yellow>Combos decay after a period of inactivity"
    permissions:
      title: "<gold><bold>Permissions Help</bold></gold>"
      content:
        1: "<yellow>vitalstrike.use - Basic plugin usage"
        2: "<yellow>vitalstrike.toggle - Toggle indicators"
        3: "<yellow>vitalstrike.reload - Reload configuration"
        4: "<yellow>vitalstrike.stats - View statistics"
        5: "<yellow>vitalstrike.leaderboard - View leaderboards"
        6: "<yellow>vitalstrike.hologram - Toggle holograms"
        7: "<yellow>vitalstrike.admin.permissions - Manage permissions"`}
            tip="Help sections provide detailed information about different aspects of the plugin."
          />
        </ConfigSection>

        <ConfigSection
          id="command-help"
          title="Command Help"
          icon="📝"
          description="Configure command descriptions and usage"
        >
          <ConfigBlock
            title="Command Help Configuration"
            filename="config.yml"
            code={`help-menu:
  commands:
    toggle:
      command: "/vs toggle [on|off]"
      description: "Toggle damage indicators on or off"
    reload:
      command: "/vs reload"
      description: "Reload the plugin configuration"
    stats:
      command: "/vs stats"
      description: "View your combat statistics"
    leaderboard:
      command: "/vs lb [damage|combo|average]"
      description: "View the damage leaderboards"
    hologram:
      command: "/vs hologram [on|off]"
      description: "Toggle combo holograms on or off"
    permissions:
      command: "/vs perm <add|remove|list> <player> [permission]"
      description: "Manage player permissions"
    help:
      command: "/vs help [section]"
      description: "Show this help menu or a specific section"`}
            tip="Command help provides information about available commands and their usage."
          />
        </ConfigSection>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Display Settings",
            href: "/docs/configuration/display",
          }}
          nextPage={{
            title: "Permissions",
            href: "/docs/configuration/permissions",
          }}
        />
      </div>
    </div>
  );
}
