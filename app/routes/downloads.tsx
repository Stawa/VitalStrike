import { useLatestVersion } from "~/hooks/useLatestVersion";
import type { MetaFunction } from "@remix-run/node";
import { FaGithub, FaCube, FaFileAlt } from "react-icons/fa";

export const meta: MetaFunction = () => {
  const title = "Downloads - VitalStrike";
  const description =
    "Download VitalStrike plugin for your Minecraft server. Get the latest version from CurseForge, Modrinth, or GitHub. Includes resource pack for enhanced visual experience.";

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
        "vitalstrike download, minecraft plugin download, combat plugin, damage indicators, resource pack, minecraft server enhancement",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function Downloads() {
  const { version, loading } = useLatestVersion();
  const versionLabel = loading || !version ? "v…" : `v${version}`;

  const pluginDownloadOptions = [
    {
      name: "CurseForge",
      description: "Download from CurseForge, the largest Minecraft mods platform",
      icon: <FaCube className="h-5 w-5" />,
      href: "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike",
    },
    {
      name: "Modrinth",
      description: "Get it from Modrinth, a modern and open-source platform",
      icon: <FaCube className="h-5 w-5" />,
      href: "https://modrinth.com/plugin/vitalstrike/",
    },
    {
      name: "GitHub",
      description: "Download directly from our GitHub releases",
      icon: <FaGithub className="h-5 w-5" />,
      href: "https://github.com/Stawa/VitalStrike/releases",
    },
  ];

  const resourcePackOption = {
    name: "VitalAwakening Resource Pack",
    description:
      "Optional add-on for enhanced visuals, including custom textures for damage indicators.",
    icon: <FaFileAlt className="h-5 w-5" />,
    href: "https://github.com/Stawa/VitalAwakening",
  };

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative py-14 sm:py-18 lg:py-20 px-4 sm:px-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.10),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.08),transparent_60%)]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200">
            Download VitalStrike
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Get{" "}
            <span className="text-primary-600 dark:text-primary-400 font-bold">VitalStrike</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base lg:text-lg max-w-2xl mx-auto">
            Download from trusted platforms. Choose the source that fits your workflow and keep your
            server up to date.
          </p>
        </div>
      </section>

      {/* DOWNLOAD CARDS */}
      <section className="py-10 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {pluginDownloadOptions.map((option) => (
              <a
                key={option.name}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-gray-700 dark:hover:bg-gray-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-primary-600 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-primary-400">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {option.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-mono text-primary-600 dark:bg-gray-800 dark:text-primary-400">
                    {versionLabel}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
                  <span className="font-medium text-gray-700 dark:text-gray-200">Download</span>
                  <span className="font-medium text-primary-600 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-primary-400">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE PACK */}
      <section className="py-10 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">
              Optional Resource Pack
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-primary-600 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-primary-400">
                  {resourcePackOption.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {resourcePackOption.name}
                    </h3>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-primary-600 dark:bg-gray-800 dark:text-primary-400">
                      Resource Pack
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {resourcePackOption.description}
                  </p>
                </div>
              </div>

              <a
                href={resourcePackOption.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full lg:w-auto items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
