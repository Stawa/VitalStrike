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

  const configSections = [
    {
      id: "basic",
      title: "Basic Settings",
      description:
        "Core plugin configuration options including update checker and database settings",
      icon: <FaCog className="text-2xl" />,
      href: "/docs/configuration/basic",
    },
    {
      id: "damage",
      title: "Damage Indicators",
      description: "Customize how damage is displayed with various formats and styles",
      icon: <FaCrosshairs className="text-2xl" />,
      href: "/docs/configuration/damage",
    },
    {
      id: "combo",
      title: "Combo System",
      description: "Configure the combo mechanics, ranks, multipliers and visual effects",
      icon: <FaChartLine className="text-2xl" />,
      href: "/docs/configuration/combo",
    },
    {
      id: "display",
      title: "Display Settings",
      description: "Adjust how indicators appear, animate and position themselves",
      icon: <FaEye className="text-2xl" />,
      href: "/docs/configuration/display",
    },
    {
      id: "messages",
      title: "Messages",
      description: "Customize all plugin messages and notifications",
      icon: <FaComments className="text-2xl" />,
      href: "/docs/configuration/messages",
    },
    {
      id: "permissions",
      title: "Permissions",
      description: "Configure permission nodes and group-based settings",
      icon: <FaShieldAlt className="text-2xl" />,
      href: "/docs/configuration/permissions",
    },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            VitalStrike{" "}
            <span className="text-primary-600 dark:text-primary-400">Configuration</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Guides to customize VitalStrike behavior, visuals, permissions, and messages.
          </p>
        </header>

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
                className="group rounded-xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200/70 dark:border-gray-800/70 hover:border-primary/30"
              >
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary-700 dark:text-primary-300 transition-colors group-hover:bg-primary/15">
                    {section.icon}
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {section.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {section.description}
                  </p>

                  <div className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                    Learn more
                    <svg
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
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

          <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-primary/10 border border-primary/15 text-primary-700 dark:text-primary-300">
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

              <div className="mt-6 w-full space-y-4 text-left">
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
                    description: "Open the config.yml file in the plugins/VitalStrike/ directory",
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
                    <div className="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0 bg-primary-600 dark:bg-primary-500 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 w-full pt-6 border-t border-gray-200/70 dark:border-gray-800/70">
                <div className="flex items-center">
                  <div className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary-700 shadow-sm dark:text-primary-300">
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
