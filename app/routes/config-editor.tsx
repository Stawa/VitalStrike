import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { HelpTip } from "~/components/HelpTip";
import { PageHeader } from "~/components/PageHeader";
import { Switch } from "~/components/Switch";
import { TiersEditor } from "~/components/TiersEditor";
import { WorldsEditor } from "~/components/WorldsEditor";
import {
  labelOf,
  sectionOf,
  sectionTitle,
  SECTION_INFO,
  SECTION_ORDER,
  plainComment,
} from "~/utils/configLayout";
import {
  problemsOf,
  type Entry,
  type Scalar,
  type Tier,
  type Value,
  type Worlds,
} from "~/utils/configTypes";
import { RELAY_URL } from "~/utils/relay";

export const meta: MetaFunction = () => [
  { title: "Config Editor - VitalStrike" },
  { name: "robots", content: "noindex" },
  { name: "description", content: "Edit your VitalStrike config.yml in the browser." },
];

interface Row extends Entry {
  section: string;
  group: string;
  label: string;
  help: string;
}

type Status = "idle" | "loading" | "ready" | "saving" | "saved" | "error";

const same = (a: Value, b: Value) => JSON.stringify(a) === JSON.stringify(b);

function listFromText(text: string, original: Scalar[]): Scalar[] {
  const numeric = original.length > 0 && original.every((v) => typeof v === "number");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (numeric && !Number.isNaN(Number(line)) ? Number(line) : line));
}

const field =
  "w-full rounded-xl bg-raised px-3.5 py-2.5 text-[15px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

export default function ConfigEditorPage() {
  return (
    <div className="page-x pt-6 lg:pt-10">
      <ConfigEditor />
    </div>
  );
}

