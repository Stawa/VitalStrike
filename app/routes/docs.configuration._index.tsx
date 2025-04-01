import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import {
  FaChartLine,
  FaCog,
  FaComments,
  FaCrosshairs,
  FaEye,
  FaShieldAlt,
  FaBook,
  FaFileAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import BackToTop from "~/components/BackToTop";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Configuration";
  const description =
    "Comprehensive configuration guide for VitalStrike. Learn about color formats, damage indicators, combo systems, and all available configuration options.";

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
        "vitalstrike configuration, minecraft plugin settings, damage indicators, combo system, color formats, minecraft server configuration",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function Configuration() {
  useHighlightCode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const configSections = [
    {
      id: "basic",
      title: "Basic Settings",
      description:
        "Core plugin configuration options including update checker and database settings",
      icon: <FaCog className="text-2xl" />,
      href: "/docs/configuration/basic",
      color: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-200 dark:border-blue-800/40",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
    },
    {
      id: "damage",
      title: "Damage Indicators",
      description:
        "Customize how damage is displayed with various formats and styles",
      icon: <FaCrosshairs className="text-2xl" />,
      href: "/docs/configuration/damage",
      color: "from-red-500/20 to-orange-500/20",
      borderColor: "border-red-200 dark:border-red-800/40",
      iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
    },
    {
      id: "combo",
      title: "Combo System",
      description:
        "Configure the combo mechanics, ranks, multipliers and visual effects",
      icon: <FaChartLine className="text-2xl" />,
      href: "/docs/configuration/combo",
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-200 dark:border-green-800/40",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      id: "display",
      title: "Display Settings",
      description:
        "Adjust how indicators appear, animate and position themselves",
      icon: <FaEye className="text-2xl" />,
      href: "/docs/configuration/display",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-200 dark:border-purple-800/40",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      id: "messages",
      title: "Messages",
      description: "Customize all plugin messages and notifications",
      icon: <FaComments className="text-2xl" />,
      href: "/docs/configuration/messages",
      color: "from-yellow-500/20 to-amber-500/20",
      borderColor: "border-yellow-200 dark:border-yellow-800/40",
      iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
    },
    {
      id: "permissions",
      title: "Permissions",
      description: "Configure permission nodes and group-based settings",
      icon: <FaShieldAlt className="text-2xl" />,
      href: "/docs/configuration/permissions",
      color: "from-cyan-500/20 to-teal-500/20",
      borderColor: "border-cyan-200 dark:border-cyan-800/40",
      iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500",
    },
  ];

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
                Configuration Guide
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              Master{" "}
              <span className="text-primary-600 dark:text-primary-400">
                VitalStrike
              </span>{" "}
              Configuration
            </h1>
            <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive guide to unlocking VitalStrike's full potential
              through advanced configuration options
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Configuration Sections Grid */}
        <section className="mb-16">
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <h2 className="flex-shrink-0 mx-4 text-2xl font-bold text-gray-900 dark:text-white">
              Configuration Sections
            </h2>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configSections.map((section) => (
              <Link
                key={section.id}
                to={section.href}
                className={`group relative overflow-hidden rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${section.borderColor}`}
              >
                {/* Gradient background that appears on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Grid pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className="mb-5 inline-flex p-3 rounded-xl shadow-md bg-white dark:bg-gray-800">
                    <div
                      className={`w-12 h-12 ${section.iconBg} rounded-lg flex items-center justify-center text-white text-2xl`}
                    >
                      {section.icon}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {section.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {section.description}
                  </p>

                  {/* Learn more link that appears on hover */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                      View details
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
                    </span>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-16">
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <h2 className="flex-shrink-0 mx-4 text-2xl font-bold text-gray-900 dark:text-white">
              Quick Start Guide
            </h2>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-md border border-indigo-200/50 dark:border-indigo-800/50 hover:border-primary-500/70 dark:hover:border-primary-500/30 transition-all duration-300">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3 mr-4 text-white shadow-md">
                  <FaBook className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    New to VitalStrike?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Follow these steps to get started with configuration:
                  </p>
                </div>
              </div>

              <div className="space-y-4 ml-2">
                {[
                  {
                    step: 1,
                    title: "Generate Configuration",
                    description:
                      "Install the plugin and start your server once to generate the default configuration files",
                  },
                  {
                    step: 2,
                    title: "Locate Config File",
                    description:
                      "Open the config.yml file in the plugins/VitalStrike/ directory",
                  },
                  {
                    step: 3,
                    title: "Customize Settings",
                    description:
                      "Modify settings according to your preferences using the guides on this page",
                  },
                  {
                    step: 4,
                    title: "Apply Changes",
                    description:
                      "Save the file and use /vs reload to apply changes without restarting",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-3 mr-4 text-white shadow-md">
                    <FaFileAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Need the default config?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      You can view the default configuration file in our{" "}
                      <a
                        href="https://github.com/Stawa/VitalStrike/blob/main/src/main/resources/config.yml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
                      >
                        GitHub repository
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
          </div>
        </section>

        {/* Navigation Footer */}
        <DocsNavigation
          previousPage={{
            title: "Getting Started",
            href: "/docs/getting-started",
          }}
          nextPage={{
            title: "Features Guide",
            href: "/docs/features",
          }}
        />
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
