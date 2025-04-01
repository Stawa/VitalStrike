import { FaDownload, FaJava, FaServer, FaMemory } from "react-icons/fa";
import { useState, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
                Installation Guide
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              Getting Started with{" "}
              <span className="text-primary-600 dark:text-primary-400">
                VitalStrike
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Step-by-step guide to install and configure VitalStrike on your
              Minecraft server.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Requirements Section - Enhanced with cards */}
        <section
          id="requirements"
          data-section="requirements"
          className="mb-16"
        >
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
                description:
                  "Latest Java version for optimal performance and security",
                color: "from-blue-500/20 to-blue-600/20",
                borderColor: "border-blue-200 dark:border-blue-800/40",
                iconBg: "bg-blue-500 dark:bg-blue-600",
              },
              {
                title: "Paper 1.21.4+ or compatible forks",
                icon: <FaServer className="text-2xl" />,
                description:
                  "Works best with Paper and its derivatives like Purpur",
                color: "from-green-500/20 to-green-600/20",
                borderColor: "border-green-200 dark:border-green-800/40",
                iconBg: "bg-green-500 dark:bg-green-600",
              },
              {
                title: "512MB+ RAM",
                icon: <FaMemory className="text-2xl" />,
                description: "Minimal memory overhead for smooth operation",
                color: "from-purple-500/20 to-purple-600/20",
                borderColor: "border-purple-200 dark:border-purple-800/40",
                iconBg: "bg-purple-500 dark:bg-purple-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden flex flex-col p-6 bg-white dark:bg-gray-900/50 rounded-xl border ${item.borderColor} hover:border-primary-500 dark:hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                {/* Gradient background that appears on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Content positioned above the gradient */}
                <div className="relative z-10">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md">
                    <div
                      className={`h-10 w-10 flex items-center justify-center rounded-full ${item.iconBg} text-white`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Installation Steps - Timeline style */}
        <section
          id="installation"
          data-section="installation"
          className="mb-16"
        >
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <h2 className="flex-shrink-0 mx-4 text-2xl font-bold text-gray-900 dark:text-white">
              Installation Steps
            </h2>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <div className="relative border-l-2 border-primary-500/30 dark:border-primary-400/30 ml-4 pl-8 space-y-12">
            {[
              {
                step: 1,
                title: "Download VitalStrike",
                content: "Get the latest version from our official sources.",
                icon: "💾",
                color: "from-blue-500/10 to-blue-600/10",
                borderColor: "border-blue-200 dark:border-blue-800/40",
                dotColor: "bg-blue-500 dark:bg-blue-600",
                action: (
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        name: "CurseForge",
                        href: "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike",
                        color:
                          "bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 text-white",
                      },
                      {
                        name: "Modrinth",
                        href: "https://modrinth.com/plugin/vitalstrike/",
                        color:
                          "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white",
                      },
                      {
                        name: "GitHub",
                        href: "https://github.com/Stawa/VitalStrike/releases",
                        color:
                          "bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 text-white",
                      },
                    ].map((option) => (
                      <a
                        key={option.name}
                        href={option.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-4 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 ${option.color}`}
                      >
                        <FaDownload className="mr-2" />
                        <span>{option.name}</span>
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
                    file in your server's plugins directory.
                  </>
                ),
                icon: "📁",
                color: "from-green-500/10 to-green-600/10",
                borderColor: "border-green-200 dark:border-green-800/40",
                dotColor: "bg-green-500 dark:bg-green-600",
              },
              {
                step: 3,
                title: "Start Your Server",
                content:
                  "Restart or reload your server to generate config files.",
                icon: "🚀",
                color: "from-purple-500/10 to-purple-600/10",
                borderColor: "border-purple-200 dark:border-purple-800/40",
                dotColor: "bg-purple-500 dark:bg-purple-600",
              },
              {
                step: 4,
                title: "Download Resource Pack",
                content:
                  "Accept the resource pack prompt when joining the server for the best visual experience. Or download manually from https://github.com/Stawa/VitalAwakening.",
                icon: "📦",
                color: "from-orange-500/10 to-orange-600/10",
                borderColor: "border-orange-200 dark:border-orange-800/40",
                dotColor: "bg-orange-500 dark:bg-orange-600",
              },
            ].map((item, index, array) => (
              <div key={item.step} className="relative">
                {/* Timeline dot with pulse effect */}
                <div className="absolute -left-12 flex items-center justify-center">
                  <div
                    className={`absolute w-12 h-12 ${item.dotColor} rounded-full opacity-15 animate-ping-slow blur-sm`}
                  ></div>
                  <div
                    className={`absolute w-10 h-10 ${item.dotColor} rounded-full opacity-20 animate-pulse`}
                  ></div>
                  <div
                    className={`relative z-10 w-7 h-7 rounded-full border-3 border-white dark:border-gray-800 ${item.dotColor} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-sm font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                </div>

                {/* Timeline connector */}
                {index < array.length - 1 && (
                  <div className="absolute -left-9 h-[calc(100%+3rem)] w-0.5 bg-gradient-to-b from-primary-500/30 via-primary-400/20 to-transparent"></div>
                )}

                <div
                  className={`group relative overflow-hidden bg-white dark:bg-gray-900/50 rounded-xl border ${item.borderColor} hover:border-primary-500 dark:hover:border-primary-500/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Gradient background that appears on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{item.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-5">
                      {typeof item.content === "string" &&
                      item.content.includes("http")
                        ? item.content
                            .split(/(https?:\/\/[^\s]+)/)
                            .map((part, index) =>
                              part.match(/^https?:\/\//) ? (
                                <a
                                  key={index}
                                  href={part}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
                                >
                                  {part}
                                </a>
                              ) : (
                                <span key={index}>{part}</span>
                              )
                            )
                        : item.content}
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

                  {/* Decorative corner accent */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
                </div>
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
                icon: "⚔️",
                color: "from-red-500/20 to-orange-500/20",
                borderColor: "border-red-200 dark:border-red-800/40",
                iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
              },
              {
                title: "Combo System",
                description:
                  "Advanced combo tracking with multipliers, ranks, and visual effects.",
                icon: "🎯",
                color: "from-blue-500/20 to-indigo-500/20",
                borderColor: "border-blue-200 dark:border-blue-800/40",
                iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
              },
              {
                title: "Statistics Tracking",
                description:
                  "Comprehensive player statistics including damage dealt, highest combos, and averages.",
                icon: "📊",
                color: "from-green-500/20 to-emerald-500/20",
                borderColor: "border-green-200 dark:border-green-800/40",
                iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
              },
              {
                title: "Visual Effects",
                description:
                  "Particles, sounds, and hologram effects for enhanced combat feedback.",
                icon: "✨",
                color: "from-purple-500/20 to-pink-500/20",
                borderColor: "border-purple-200 dark:border-purple-800/40",
                iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
              },
              {
                title: "Permission Groups",
                description:
                  "Group-based customization for different damage indicator styles.",
                icon: "🔑",
                color: "from-yellow-500/20 to-amber-500/20",
                borderColor: "border-yellow-200 dark:border-yellow-800/40",
                iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
              },
              {
                title: "MiniMessage Support",
                description:
                  "Rich text formatting with gradients and custom colors.",
                icon: "🎨",
                color: "from-cyan-500/20 to-teal-500/20",
                borderColor: "border-cyan-200 dark:border-cyan-800/40",
                iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${feature.borderColor}`}
              >
                {/* Gradient background that appears on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Grid pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className="mb-5 inline-flex p-3 rounded-xl shadow-md bg-white dark:bg-gray-800">
                    <div
                      className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center text-white text-2xl`}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>

                  {/* Learn more link that appears on hover */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <a
                      href={`/docs/features#${feature.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
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

                {/* Decorative corner accent */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
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
  );
}
