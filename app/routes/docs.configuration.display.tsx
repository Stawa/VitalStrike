import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Display Settings";
  const description =
    "Configure how damage indicators, leaderboards, and menus are displayed in VitalStrike.";

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
        "vitalstrike display, minecraft plugin UI, damage indicators, leaderboard display, menu configuration",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function DisplayConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "basic-settings", label: "Basic Settings", icon: "⚙️" },
    { id: "positioning", label: "Position Settings", icon: "📍" },
    { id: "animation", label: "Animation Settings", icon: "✨" },
    { id: "leaderboard", label: "Leaderboard Display", icon: "🏆" },
    { id: "help-menu", label: "Help Menu Display", icon: "❔" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Display Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure how damage indicators, leaderboards, and menus are displayed
        </p>
      </div>

      <TableOfContents items={tableItems} />

      <div className="space-y-10">
        <ConfigSection
          id="basic-settings"
          title="Basic Settings"
          icon="⚙️"
          description="Configure basic display settings"
        >
          <ConfigBlock
            title="Basic Display Configuration"
            filename="config.yml"
            code={`# Display Settings
display:
  duration: 1.5 # How long damage/heal numbers stay visible (in seconds)`}
            tip="The duration setting controls how long damage numbers remain visible before fading away."
          />
        </ConfigSection>

        <ConfigSection
          id="positioning"
          title="Position Settings"
          icon="📍"
          description="Configure where damage indicators appear"
        >
          <ConfigBlock
            title="Position Configuration"
            filename="config.yml"
            code={`display:
  position:
    y: -0.2 # Vertical offset (negative = lower, positive = higher)
    x: -0.5 # Horizontal offset (negative = left, positive = right)
    random-offset: -1 # Random variation (-1 = disabled, 0 or higher = amount of randomness)
    direction: "down" # Direction for indicators to move (down, up, left, right)`}
            tip="Position settings control where damage numbers appear relative to the entity and how they move."
          />
        </ConfigSection>

        <ConfigSection
          id="animation"
          title="Animation Settings"
          icon="✨"
          description="Configure how damage indicators animate"
        >
          <ConfigBlock
            title="Animation Configuration"
            filename="config.yml"
            code={`display:
  animation:
    fade-in: 0.25 # Fade in duration in seconds
    fade-out: 0.25 # Fade out duration in seconds
    float-speed: 0.03 # Floating speed (blocks per tick)
    float-curve: 0.02 # Curve intensity for floating motion`}
            tip="Animation settings control how damage numbers fade in/out and move through the air."
          />
        </ConfigSection>

        <ConfigSection
          id="leaderboard"
          title="Leaderboard Display"
          icon="🏆"
          description="Configure leaderboard appearance"
        >
          <ConfigBlock
            title="Leaderboard Configuration"
            filename="config.yml"
            code={`leaderboard:
  display:
    title-formats:
      damage: "<gold><bold>Top %d Damage Dealers</bold></gold>"
      combo: "<gold><bold>Top %d Highest Combos</bold></gold>"
      average: "<gold><bold>Top %d Average Damage</bold></gold>"
    entry-format: "<yellow>#%d <white>%s: <gold>%s"
    header: "<dark_gray><strikethrough>                    </strikethrough>"
    footer: "<dark_gray><strikethrough>                    </strikethrough>"
  default-type: "damage"
  display-limit: 10
  number-format:
    damage: "%.1f"
    average: "%.1f"
    combo: "%d"`}
            tip="Customize how leaderboards look, including titles, entries, and number formatting."
          />
        </ConfigSection>

        <ConfigSection
          id="help-menu"
          title="Help Menu Display"
          icon="❔"
          description="Configure help menu appearance"
        >
          <ConfigBlock
            title="Help Menu Configuration"
            filename="config.yml"
            code={`help-menu:
  header: "<dark_gray><strikethrough>                    </strikethrough>"
  title: "<gold><bold>VitalStrike Commands</bold></gold>"
  footer: "<dark_gray><strikethrough>                    </strikethrough>"
  commands:
    toggle:
      command: "/vs toggle [on|off]"
      description: "Toggle damage indicators on or off"
    reload:
      command: "/vs reload"
      description: "Reload the plugin configuration"`}
            tip="Customize the appearance of the help menu, including headers, titles, and command listings."
          />
        </ConfigSection>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Combo System",
            href: "/docs/configuration/combo",
          }}
          nextPage={{
            title: "Messages",
            href: "/docs/configuration/messages",
          }}
        />
      </div>
    </div>
  );
}
