import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { DocsNavigation } from "~/components/DocsNavigation";
import { PageHeader } from "~/components/PageHeader";

export const meta: MetaFunction = () => {
  const title = "Configuration - VitalStrike Documentation";
  const description =
    "Every section of VitalStrike's config.yml explained: damage indicators, combos, display, messages, permissions, knockdown and more.";

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

const sections = [
  [
    "Basic settings",
    "Enable the plugin, the update checker, disabled worlds and dimension multipliers.",
    "/docs/configuration/basic",
  ],
  [
    "Damage indicators",
    "The text, colours and symbols shown for each damage type, and per-group styles.",
    "/docs/configuration/damage",
  ],
  [
    "Combo system",
    "Reset time, decay, ranks, the damage multiplier, effects and the hologram.",
    "/docs/configuration/combo",
  ],
  [
    "Display",
    "How long indicators last, where they appear, how they animate and merge.",
    "/docs/configuration/display",
  ],
  ["Messages", "Every chat message the plugin sends.", "/docs/configuration/messages"],
  [
    "Permissions",
    "Permission nodes and group-based damage styles.",
    "/docs/configuration/permissions",
  ],
  [
    "Knockdown",
    "Down time, revive range and duration, and the Vital Awakening item.",
    "/docs/configuration/knockdown",
  ],
  [
    "Health bars and levels",
    "Health bars, the kill indicator, levels, rewards and the resource pack.",
    "/docs/configuration/progression",
  ],
];

const steps = [
  "Install the plugin and start the server once so it writes the default file.",
  "Open plugins/VitalStrike/config.yml. Every option is commented.",
  "Change what you want. Text uses MiniMessage, and & colour codes also work.",
  "Save, then run /vs reload. No restart is needed.",
];

export default function ConfigurationOverview() {
  return (
    <div>
      <PageHeader title="Configuration">
        Everything lives in one commented file. Pick a section below, or read the default file on
        GitHub.
      </PageHeader>

      <section id="sections" data-toc="Sections">
        <h2 className="sr-only">Sections</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sections.map(([title, text, href]) => (
            <li key={title}>
              <Link
                to={href}
                className="group block h-full rounded-2xl bg-surface p-5 transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface"
              >
                <span className="text-lg font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {title}
                </span>
                <span className="mt-1.5 block text-[15px] leading-relaxed text-muted-foreground">
                  {text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="workflow" data-toc="Editing the config" className="mt-14">
        <h2 className="font-heading text-2xl sm:text-3xl">Editing the config</h2>
        <ol className="mt-5 space-y-3 text-[17px] leading-relaxed">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[15px] text-muted-foreground">
          Upgrading keeps your file. Options added in a newer version fall back to the bundled
          defaults until you add them. The default file is on{" "}
          <a
            href="https://github.com/Stawa/VitalStrike/blob/main/src/main/resources/config.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-700 underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <DocsNavigation
        previousPage={{ title: "Getting started", href: "/docs/getting-started" }}
        nextPage={{ title: "Basic settings", href: "/docs/configuration/basic" }}
      />
    </div>
  );
}
