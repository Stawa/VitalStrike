import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { TableOfContents } from "~/components/TableOfContents";
import { useState, useEffect } from "react";
import {
  FaTerminal,
  FaToggleOn,
  FaChartBar,
  FaTools,
  FaSearch,
  FaCopy,
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
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tableItems = [
    { id: "basic-commands", label: "Basic Commands", icon: "⌨️" },
    { id: "toggle-commands", label: "Toggle Commands", icon: "🔄" },
    { id: "stats-commands", label: "Statistics Commands", icon: "📊" },
    { id: "admin-commands", label: "Admin Commands", icon: "🛠️" },
  ];

  const commandSections = [
    {
      id: "basic-commands",
      title: "Basic Commands",
      description: "Essential commands for using VitalStrike",
      icon: <FaTerminal className="text-xl" />,
      color: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-200 dark:border-blue-800/40",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      commands: [
        {
          command: "/vs help",
          description: "Show the help menu",
          permission: "vitalstrike.use",
        },
        {
          command: "/vs version",
          description: "Show plugin version information",
          permission: "vitalstrike.use",
        },
      ],
    },
    {
      id: "toggle-commands",
      title: "Toggle Commands",
      description: "Commands to toggle plugin features",
      icon: <FaToggleOn className="text-xl" />,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-200 dark:border-green-800/40",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
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
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-200 dark:border-purple-800/40",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
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
      ],
    },
    {
      id: "admin-commands",
      title: "Admin Commands",
      description: "Administrative commands for managing the plugin",
      icon: <FaTools className="text-xl" />,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-200 dark:border-amber-800/40",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
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
          command: "/vs perm [add|remove|list]",
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
              cmd.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
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
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased">
      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 pt-16 pb-8">
          <div className="text-center px-4 md:px-6 lg:px-8 py-8 md:py-12 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full animate-pulse-slow" />
              <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary/10 rounded-full animate-float" />
              <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-primary/5 rounded-full animate-float-delayed" />

              {/* Particle effect - only render on client side */}
              {isClient && (
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-primary/20 animate-float-random"
                      style={{
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6 inline-flex bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 px-4 py-2 rounded-full shadow-sm border border-primary-200/50 dark:border-primary-700/50">
              <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                Command Reference
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              VitalStrike{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Commands
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete list of commands and their usage in VitalStrike
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Table of Contents */}
        <div className="mb-12">
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <h2 className="flex-shrink-0 mx-4 text-2xl font-bold text-gray-900 dark:text-white">
              Command Reference
            </h2>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
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
                  <div
                    className={`${section.iconBg} p-2 rounded-lg mr-3 text-white shadow-md`}
                  >
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {section.description}
              </p>

              <div className="grid gap-4">
                {section.commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-300 border ${section.borderColor}`}
                  >
                    {/* Gradient background that appears on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    {/* Grid pattern background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
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
                              <span className="text-green-500 text-sm">
                                Copied!
                              </span>
                            ) : (
                              <FaCopy size={14} />
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          {cmd.description}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
                          {cmd.permission}
                        </span>
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
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
                Try adjusting your search term to find what you're looking for.
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
              title: "API Reference",
              href: "/docs/api",
            }}
          />
        </div>
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
