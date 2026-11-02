import { Link } from "@remix-run/react";
import { FaDiscord, FaGithub } from "react-icons/fa";

const GITHUB_URL = "https://github.com/Stawa/VitalStrike";
const DISCORD_URL = "https://discord.gg/b4nxvp8NcH";

type FooterLink = { label: string; href: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Docs",
    links: [
      { label: "Getting started", href: "/docs/getting-started" },
      { label: "Configuration", href: "/docs/configuration" },
      { label: "Commands", href: "/docs/commands" },
      { label: "JavaDoc", href: "https://stawa.github.io/VitalStrike/javadoc/", external: true },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Downloads", href: "/downloads" },
      { label: "Changelog", href: "/blog" },
      { label: "Releases", href: `${GITHUB_URL}/releases`, external: true },
      { label: "Source code", href: GITHUB_URL, external: true },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Report a bug", href: `${GITHUB_URL}/issues`, external: true },
      { label: "Discord", href: DISCORD_URL, external: true },
      { label: "Support development", href: "https://buymeacoffee.com/stawa", external: true },
    ],
  },
];

const linkClass = "text-[15px] text-muted-foreground transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="page-x mt-auto pb-6 pt-10">
      <div className="rounded-3xl bg-surface p-8 sm:p-12">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/Icon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
              <span className="text-xl font-extrabold tracking-tight">VitalStrike</span>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Combat feedback for Paper servers: damage numbers, health bars, combos, levels and a
              revive system. Free and open source.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-raised text-ink transition-colors hover:bg-primary-600 hover:text-white"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-raised text-ink transition-colors hover:bg-[#5865F2] hover:text-white"
              >
                <span className="sr-only">Discord</span>
                <FaDiscord className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[15px] font-bold">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          className={linkClass}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>Licensed under the GNU GPL v3.</p>
          <p>Not affiliated with Mojang or Microsoft.</p>
        </div>
      </div>
    </footer>
  );
}
