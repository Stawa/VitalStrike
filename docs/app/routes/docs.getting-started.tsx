import { Link } from "@remix-run/react";
import { useLatestVersion } from "~/hooks/useLatestVersion";
import {
  FaDownload,
  FaJava,
  FaServer,
  FaMemory,
  FaTerminal,
  FaRegCopy,
  FaChevronDown,
} from "react-icons/fa";
import { SiSpring } from "react-icons/si";
import { useState, useRef, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Installation Guide";
  const description =
    "Step-by-step guide to installing and setting up VitalStrike on your Minecraft server. Learn about requirements, installation steps, and initial configuration.";

  return [
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
      content: "vitalstrike installation, minecraft plugin setup, server requirements, plugin configuration, getting started guide",
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
      description: "Download from Paper's official platform"
    },
    {
      name: "Modrinth",
      href: "https://modrinth.com/plugin/vitalstrike/",
      description: "Get it from Modrinth"
    },
    {
      name: "GitHub",
      href: "https://github.com/Stawa/VitalStrike/releases",
      description: "Download from GitHub releases"
    }
  ];

  return (
    <div className="max-w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-800/20">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Installation Guide
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
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

      {/* Requirements Section */}
      <section id="requirements" data-section="requirements" className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Requirements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Java 17+", icon: <FaJava className="text-2xl" /> },
            {
              title: "Spigot/Paper 1.20-1.21+",
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
              <span className="text-primary-600 dark:text-primary-400 mr-4">
                {item.icon}
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Steps */}
      <section id="installation" data-section="installation" className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Installation Steps
        </h2>
        <div className="space-y-8">
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
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FaDownload className="mr-2" />
                    {loading ? "Download Latest" : `Download Latest (v${version})`}
                    <FaChevronDown className={`ml-2 transition-transform duration-200 ${isDownloadOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDownloadOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 right-0 sm:right-auto z-10 mt-2 w-full sm:w-72 rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="p-1">
                        {downloadOptions.map((option) => (
                          <a
                            key={option.name}
                            href={option.href}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
                            onClick={() => setIsDownloadOpen(false)}
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{option.name}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">{option.description}</p>
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
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white rounded-full font-bold mr-6">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.content}
                </p>
                {item.action && (
                  <div>
                    {item.action.type === "button" ? (
                      <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white rounded-lg hover:opacity-90 transition-opacity">
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

      {/* Configuration Section */}
      <section id="quick-start" data-section="quick-start" className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Configuration Guide
        </h2>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The main configuration file is located at{" "}
              <code className="font-mono bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                plugins/VitalStrike/config.yml
              </code>
            </p>

            {/* Configuration Categories */}
            <div className="space-y-8">
              {[
                {
                  title: "Basic Settings",
                  description: "Core plugin configuration options",
                  config: `# Update Checker
update-checker:
  enabled: true

# General Settings
enabled: true

# Database Settings
database:
  enabled: true
  file: "playerdata.yml"`,
                  explanation: "These are the fundamental settings that control the plugin's basic functionality and update checking."
                },
                {
                  title: "Damage Indicators",
                  description: "Customize how damage numbers appear",
                  config: `# Damage Indicator Settings
damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  heal: "<green>+%.1f ❤"`,
                  explanation: "Configure how different types of damage are displayed. Supports gradients, colors, and custom symbols."
                },
                {
                  title: "Combo System",
                  description: "Configure the combo mechanics",
                  config: `# Combo System Configuration
combo:
  enabled: true
  reset-time: 3 # Time in seconds
  display:
    format: "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>"
    rank:
      enabled: true`,
                  explanation: "Control the combo system behavior, including timing, display format, and ranking features."
                }
              ].map((section, index) => (
                <div key={index} className="language-yaml border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {section.description}
                  </p>
                  <div className="relative">
                    <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto max-w-full">
                      <code className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                        {section.config}
                      </code>
                      <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-600">
                        <FaRegCopy className="text-xl" />
                      </button>
                    </pre>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {section.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* View Full Configuration Link */}
          <Link
            to="/docs/configuration"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <SiSpring className="mr-2" />
            View Full Configuration Guide
          </Link>
        </div>
      </section>

      {/* Next Steps */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {[
          {
            title: "Configuration Guide",
            description: "Customize every aspect of VitalStrike",
            link: "/docs/configuration",
            icon: <SiSpring className="text-2xl" />,
          },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="p-6 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
              <div className="ml-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span className="text-primary-600 dark:text-primary-400">
                  {item.icon}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
