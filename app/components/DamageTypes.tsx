import { useId, useState } from "react";

/** Damage formats and sounds are the defaults from config.yml. Colours are the first stop of each gradient. */
const types = [
  {
    key: "default",
    color: "#ff6b6b",
    sound: "entity.player.attack.strong",
    format: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>",
    sample: "-6.0 ❤",
  },
  {
    key: "critical",
    color: "#ff3b3b",
    bold: true,
    sound: "entity.player.attack.crit",
    format: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>",
    sample: "-9.0 ⚡",
  },
  {
    key: "fire",
    color: "#ffd700",
    sound: "block.fire.ambient",
    format: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>",
    sample: "-3.0 🔥",
  },
  {
    key: "poison",
    color: "#50c878",
    sound: "entity.spider.hurt",
    format: "<gradient:#50C878:#228B22>-%.1f ☠</gradient>",
    sample: "-2.0 ☠",
  },
  {
    key: "magic",
    color: "#b44dff",
    sound: "entity.illusioner.cast_spell",
    format: "<gradient:#9400D3:#800080>-%.1f ✨</gradient>",
    sample: "-4.0 ✨",
  },
  {
    key: "explosion",
    color: "#ff4500",
    sound: "entity.generic.explode",
    format: "<gradient:#FF4500:#8B0000>-%.1f 💥</gradient>",
    sample: "-12.0 💥",
  },
  {
    key: "drown",
    color: "#1e90ff",
    sound: "block.water.ambient",
    format: "<gradient:#1E90FF:#0000CD>-%.1f 💧</gradient>",
    sample: "-2.0 💧",
  },
  {
    key: "fall",
    color: "#a9a9a9",
    sound: "entity.player.small_fall",
    format: "<gradient:#A9A9A9:#696969>-%.1f 💨</gradient>",
    sample: "-5.0 💨",
  },
  {
    key: "lightning",
    color: "#ffff55",
    sound: "entity.lightning_bolt.thunder",
    format: "<yellow>-%.1f ⚡",
    sample: "-5.0 ⚡",
  },
  {
    key: "freeze",
    color: "#55ffff",
    sound: "block.glass.break",
    format: "<aqua>-%.1f ❄",
    sample: "-1.0 ❄",
  },
  {
    key: "projectile",
    color: "#aaaaaa",
    sound: "entity.arrow.hit",
    format: "<gray>-%.1f 🏹",
    sample: "-6.0 🏹",
  },
  { key: "heal", color: "#55ff55", sound: "none", format: "<green>+%.1f ❤", sample: "+4.0 ❤" },
];

export function DamageTypes() {
  const [active, setActive] = useState(0);
  const id = useId();
  const current = types[active];

  return (
    <div className="rounded-3xl bg-surface p-5 sm:p-8">
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-2">
        <span id={id} className="sr-only">
          Damage type
        </span>
        {types.map((type, i) => (
          <button
            key={type.key}
            type="button"
            role="radio"
            aria-checked={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
              i === active
                ? "bg-ink text-ground"
                : "bg-raised text-ink hover:bg-gray-200 dark:hover:bg-dark-border"
            }`}
          >
            {type.key}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-5">
        <div className="flex min-h-[10rem] items-center justify-center rounded-2xl bg-[#14171c] p-6 md:col-span-2">
          <p
            className="text-4xl tabular-nums sm:text-5xl"
            style={{ color: current.color, fontWeight: current.bold ? 800 : 700 }}
            aria-live="polite"
          >
            {current.sample}
          </p>
        </div>
        <dl className="space-y-3 md:col-span-3">
          <div className="rounded-2xl bg-raised p-4">
            <dt className="text-sm font-semibold text-muted-foreground">Format in config.yml</dt>
            <dd className="mt-1 break-all font-mono text-sm">{current.format}</dd>
          </div>
          <div className="rounded-2xl bg-raised p-4">
            <dt className="text-sm font-semibold text-muted-foreground">Sound</dt>
            <dd className="mt-1 font-mono text-sm">{current.sound}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
