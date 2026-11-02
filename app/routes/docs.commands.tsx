import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { DocsNavigation } from "~/components/DocsNavigation";
import { PageHeader } from "~/components/PageHeader";

export const meta: MetaFunction = () => {
  const title = "Commands - VitalStrike Documentation";
  const description =
    "Every VitalStrike command with its usage and permission: /vs toggle, stats, leaderboard, reload, revive and more.";

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

interface Command {
  usage: string;
  text: string;
  permission: string;
  op?: boolean;
}

const groups: { id: string; title: string; commands: Command[] }[] = [
  {
    id: "player",
    title: "Player commands",
    commands: [
      {
        usage: "/vs help [section]",
        text: "Show the help menu or one section of it.",
        permission: "vitalstrike.use",
      },
      {
        usage: "/vs toggle [on|off]",
        text: "Turn your own damage indicators on or off.",
        permission: "vitalstrike.toggle",
      },
      {
        usage: "/vs holo [on|off]",
        text: "Turn your combo hologram on or off.",
        permission: "vitalstrike.hologram",
      },
      {
        usage: "/vs stats [player]",
        text: "Show level, kills and combat stats for yourself or another player.",
        permission: "vitalstrike.stats",
      },
      {
        usage: "/vs top [damage|combo|average]",
        text: "Show the top players. Old names: /vs leaderboard, /vs lb.",
        permission: "vitalstrike.leaderboard",
      },
      {
        usage: "/vs pack",
        text: "Load the optional resource pack. Old names: /vs resourcepack, /vs rp.",
        permission: "vitalstrike.resourcepack",
      },
    ],
  },
  {
    id: "admin",
    title: "Admin commands",
    commands: [
      {
        usage: "/vs reload",
        text: "Reload config.yml and clear floating text. Combo and knockdown values apply without a restart.",
        permission: "vitalstrike.reload",
        op: true,
      },
      {
        usage: "/vs clear",
        text: "Remove all floating damage and combo text, including strays.",
        permission: "vitalstrike.clear",
        op: true,
      },
      {
        usage: "/vs revive <player>",
        text: "Force-revive a downed player.",
        permission: "vitalstrike.revive",
        op: true,
      },
      {
        usage: "/vs give [amount] [player]",
        text: "Give Vital Awakening revive items. Old names: /vs vitalawakening, /vs va.",
        permission: "vitalstrike.give",
        op: true,
      },
      {
        usage: "/vs config [apply <code>]",
        text: "Edit the config in your browser. /vs config gives a link and a code; after saving in the editor, run /vs config apply <code>. The old file is kept as config.yml.bak.",
        permission: "vitalstrike.admin.config",
        op: true,
      },
      {
        usage: "/vs perm <add|remove|list> <player> [permission]",
        text: "Manage stored group permissions. Works for offline players.",
        permission: "vitalstrike.admin.permissions",
        op: true,
      },
    ],
  },
];

export default function Commands() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const q = query.trim().toLowerCase();

  const visible = groups
    .map((group) => ({
      ...group,
      commands: group.commands.filter(
        (c) => !q || `${c.usage} ${c.text} ${c.permission}`.toLowerCase().includes(q)
      ),
    }))
    .filter((group) => group.commands.length > 0);

  const copy = async (usage: string) => {
    try {
      await navigator.clipboard.writeText(usage.split(" [")[0].split(" <")[0]);
      setCopied(usage);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  };

  return (
    <div>
      <PageHeader title="Commands">
        The command is{" "}
        <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.9em]">
          /vitalstrike
        </code>
        , or <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.9em]">/vs</code>{" "}
        for short.
      </PageHeader>

      <label className="block">
        <span className="sr-only">Filter commands</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter commands or permissions"
          className="h-12 w-full max-w-md rounded-full bg-surface px-5 text-[15px] text-ink placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
      </label>

      {visible.map((group) => (
        <section key={group.id} id={group.id} data-toc={group.title} className="mt-10 scroll-mt-24">
          <h2 className="font-heading text-2xl sm:text-3xl">{group.title}</h2>
          <ul className="mt-5 space-y-3">
            {group.commands.map((command) => (
              <li key={command.usage} className="rounded-2xl bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <code className="break-all font-mono text-[15px] font-semibold">
                    {command.usage}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(command.usage)}
                    className="rounded-full bg-raised px-3.5 py-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                    aria-label={`Copy ${command.usage}`}
                  >
                    {copied === command.usage ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {command.text}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Permission <code className="font-mono text-ink">{command.permission}</code>
                  {command.op ? " (operators by default)" : " (everyone by default)"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {visible.length === 0 && (
        <p className="mt-10 text-[17px] text-muted-foreground">
          No command matches &quot;{query}&quot;.
        </p>
      )}

      <section
        id="permissions"
        data-toc="Permissions"
        className="mt-14 scroll-mt-24 rounded-3xl bg-surface p-6 sm:p-8"
      >
        <h2 className="font-heading text-2xl sm:text-3xl">Permission notes</h2>
        <ul className="mt-4 space-y-2 text-[17px] leading-relaxed">
          <li>
            <code className="font-mono">vitalstrike.admin</code> grants every admin permission
            above, plus the update notice.
          </li>
          <li>
            <code className="font-mono">vitalstrike.update-notify</code> tells a player about new
            releases when they join.
          </li>
          <li>
            <code className="font-mono">vitalstrike.group.&lt;name&gt;</code> gives a player a
            damage style from <code className="font-mono">group-damage-formats</code>.
          </li>
        </ul>
      </section>

      <DocsNavigation
        previousPage={{ title: "Health bars and levels", href: "/docs/configuration/progression" }}
      />
    </div>
  );
}
