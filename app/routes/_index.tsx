import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useHighlightCode } from "~/hooks/prism";
import { Arena } from "~/components/Arena";
import { CodeBlock } from "~/components/CodeBlock";
import { FeatureShowcase } from "~/components/FeatureShowcase";
import { FinalCta } from "~/components/FinalCta";
import { DamageTypes } from "~/components/DamageTypes";
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

const configSnippet = `display:
  duration: 1.5            # seconds an indicator stays
  merge:
    enabled: true
    window: 2000           # ms; rapid hits add into one number

simple-damage-formats:
  default:  "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  heal:     "<green>+%.1f ❤"

combo:
  reset-time: 3
  multiplier:
    enabled: false         # turn on for a damage bonus
    per-combo: 0.1
    max: 3.0
  rank:
    thresholds: { D: 0, C: 5, B: 10, A: 15, S: 25, SS: 40, SSS: 60 }

world-settings:
  disabled-worlds: [ "minigames_world" ]
  dimensions:
    nether: { enabled: true, damage-multiplier: 1.2 }

knockdown-system:
  down-duration: 30
  external-revive: { range: 3.0, duration: 5.0 }`;

const facts = [
  ["28", "damage types, each with its own look and sound"],
  ["7", "combo ranks, from D up to SSS"],
  ["2 s", "window that merges rapid hits into one number"],
  ["1", "commented config file for all of it"],
];

const steps = [
  ["Download", "Grab the JAR from Modrinth, CurseForge or GitHub."],
  ["Drop it in", "Put it in your server's plugins folder."],
  ["Start once", "The server writes plugins/VitalStrike/config.yml."],
  ["Tune and reload", "Edit the config, then run /vs reload. No restart."],
];

const requirements = [
  "Paper 26.1 or newer, or a Paper fork",
  "Java 25",
  "Spigot and Bukkit are not supported",
  "On 1.21.x? Stay on VitalStrike 1.4.0",
];

const configPoints = [
  "Restyle damage per type, or per permission group with vitalstrike.group.<name>.",
  "Scale damage per dimension and switch whole worlds off.",
  "Text uses MiniMessage, so gradients, bold and click events just work.",
  "Upgrading keeps your file: new options fall back to the bundled defaults.",
];

const sectionTitle = "font-heading text-[clamp(2rem,3.8vw,4.25rem)]";
const lead = "text-lg leading-relaxed text-muted-foreground 2xl:text-2xl";

export default function Index() {
  useHighlightCode();

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

      {/* Facts */}
      <section aria-label="At a glance" className="pb-24 lg:pb-32">
        <Reveal>
          <dl className="grid gap-x-8 gap-y-8 rounded-3xl bg-surface p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-12">
            {facts.map(([value, label]) => (
              <div key={label}>
                <dt className="font-heading text-[clamp(3rem,5vw,6rem)] text-primary-600 dark:text-primary-400">
                  {value}
                </dt>
                <dd className="mt-2 max-w-[22ch] text-[17px] leading-snug text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Features */}
      <section aria-labelledby="features-h" className="pb-24 lg:pb-32">
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
            <h2 id="features-h" className={`${sectionTitle} lg:col-span-7`}>
              Every hit, made readable
            </h2>
            <p className={`${lead} lg:col-span-5 lg:max-w-xl`}>
              Each piece has its own switch in <code>config.yml</code>. Turn on only what you want.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <FeatureShowcase />
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            Also included: kills can earn XP and levels, damage milestones can pay rewards, and{" "}
            <code>/vs stats</code> and <code>/vs leaderboard</code> track damage, hits and best
            combo. All of it can be switched off.
          </p>
        </Reveal>
      </section>

      {/* Damage types */}
      <section
        aria-labelledby="types-h"
        className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-16 lg:pb-32"
      >
        <Reveal className="lg:col-span-4">
          <h2 id="types-h" className={sectionTitle}>
            A look for every kind of damage
          </h2>
          <p className={`mt-5 max-w-md ${lead}`}>
            Pick a damage type to see its default format and sound. Each one is a line in your
            config that you can rewrite.
          </p>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-8">
          <DamageTypes />
        </Reveal>
      </section>

      {/* Config */}
      <section aria-labelledby="config-h" className="pb-24 lg:pb-32">
        <div className="grid gap-10 rounded-3xl bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
          <Reveal className="lg:col-span-5">
            <h2 id="config-h" className={sectionTitle}>
              One commented file
            </h2>
            <ul className="mt-8 space-y-4 text-[17px] leading-relaxed 2xl:text-lg">
              {configPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary-600"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/docs/configuration"
              className="mt-8 inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-ground transition-opacity hover:opacity-90"
            >
              Configuration reference
            </Link>
          </Reveal>

          <Reveal delay={100} className="min-w-0 lg:col-span-7">
            <CodeBlock
              code={configSnippet}
              filename="plugins/VitalStrike/config.yml (defaults, excerpt)"
              className="!bg-ground"
            />
          </Reveal>
        </div>
      </section>

      {/* Install */}
      <section
        aria-labelledby="install-h"
        className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-16 lg:pb-32"
      >
        <Reveal className="lg:col-span-5">
          <h2 id="install-h" className={sectionTitle}>
            Running in about a minute
          </h2>
          <div className="mt-8 rounded-3xl bg-surface p-6 sm:p-8">
            <h3 className="text-lg font-bold">Before you install</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">VitalStrike 1.5.0 needs:</p>
            <ul className="mt-4 space-y-2.5 text-[17px]">
              {requirements.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7">
          <ol className="space-y-3">
            {steps.map(([title, text], i) => (
              <li key={title} className="flex items-center gap-5 rounded-3xl bg-surface p-5 sm:p-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-ground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground 2xl:text-base">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Call to action */}
      <section aria-label="Get VitalStrike" className="pb-24 lg:pb-32">
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
