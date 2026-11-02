import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Arena } from "~/components/Arena";
import { FinalCta } from "~/components/FinalCta";
import { Reveal } from "~/components/Reveal";
import { DeveloperCard } from "~/components/DeveloperCard";

export const meta: MetaFunction = () => {
  const title = "VitalStrike - Combat feedback plugin for Paper servers";
  const description =
    "Floating damage numbers, health bars, combo ranks and a knockdown and revive system for Paper 26.1+ servers. Free and open source, configured in one file.";

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
        "minecraft, paper plugin, damage indicators, health bar, combo, pvp, knockdown, revive, leaderboard",
    },
    { name: "theme-color", content: "#d6343c" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

const features = [
  [
    "Damage numbers",
    "A number floats off every hit, styled by damage type, and merges rapid hits.",
  ],
  ["Health bars", "See how much health whatever you hit has left."],
  ["Combos", "Chain hits to climb ranks from D up to SSS, with optional damage bonuses."],
  [
    "Knockdown and revive",
    "Lethal damage downs a player instead. Teammates or a Vital Awakening bring them back.",
  ],
];

const steps = [
  ["Download", "Grab the JAR from Modrinth, CurseForge or GitHub."],
  ["Drop it in plugins", "Needs Paper 26.1+ and Java 25. Then start the server once."],
  ["Tune it", "Edit config.yml and run /vs reload, or run /vs config to edit it in your browser."],
];

const sectionTitle = "font-heading text-[clamp(2rem,3.8vw,4.25rem)]";
const lead = "text-lg leading-relaxed text-muted-foreground 2xl:text-2xl";

export default function Index() {
  return (
    <div className="page-x">
      {/* Hero */}
      <section className="grid items-center gap-10 py-10 lg:min-h-[calc(100svh-var(--navbar-height)-2rem)] lg:grid-cols-12 lg:gap-14 lg:py-16">
        <div className="vs-rise lg:col-span-6">
          <h1 className="font-heading text-[clamp(2.75rem,5.4vw,8rem)]">
            Damage you can actually see.
          </h1>
          <p className={`mt-6 max-w-xl 2xl:max-w-3xl ${lead}`}>
            VitalStrike is a free Paper plugin that floats a number off every hit, styled by damage
            type, with a health bar on whatever you hit and combo ranks for chained hits. Every look
            is configurable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/downloads"
              className="inline-flex items-center rounded-full bg-primary-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Download VitalStrike
            </Link>
            <Link
              to="/docs/getting-started"
              className="inline-flex items-center rounded-full bg-surface px-8 py-4 text-base font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface"
            >
              Read the docs
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-muted-foreground">
            <li>Paper 26.1+</li>
            <li>Java 25</li>
            <li>Free, GPL-3.0</li>
          </ul>
        </div>

        <div className="vs-rise lg:col-span-6 [animation-delay:120ms]">
          <Arena />
          <p className="mt-3 px-2 text-sm text-muted-foreground">
            Try it: click the zombie or use the buttons. Values match the default config.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section aria-labelledby="features-h" className="pb-20 lg:pb-28">
        <Reveal>
          <h2 id="features-h" className={sectionTitle}>
            What you get
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, text]) => (
              <li key={title} className="rounded-3xl bg-surface p-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] text-muted-foreground">
            Every piece has its own switch in <code>config.yml</code>.{" "}
            <Link
              to="/docs/configuration"
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              See everything you can change
            </Link>
          </p>
        </Reveal>
      </section>

      {/* Install */}
      <section aria-labelledby="install-h" className="pb-20 lg:pb-28">
        <Reveal>
          <h2 id="install-h" className={sectionTitle}>
            Running in a minute
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([title, text], i) => (
              <li key={title} className="flex gap-4 rounded-3xl bg-surface p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-ground">
                  {i + 1}
                </span>
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Call to action */}
      <section aria-label="Get VitalStrike" className="pb-20 lg:pb-28">
        <Reveal>
          <FinalCta />
        </Reveal>
      </section>

      {/* People */}
      <section aria-labelledby="team-h" className="grid gap-8 pb-16 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <h2 id="team-h" className="font-heading text-[clamp(1.75rem,2.8vw,3rem)]">
            Made by two people
          </h2>
          <p className="mt-4 max-w-sm text-[17px] text-muted-foreground">
            Maintained by one person, so replies can take a while. Bug reports and ideas are always
            welcome.
          </p>
        </Reveal>
        <Reveal delay={80} className="grid gap-4 lg:col-span-8 xl:grid-cols-2">
          <DeveloperCard
            name="Stawa"
            avatarUrl="https://github.com/Stawa.png"
            roles={[{ label: "Plugin, releases and docs", tone: "primary" }]}
            bio="Writes the plugin, ships the releases and keeps these docs in step with the code."
            githubUrl="https://github.com/Stawa/"
          />
          <DeveloperCard
            name="TeenYsDaMan"
            avatarUrl="https://github.com/TeenYsDaMan.png"
            roles={[{ label: "Resource pack", tone: "primary" }]}
            bio="Makes the optional resource pack: the models and textures behind the Vital Awakening item."
            githubUrl="https://github.com/TeenYsDaMan/"
          />
        </Reveal>
      </section>
    </div>
  );
}
