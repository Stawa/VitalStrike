import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { FaCube, FaGithub, FaFileAlt } from "react-icons/fa";
import { useLatestVersion } from "~/hooks/useLatestVersion";

export const meta: MetaFunction = () => {
  const title = "Download VitalStrike";
  const description =
    "Download VitalStrike for Paper 26.1+ from Modrinth, CurseForge or GitHub. Requires Java 25. Includes an optional resource pack.";

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
        "vitalstrike download, paper plugin, minecraft combat plugin, damage indicators, resource pack",
    },
    { name: "theme-color", content: "#d6343c" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

const sources = [
  {
    name: "Modrinth",
    text: "Open-source platform with update checks in launchers and tools.",
    href: "https://modrinth.com/plugin/vitalstrike/",
    icon: FaCube,
    primary: true,
  },
  {
    name: "CurseForge",
    text: "The largest Minecraft project host. Same JAR, same version.",
    href: "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike",
    icon: FaCube,
    primary: false,
  },
  {
    name: "GitHub",
    text: "Every release with notes, straight from the repository.",
    href: "https://github.com/Stawa/VitalStrike/releases",
    icon: FaGithub,
    primary: false,
  },
];

const requirements = [
  ["VitalStrike 1.5.0 needs Paper 26.1+", "Or a Paper fork. Spigot and Bukkit are not supported."],
  ["Java 25 or newer", "Paper 26.1 itself requires it."],
  [
    "Upgrading from 1.4.0?",
    "Your config.yml is kept. New options use the bundled defaults, so new features are on after the update.",
  ],
  ["Server on 1.21.x?", "Stay on VitalStrike 1.4.0. Version 1.5.0 will not load there."],
];

export default function Downloads() {
  const { version, loading } = useLatestVersion();
  const versionLabel =
    loading || !version
      ? "the latest published release"
      : `the latest published release, ${version}`;

  return (
    <div className="page-x pb-16">
      <section className="pb-12 pt-8 sm:pt-14">
        <h1 className="font-heading text-[clamp(2.6rem,5.4vw,4.4rem)]">Download VitalStrike</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          You are getting {versionLabel}. It is the same JAR on every site below. Put it in{" "}
          <code>plugins/</code> and start the server.
        </p>
      </section>

      <section aria-label="Download sources">
        <ul className="grid gap-4 md:grid-cols-3">
          {sources.map((source) => (
            <li key={source.name}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-full flex-col rounded-3xl p-7 transition-colors ${
                  source.primary
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-surface hover:bg-gray-200 dark:hover:bg-dark-surface"
                }`}
              >
                <source.icon className="h-7 w-7" aria-hidden="true" />
                <span className="mt-8 text-2xl font-extrabold tracking-tight">{source.name}</span>
                <span
                  className={`mt-2 flex-1 text-[15px] leading-relaxed ${source.primary ? "text-white/85" : "text-muted-foreground"}`}
                >
                  {source.text}
                </span>
                <span className="mt-6 text-[15px] font-semibold">Get the JAR →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="req-h" className="pt-20">
        <h2 id="req-h" className="font-heading text-[clamp(1.75rem,3.4vw,2.5rem)]">
          Before you install
        </h2>
        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          {requirements.map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-surface p-6">
              <dt className="text-lg font-bold">{title}</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
        <Link
          to="/docs/getting-started"
          className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-ground transition-opacity hover:opacity-90"
        >
          Installation guide
        </Link>
      </section>

      <section aria-labelledby="pack-h" className="pt-20">
        <div className="grid gap-8 rounded-3xl bg-surface p-7 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FaFileAlt
              className="h-7 w-7 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
            <h2 id="pack-h" className="font-heading mt-5 text-[clamp(1.75rem,3.4vw,2.5rem)]">
              Optional resource pack
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              The pack gives the Vital Awakening revive totem its own model and texture. Without it
              the item shows as a plain totem and everything still works. Players load it with{" "}
              <code>/vs resourcepack</code>, or you can send it on join with{" "}
              <code>resource-pack.auto-send</code>. If you skip the pack, set{" "}
              <code>knockdown-system.vital-awakening.item-model</code> to an empty string.
            </p>
          </div>
          <div className="flex items-end lg:col-span-4 lg:justify-end">
            <a
              href="https://github.com/Stawa/VitalAwakening"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-primary-600 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Get the resource pack
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
