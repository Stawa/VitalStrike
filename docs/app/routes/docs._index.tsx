import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Comprehensive Guides & References";
  const description =
    "Master VitalStrike with our comprehensive documentation. Learn installation, configuration, commands, and API integration for your Minecraft server.";

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
        "minecraft plugin documentation, vitalstrike setup, minecraft combat plugin, server configuration, plugin api",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function DocsIndex() {
  const guides = [
    {
      title: "Getting Started",
      description: "Learn how to install and setup VitalStrike in your server.",
      href: "/docs/getting-started",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Configuration",
      description: "Customize VitalStrike to fit your server's needs.",
      href: "/docs/configuration",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    },
    {
      title: "Commands",
      description: "Explore all available commands and their usage.",
      href: "/docs/commands",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "API Reference",
      description: "Integrate VitalStrike with your plugins using our API.",
      href: "/docs/api",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto overflow-hidden">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20 px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="mb-6 inline-flex bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-800/20 px-4 py-3 rounded-2xl">
          <span className="text-primary-700 dark:text-primary-300 font-medium">
            Documentation
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Master{" "}
          <span className="text-primary-600 dark:text-primary-400">
            VitalStrike
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive guides and references to unleash VitalStrike's full
          potential in your server.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16 lg:mb-20 px-4 md:px-6 lg:px-8">
        {guides.map((guide) => (
          <Link
            key={guide.title}
            to={guide.href}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900/50 p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-primary-100/50 dark:from-primary-900/5 dark:to-primary-800/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10 dark:bg-primary-400/10 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-colors">
                <div className="text-primary-600 dark:text-primary-400 group-hover:text-white">
                  {guide.icon}
                </div>
              </div>
              <h3 className="mb-2 text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-6">
                {guide.description}
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

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-xl mx-4 md:mx-6 lg:mx-8 bg-primary-600 dark:bg-primary-500 p-6 md:p-8 lg:p-10">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need Expert Help?
          </h3>
          <p className="text-primary-50 mb-8 text-lg">
            Join our active Discord community for real-time support, updates,
            and discussions with other VitalStrike users.
          </p>
          <a
            href="https://discord.gg/b4nxvp8NcH"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-black dark:text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-400 dark:hover:bg-primary-300 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg
              className="h-6 w-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join Discord Server
          </a>
        </div>
      </div>
    </div>
  );
}
