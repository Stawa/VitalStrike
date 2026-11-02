import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Interactive model of what VitalStrike puts on screen. Numbers come from the
 * plugin's default config.yml: 1.5 s indicators, 2 s merge window, ten-segment
 * health bar, combo ranks at 0/5/10/15/25/40/60, hologram from a 10-hit streak.
 */

const MOB_MAX_HP = 20;
const COMBO_RESET_MS = 3000;
const MERGE_WINDOW_MS = 2000;
const INDICATOR_MS = 1500;
const HOLOGRAM_MIN_COMBO = 10;
const RANKS = [
  { name: "SSS", at: 60, color: "#ff4d2e" },
  { name: "SS", at: 40, color: "#b35cff" },
  { name: "S", at: 25, color: "#ff5fa8" },
  { name: "A", at: 15, color: "#ffb21a" },
  { name: "B", at: 10, color: "#4fd1ff" },
  { name: "C", at: 5, color: "#5be37d" },
  { name: "D", at: 0, color: "#a3a198" },
] as const;

type HitKind = "sword" | "critical" | "fire" | "poison" | "heal";

type GlyphName = "heart" | "bolt" | "flame" | "skull";

const KINDS: Record<HitKind, { label: string; glyph: GlyphName; sign: string; color: string }> = {
  sword: { label: "Sword", glyph: "heart", sign: "-", color: "#ff7b7b" },
  critical: { label: "Critical", glyph: "bolt", sign: "-", color: "#ff3030" },
  fire: { label: "Fire", glyph: "flame", sign: "-", color: "#ffa31a" },
  poison: { label: "Poison", glyph: "skull", sign: "-", color: "#50c878" },
  heal: { label: "Heal", glyph: "heart", sign: "+", color: "#55ff55" },
};

/** Small drawn marks standing in for the symbols the plugin prints in chat. */
function Glyph({
  name,
  className = "h-[0.9em] w-[0.9em]",
}: {
  name: GlyphName;
  className?: string;
}) {
  const paths: Record<GlyphName, React.ReactNode> = {
    heart: <path d="M8 14 1.5 7.6A3.9 3.9 0 0 1 8 3a3.9 3.9 0 0 1 6.5 4.6Z" />,
    bolt: <path d="M9.5 1 3 9h4l-1 6 7-9H9Z" />,
    flame: (
      <path d="M8 1c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.7-2.600 1.500-3.500C5.500 7 6 7.500 6.500 8 7 5.500 7 3.500 8 1Z" />
    ),
    skull: (
      <path d="M8 1.500a5.500 5.500 0 0 0-3.500 9.800V14h2v-1.500h1V14h1v-1.500h1V14h2v-2.700A5.500 5.500 0 0 0 8 1.500ZM5.800 8a1.200 1.200 0 1 1 0 2.400 1.200 1.200 0 0 1 0-2.400Zm4.400 0a1.200 1.200 0 1 1 0 2.400 1.200 1.200 0 0 1 0-2.400Z" />
    ),
  };
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`inline-block align-[-0.1em] ${className}`}
    >
      {paths[name]}
    </svg>
  );
}

type Floater = {
  id: number;
  kind: HitKind;
  amount: number;
  born: number;
  dx: string;
  tick: number;
};

const rankFor = (combo: number) => RANKS.find((r) => combo >= r.at) ?? RANKS[RANKS.length - 1];

