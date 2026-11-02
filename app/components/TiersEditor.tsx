import type { Tier } from "~/utils/configTypes";

// New tiers and items start with something common; raise it to taste.
const DEFAULT_ITEM = { material: "COOKED_BEEF", amount: 4 };

const COMMON_ITEMS = [
  "COOKED_BEEF",
  "BREAD",
  "COAL",
  "IRON_INGOT",
  "GOLD_INGOT",
  "DIAMOND",
  "EMERALD",
  "NETHERITE_INGOT",
  "NETHERITE_SCRAP",
  "GOLDEN_APPLE",
  "ENCHANTED_GOLDEN_APPLE",
  "COOKED_BEEF",
  "ARROW",
  "EXPERIENCE_BOTTLE",
  "TOTEM_OF_UNDYING",
  "ENDER_PEARL",
  "DIAMOND_SWORD",
  "NETHERITE_SWORD",
  "SHIELD",
  "ELYTRA",
  "NETHER_STAR",
];

const box =
  "rounded-xl bg-raised px-3 py-2 text-[15px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";
const bad = "ring-2 ring-primary-500";
const textButton = "text-sm font-semibold hover:underline";

const numberOr = (raw: string, fallback: number) => {
  const n = Number(raw);
  return raw.trim() === "" || Number.isNaN(n) ? fallback : n;
};

export function TiersEditor({
  value,
  onChange,
  id,
}: Readonly<{ value: Tier[]; onChange: (next: Tier[]) => void; id: string }>) {
  const update = (i: number, patch: Partial<Tier>) =>
    onChange(value.map((tier, j) => (j === i ? { ...tier, ...patch } : tier)));

  const updateItem = (i: number, k: number, patch: Partial<Tier["items"][number]>) =>
    update(i, {
      items: (value[i]?.items ?? []).map((item, j) => (j === k ? { ...item, ...patch } : item)),
    });

  const addTier = () => {
    const last = value[value.length - 1];
    onChange([
      ...value,
      {
        damage: last ? Math.round(last.damage * 2) : 50,
        xp: 0,
        items: [{ ...DEFAULT_ITEM }],
      },
    ]);
  };

  const ascending = value.every((tier, i) => i === 0 || tier.damage >= (value[i - 1]?.damage ?? 0));

  return (
    <div>
      <p className="rounded-xl bg-raised p-3.5 text-[14px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-ink">Careful with existing tiers.</span> Each
        player&apos;s progress is stored as how many tiers they have claimed. Add new tiers at the
        end. Removing or reordering tiers players already claimed changes what they still earn.
      </p>
      {!ascending && (
        <p className="mt-2 text-[14px] text-primary-500">
          Tiers are paid out from the lowest damage up, whatever order they are listed in.
        </p>
      )}

      <ol className="mt-4 space-y-4">
        {value.map((tier, i) => (
          <li key={i} className="rounded-2xl bg-raised p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-[16px] font-bold">Tier {i + 1}</h4>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className={`${textButton} text-primary-500`}
                aria-label={`Remove tier ${i + 1}`}
              >
                Remove tier
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-[14px] text-muted-foreground">
                Total damage needed
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={tier.damage}
                  onChange={(e) => update(i, { damage: numberOr(e.target.value, 0) })}
                  className={`${box} mt-1 w-full bg-surface ${tier.damage < 0 ? bad : ""}`}
                />
              </label>
              <label className="block text-[14px] text-muted-foreground">
                Bonus XP
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={tier.xp}
                  onChange={(e) => update(i, { xp: Math.trunc(numberOr(e.target.value, 0)) })}
                  className={`${box} mt-1 w-full bg-surface ${tier.xp < 0 ? bad : ""}`}
                />
              </label>
            </div>

            <p className="mt-4 text-[14px] font-semibold">Items</p>
            {tier.items.length === 0 && (
              <p className="mt-1 text-[14px] text-muted-foreground">No items, XP only.</p>
            )}
            <ul className="mt-2 space-y-2">
              {tier.items.map((item, k) => {
                const invalid = !/^[A-Za-z0-9_:]{1,64}$/.test(item.material.trim());
                return (
                  <li key={k} className="flex flex-wrap items-center gap-2">
                    <input
                      list={`${id}-materials`}
                      value={item.material}
                      onChange={(e) =>
                        updateItem(i, k, {
                          material: e.target.value.toUpperCase().replace(/\s/g, ""),
                        })
                      }
                      placeholder="MATERIAL"
                      aria-label={`Tier ${i + 1} item ${k + 1} material`}
                      aria-invalid={invalid}
                      className={`${box} min-w-0 flex-1 bg-surface font-mono ${invalid ? bad : ""}`}
                    />
                    <input
                      type="number"
                      min={1}
                      max={64}
                      step={1}
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(i, k, { amount: Math.trunc(numberOr(e.target.value, 1)) })
                      }
                      aria-label={`Tier ${i + 1} item ${k + 1} amount`}
                      className={`${box} w-20 bg-surface text-right`}
                    />
                    <button
                      type="button"
                      onClick={() => update(i, { items: tier.items.filter((_, j) => j !== k) })}
                      className={`${textButton} text-muted-foreground`}
                      aria-label={`Remove item ${k + 1} from tier ${i + 1}`}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => update(i, { items: [...tier.items, { ...DEFAULT_ITEM }] })}
              className={`${textButton} mt-3 text-primary-500`}
            >
              Add item
            </button>
          </li>
        ))}
      </ol>

      <datalist id={`${id}-materials`}>
        {COMMON_ITEMS.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <button
        type="button"
        onClick={addTier}
        className="mt-4 h-11 rounded-full bg-raised px-6 text-[15px] font-semibold hover:opacity-80"
      >
        Add tier
      </button>
    </div>
  );
}