function ConfigEditor() {
  const [code, setCode] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [edits, setEdits] = useState<Record<string, Value>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("general");
  const [copied, setCopied] = useState(false);
  const [demo, setDemo] = useState(false);

  const load = async (value: string) => {
    const clean = value.trim().toUpperCase();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch(`${RELAY_URL}/sessions/${clean}`);
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "That code was not found. It may have expired (codes last one hour)."
            : response.status >= 500
              ? "The editor service is not available right now. Try again in a minute."
              : `The editor service answered ${response.status}.`
        );
      }
      const session = (await response.json()) as { entries: Entry[] };
      setCode(clean);
      setEntries(session.entries);
      setEdits({});
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach the relay.");
      setStatus("error");
    }
  };

  const startDemo = async () => {
    setStatus("loading");
    setError("");
    const sample = (await import("~/utils/configDemo.json")).default as unknown as {
      entries: Entry[];
    };
    setEntries(sample.entries);
    setEdits({});
    setActive("general");
    setDemo(true);
    setStatus("ready");
  };

  const leaveDemo = () => {
    setDemo(false);
    setEntries([]);
    setEdits({});
    setCode("");
    setStatus("idle");
  };

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("code");
    if (fromUrl) {
      setCode(fromUrl.toUpperCase());
      void load(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows: Row[] = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        section: sectionOf(entry.path),
        ...labelOf(entry.path),
        help: plainComment(entry.comment),
      })),
    [entries]
  );

  const changes = useMemo(() => {
    const result: Record<string, Value> = {};
    for (const entry of entries) {
      const edited = edits[entry.path];
      if (edited !== undefined && !same(edited, entry.value)) result[entry.path] = edited;
    }
    return result;
  }, [entries, edits]);
  const changeCount = Object.keys(changes).length;
  const problems = useMemo(
    () =>
      entries.flatMap((entry) =>
        entry.path in changes ? problemsOf(entry.type, changes[entry.path] as Value) : []
      ),
    [entries, changes]
  );

  const sections = useMemo(() => {
    const present = new Set(rows.map((r) => r.section));
    const known = SECTION_ORDER.filter((s) => present.has(s));
    const extra = [...present].filter((s) => !(SECTION_ORDER as readonly string[]).includes(s));
    return [...known, ...extra.sort()];
  }, [rows]);

  const changedIn = (section: string) =>
    rows.filter((r) => r.section === section && r.path in changes).length;

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (q) {
      return rows.filter((r) =>
        `${r.path} ${r.label} ${r.group} ${r.comment} ${sectionTitle(r.section)}`
          .toLowerCase()
          .includes(q)
      );
    }
    return rows.filter((r) => r.section === active);
  }, [rows, q, active]);

  const blocks = useMemo(() => {
    const out: { key: string; heading: string; rows: Row[] }[] = [];
    for (const row of visible) {
      const heading = q
        ? [sectionTitle(row.section), row.group].filter(Boolean).join(" › ")
        : row.group;
      const key = `${q ? row.section : ""}|${row.group}`;
      const last = out[out.length - 1];
      if (last && last.key === key) last.rows.push(row);
      else out.push({ key, heading, rows: [row] });
    }
    return out;
  }, [visible, q]);

  const save = async () => {
    setStatus("saving");
    setError("");
    try {
      const response = await fetch(`${RELAY_URL}/sessions/${code}/changes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes }),
      });
      if (!response.ok) throw new Error(`The relay answered ${response.status}.`);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach the relay.");
      setStatus("ready");
    }
  };

  const command = `/vs config apply ${code}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const setValue = (path: string, value: Value) => setEdits((prev) => ({ ...prev, [path]: value }));
  const reset = (path: string) =>
    setEdits((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });

  if (status === "idle" || status === "error" || status === "loading") {
    const steps = [
      ["Run the command", "Type /vs config in game. It prints a link and a code."],
      ["Change settings", "Open the link, or paste the code here. Use switches and fields."],
      ["Apply", "Save, then run the /vs config apply command shown. Your old file is backed up."],
    ];
    return (
      <div className="grid items-start gap-10 py-4 lg:grid-cols-12 lg:gap-16 lg:py-10">
        <div className="lg:col-span-6">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl">
            Edit your config in the browser.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            No YAML and no hunting through a file. Change settings with switches and fields, then
            apply them to your server with one command.
          </p>
          <ol className="mt-8 space-y-5">
            {steps.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-ground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[17px] font-bold">{title}</h2>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-3xl bg-surface p-6 sm:p-8 lg:col-span-6 lg:mt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(code);
            }}
          >
            <label htmlFor="editor-code" className="text-[17px] font-bold">
              Editor code
            </label>
            <p className="mt-1 text-[14px] text-muted-foreground">
              10 characters, valid for one hour.
            </p>
            <input
              id="editor-code"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="ABCDEFGHJK"
              autoComplete="off"
              spellCheck={false}
              aria-describedby={error ? "editor-code-error" : undefined}
              className="mt-4 h-14 w-full rounded-2xl bg-raised px-5 text-center font-mono text-xl uppercase tracking-[0.3em] placeholder:text-muted-foreground/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
            <button
              type="submit"
              disabled={code.length !== 10 || status === "loading"}
              className="mt-4 h-12 w-full rounded-full bg-primary-600 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {status === "loading" ? "Loading..." : "Open editor"}
            </button>
            {error && (
              <p id="editor-code-error" role="alert" className="mt-4 text-[15px] text-primary-500">
                {error}
              </p>
            )}
          </form>

          <div className="mt-6 border-t border-border pt-6">
            <p className="text-[15px] text-muted-foreground">
              No server handy? Look around with sample settings. Nothing is saved.
            </p>
            <button
              type="button"
              onClick={() => void startDemo()}
              disabled={status === "loading"}
              className="mt-3 h-11 rounded-full bg-raised px-6 text-[15px] font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              Try it with sample settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div>
        <PageHeader title="Saved">
          {changeCount} change{changeCount === 1 ? "" : "s"} waiting. Run this on your server to
          apply them. Your old config is kept as <code>config.yml.bak</code>.
        </PageHeader>
        <div className="flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-5">
          <code className="min-w-0 break-all font-mono text-[15px] font-semibold">{command}</code>
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-raised px-3.5 py-1.5 text-sm font-semibold hover:opacity-80"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setStatus("ready")}
          className="mt-6 text-[15px] font-semibold text-primary-500 hover:underline"
        >
          Keep editing
        </button>
      </div>
    );
  }

  const info = SECTION_INFO[active];

  return (
    <div className="pb-28">
      <PageHeader title="Config editor">
        Pick a section, change what you need, then save. Only settings you touch are changed.
      </PageHeader>

      {demo && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4 text-[15px]">
          <p className="min-w-0 text-muted-foreground">
            <span className="font-semibold text-ink">Sample settings.</span> Nothing you change here
            is saved. Run <code className="font-mono">/vs config</code> on your server to edit your
            own.
          </p>
          <button
            type="button"
            onClick={leaveDemo}
            className="font-semibold text-primary-500 hover:underline"
          >
            Exit demo
          </button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <aside className="self-start lg:sticky lg:top-[calc(var(--navbar-height)+1rem)]">
          <label className="block">
            <span className="sr-only">Search settings</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all settings"
              className="h-11 w-full rounded-full bg-surface px-5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </label>

          <label className="mt-3 block lg:hidden">
            <span className="sr-only">Section</span>
            <select
              value={active}
              onChange={(e) => {
                setActive(e.target.value);
                setQuery("");
              }}
              className="h-11 w-full rounded-full bg-surface px-5 text-[15px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {sections.map((s) => (
                <option key={s} value={s}>
                  {sectionTitle(s)}
                  {changedIn(s) ? ` (${changedIn(s)} edited)` : ""}
                </option>
              ))}
            </select>
          </label>

          <nav aria-label="Sections" className="mt-4 hidden lg:block">
            <ul className="space-y-1">
              {sections.map((s) => {
                const count = changedIn(s);
                const current = !q && s === active;
                return (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setActive(s);
                        setQuery("");
                      }}
                      aria-current={current ? "true" : undefined}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] font-semibold transition-colors ${
                        current ? "bg-surface text-ink" : "text-muted-foreground hover:bg-surface"
                      }`}
                    >
                      {sectionTitle(s)}
                      {count > 0 && (
                        <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="mt-8 min-w-0 lg:mt-0">
          <h2 className="font-heading text-2xl sm:text-3xl">
            {q ? `Results for "${query.trim()}"` : sectionTitle(active)}
          </h2>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {q
              ? `${visible.length} setting${visible.length === 1 ? "" : "s"} found.`
              : (info?.blurb ?? "")}
          </p>

          {visible.length === 0 && (
            <p className="mt-8 text-[17px] text-muted-foreground">Nothing matches that search.</p>
          )}

          {blocks.map((block) => (
            <section key={block.key} className="mt-8">
              {block.heading && (
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {block.heading}
                </h3>
              )}
              <ul className="divide-y divide-border rounded-2xl bg-surface">
                {block.rows.map((row) => {
                  const current = edits[row.path] ?? row.value;
                  const changed = row.path in changes;
                  const id = `f-${row.path}`;
                  const wide =
                    row.type === "list" ||
                    row.type === "tiers" ||
                    row.type === "worlds" ||
                    (row.type === "string" &&
                      (String(current).length > 40 || String(current).includes("\n")));
                  return (
                    <li key={row.path} className="p-4 sm:p-5">
                      <div
                        className={`flex gap-4 ${
                          wide ? "flex-col" : "items-center justify-between"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <label
                              id={`${id}-label`}
                              htmlFor={id}
                              className="text-[16px] font-semibold"
                            >
                              {row.label}
                            </label>
                            {row.help && <HelpTip text={row.help} label={row.label} />}
                            {changed && (
                              <button
                                type="button"
                                onClick={() => reset(row.path)}
                                className="text-sm font-semibold text-primary-500 hover:underline"
                              >
                                Edited, undo
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={wide ? "w-full" : "shrink-0"}>
                          {row.type === "boolean" && (
                            <Switch
                              checked={current === true}
                              onChange={(v) => setValue(row.path, v)}
                              labelledBy={`${id}-label`}
                            />
                          )}
                          {(row.type === "integer" || row.type === "number") && (
                            <input
                              id={id}
                              type="number"
                              step={row.type === "integer" ? 1 : "any"}
                              value={String(current)}
                              onChange={(e) => {
                                const n = e.target.valueAsNumber;
                                if (!Number.isNaN(n)) setValue(row.path, n);
                              }}
                              className={`${field} w-28 text-right sm:w-32`}
                            />
                          )}
                          {row.type === "string" &&
                            (wide ? (
                              <textarea
                                id={id}
                                rows={2}
                                value={String(current)}
                                onChange={(e) => setValue(row.path, e.target.value)}
                                className={`${field} font-mono`}
                              />
                            ) : (
                              <input
                                id={id}
                                type="text"
                                value={String(current)}
                                onChange={(e) => setValue(row.path, e.target.value)}
                                className={`${field} w-44 sm:w-56`}
                              />
                            ))}
                          {row.type === "list" && (
                            <>
                              <textarea
                                id={id}
                                rows={Math.min(8, Math.max(2, (current as Scalar[]).length + 1))}
                                value={(current as Scalar[]).join("\n")}
                                onChange={(e) =>
                                  setValue(
                                    row.path,
                                    listFromText(e.target.value, row.value as Scalar[])
                                  )
                                }
                                aria-describedby={`${id}-hint`}
                                className={`${field} font-mono`}
                              />
                              <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
                                One item per line.
                              </p>
                            </>
                          )}
                          {row.type === "tiers" && (
                            <TiersEditor
                              id={id}
                              value={current as Tier[]}
                              onChange={(next) => setValue(row.path, next)}
                            />
                          )}
                          {row.type === "worlds" && (
                            <WorldsEditor
                              id={id}
                              value={current as Worlds}
                              onChange={(next) => setValue(row.path, next)}
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-ground/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-8xl items-center justify-between gap-4">
          <p className="min-w-0 text-sm text-muted-foreground sm:text-[15px]" aria-live="polite">
            {error ? (
              <span className="text-primary-500">{error}</span>
            ) : problems.length > 0 ? (
              <span className="text-primary-500">
                Fix {problems.length} problem{problems.length === 1 ? "" : "s"} first: {problems[0]}
              </span>
            ) : changeCount > 0 ? (
              `${changeCount} unsaved change${changeCount === 1 ? "" : "s"}`
            ) : (
              "No changes yet"
            )}
          </p>
          <div className="flex items-center gap-3">
            {changeCount > 0 && (
              <button
                type="button"
                onClick={() => setEdits({})}
                className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:underline sm:text-[15px]"
              >
                Discard all
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={demo || status === "saving" || changeCount === 0 || problems.length > 0}
              className="h-11 whitespace-nowrap rounded-full bg-primary-600 px-5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50 sm:px-6"
            >
              {demo ? "Demo only" : status === "saving" ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
