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
} from "react-icons/fa";

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
      description:
        "Customize how damage is displayed with various formats and styles",
      icon: <FaCrosshairs className="text-2xl" />,
      href: "/docs/configuration/damage",
    },
    {
      id: "combo",
      title: "Combo System",
      description:
        "Configure the combo mechanics, ranks, multipliers and visual effects",
      icon: <FaChartLine className="text-2xl" />,
      href: "/docs/configuration/combo",
    },
    {
      id: "display",
      title: "Display Settings",
      description:
        "Adjust how indicators appear, animate and position themselves",
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
    <div className="max-w-full mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-16">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Master{" "}
          <span className="text-primary-600 dark:text-primary-400">
            VitalStrike
          </span>{" "}
          Configuration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive guide to unlocking VitalStrike's full potential through
          advanced configuration options
        </p>
      </div>

      {/* Configuration Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {configSections.map((section) => (
          <Link
            key={section.id}
            to={section.href}
            className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 transition-colors p-6 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 dark:bg-primary-900/20 rounded-full p-3 mr-4">
                <span className="text-primary-600 dark:text-primary-400">
                  {section.icon}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {section.description}
            </p>
            <div className="mt-auto text-primary-600 dark:text-primary-400 font-medium">
              View details →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 p-6 mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Start Guide
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          New to VitalStrike? Here's how to get started with configuration:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            Install the plugin and start your server once to generate the
            default configuration
          </li>
          <li>
            Open the{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
              config.yml
            </code>{" "}
            file in the VitalStrike plugin folder
          </li>
          <li>
            Modify settings according to your preferences using the guides on
            this page
          </li>
          <li>
            Save the file and use{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
              /vs reload
            </code>{" "}
            to apply changes
          </li>
        </ol>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
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
      </div>
    </div>
  );
}
