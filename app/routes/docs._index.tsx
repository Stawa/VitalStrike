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
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      title: "JavaDoc",
      description: "Access detailed API documentation and explore VitalStrike's codebase.",
      href: "https://stawa.github.io/VitalStrike/javadoc/",
      target: "_blank",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Documentation
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Master <span className="text-primary-600 dark:text-primary-400">VitalStrike</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Comprehensive guides and references to configure, operate, and extend VitalStrike on
            your server.
          </p>
        </header>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {guides.map((guide) => (
            <Link
              key={guide.title}
              to={guide.href}
              target={guide.target}
              className="group rounded-xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200/70 dark:border-gray-800/70 hover:border-primary/30"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary-700 dark:text-primary-300 transition-colors group-hover:bg-primary/15">
                  {guide.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
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

        {/* Timeline Header - similar to blog */}
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <h2 className="flex-shrink-0 mx-4 text-xl font-bold text-gray-900 dark:text-white">
            Additional Resources
          </h2>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-200/70 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-primary/10 border border-primary/15 text-primary-700 dark:text-primary-300">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Join the Community
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              Get help, share feedback, and connect with other VitalStrike users in the Discord
              server.
            </p>
            <a
              href="https://discord.gg/b4nxvp8NcH"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Join Discord
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
