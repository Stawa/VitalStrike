import { useState } from "react";
import { Link } from "@remix-run/react";
import { marked } from "marked";
import type { BlogPost } from "~/types/blog";

interface Item {
  text: string;
  sub: string[];
}

interface Group {
  title: string;
  items: Item[];
}

/** Splits a release's markdown into its "### Added / Changed / Fixed" groups and their bullet lists. */
export function parseGroups(changes: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;

  for (const raw of changes.split("\n")) {
    const heading = raw.match(/^###\s+(.+)$/);
    if (heading) {
      current = { title: heading[1].trim(), items: [] };
      groups.push(current);
      continue;
    }
    if (!current) continue;
    const top = raw.match(/^[-*]\s+(.*)$/);
    const nested = raw.match(/^\s+[-*]\s+(.*)$/);
    if (top) current.items.push({ text: top[1], sub: [] });
    else if (nested && current.items.length)
      current.items[current.items.length - 1].sub.push(nested[1]);
    else if (raw.trim() && current.items.length)
      current.items[current.items.length - 1].text += ` ${raw.trim()}`;
  }

  return groups.filter((group) => group.items.length > 0);
}

const dotColors: Record<string, string> = {
  added: "#6aa36a",
  changed: "#6f8fc2",
  fixed: "#c2a25f",
  removed: "#c27a7a",
};

const dot = (title: string) => dotColors[title.toLowerCase()] ?? "#8a92a1";
const inline = (text: string) => marked.parseInline(text, { async: false }) as string;
const plain = (text: string) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "");

function shorten(text: string, max = 120) {
  const clean = plain(text);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

const prose =
  "[&_code]:rounded-md [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold";

export function releaseStatus(post: BlogPost, index: number) {
  if (post.date.toLowerCase().includes("unreleased")) return "Unreleased";
  return index === 0 ? "Latest" : null;
}

function Counts({ changes }: Readonly<{ changes: string }>) {
  const groups = parseGroups(changes);
  return (
    <ul className="flex flex-wrap gap-2">
      {groups.map((group) => (
        <li
          key={group.title}
          className="inline-flex items-center gap-2 rounded-full bg-raised px-3 py-1 text-sm font-semibold"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: dot(group.title) }}
            aria-hidden="true"
          />
          {group.items.length} {group.title.toLowerCase()}
        </li>
      ))}
    </ul>
  );
}

/** The newest release, shown larger with a few highlights picked from Added, then Changed. */
export function FeaturedRelease({
  post,
  status,
}: Readonly<{ post: BlogPost; status: string | null }>) {
  const groups = parseGroups(post.changes);
  const order = ["added", "changed", "fixed"];
  const rank = (title: string) => {
    const i = order.indexOf(title.toLowerCase());
    return i === -1 ? order.length : i;
  };
  const highlights = [...groups]
    .sort((a, b) => rank(a.title) - rank(b.title))
    .flatMap((group) =>
      group.items
        .slice(0, group.title.toLowerCase() === "added" ? 3 : 2)
        .map((item) => ({ group: group.title, text: item.text }))
    )
    .slice(0, 5);

  return (
    <article
      id={`v${post.version}`}
      className="scroll-mt-24 rounded-3xl bg-surface p-6 sm:p-10 lg:p-12"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            {status && (
              <span className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-ground">
                {status}
              </span>
            )}
            {status !== "Unreleased" && (
              <span className="text-[15px] font-medium text-muted-foreground">{post.date}</span>
            )}
          </div>
          <h2 className="font-heading mt-4 text-[clamp(3.5rem,7vw,8rem)]">{post.version}</h2>
          <p
            className={`mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground 2xl:text-xl ${prose}`}
            dangerouslySetInnerHTML={{ __html: inline(post.description) }}
          />
          <div className="mt-6">
            <Counts changes={post.changes} />
          </div>
          <Link
            to={`/blog/${post.version}`}
            className="mt-8 inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-ground transition-opacity hover:opacity-90"
          >
            Read the full notes
          </Link>
        </div>

        <div className="lg:col-span-6">
          <h3 className="text-sm font-bold text-muted-foreground">Highlights</h3>
          <ul className="mt-3 space-y-2">
            {highlights.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl bg-raised p-4 text-[15px] leading-relaxed 2xl:text-base"
              >
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: dot(item.group) }}
                  aria-hidden="true"
                />
                <span>{shorten(item.text, 130)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/** A compact card for every older release. */
export function ReleaseSummary({
  post,
  status,
}: Readonly<{ post: BlogPost; status: string | null }>) {
  return (
    <Link
      id={`v${post.version}`}
      to={`/blog/${post.version}`}
      className="group flex scroll-mt-24 flex-col rounded-3xl bg-surface p-6 transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-4xl group-hover:text-primary-600 dark:group-hover:text-primary-400">
          {post.version}
        </h2>
        <span className="text-sm font-medium text-muted-foreground">{status ?? post.date}</span>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">
        {shorten(post.description, 190)}
      </p>
      <div className="mt-5">
        <Counts changes={post.changes} />
      </div>
    </Link>
  );
}

/** Full notes for one release. Groups can be folded, and the long ones start folded. */
export function ReleaseGroups({ changes }: Readonly<{ changes: string }>) {
  const groups = parseGroups(changes);
  const [open, setOpen] = useState<boolean[]>(() => groups.map((group) => group.items.length <= 8));

  if (groups.length === 0) {
    return <p className="mt-6 text-muted-foreground">No detailed notes for this release.</p>;
  }

  const allOpen = open.every(Boolean);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <Counts changes={changes} />
        <button
          type="button"
          onClick={() => setOpen(groups.map(() => !allOpen))}
          className="shrink-0 rounded-full bg-surface px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {groups.map((group, g) => (
          <section key={group.title} className="rounded-2xl bg-surface">
            <h3>
              <button
                type="button"
                aria-expanded={open[g]}
                onClick={() =>
                  setOpen((state) => state.map((value, i) => (i === g ? !value : value)))
                }
                className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-lg font-bold sm:px-6"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: dot(group.title) }}
                  aria-hidden="true"
                />
                {group.title}
                <span className="text-sm font-semibold text-muted-foreground">
                  {group.items.length}
                </span>
                <span className="ml-auto text-muted-foreground" aria-hidden="true">
                  {open[g] ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open[g] && (
              <ul className="space-y-3 px-5 pb-5 text-[15px] leading-relaxed sm:px-6">
                {group.items.map((item, i) => (
                  <li key={i}>
                    <span
                      className={prose}
                      dangerouslySetInnerHTML={{ __html: inline(item.text) }}
                    />
                    {item.sub.length > 0 && (
                      <ul className="mt-1.5 space-y-1 pl-4 text-muted-foreground">
                        {item.sub.map((sub, j) => (
                          <li key={j} className="list-disc">
                            <span
                              className={prose}
                              dangerouslySetInnerHTML={{ __html: inline(sub) }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
