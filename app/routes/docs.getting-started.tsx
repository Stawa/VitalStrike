import {
  FaBolt,
  FaBoxOpen,
  FaChartBar,
  FaCrosshairs,
  FaDownload,
  FaFileDownload,
  FaFolderOpen,
  FaJava,
  FaKey,
  FaMagic,
  FaMemory,
  FaPalette,
  FaPlay,
  FaServer,
} from "react-icons/fa";
import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import BackToTop from "~/components/BackToTop";

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

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Installation Guide
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Getting Started with{" "}
            <span className="text-primary-600 dark:text-primary-400">VitalStrike</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Install the plugin, verify requirements, and apply the first configuration in minutes.
          </p>
        </header>

        <div className="pb-12">
          {/* Requirements Section - Enhanced with cards */}
          <section id="requirements" data-section="requirements" className="mb-16">
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <h2 className="flex-shrink-0 mx-4 text-2xl font-bold text-gray-900 dark:text-white">
                Requirements
              </h2>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Java 21+",
                  icon: <FaJava className="text-2xl" />,
                  description: "Latest Java version for optimal performance and security",
                },
                {
                  title: "Paper 1.21.4+ or compatible forks",
                  icon: <FaServer className="text-2xl" />,
                  description: "Works best with Paper and its derivatives like Purpur",
                },
                {
                  title: "512MB+ RAM",
                  icon: <FaMemory className="text-2xl" />,
                  description: "Minimal memory overhead for smooth operation",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-white/70 dark:bg-gray-900/50 rounded-xl border border-gray-200/70 dark:border-gray-800/70 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-sm"
                >
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary-700 dark:text-primary-300">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Installation Steps - Timeline style */}
          <section id="installation" data-section="installation" className="mb-20">
            <div className="relative flex items-center mb-12">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <h2 className="flex-shrink-0 mx-6 text-3xl font-bold text-gray-900 dark:text-white">
                Installation Steps
              </h2>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  step: 1,
                  title: "Download VitalStrike",
                  content: "Get the latest version from our official sources.",
                  icon: <FaFileDownload className="text-xl" />,
                  action: (
                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          name: "CurseForge",
                          href: "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike",
                        },
                        {
                          name: "Modrinth",
                          href: "https://modrinth.com/plugin/vitalstrike/",
                        },
                        {
                          name: "GitHub",
                          href: "https://github.com/Stawa/VitalStrike/releases",
                        },
                      ].map((option) => (
                        <a
                          key={option.name}
                          href={option.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors"
                        >
                          <FaDownload />
                          {option.name}
                        </a>
                      ))}
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
                      file in your server&apos;s plugins directory.
                    </>
                  ),
                  icon: <FaFolderOpen className="text-xl" />,
                },
                {
                  step: 3,
                  title: "Start Your Server",
                  content: "Restart or reload your server to generate config files.",
                  icon: <FaPlay className="text-xl" />,
                },
                {
                  step: 4,
                  title: "Download Resource Pack",
                  content:
                    "Accept the resource pack prompt when joining the server for the best visual experience. You can also trigger it with /vs resourcepack, or download manually from https://github.com/Stawa/VitalAwakening",
                  icon: <FaBoxOpen className="text-xl" />,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 dark:border-gray-800/70 dark:bg-gray-900/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary-700 shadow-sm dark:text-primary-300">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/60 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800/70 dark:bg-gray-900/40 dark:text-gray-200">
                      Step {item.step}
                    </span>
                  </div>

                  <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {typeof item.content === "string" && item.content.includes("http")
                      ? item.content.split(/(https?:\/\/[^\s]+)/).map((part, index) =>
                          part.match(/^https?:\/\//) ? (
                            <a
                              key={index}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline underline-offset-2"
                            >
                              {part}
                            </a>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )
                      : item.content}
                  </div>

                  {item.action && <div className="mt-5">{item.action}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* Feature Overview - Grid with hover effects */}
          <section id="overview" data-section="overview" className="mb-16">
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <h2 className="flex-shrink-0 mx-4 text-2xl font-bold text-gray-900 dark:text-white">
                Feature Overview
              </h2>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Dynamic Damage Indicators",
                  description:
                    "Customizable floating damage numbers with support for gradients, animations, and different damage types.",
                  icon: <FaCrosshairs className="text-2xl" />,
                },
                {
                  title: "Combo System",
                  description:
                    "Advanced combo tracking with multipliers, ranks, and visual effects.",
                  icon: <FaMagic className="text-2xl" />,
                },
                {
                  title: "Statistics Tracking",
                  description:
                    "Comprehensive player statistics including damage dealt, highest combos, and averages.",
                  icon: <FaChartBar className="text-2xl" />,
                },
                {
                  title: "Visual Effects",
                  description:
                    "Particles, sounds, and hologram effects for enhanced combat feedback.",
                  icon: <FaBolt className="text-2xl" />,
                },
                {
                  title: "Permission Groups",
                  description: "Group-based customization for different damage indicator styles.",
                  icon: <FaKey className="text-2xl" />,
                },
                {
                  title: "MiniMessage Support",
                  description: "Rich text formatting with gradients and custom colors.",
                  icon: <FaPalette className="text-2xl" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-gray-200/70 dark:border-gray-800/70 hover:border-primary/30"
                >
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary-700 dark:text-primary-300">
                      {feature.icon}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-200/70 dark:border-gray-800/70">
                      <a
                        href={`/docs/features#${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        Learn more
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
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
          {/* Back to top button */}
          <BackToTop />
        </div>
      </div>
    </div>
  );
}
