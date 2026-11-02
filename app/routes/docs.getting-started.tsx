import type { MetaFunction } from "@remix-run/node";
import { DocsNavigation } from "~/components/DocsNavigation";
import { PageHeader } from "~/components/PageHeader";

export const meta: MetaFunction = () => {
  const title = "Getting Started - VitalStrike Documentation";
  const description =
    "Install VitalStrike on a Paper 26.1+ server: requirements, installation steps and your first configuration change.";

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
      content: "vitalstrike installation, paper plugin setup, server requirements, getting started",
    },
    { name: "theme-color", content: "#d6343c" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

const requirements = [
  ["Paper 26.1 or newer", "Or a Paper fork. Spigot and Bukkit are not supported."],
  ["Java 25 or newer", "Paper 26.1 itself requires it."],
  ["On 1.21.x?", "Stay on VitalStrike 1.4.0. Version 2.0.0 will not load there."],
];

const sources = [
  ["Modrinth", "https://modrinth.com/plugin/vitalstrike/"],
  ["CurseForge", "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike"],
  ["GitHub releases", "https://github.com/Stawa/VitalStrike/releases"],
];

const nextSteps = [
  ["Turn features on or off", "Every system has an enabled option in config.yml."],
  ["Restyle the damage numbers", "Change the text for each damage type, or per permission group."],
  [
    "Set up permissions",
    "Admin commands default to operators. Grant vitalstrike.group.<name> for custom styles.",
  ],
];

const codeClass = "rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.9em]";

export default function GettingStarted() {
  return (
    <div>
      <PageHeader title="Getting started">
        Install VitalStrike, check the requirements, and change your first setting in a few minutes.
      </PageHeader>

      <section id="requirements" data-toc="Requirements" className="scroll-mt-24">
        <h2 className="font-heading text-2xl sm:text-3xl">Requirements</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {requirements.map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-5">
              <dt className="text-lg font-bold">{title}</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="install" data-toc="Install" className="mt-14 scroll-mt-24">
        <h2 className="font-heading text-2xl sm:text-3xl">Install</h2>
        <ol className="mt-5 space-y-3">
          <li className="rounded-2xl bg-surface p-5 sm:p-6">
            <h3 className="text-lg font-bold">1. Download the JAR</h3>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              The file is identical on every site.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sources.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-primary-600 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  {name}
                </a>
              ))}
            </div>
          </li>
          <li className="rounded-2xl bg-surface p-5 sm:p-6">
            <h3 className="text-lg font-bold">2. Put it in plugins</h3>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              Copy the <code className={codeClass}>.jar</code> into your server&apos;s{" "}
              <code className={codeClass}>plugins</code> folder.
            </p>
          </li>
          <li className="rounded-2xl bg-surface p-5 sm:p-6">
            <h3 className="text-lg font-bold">3. Start the server</h3>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              This creates <code className={codeClass}>plugins/VitalStrike/config.yml</code>.
            </p>
          </li>
          <li className="rounded-2xl bg-surface p-5 sm:p-6">
            <h3 className="text-lg font-bold">4. Edit and reload</h3>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              Change what you want, then run <code className={codeClass}>/vs reload</code>. No
              restart is needed, and the file is fully commented.
            </p>
          </li>
        </ol>
      </section>

      <section id="resource-pack" data-toc="Resource pack" className="mt-14 scroll-mt-24">
        <h2 className="font-heading text-2xl sm:text-3xl">Resource pack (optional)</h2>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          The pack gives the Vital Awakening revive totem its own model and texture. Players load it
          with <code className={codeClass}>/vs resourcepack</code>, or you can send it on join with{" "}
          <code className={codeClass}>resource-pack.auto-send</code>. If you do not use it, set{" "}
          <code className={codeClass}>knockdown-system.vital-awakening.item-model</code> to an empty
          string. Get it from the{" "}
          <a
            href="https://github.com/Stawa/VitalAwakening"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-700 underline underline-offset-4 dark:text-primary-300"
          >
            VitalAwakening repository
          </a>
          .
        </p>
      </section>

      <section id="next" data-toc="What to change first" className="mt-14 scroll-mt-24">
        <h2 className="font-heading text-2xl sm:text-3xl">What to change first</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {nextSteps.map(([title, text]) => (
            <li key={title} className="rounded-2xl bg-surface p-5">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <DocsNavigation
        previousPage={{ title: "Introduction", href: "/docs" }}
        nextPage={{ title: "Configuration overview", href: "/docs/configuration" }}
      />
    </div>
  );
}
