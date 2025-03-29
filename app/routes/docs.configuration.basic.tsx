import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Basic Configuration";
  const description =
    "Configure core VitalStrike settings including general options, database, update checker, display settings, and messages.";

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
        "vitalstrike settings, minecraft plugin configuration, basic settings, database configuration, plugin messages",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function BasicConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "general-settings", label: "General Settings", icon: "⚙️" },
    { id: "database", label: "Database Configuration", icon: "💾" },
    { id: "update-checker", label: "Update Checker", icon: "🔄" },
    { id: "display", label: "Display Settings", icon: "🎯" },
    { id: "messages", label: "Messages", icon: "💬" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Basic Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure core plugin settings, display options, and basic
          functionality
        </p>
      </div>

      <TableOfContents items={tableItems} />

      <div className="space-y-10">
        <ConfigSection
          id="general-settings"
          title="General Settings"
          icon="⚙️"
          description="Core plugin configuration options"
        >
          <ConfigBlock
            title="Basic Plugin Settings"
            filename="config.yml"
            code={`# General Settings
  enabled: true`}
            tip="These settings control the core functionality of the plugin. The prefix is used for all plugin messages."
          />
        </ConfigSection>

        <ConfigSection
          id="database"
          title="Database Configuration"
          icon="💾"
          description="Configure how player data is stored"
        >
          <ConfigBlock
            title="Database Settings"
            filename="config.yml"
            code={`# Database Settings
  database:
    enabled: true
    file: "playerdata.yml"`}
            tip="Simple file-based storage for player data. Perfect for small to medium-sized servers."
          />
        </ConfigSection>

        <ConfigSection
          id="update-checker"
          title="Update Checker"
          icon="🔄"
          description="Configure automatic update checking"
        >
          <ConfigBlock
            title="Update Settings"
            filename="config.yml"
            code={`# Update Checker
  update-checker:
    enabled: true`}
            tip="Enable or disable automatic checking for new plugin versions."
          />
        </ConfigSection>

        <ConfigSection
          id="display"
          title="Display Settings"
          icon="🎯"
          description="Configure how damage indicators are displayed"
        >
          <ConfigBlock
            title="Display Configuration"
            filename="config.yml"
            code={`# Display Settings
  display:
    duration: 1.5 # How long damage/heal numbers stay visible (in seconds)
    position:
      y: -0.2 # Vertical offset (negative = lower, positive = higher)
      x: -0.5 # Horizontal offset (negative = left, positive = right)
      random-offset: -1 # Random variation (-1 = disabled, 0 or higher = amount of randomness)
      direction: "down" # Direction for indicators to move
    animation:
      fade-in: 0.25 # Fade in duration in seconds
      fade-out: 0.25 # Fade out duration in seconds
      float-speed: 0.03 # Floating speed (blocks per tick)
      float-curve: 0.02 # Curve intensity for floating motion`}
            tip="Fine-tune how damage indicators appear and animate in-game."
          />
        </ConfigSection>

        <ConfigSection
          id="messages"
          title="Messages"
          icon="💬"
          description="Customize plugin messages"
        >
          <ConfigBlock
            title="Message Configuration"
            filename="config.yml"
            code={`# Messages
  messages:
    no-permission: "<red>You don't have permission to use this command!"
    enabled-personal: "<green>VitalStrike damage indicators enabled for you!"
    disabled-personal: "<red>VitalStrike damage indicators disabled for you!"
    already-enabled: "<yellow>VitalStrike damage indicators are already enabled for you!"
    already-disabled: "<yellow>VitalStrike damage indicators are already disabled for you!"
    config-reloaded: "<green>Configuration reloaded successfully!"`}
            tip="Customize all plugin messages. Supports MiniMessage format for colors and formatting."
          />
        </ConfigSection>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Configuration Overview",
            href: "/docs/configuration",
          }}
          nextPage={{
            title: "Damage Formats",
            href: "/docs/configuration/damage-formats",
          }}
        />
      </div>
    </div>
  );
}
