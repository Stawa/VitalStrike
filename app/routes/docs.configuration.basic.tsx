import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { FaCog, FaDatabase, FaSyncAlt, FaEye, FaComments, FaGlobe } from "react-icons/fa";
import { PageHeader } from "~/components/PageHeader";

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
    { id: "general-settings", label: "General Settings", icon: <FaCog /> },
    { id: "database", label: "Database Configuration", icon: <FaDatabase /> },
    { id: "update-checker", label: "Update Checker", icon: <FaSyncAlt /> },
    { id: "world-settings", label: "World Settings", icon: <FaGlobe /> },
    { id: "display", label: "Display Settings", icon: <FaEye /> },
    { id: "messages", label: "Messages", icon: <FaComments /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div>
        <PageHeader title={<>Basic Settings</>}>
          Configure core plugin settings, display options, and basic functionality.
        </PageHeader>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="general-settings"
            title="General Settings"
            icon={<FaCog className="text-xl" />}
            description="Core plugin configuration options"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
              <p>
                These settings control the core functionality of the plugin. The master switch
                enables or disables the entire plugin.
              </p>
            </div>

            <ConfigBlock
              title="Basic Plugin Settings"
              filename="config.yml"
              code={`# General Settings
enabled: true`}
              tip="This is the master switch for the entire plugin. Set to false to disable all functionality."
            />

            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Pro Tip
              </h4>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                You can use permission-based toggles to enable/disable the plugin for specific
                players or groups instead of disabling it entirely.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="database"
            title="Database Configuration"
            icon={<FaDatabase className="text-xl" />}
            description="Configure how player data is stored"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
              <p>
                VitalStrike stores player statistics, preferences, and other data in a database.
                Currently, the plugin supports file-based storage.
              </p>
            </div>

            <ConfigBlock
              title="Database Settings"
              filename="config.yml"
              code={`# Database Settings
database:
  enabled: true
  file: "playerdata.yml"`}
              tip="Simple file-based storage for player data. Perfect for small to medium-sized servers."
            />

            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Database Performance
              </h4>
              <p className="text-sm text-ink">
                The file-based database is automatically saved when the server shuts down and
                periodically during operation. For larger servers, consider backing up the
                playerdata.yml file regularly.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="update-checker"
            title="Update Checker"
            icon={<FaSyncAlt className="text-xl" />}
            description="Configure automatic update checking"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
              <p>
                VitalStrike can automatically check for updates when your server starts up. This
                helps ensure you&apos;re always running the latest version with the newest features
                and bug fixes.
              </p>
            </div>

            <ConfigBlock
              title="Update Settings"
              filename="config.yml"
              code={`# Update Checker
update-checker:
  enabled: true`}
              tip="Enable or disable automatic checking for new plugin versions."
            />

            <div className="mt-6 p-4 rounded-2xl bg-raised">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Update Notifications
              </h4>
              <p className="text-sm text-ink">
                When a new version is available, a notification will be shown to server operators
                when they join the game. You can also check for updates manually with the reload
                command.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="world-settings"
            title="World Settings"
            icon={<FaGlobe className="text-xl" />}
            description="Configure world-specific behavior"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
              <p>
                Control how VitalStrike behaves in different worlds and dimensions. You can disable
                the plugin in specific worlds or adjust damage multipliers for different dimensions
                or for individual worlds by name.
              </p>
            </div>

            <ConfigBlock
              title="World Configuration"
              filename="config.yml"
              code={`# World Settings
world-settings:
  enabled: true # Master switch for world-based control
  disabled-worlds:
    - "example_world"
    - "minigames_world"
  # Dimension-specific settings
  dimensions:
    overworld:
      enabled: true
      damage-multiplier: 1.0 # Normal damage in overworld
    nether:
      enabled: true
      damage-multiplier: 1.2 # 20% more damage in nether
    end:
      enabled: true
      damage-multiplier: 1.1 # 10% more damage in end
  # Individual worlds by name. These win over the dimension settings above.
  worlds:
    arena:
      enabled: true
      damage-multiplier: 2.0 # Double damage in the "arena" world`}
              tip="A world listed under worlds wins over its dimension. Use the world's folder name. You can also add worlds in the web editor with /vs config."
            />

            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h4 className="text-sm font-medium text-ink mb-2">Protected regions</h4>
              <p className="text-sm text-ink">
                VitalStrike counts hits after other plugins have had their say. Damage cancelled by
                WorldGuard PvP flags or spawn protection never creates indicators, combos, stats or
                rewards, so no extra setting is needed. The old <code>respect-worldguard-pvp</code>{" "}
                option was removed in 1.5.0.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="display"
            title="Display Settings"
            icon={<FaEye className="text-xl" />}
            description="Configure how damage indicators are displayed"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
              <p>
                These settings control the visual appearance and animation of damage indicators.
                Adjust how long they stay visible, their position, and animation properties.
              </p>
            </div>

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
    direction: "down" # Direction for indicators to move (down, up, left, right)
  animation:
    fade-in: 0.25 # Fade in duration in seconds
    fade-out: 0.25 # Fade out duration in seconds
    float-speed: 0.03 # Floating speed (blocks per tick)
    float-curve: 0.02 # Curve intensity for floating motion`}
              tip="Fine-tune how damage indicators appear and animate in-game."
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-raised">
                <h4 className="text-sm font-medium text-ink mb-2">Position Settings</h4>
                <ul className="text-sm text-ink space-y-2 list-disc pl-5">
                  <li>
                    <strong>y:</strong> Vertical position (-0.2 places indicators slightly below the
                    entity)
                  </li>
                  <li>
                    <strong>x:</strong> Horizontal position (-0.5 places indicators to the left of
                    the entity)
                  </li>
                  <li>
                    <strong>random-offset:</strong> Adds variation to prevent overlapping indicators
                  </li>
                  <li>
                    <strong>direction:</strong> Which way indicators move (down, up, left, right)
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-raised">
                <h4 className="text-sm font-medium text-ink mb-2">Animation Settings</h4>
                <ul className="text-sm text-ink space-y-2 list-disc pl-5">
                  <li>
                    <strong>fade-in/out:</strong> How quickly indicators appear and disappear
                  </li>
                  <li>
                    <strong>float-speed:</strong> How fast indicators move (higher = faster)
                  </li>
                  <li>
                    <strong>float-curve:</strong> Adds a curved path to indicator movement
                  </li>
                  <li>
                    <strong>duration:</strong> Total time indicators remain visible
                  </li>
                </ul>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="messages"
            title="Messages"
            icon={<FaComments className="text-xl" />}
            description="Customize plugin messages"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-muted-foreground">
              <p>
                Customize all messages sent by the plugin to players. Messages support MiniMessage
                format for colors, formatting, and gradients.
              </p>
            </div>

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

            <div className="mt-6 rounded-2xl bg-surface p-5">
              <h4 className="text-sm font-medium text-ink mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Color Formatting
              </h4>
              <p className="text-sm text-ink mb-2">
                VitalStrike supports both MiniMessage format and traditional Minecraft color codes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-surface rounded">
                  <code className="text-ink">&lt;red&gt;Text&lt;/red&gt;</code> - Red text
                </div>
                <div className="p-2 bg-surface rounded">
                  <code className="text-ink">&lt;bold&gt;Text&lt;/bold&gt;</code> - Bold text
                </div>
                <div className="p-2 bg-surface rounded">
                  <code className="text-ink">&lt;gradient:red:gold&gt;Text&lt;/gradient&gt;</code> -
                  Gradient
                </div>
                <div className="p-2 bg-surface rounded">
                  <code className="text-ink">&amp;cText</code> - Legacy format (red)
                </div>
              </div>
            </div>
          </ConfigSection>
        </div>

        <div className="mt-16 pt-6 border-t border-gray-200">
          <DocsNavigation
            previousPage={{
              title: "Configuration Overview",
              href: "/docs/configuration",
            }}
            nextPage={{
              title: "Damage Formats",
              href: "/docs/configuration/damage",
            }}
          />
        </div>
      </div>
    </div>
  );
}
