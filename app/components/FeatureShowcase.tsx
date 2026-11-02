import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/**
 * One stage, seven pieces of what VitalStrike puts on screen. Pick a feature on the left and the
 * stage on the right shows it in a game-like scene. Figures are the plugin's shipped defaults.
 */

function Mob({ className = "h-44 w-[5.5rem]" }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 16 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
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
  );
}

function HpBar({ hp, max = 20 }: Readonly<{ hp: number; max?: number }>) {
  const segments = Math.ceil((hp / max) * 10);
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-sm text-[#eceef2]">
      <div className="flex gap-[3px]" role="img" aria-label={`${hp} of ${max} health`}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-3.5 w-2.5 rounded-[3px] ${i < segments ? "bg-[#ff4d4d]" : "bg-[#3a3f49]"}`}
          />
        ))}
      </div>
      <span className="tabular-nums">
        {hp}
        <span className="text-[#9aa1ad]">/{max}</span>
      </span>
    </div>
  );
}

function Stage({ children, ground = true }: Readonly<{ children: ReactNode; ground?: boolean }>) {
  return (
    <div className="relative min-h-[26rem] overflow-hidden rounded-3xl bg-[#1c2230] text-[#eceef2] lg:min-h-[34rem] 2xl:min-h-[42rem]">
      {ground && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-[#2b3a2c]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-20 h-3 bg-[#41703b]" aria-hidden="true" />
        </>
      )}
      <div className="absolute inset-x-0 bottom-[5.75rem] top-0 p-5 sm:p-8">{children}</div>
    </div>
  );
}

function Float({
  children,
  className,
  color,
  size = "text-4xl",
}: Readonly<{ children: ReactNode; className: string; color: string; size?: string }>) {
  return (
    <span className={`absolute font-extrabold tabular-nums ${size} ${className}`} style={{ color }}>
      {children}
    </span>
  );
}

function DamageScene() {
  return (
    <Stage>
      <div className="relative h-full">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <Mob className="h-44 w-[5.5rem] 2xl:h-64 2xl:w-32" />
        </div>
        <Float className="left-[14%] top-[18%]" color="#ff7b7b" size="text-5xl 2xl:text-6xl">
          -6.0
        </Float>
        <Float
          className="left-[40%] top-[2%] -rotate-3"
          color="#ff3030"
          size="text-7xl 2xl:text-8xl"
        >
          -9.0
        </Float>
        <Float className="right-[12%] top-[26%]" color="#ffd700" size="text-4xl 2xl:text-5xl">
          -3.0
        </Float>
        <Float className="left-[6%] top-[52%]" color="#50c878" size="text-3xl 2xl:text-4xl">
          -2.0
        </Float>
        <Float className="right-[6%] top-[56%]" color="#55ff55" size="text-4xl 2xl:text-5xl">
          +4.0
        </Float>
      </div>
    </Stage>
  );
}

function HealthScene() {
  return (
    <Stage>
      <div className="flex h-full items-end justify-around gap-4">
        {[20, 14, 5].map((hp) => (
          <div key={hp} className="flex flex-col items-center gap-3">
            <HpBar hp={hp} />
            <Mob className="h-36 w-[4.5rem] 2xl:h-52 2xl:w-26" />
          </div>
        ))}
      </div>
    </Stage>
  );
}

const ranks = [
  { name: "D", at: 0, color: "#a3a8b3" },
  { name: "C", at: 5, color: "#5be37d" },
  { name: "B", at: 10, color: "#4fd1ff" },
  { name: "A", at: 15, color: "#ffb21a" },
  { name: "S", at: 25, color: "#ff5fa8" },
  { name: "SS", at: 40, color: "#b35cff" },
  { name: "SSS", at: 60, color: "#ff4d2e" },
];

function ComboScene() {
  return (
    <Stage>
      <div className="flex h-full flex-col justify-between">
        <ul className="flex flex-wrap gap-2">
          {ranks.map((rank) => (
            <li
              key={rank.name}
              className={`rounded-xl px-3.5 py-2 text-center ${rank.name === "B" ? "bg-[#2a3345] ring-2 ring-[#4fd1ff]" : "bg-black/25 opacity-70"}`}
            >
              <span
                className="block text-lg font-extrabold leading-none"
                style={{ color: rank.color }}
              >
                {rank.name}
              </span>
              <span className="mt-1 block text-xs tabular-nums text-[#9aa1ad]">{rank.at}+</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center">
          <p className="text-center font-bold text-[#4fd1ff]">
            <span className="block text-3xl 2xl:text-5xl">12 HIT STREAK</span>
            <span className="mt-1 block text-lg font-normal text-[#9aa1ad]">
              Rank <span className="text-[#4fd1ff]">B</span>
            </span>
          </p>
          <Mob className="mt-3 h-32 w-16 2xl:h-48 2xl:w-24" />
        </div>
      </div>
    </Stage>
  );
}

function GroupScene() {
  const groups = [
    { name: "default", node: "no permission", color: "#ff6b6b" },
    { name: "water", node: "vitalstrike.group.water", color: "#1e90ff" },
    { name: "fire", node: "vitalstrike.group.fire", color: "#ff5a1f" },
  ];
  return (
    <Stage>
      <div className="flex h-full items-end justify-around gap-4">
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col items-center gap-2 text-center">
            <span
              className="text-5xl font-extrabold tabular-nums 2xl:text-6xl"
              style={{ color: group.color }}
            >
              -6.0
            </span>
            <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold sm:text-sm">
              {group.name}
            </span>
            <span className="max-w-[9rem] break-all font-mono text-[11px] text-[#9aa1ad]">
              {group.node}
            </span>
            <Mob className="h-32 w-16 2xl:h-44 2xl:w-22" />
          </div>
        ))}
      </div>
    </Stage>
  );
}

const sounds = [
  ["critical", "entity.player.attack.crit"],
  ["fire", "block.fire.ambient"],
  ["lightning", "entity.lightning_bolt.thunder"],
  ["sonic_boom", "entity.warden.sonic_boom"],
];

function SoundScene() {
  return (
    <Stage ground={false}>
      <ul className="flex h-full flex-col justify-center gap-3">
        {sounds.map(([type, sound], row) => (
          <li
            key={type}
            className="flex items-center justify-between gap-4 rounded-2xl bg-black/25 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="text-xl font-bold 2xl:text-2xl">{type}</p>
              <p className="truncate font-mono text-sm text-[#9aa1ad]">{sound}</p>
            </div>
            <div className="flex h-8 items-center gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="h-full w-1.5 origin-center rounded-full bg-[#9db4de] motion-safe:animate-[vs-eq_1.1s_ease-in-out_infinite]"
                  style={{ animationDelay: `${(row * 5 + bar) * 90}ms` }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function DimensionScene() {
  const dims = [
    { name: "Overworld", value: 1.0, color: "#5be37d" },
    { name: "Nether", value: 1.2, color: "#ff6a3d" },
    { name: "End", value: 1.1, color: "#b35cff" },
  ];
  return (
    <Stage ground={false}>
      <div className="flex h-full flex-col justify-center gap-6">
        {dims.map((dim) => (
          <div key={dim.name}>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold 2xl:text-2xl">{dim.name}</span>
              <span
                className="text-3xl font-extrabold tabular-nums 2xl:text-4xl"
                style={{ color: dim.color }}
              >
                {dim.value.toFixed(1)}×
              </span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full rounded-full"
                style={{ width: `${(dim.value / 1.2) * 100}%`, backgroundColor: dim.color }}
              />
            </div>
          </div>
        ))}
        <p className="text-sm text-[#9aa1ad]">
          damage-multiplier per dimension. Switch a whole dimension or world off with enabled:
          false.
        </p>
      </div>
    </Stage>
  );
}

function DownedScene() {
  return (
    <Stage>
      <div className="flex h-full flex-col justify-between">
        <div className="mx-auto w-full max-w-sm text-center">
          <p className="text-sm font-semibold text-[#ffd84d]">Reviving Steve...</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/30">
            <div className="h-full w-[62%] rounded-full bg-[#ffd84d]" />
          </div>
          <p className="mt-2 text-sm text-[#9aa1ad]">
            Downed for 30 s. Revive takes 5 s within 3 blocks.
          </p>
        </div>
        <div className="flex items-end justify-center gap-10">
          <Mob className="h-40 w-20 2xl:h-56 2xl:w-28" />
          <div className="mb-3 origin-bottom-left -rotate-90 translate-x-4">
            <Mob className="h-40 w-20 opacity-80 2xl:h-56 2xl:w-28" />
          </div>
        </div>
      </div>
    </Stage>
  );
}

const features = [
  {
    id: "damage",
    title: "Damage numbers on every hit",
    text: "Floating text styled per damage type, merged when hits land fast, with real critical-hit detection and green heals.",
    facts: ["28 damage types", "2 s merge window", "Real crits"],
    Scene: DamageScene,
  },
  {
    id: "health",
    title: "A health bar on whatever you hit",
    text: "Mobs and players get a ten-segment bar above their head that disappears a few seconds after the last hit or heal.",
    facts: ["10 segments", "Hides after 4 s"],
    Scene: HealthScene,
  },
  {
    id: "combo",
    title: "Combos with ranks",
    text: "Chain hits to climb from D to SSS. A hologram shows the streak, and an optional damage bonus rewards it.",
    facts: ["Hologram from 10 hits", "Bonus up to 3.0×, off by default"],
    Scene: ComboScene,
  },
  {
    id: "groups",
    title: "A different style per group",
    text: "Give VIPs or ranks their own damage look with a permission. Everyone else keeps the default.",
    facts: ["vitalstrike.group.<name>"],
    Scene: GroupScene,
  },
  {
    id: "sounds",
    title: "Sounds per damage type",
    text: "Every damage cause can play its own Minecraft sound, with volume, pitch and hearing range set once.",
    facts: ["Any vanilla sound", "20 block range"],
    Scene: SoundScene,
  },
  {
    id: "dimensions",
    title: "Damage scaled per dimension",
    text: "Multiply damage in the Nether or End, or switch VitalStrike off in whole dimensions and worlds.",
    facts: ["Nether 1.2×", "End 1.1×"],
    Scene: DimensionScene,
  },
  {
    id: "downed",
    title: "Downed, not dead",
    text: "Lethal damage drops a player instead of killing them. A teammate can revive them, or they use a Vital Awakening totem.",
    facts: ["30 s down", "5 s revive"],
    Scene: DownedScene,
  },
];

export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { Scene } = features[active];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + features.length) % features.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="order-last lg:order-none lg:col-span-5">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="VitalStrike features"
          className="space-y-1"
        >
          {features.map((feature, i) => {
            const selected = i === active;
            return (
              <button
                key={feature.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${feature.id}`}
                aria-selected={selected}
                aria-controls="feature-stage"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={`block w-full rounded-2xl px-5 py-4 text-left transition-colors ${selected ? "bg-surface" : "hover:bg-surface/60"}`}
              >
                <span
                  className={`block text-xl font-bold tracking-tight 2xl:text-2xl ${selected ? "" : "text-muted-foreground"}`}
                >
                  {feature.title}
                </span>
                {selected && (
                  <span className="mt-2 block">
                    <span className="block text-[15px] leading-relaxed text-muted-foreground 2xl:text-base">
                      {feature.text}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      {feature.facts.map((fact) => (
                        <span
                          key={fact}
                          className="rounded-full bg-raised px-3 py-1 text-sm font-semibold"
                        >
                          {fact}
                        </span>
                      ))}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="feature-stage"
        role="tabpanel"
        aria-labelledby={`tab-${features[active].id}`}
        className="lg:sticky lg:top-[calc(var(--navbar-height)+1.5rem)] lg:col-span-7 lg:self-start"
      >
        <Scene />
      </div>
    </div>
  );
}
