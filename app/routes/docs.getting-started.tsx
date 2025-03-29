import { useLatestVersion } from "~/hooks/useLatestVersion";
import {
  FaDownload,
  FaJava,
  FaServer,
  FaMemory,
  FaRegCopy,
  FaChevronDown,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Installation Guide";
  const description =
    "Step-by-step guide to installing and setting up VitalStrike on your Minecraft server. Learn about requirements, installation steps, and initial configuration.";

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
        "vitalstrike installation, minecraft plugin setup, server requirements, plugin configuration, getting started guide",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function GettingStarted() {
  useHighlightCode();

  const { version, loading } = useLatestVersion();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDownloadOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadOptions = [
    {
      name: "Hangar (Paper)",
      href: "https://hangar.papermc.io/Stawa/VitalStrike",
      description: "Download from Paper's official platform",
    },
    {
      name: "Modrinth",
      href: "https://modrinth.com/plugin/vitalstrike/",
      description: "Get it from Modrinth",
    },
    {
      name: "GitHub",
      href: "https://github.com/Stawa/VitalStrike/releases",
      description: "Download from GitHub releases",
    },
  ];

  return (
    <div className="max-w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Page Header - Simplified */}
      <div className="text-center mb-20">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Installation Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Getting Started with{" "}
          <span className="text-primary-600 dark:text-primary-400">
            VitalStrike
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Step-by-step guide to install and configure VitalStrike on your
          Minecraft server.
        </p>
      </div>

      {/* Requirements Section - More Minimal */}
      <section id="requirements" data-section="requirements" className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Requirements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Java 21+", icon: <FaJava className="text-2xl" /> },
            {
              title: "Paper 1.21.4+ or compatible forks",
              icon: <FaServer className="text-2xl" />,
            },
            {
              title: "512MB+ RAM",
              icon: <FaMemory className="text-2xl" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 transition-colors"
            >
              <span className="text-primary-500 dark:text-primary-400 mr-4">
                {item.icon}
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Steps - Cleaner */}
      <section id="installation" data-section="installation" className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Installation Steps
        </h2>
        <div className="space-y-12">
          {[
            {
              step: 1,
              title: "Download VitalStrike",
              content: "Get the latest version from our official sources.",
              action: (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  >
                    <FaDownload className="mr-2" />
                    {loading
                      ? "Download Latest"
                      : `Download Latest (v${version})`}
                    <FaChevronDown
                      className={`ml-2 transition-transform duration-200 ${
                        isDownloadOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDownloadOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 right-0 sm:right-auto z-10 mt-2 w-full sm:w-72 rounded-lg bg-white dark:bg-gray-900 shadow-lg"
                    >
                      <div className="p-1">
                        {downloadOptions.map((option) => (
                          <a
                            key={option.name}
                            href={option.href}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
                            onClick={() => setIsDownloadOpen(false)}
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {option.name}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {option.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              step: 2,
              title: "Install the Plugin",
              content: (
                <>
                  Place the{" "}
                  <code className="font-mono px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    .jar
                  </code>{" "}
                  file in your server's plugins directory.
                </>
              ),
            },
            {
              step: 3,
              title: "Start Your Server",
              content:
                "Restart or reload your server to generate config files.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-600 dark:bg-primary-500 text-white rounded-full font-bold mr-6">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-5">
                  {item.content}
                </p>
                {item.action && (
                  <div>
                    {item.action.type === "button" ? (
                      <button className="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
                        {item.action}
                      </button>
                    ) : (
                      item.action
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Overview - More Spacious */}
      <section id="overview" data-section="overview" className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Feature Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Dynamic Damage Indicators",
              description:
                "Customizable floating damage numbers with support for gradients, animations, and different damage types.",
              icon: "⚔️",
            },
            {
              title: "Combo System",
              description:
                "Advanced combo tracking with multipliers, ranks, and visual effects.",
              icon: "🎯",
            },
            {
              title: "Statistics Tracking",
              description:
                "Comprehensive player statistics including damage dealt, highest combos, and averages.",
              icon: "📊",
            },
            {
              title: "Visual Effects",
              description:
                "Particles, sounds, and hologram effects for enhanced combat feedback.",
              icon: "✨",
            },
            {
              title: "Permission Groups",
              description:
                "Group-based customization for different damage indicator styles.",
              icon: "🔑",
            },
            {
              title: "MiniMessage Support",
              description:
                "Rich text formatting with gradients and custom colors.",
              icon: "🎨",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Configuration Section - Cleaner Look */}
      <section id="quick-start" data-section="quick-start" className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Quick Start Guide
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 transition-colors p-8">
            <div className="flex items-center mb-5">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 mr-4">
                <div className="text-xl text-primary-600 dark:text-primary-400">
                  📄
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Configuration
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              After installation, find your configuration at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 font-mono text-sm relative">
              plugins/VitalStrike/config.yml
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                <button className="hover:text-primary-500 transition-colors">
                  <FaRegCopy />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Edit this file to customize damage indicators, combos, and more.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 transition-colors p-8">
            <div className="flex items-center mb-5">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 mr-4">
                <div className="text-xl text-primary-600 dark:text-primary-400">
                  ⌨️
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Basic Commands
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { cmd: "/vs toggle", desc: "Toggle damage indicators" },
                { cmd: "/vs reload", desc: "Reload configuration" },
                { cmd: "/vs stats", desc: "View your statistics" },
                { cmd: "/vs help", desc: "Show help menu" },
              ].map((cmd, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <code className="flex-shrink-0 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded">
                    {cmd.cmd}
                  </code>
                  <span className="text-gray-600 dark:text-gray-400">
                    {cmd.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Cleaner Design */}
      <section id="how-it-works" data-section="how-it-works" className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          How It Works
        </h2>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚔️</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Damage Indicators
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                When entities take damage, VitalStrike displays floating text
                with customizable styles:
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                  ⚡ Critical Hits
                </span>
                <span className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg">
                  🔥 Fire Damage
                </span>
                <span className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                  ☠️ Poison Damage
                </span>
                <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg">
                  ✨ Magic Damage
                </span>
                <span className="px-4 py-2 bg-gray-50 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 rounded-lg">
                  ⚙️ And any custom damage type
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Combo System
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Track consecutive hits and unlock powerful bonuses:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">📈</span>
                    <span>
                      Progressive damage multipliers increase your power
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">🏆</span>
                    <span>Climb through ranks from D to SSS</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">💫</span>
                    <span>Unlock special effects at combo milestones</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">⏱️</span>
                    <span>Maintain your combo within time limits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 flex items-start">
            <span className="text-xl mr-3">💡</span>
            <div>
              <p className="font-medium text-primary-900 dark:text-primary-100">
                Pro Tip
              </p>
              <p className="text-sm text-primary-800 dark:text-primary-200">
                Use MiniMessage format in config.yml to create custom gradients
                and animations for your damage indicators!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps - Simplified */}
      <DocsNavigation
        previousPage={{
          title: "Getting Started",
          href: "/docs/getting-started",
        }}
        nextPage={{
          title: "Configuration Guide",
          href: "/docs/configuration",
        }}
      />
    </div>
  );
}
