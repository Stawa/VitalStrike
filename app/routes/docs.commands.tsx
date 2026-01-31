import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { TableOfContents } from "~/components/TableOfContents";
import { useState } from "react";
import {
  FaTerminal,
  FaToggleOn,
  FaChartBar,
  FaTools,
  FaSearch,
  FaCopy,
  FaTimes,
} from "react-icons/fa";
import BackToTop from "~/components/BackToTop";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const tableItems = [
    { id: "basic-commands", label: "Basic Commands", icon: <FaTerminal /> },
    { id: "toggle-commands", label: "Toggle Commands", icon: <FaToggleOn /> },
    { id: "stats-commands", label: "Statistics Commands", icon: <FaChartBar /> },
    { id: "admin-commands", label: "Admin Commands", icon: <FaTools /> },
  ];

  const commandSections = [
    {
      id: "basic-commands",
      title: "Basic Commands",
      description: "Essential commands for using VitalStrike",
      icon: <FaTerminal className="text-xl" />,
      commands: [
        {
          command: "/vs help [section]",
          description: "Show the help menu or a specific section",
          permission: "vitalstrike.use",
        },
        {
          command: "/vs resourcepack",
          description: "Load the custom resource pack",
          permission: "vitalstrike.resourcepack",
        },
      ],
    },
    {
      id: "toggle-commands",
      title: "Toggle Commands",
      description: "Commands to toggle plugin features",
      icon: <FaToggleOn className="text-xl" />,
      commands: [
        {
          command: "/vs toggle [on|off]",
          description: "Toggle damage indicators on/off",
          permission: "vitalstrike.toggle",
        },
        {
          command: "/vs hologram [on|off]",
          description: "Toggle combo hologram display",
          permission: "vitalstrike.hologram",
        },
      ],
    },
    {
      id: "stats-commands",
      title: "Statistics Commands",
      description: "Commands to view statistics and leaderboards",
      icon: <FaChartBar className="text-xl" />,
      commands: [
        {
          command: "/vs stats",
          description: "View your combat statistics",
          permission: "vitalstrike.stats",
        },
        {
          command: "/vs leaderboard [damage|combo|average]",
          description: "View top players leaderboard",
          permission: "vitalstrike.leaderboard",
        },
        {
          command: "/vs lb [damage|combo|average]",
          description: "Alias for /vs leaderboard",
          permission: "vitalstrike.leaderboard",
        },
      ],
    },
    {
      id: "admin-commands",
      title: "Admin Commands",
      description: "Administrative commands for managing the plugin",
      icon: <FaTools className="text-xl" />,
      commands: [
        {
          command: "/vs reload",
          description: "Reload the plugin configuration",
          permission: "vitalstrike.reload",
        },
        {
          command: "/vs vitalawakening [amount]",
          description: "Give Vital Awakening items",
          permission: "vitalstrike.give",
        },
        {
          command: "/vs perm <add|remove|list> <player> [permission]",
          description: "Manage player permissions",
          permission: "vitalstrike.admin.permissions",
        },
      ],
    },
  ];

  const filteredSections = searchTerm
    ? commandSections
        .map((section) => ({
          ...section,
          commands: section.commands.filter(
            (cmd) =>
              cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cmd.permission.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((section) => section.commands.length > 0)
    : commandSections;

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Command Reference
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            VitalStrike <span className="text-primary-600 dark:text-primary-400">Commands</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Complete list of commands and their usage in VitalStrike.
          </p>
        </header>

        {/* Search and Table of Contents */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-4 py-3 pl-12 text-gray-900 shadow-sm backdrop-blur-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-white"
              />
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>
          </div>

          <TableOfContents items={tableItems} />
        </div>

        {/* Command Sections */}
        <div className="space-y-16">
          {filteredSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="relative flex items-center mb-8">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <div className="flex items-center flex-shrink-0 mx-4">
                  <div className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary-700 shadow-sm dark:text-primary-300">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{section.description}</p>

              <div className="grid gap-4">
                {section.commands.map((cmd) => (
                  <div
                    key={cmd.command}
                    className="group rounded-xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/70 dark:border-gray-800/70 hover:border-primary/30"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-3 md:mb-0">
                        <div className="flex items-center">
                          <div className="font-mono text-base font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                            {cmd.command}
                          </div>
                          <button
                            onClick={() => handleCopyCommand(cmd.command)}
                            className="ml-2 p-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                            title="Copy command"
                          >
                            {copiedCommand === cmd.command ? (
                              <span className="text-green-500 text-sm">Copied!</span>
                            ) : (
                              <FaCopy size={14} />
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{cmd.description}</p>
                      </div>
                      <div className="md:text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
                          {cmd.permission}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <FaSearch className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No commands found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search term to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="mt-16">
          <DocsNavigation
            previousPage={{
              title: "Configuration",
              href: "/docs/configuration",
            }}
            nextPage={{
              title: "Downloads",
              href: "/downloads",
            }}
          />
        </div>
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