export function Arena() {
  const [hp, setHp] = useState(MOB_MAX_HP);
  const [combo, setCombo] = useState(0);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [slain, setSlain] = useState(false);
  const [shake, setShake] = useState(0);
  const [merge, setMerge] = useState(true);
  const [log, setLog] = useState("Hit the zombie to see what players see.");

  const idRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout>>();
  const respawnTimer = useRef<ReturnType<typeof setTimeout>>();
  const state = useRef({ hp, combo, dead: false });
  state.current = { hp, combo, dead: slain };

  useEffect(
    () => () => {
      clearTimeout(comboTimer.current);
      clearTimeout(respawnTimer.current);
    },
    []
  );

  const spawn = useCallback(
    (kind: HitKind, amount: number) => {
      const now = Date.now();
      setFloaters((list) => {
        const live = list.filter((f) => now - f.born < INDICATOR_MS + 200);
        const last = live[live.length - 1];
        if (merge && last && last.kind === kind && now - last.born < MERGE_WINDOW_MS) {
          return [
            ...live.slice(0, -1),
            { ...last, amount: last.amount + amount, born: now, tick: last.tick + 1 },
          ];
        }
        idRef.current += 1;
        const dx = `${Math.round((Math.random() - 0.5) * 70)}px`;
        return [...live, { id: idRef.current, kind, amount, born: now, dx, tick: 0 }];
      });
    },
    [merge]
  );

  const hit = useCallback(
    (requested: HitKind) => {
      const s = state.current;
      if (s.dead) return;

      if (requested === "heal") {
        const healed = Math.min(4, MOB_MAX_HP - s.hp);
        if (healed <= 0) {
          setLog("Already at full health.");
          return;
        }
        setHp(s.hp + healed);
        spawn("heal", healed);
        setLog(`+${healed.toFixed(1)} heal indicator`);
        return;
      }

      const isCrit = requested === "sword" && Math.random() < 0.2;
      const kind: HitKind = isCrit ? "critical" : requested;
      const base =
        requested === "sword" ? 4 + Math.floor(Math.random() * 4) : requested === "fire" ? 3 : 2;
      const amount = isCrit ? Math.round(base * 1.5 * 10) / 10 : base;
      const nextHp = Math.max(0, s.hp - amount);
      const nextCombo = s.combo + 1;

      setCombo(nextCombo);
      setHp(nextHp);
      setShake((n) => n + 1);
      spawn(kind, amount);
      clearTimeout(comboTimer.current);
      comboTimer.current = setTimeout(() => setCombo(0), COMBO_RESET_MS);
      setLog(
        `${KINDS[kind].sign}${amount.toFixed(1)} ${KINDS[kind].label.toLowerCase()} hit, combo ${nextCombo}`
      );

      if (nextHp === 0) {
        setSlain(true);
        setLog("SLAIN Zombie");
        respawnTimer.current = setTimeout(() => {
          setHp(MOB_MAX_HP);
          setSlain(false);
        }, 1400);
      }
    },
    [spawn]
  );

  // Clear indicators once their animation has finished.
  useEffect(() => {
    if (floaters.length === 0) return;
    const timer = setTimeout(() => {
      const now = Date.now();
      setFloaters((list) => list.filter((f) => now - f.born < INDICATOR_MS));
    }, INDICATOR_MS + 50);
    return () => clearTimeout(timer);
  }, [floaters]);

  const rank = rankFor(combo);
  const segments = Math.ceil((hp / MOB_MAX_HP) * 10);

  return (
    <div data-ui className="overflow-hidden rounded-3xl bg-[#14171c] text-[#eceef2]">
      <div className="relative min-h-[23rem] overflow-hidden bg-[#1c2230] sm:min-h-[27rem] lg:min-h-[32rem] 2xl:min-h-[34rem]">
        {/* ground */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[#2b3a2c]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-20 h-3 bg-[#41703b]" aria-hidden="true" />

        {/* readouts */}
        <dl className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 text-sm sm:left-5 sm:top-5">
          <div className="rounded-full bg-black/35 px-3.5 py-1.5">
            <dt className="inline text-[#9aa1ad]">Combo </dt>
            <dd
              className="inline font-bold tabular-nums"
              style={{ color: combo ? rank.color : undefined }}
            >
              {combo}
              {combo > 0 && ` ${rank.name}`}
            </dd>
          </div>
        </dl>

        {/* the mob */}
        <div className="absolute inset-x-0 bottom-[5.9rem] flex justify-center">
          <div className="relative flex flex-col items-center">
            {combo >= HOLOGRAM_MIN_COMBO && !slain && (
              <p
                className="absolute -top-24 whitespace-nowrap text-center text-sm font-bold sm:-top-28"
                style={{ color: rank.color }}
              >
                {combo} HIT STREAK
                <span className="block font-normal text-[#9aa1ad]">
                  Rank <span style={{ color: rank.color }}>{rank.name}</span>
                </span>
              </p>
            )}

            <div className="relative h-0 w-0">
              {floaters.map((f) => (
                <span
                  key={`${f.id}-${f.tick}`}
                  className="pointer-events-none absolute -top-20 left-0 -translate-x-1/2 whitespace-nowrap text-xl font-bold motion-safe:animate-[vs-float_1.5s_ease-out_forwards] sm:text-2xl"
                  style={{
                    color: KINDS[f.kind].color,
                    ["--vs-dx" as string]: f.dx,
                    fontWeight: f.kind === "critical" ? 800 : 700,
                  }}
                >
                  {KINDS[f.kind].sign}
                  {f.amount.toFixed(1)} <Glyph name={KINDS[f.kind].glyph} />
                </span>
              ))}
            </div>

            {slain ? (
              <p className="mb-3 whitespace-nowrap text-lg font-bold text-[#ff4d4d]">
                <Glyph name="skull" /> SLAIN{" "}
                <span className="font-normal text-[#9aa1ad]">Zombie</span>
              </p>
            ) : (
              <div className="mb-3 flex items-center gap-2 whitespace-nowrap text-sm">
                <div className="flex gap-[3px]" aria-hidden="true">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      className={`h-3.5 w-2.5 rounded-[3px] ${i < segments ? "bg-[#ff4d4d]" : "bg-[#3a3f49]"}`}
                    />
                  ))}
                </div>
                <span className="tabular-nums">
                  {hp.toFixed(0)}
                  <span className="text-[#9aa1ad]">/{MOB_MAX_HP}</span>{" "}
                  <Glyph name="heart" className="h-[0.9em] w-[0.9em] text-[#ff4d4d]" />
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => hit("sword")}
              aria-label="Hit the zombie with a sword"
              disabled={slain}
              className="block cursor-crosshair rounded-xl bg-transparent p-0 outline-offset-4 disabled:opacity-40"
            >
              <svg
                key={shake}
                viewBox="0 0 16 32"
                width="96"
                height="192"
                shapeRendering="crispEdges"
                className={`h-40 w-20 sm:h-48 sm:w-24 2xl:h-60 2xl:w-30 ${shake && !slain ? "motion-safe:animate-[vs-shake_0.25s_ease-out]" : ""} ${slain ? "rotate-90 opacity-0 transition-all duration-500" : ""}`}
                aria-hidden="true"
              >
                <rect x="4" y="0" width="8" height="8" fill="#6fa55a" />
                <rect x="5" y="3" width="2" height="2" fill="#1b2a17" />
                <rect x="9" y="3" width="2" height="2" fill="#1b2a17" />
                <rect x="6" y="6" width="4" height="1" fill="#46703a" />
                <rect x="4" y="8" width="8" height="12" fill="#2f7a8f" />
                <rect x="0" y="8" width="4" height="12" fill="#6fa55a" />
                <rect x="12" y="8" width="4" height="12" fill="#6fa55a" />
                <rect x="4" y="20" width="4" height="12" fill="#3a3f8f" />
                <rect x="8" y="20" width="4" height="12" fill="#2f337a" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4">
        {(["sword", "fire", "poison", "heal"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => hit(kind)}
            disabled={slain}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#232830] px-5 text-[15px] font-semibold transition-colors hover:bg-[#2d333d] active:scale-[0.97] disabled:opacity-40"
          >
            <span style={{ color: KINDS[kind].color }}>
              <Glyph name={KINDS[kind].glyph} />
            </span>
            {KINDS[kind].label}
          </button>
        ))}
        <label className="ml-auto flex min-h-11 cursor-pointer items-center gap-2 px-2 text-[15px] text-[#c4c9d2]">
          <input
            type="checkbox"
            checked={merge}
            onChange={(e) => setMerge(e.target.checked)}
            className="h-4 w-4 accent-[#d6343c]"
          />
          Merge rapid hits
        </label>
      </div>
      <p aria-live="polite" className="px-5 pb-4 text-sm text-[#9aa1ad]">
        {log}
      </p>
    </div>
  );
}
