import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { PageHeader } from "~/components/PageHeader";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation";
  const description =
    "Install, configure and run VitalStrike on a Paper server: damage indicators, health bars, combos, knockdown, commands and permissions.";

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
    { name: "theme-color", content: "#d6343c" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

const guides = [
  {
    title: "Getting started",
    text: "Requirements, installation and your first reload.",
    href: "/docs/getting-started",
  },
  {
    title: "Configuration",
    text: "Every option in config.yml, section by section.",
    href: "/docs/configuration",
  },
  {
    title: "Commands",
    text: "All /vs commands with their permissions.",
    href: "/docs/commands",
  },
  {
    title: "JavaDoc",
    text: "The plugin's source documentation.",
    href: "https://stawa.github.io/VitalStrike/javadoc/",
    external: true,
  },
];

const whatsNew = [
  "Built for Paper 26.1+ and Java 25.",
  "Hits cancelled by other plugins, such as WorldGuard PvP flags, no longer create indicators, combos or stats.",
  "Real critical-hit detection, heal indicators, and projectile hits credited to the shooter.",
  "Combo decay works, and every setting now reloads with /vs reload.",
  "Downed players crawl and cannot attack or interact. New /vs revive command.",
  "Fixed several config paths that were silently ignored in earlier versions.",
];

export default function DocsIndex() {
  return (
    <div>
      <PageHeader title="Documentation">
        VitalStrike adds floating damage numbers, health bars and combos to a Paper server, with a
        knockdown and revive system on top. Everything is configured in one file.
      </PageHeader>

      <section data-toc="Guides" id="guides">
        <h2 className="sr-only">Guides</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.title}>
              {guide.external ? (
                <a
                  href={guide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-2xl bg-surface p-6 transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface"
                >
                  <span className="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {guide.title} →
                  </span>
                  <span className="mt-2 block text-[15px] text-muted-foreground">{guide.text}</span>
                </a>
              ) : (
                <Link
                  to={guide.href}
                  className="group block h-full rounded-2xl bg-surface p-6 transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface"
                >
                  <span className="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {guide.title}
                  </span>
                  <span className="mt-2 block text-[15px] text-muted-foreground">{guide.text}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section data-toc="New in 1.5.0" id="new" className="mt-14">
        <h2 className="font-heading text-2xl sm:text-3xl">New in 1.5.0</h2>
        <ul className="mt-5 space-y-3 text-[17px] leading-relaxed">
          {whatsNew.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary-600"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[15px] text-muted-foreground">
          The full list is in the{" "}
          <Link
            to="/blog"
            className="font-semibold text-primary-700 underline underline-offset-4 dark:text-primary-300"
          >
            changelog
          </Link>
          . Upgrading from 1.4.0 keeps your <code>config.yml</code>; new options use the bundled
          defaults.
        </p>
      </section>

      <section data-toc="Get help" id="help" className="mt-14 rounded-3xl bg-surface p-6 sm:p-8">
        <h2 className="font-heading text-2xl sm:text-3xl">Stuck or found a bug?</h2>
        <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          VitalStrike is maintained by one person, so replies can take a while, but reports are
          always read.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://discord.gg/b4nxvp8NcH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Ask on Discord
          </a>
          <a
            href="https://github.com/Stawa/VitalStrike/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-raised px-6 py-3 text-base font-semibold transition-colors hover:opacity-80"
          >
            Open an issue
          </a>
        </div>
      </section>
    </div>
  );
}
