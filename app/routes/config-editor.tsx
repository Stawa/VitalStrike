import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "~/components/PageHeader";
import { RELAY_URL } from "~/utils/relay";

export const meta: MetaFunction = () => [
  { title: "Config Editor - VitalStrike" },
  { name: "robots", content: "noindex" },
  { name: "description", content: "Edit your VitalStrike config.yml in the browser." },
];

type Scalar = string | number | boolean;
type Value = Scalar | Scalar[];

interface Entry {
  path: string;
  type: "boolean" | "integer" | "number" | "string" | "list";
  value: Value;
  comment: string;
}

type Status = "idle" | "loading" | "ready" | "saving" | "saved" | "error";

const same = (a: Value, b: Value) => JSON.stringify(a) === JSON.stringify(b);

function groupOf(path: string) {
  return path.includes(".") ? path.slice(0, path.indexOf(".")) : "general";
}

function listFromText(text: string, original: Scalar[]): Scalar[] {
  const numeric = original.length > 0 && original.every((v) => typeof v === "number");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (numeric && !Number.isNaN(Number(line)) ? Number(line) : line));
}

const field =
  "w-full rounded-xl bg-raised px-3.5 py-2 text-[15px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

export default function ConfigEditor() {
  const [code, setCode] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [edits, setEdits] = useState<Record<string, Value>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

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
            : `The relay answered ${response.status}.`
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

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("code");
    if (fromUrl) {
      setCode(fromUrl.toUpperCase());
      void load(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changes = useMemo(() => {
    const result: Record<string, Value> = {};
    for (const entry of entries) {
      const edited = edits[entry.path];
      if (edited !== undefined && !same(edited, entry.value)) result[entry.path] = edited;
    }
    return result;
  }, [entries, edits]);
  const changeCount = Object.keys(changes).length;

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const entry of entries) {
      if (q && !`${entry.path} ${entry.comment}`.toLowerCase().includes(q)) continue;
      const key = groupOf(entry.path);
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    return [...map.entries()];
  }, [entries, q]);

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

  const reset = (path: string) =>
    setEdits((previous) => {
      const next = { ...previous };
      delete next[path];
      return next;
    });

  if (status === "idle" || status === "error" || status === "loading") {
    return (
      <div>
        <PageHeader title="Config editor">
          Run <code className="font-mono">/vs config</code> on your server to get a link, or enter
          the code it gave you.
        </PageHeader>
        <form
          className="flex max-w-md flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void load(code);
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Editor code"
            maxLength={10}
            aria-label="Editor code"
            className="h-12 flex-1 rounded-full bg-surface px-5 font-mono text-[15px] uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <button
            type="submit"
            disabled={code.length !== 10 || status === "loading"}
            className="h-12 rounded-full bg-primary-600 px-6 font-semibold text-white disabled:opacity-50"
          >
            {status === "loading" ? "Loading..." : "Open"}
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-4 text-[15px] text-primary-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div>
        <PageHeader title="Saved">
          {changeCount} change{changeCount === 1 ? "" : "s"} are waiting. Run this command on your
          server to apply them. Your previous config is kept as <code>config.yml.bak</code>.
        </PageHeader>
        <div className="flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-5">
          <code className="break-all font-mono text-[15px] font-semibold">{command}</code>
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

  return (
    <div className="pb-28">
      <PageHeader title="Config editor">
        Change values below, save, then run the command shown. Only settings that already exist can
        be changed.
      </PageHeader>

      <label className="block">
        <span className="sr-only">Filter settings</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter settings"
          className="h-12 w-full max-w-md rounded-full bg-surface px-5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
      </label>

      {groups.map(([group, items]) => (
        <section key={group} className="mt-10">
          <h2 className="font-heading text-2xl sm:text-3xl">{group}</h2>
          <ul className="mt-5 space-y-3">
            {items.map((entry) => {
              const current = edits[entry.path] ?? entry.value;
              const changed = entry.path in changes;
              const id = `f-${entry.path}`;
              return (
                <li key={entry.path} className="rounded-2xl bg-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label htmlFor={id} className="break-all font-mono text-[14px] font-semibold">
                      {entry.path}
                      {changed && <span className="ml-2 text-primary-500">edited</span>}
                    </label>
                    {changed && (
                      <button
                        type="button"
                        onClick={() => reset(entry.path)}
                        className="text-sm font-semibold text-muted-foreground hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  {entry.comment && (
                    <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-muted-foreground">
                      {entry.comment}
                    </p>
                  )}
                  <div className="mt-3">
                    {entry.type === "boolean" && (
                      <input
                        id={id}
                        type="checkbox"
                        checked={current === true}
                        onChange={(e) => setEdits({ ...edits, [entry.path]: e.target.checked })}
                        className="h-5 w-5 accent-primary-600"
                      />
                    )}
                    {(entry.type === "integer" || entry.type === "number") && (
                      <input
                        id={id}
                        type="number"
                        step={entry.type === "integer" ? 1 : "any"}
                        value={String(current)}
                        onChange={(e) => {
                          const n = e.target.valueAsNumber;
                          if (!Number.isNaN(n)) setEdits({ ...edits, [entry.path]: n });
                        }}
                        className={`${field} max-w-xs`}
                      />
                    )}
                    {entry.type === "string" &&
                      (String(current).length > 70 || String(current).includes("\n") ? (
                        <textarea
                          id={id}
                          rows={3}
                          value={String(current)}
                          onChange={(e) => setEdits({ ...edits, [entry.path]: e.target.value })}
                          className={`${field} font-mono`}
                        />
                      ) : (
                        <input
                          id={id}
                          type="text"
                          value={String(current)}
                          onChange={(e) => setEdits({ ...edits, [entry.path]: e.target.value })}
                          className={field}
                        />
                      ))}
                    {entry.type === "list" && (
                      <>
                        <textarea
                          id={id}
                          rows={Math.min(8, Math.max(2, (current as Scalar[]).length + 1))}
                          value={(current as Scalar[]).join("\n")}
                          onChange={(e) =>
                            setEdits({
                              ...edits,
                              [entry.path]: listFromText(e.target.value, entry.value as Scalar[]),
                            })
                          }
                          aria-describedby={`${id}-hint`}
                          className={`${field} font-mono`}
                        />
                        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
                          One item per line.
                        </p>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="mt-10 text-[17px] text-muted-foreground">
          No setting matches &quot;{query}&quot;.
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-ground/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="text-[15px] text-muted-foreground" aria-live="polite">
            {error ? (
              <span className="text-primary-500">{error}</span>
            ) : (
              `${changeCount} unsaved change${changeCount === 1 ? "" : "s"}`
            )}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            className="h-11 rounded-full bg-primary-600 px-6 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
