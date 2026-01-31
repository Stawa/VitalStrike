import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { FaInfoCircle, FaCog, FaMapMarkerAlt, FaTrophy, FaQuestionCircle } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";
import BackToTop from "~/components/BackToTop";

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
    { id: "basic-settings", label: "Basic Settings", icon: <FaCog /> },
    { id: "positioning", label: "Position Settings", icon: <FaMapMarkerAlt /> },
    { id: "animation", label: "Animation Settings", icon: <IoSparklesSharp /> },
    { id: "leaderboard", label: "Leaderboard Display", icon: <FaTrophy /> },
    { id: "help-menu", label: "Help Menu Display", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Display <span className="text-primary-600 dark:text-primary-400">Settings</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Configure how damage indicators, leaderboards, and menus are displayed in VitalStrike.
          </p>
        </header>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="basic-settings"
            title="Basic Settings"
            icon={<FaCog className="text-xl" />}
            description="Configure basic display settings"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Basic display settings control the fundamental aspects of how damage indicators
                appear in-game. These settings affect all damage indicators regardless of type.
              </p>
            </div>

            <ConfigBlock
              title="Basic Display Configuration"
              filename="config.yml"
              code={`# Display Settings
display:
  duration: 1.5 # How long damage/heal numbers stay visible (in seconds)`}
              tip="The duration setting controls how long damage numbers remain visible before fading away."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Duration Impact
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Setting a longer duration makes damage numbers stay visible longer, which can be
                helpful for tracking damage over time. However, too long a duration might cause
                visual clutter during intense combat. A value between 1.0 and 2.0 seconds typically
                provides a good balance.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="positioning"
            title="Position Settings"
            icon={<FaMapMarkerAlt className="text-xl" />}
            description="Configure where damage indicators appear"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Position settings control where damage numbers appear relative to the entity and how
                they move. These settings allow you to customize the exact placement of indicators
                for optimal visibility.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-green-200 dark:border-green-800/40 shadow-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-800/40 shadow-sm">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  Offset Positioning
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The <code>x</code> and <code>y</code> values determine where damage numbers appear
                  relative to the entity:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>y: -0.2</code> - Slightly below the entity
                  </li>
                  <li>
                    <code>y: 0.5</code> - Above the entity
                  </li>
                  <li>
                    <code>x: -0.5</code> - To the left of the entity
                  </li>
                  <li>
                    <code>x: 0.5</code> - To the right of the entity
                  </li>
                </ul>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-800/40 shadow-sm">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  Random Offset & Direction
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <code>random-offset</code> adds variation to prevent indicators from stacking:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>random-offset: -1</code> - Disabled (fixed position)
                  </li>
                  <li>
                    <code>random-offset: 0.2</code> - Small random variation
                  </li>
                  <li>
                    <code>random-offset: 0.5</code> - Larger random variation
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  The <code>direction</code> setting controls which way indicators float.
                </p>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="animation"
            title="Animation Settings"
            icon={<IoSparklesSharp className="text-xl" />}
            description="Configure how damage indicators animate"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Animation settings control how damage numbers fade in/out and move through the air.
                These settings allow you to create smooth, visually appealing damage indicators that
                enhance the combat experience.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Animation Tips
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                For smoother animations, keep fade-in and fade-out times between 0.1 and 0.3
                seconds. The float-speed controls how quickly indicators move (higher values =
                faster movement). The float-curve adds a curved path to the movement, creating a
                more dynamic effect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/40">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Fade Effects
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fade effects control the opacity transition of damage indicators:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>fade-in: 0.25</code> - How long it takes to appear
                  </li>
                  <li>
                    <code>fade-out: 0.25</code> - How long it takes to disappear
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Setting these to 0 will make indicators appear/disappear instantly.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/40">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Movement Effects
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Movement effects control how indicators float through the air:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>float-speed: 0.03</code> - Speed of movement
                  </li>
                  <li>
                    <code>float-curve: 0.02</code> - Curve intensity
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Higher float-curve values create more pronounced curved paths.
                </p>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="leaderboard"
            title="Leaderboard Display"
            icon={<FaTrophy className="text-xl" />}
            description="Configure leaderboard appearance"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Leaderboard display settings control how the in-game leaderboards appear to players.
                These settings allow you to customize titles, entry formats, and number formatting
                for different leaderboard types.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800/40 shadow-md"
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Title Formats
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize the title for each leaderboard type:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Damage leaderboard</li>
                  <li>Combo leaderboard</li>
                  <li>Average damage leaderboard</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  The <code>%d</code> placeholder is replaced with the display limit.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Entry Format
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The <code>entry-format</code> controls how each leaderboard entry appears:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>%d</code> - Position number
                  </li>
                  <li>
                    <code>%s</code> - Player name
                  </li>
                  <li>
                    <code>%s</code> - Value (damage, combo, etc.)
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Number Format
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Control how numbers appear in each leaderboard type:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>%.1f</code> - One decimal place (12.5)
                  </li>
                  <li>
                    <code>%.2f</code> - Two decimal places (12.57)
                  </li>
                  <li>
                    <code>%d</code> - Whole numbers only (13)
                  </li>
                </ul>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="help-menu"
            title="Help Menu Display"
            icon={<FaQuestionCircle className="text-xl" />}
            description="Configure help menu appearance"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Help menu display settings control how the plugin&apos;s help menu appears to
                players. These settings allow you to customize the header, title, footer, and
                command listings to match your server&apos;s style.
              </p>
            </div>

            <ConfigBlock
              title="Help Menu Configuration"
              filename="help.yml"
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
      description: "Reload the plugin configuration"
    vitalawakening:
      command: "/vs vitalawakening [amount]"
      description: "Get Vital Awakening revival items"
    resourcepack:
      command: "/vs resourcepack"
      description: "Load the custom resource pack"`}
              tip="Customize the appearance of the help menu, including headers, titles, and command listings."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-teal-200 dark:border-teal-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40">
              <h4 className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Adding Custom Commands
              </h4>
              <p className="text-sm text-teal-700 dark:text-teal-400">
                You can add additional commands to the help menu by adding new entries under the{" "}
                <code>commands</code> section. Each command needs a unique key, a command string,
                and a description. These will automatically appear in the help menu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-teal-200 dark:border-teal-800/40 shadow-sm">
                <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">
                  Menu Structure
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The help menu is structured with:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Header (decorative line)</li>
                  <li>Title (plugin name)</li>
                  <li>Command listings</li>
                  <li>Footer (decorative line)</li>
                </ul>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-teal-200 dark:border-teal-800/40 shadow-sm">
                <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">
                  Command Format
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each command in the help menu includes:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>command</code> - The command syntax
                  </li>
                  <li>
                    <code>description</code> - What the command does
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Optional parameters are typically shown in [brackets].
                </p>
              </div>
            </div>
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
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
