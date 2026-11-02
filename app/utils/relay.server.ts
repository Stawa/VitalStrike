// Web-editor relay: a short-lived mailbox between `/vs config` and the editor page.
// The 10-character code is the only secret. Sessions expire after an hour and hold nothing but
// config setting names, values and comments. Storage is Redis (Vercel Marketplace: Upstash).

const TTL_SECONDS = 3600;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_ENTRIES = 3000;
const MAX_CHANGES = 1000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE = /^[A-Z2-9]{10}$/;

interface Session {
  entries: { path: string }[];
  changes: Record<string, unknown> | null;
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis is not configured");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Redis answered ${response.status}`);
  return ((await response.json()) as { result: unknown }).result;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const notFound = () => json({ error: "not found" }, 404);
const badRequest = () => json({ error: "bad request" }, 400);

function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) return null;
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

const isScalar = (v: unknown) => ["string", "number", "boolean"].includes(typeof v);
const isValue = (v: unknown) =>
  isScalar(v) || (Array.isArray(v) && v.length <= 500 && v.every(isScalar));

async function load(code: string): Promise<Session | null> {
  const stored = await redis(["GET", `vs:${code}`]);
  return typeof stored === "string" ? (JSON.parse(stored) as Session) : null;
}

const save = (code: string, session: Session) =>
  redis(["SET", `vs:${code}`, JSON.stringify(session), "EX", TTL_SECONDS]);

/** Handles /api/sessions[/:code[/changes|/result]]. `path` is the part after /api/. */
export async function handleRelay(request: Request, path: string): Promise<Response> {
  try {
    const parts = path.split("/").filter(Boolean);
    if (parts[0] !== "sessions") return notFound();
    const method = request.method;

    if (parts.length === 1 && method === "POST") {
      const body = await readJson(request);
      if (!body || !Array.isArray(body.entries) || body.entries.length > MAX_ENTRIES) {
        return badRequest();
      }
      const code = newCode();
      await save(code, { entries: body.entries as Session["entries"], changes: null });
      return json({ code }, 201);
    }

    const code = parts[1];
    if (!code || !CODE.test(code)) return notFound();
    const session = await load(code);
    if (!session) return notFound();

    if (parts.length === 2 && method === "GET") return json(session);

    if (parts.length === 2 && method === "DELETE") {
      await redis(["DEL", `vs:${code}`]);
      return json({ ok: true });
    }

    if (parts.length === 3 && parts[2] === "changes" && method === "PUT") {
      const body = await readJson(request);
      const changes = body?.changes;
      const known = new Set(session.entries.map((e) => e.path));
      const valid =
        !!changes &&
        typeof changes === "object" &&
        !Array.isArray(changes) &&
        Object.keys(changes).length <= MAX_CHANGES &&
        Object.entries(changes).every(([key, value]) => known.has(key) && isValue(value));
      if (!valid) return badRequest();
      session.changes = changes as Record<string, unknown>;
      await save(code, session);
      return json({ ok: true });
    }

    if (parts.length === 3 && parts[2] === "result" && method === "GET") {
      return session.changes === null
        ? json({ error: "no changes saved" }, 404)
        : json({ changes: session.changes });
    }

    return notFound();
  } catch (error) {
    console.error("relay error", error);
    return json({ error: "relay unavailable" }, 503);
  }
}
