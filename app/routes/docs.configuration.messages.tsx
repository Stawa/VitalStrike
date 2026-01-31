import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import {
  FaInfoCircle,
  FaCommentAlt,
  FaPalette,
  FaQuestionCircle,
  FaTerminal,
} from "react-icons/fa";
import BackToTop from "~/components/BackToTop";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Messages Configuration";
  const description = "Configure system messages, help menus, and text formatting in VitalStrike.";

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
    { id: "system-messages", label: "System Messages", icon: <FaCommentAlt /> },
    { id: "color-formats", label: "Color Formats", icon: <FaPalette /> },
    { id: "help-sections", label: "Help Sections", icon: <FaQuestionCircle /> },
    { id: "command-help", label: "Command Help", icon: <FaTerminal /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Messages <span className="text-primary-600 dark:text-primary-400">Configuration</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Configure system messages, help menus, and text formatting for your server.
          </p>
        </header>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="system-messages"
            title="System Messages"
            icon={<FaCommentAlt className="text-xl" />}
            description="Configure basic system messages"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                System messages are displayed to players when they interact with the plugin&apos;s
                commands and features. These messages can be fully customized to match your
                server&apos;s style and tone.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Message Variables
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Some messages support variables that are replaced with dynamic content:
              </p>
              <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>
                  <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">
                    %player%
                  </code>{" "}
                  - Player&apos;s name
                </li>
                <li>
                  <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">
                    %damage%
                  </code>{" "}
                  - Damage amount
                </li>
                <li>
                  <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">
                    %combo%
                  </code>{" "}
                  - Combo count
                </li>
              </ul>
            </div>
          </ConfigSection>

          <ConfigSection
            id="color-formats"
            title="Color Formats"
            icon={<FaPalette className="text-xl" />}
            description="Available color and formatting options"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                VitalStrike supports a wide range of color and formatting options for all text
                displayed by the plugin. These formats can be used in any message configuration to
                create visually appealing and informative text.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-pink-200 dark:border-pink-800/40 shadow-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">Basic Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">&lt;red&gt;</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">&lt;blue&gt;</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">&lt;green&gt;</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">&lt;yellow&gt;</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">&lt;purple&gt;</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">&lt;gray&gt;</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">
                  Text Formatting
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>
                    <span className="font-bold">&lt;bold&gt;</span> - Bold text
                  </li>
                  <li>
                    <span className="italic">&lt;italic&gt;</span> - Italic text
                  </li>
                  <li>
                    <span className="underline">&lt;underlined&gt;</span> - Underlined
                  </li>
                  <li>
                    <span className="line-through">&lt;strikethrough&gt;</span> - Strikethrough
                  </li>
                  <li>
                    <span className="font-mono">&lt;obfuscated&gt;</span> - Obfuscated
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">
                  Advanced Formatting
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gradients:</p>
                    <div className="h-6 rounded bg-gradient-to-r from-red-500 to-yellow-500"></div>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">
                      &lt;gradient:red:yellow&gt;Text&lt;/gradient&gt;
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Combined:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      &lt;bold&gt;&lt;gradient:blue:aqua&gt;Text&lt;/gradient&gt;&lt;/bold&gt;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="help-sections"
            title="Help Sections"
            icon={<FaQuestionCircle className="text-xl" />}
            description="Configure help menu sections"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Help sections provide detailed information about different aspects of the plugin.
                These sections can be accessed through the help command and provide players with
                guidance on how to use the plugin&apos;s features.
              </p>
            </div>

            <ConfigBlock
              title="Help Sections Configuration"
              filename="help.yml"
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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-green-200 dark:border-green-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Creating Custom Help Sections
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                You can create additional help sections by adding new entries under the{" "}
                <code>sections</code> key. Each section needs a unique identifier, a title, and
                numbered content entries. Players can access these sections with{" "}
                <code>/vs help [section-name]</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-800/40 shadow-sm">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  Section Structure
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each help section consists of:
                </p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <code>title</code> - The section heading
                  </li>
                  <li>
                    <code>content</code> - Numbered list of help entries
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  The content entries are displayed in numerical order.
                </p>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-800/40 shadow-sm">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  Example Help Section
                </h4>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm">
                  <p className="font-bold text-amber-600 dark:text-amber-400">Combo System Help</p>
                  <ul className="mt-1 space-y-1 text-yellow-600 dark:text-yellow-400">
                    <li>Combos increase when you hit enemies in succession</li>
                    <li>Higher combos give damage multipliers</li>
                    <li>Combos decay after a period of inactivity</li>
                  </ul>
                </div>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="command-help"
            title="Command Help"
            icon={<FaTerminal className="text-xl" />}
            description="Configure command descriptions and usage"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Command help provides information about available commands and their usage. This
                section allows you to customize how commands are displayed in the help menu,
                including their syntax and descriptions.
              </p>
            </div>

            <ConfigBlock
              title="Command Help Configuration"
              filename="help.yml"
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
      description: "Show this help menu or a specific section"
    vitalawakening:
      command: "/vs vitalawakening [amount]"
      description: "Get Vital Awakening revival items"
    resourcepack:
      command: "/vs resourcepack"
      description: "Load the custom resource pack"`}
              tip="Command help provides information about available commands and their usage."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Command Syntax Conventions
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                When writing command syntax:
              </p>
              <ul className="mt-2 text-sm text-purple-700 dark:text-purple-400 space-y-1">
                <li>
                  <code className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900/50 rounded">
                    [argument]
                  </code>{" "}
                  - Optional argument
                </li>
                <li>
                  <code className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900/50 rounded">
                    &lt;argument&gt;
                  </code>{" "}
                  - Required argument
                </li>
                <li>
                  <code className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900/50 rounded">
                    [a|b|c]
                  </code>{" "}
                  - Choose one of these options
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/40">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Command Structure
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each command entry consists of:
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
                  These are displayed when a player uses <code>/vs help</code>.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/40">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Example Command Display
                </h4>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm">
                  <p className="text-yellow-600 dark:text-yellow-400 font-mono">
                    /vs toggle [on|off]
                  </p>
                  <p className="text-white dark:text-gray-300 mt-1">
                    Toggle damage indicators on or off
                  </p>
                  <div className="mt-2 border-t border-gray-300 dark:border-gray-700 pt-2"></div>
                  <p className="text-yellow-600 dark:text-yellow-400 font-mono">/vs stats</p>
                  <p className="text-white dark:text-gray-300 mt-1">View your combat statistics</p>
                </div>
              </div>
            </div>
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
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
