export type Scalar = string | number | boolean;

export interface TierItem {
  material: string;
  amount: number;
}

export interface Tier {
  damage: number;
  xp: number;
  items: TierItem[];
}

export interface WorldSetting {
  enabled: boolean;
  "damage-multiplier": number;
}

export type Worlds = Record<string, WorldSetting>;

export type Value = Scalar | Scalar[] | Tier[] | Worlds;

export interface Entry {
  path: string;
  type: "boolean" | "integer" | "number" | "string" | "list" | "tiers" | "worlds";
  value: Value;
  comment: string;
}

export const WORLD_NAME = /^[A-Za-z0-9_-]{1,64}$/;
const MATERIAL = /^[A-Za-z0-9_:]{1,64}$/;

/** Problems that the plugin would reject, so Save can be blocked with a clear message. */
export function problemsOf(type: Entry["type"], value: Value): string[] {
  const problems: string[] = [];
  if (type === "tiers") {
    (value as Tier[]).forEach((tier, i) => {
      const n = i + 1;
      if (!Number.isFinite(tier.damage) || tier.damage < 0) problems.push(`Tier ${n}: damage`);
      if (!Number.isInteger(tier.xp) || tier.xp < 0) problems.push(`Tier ${n}: XP`);
      tier.items.forEach((item, k) => {
        if (!MATERIAL.test(item.material.trim()))
          problems.push(`Tier ${n}, item ${k + 1}: material`);
        if (!Number.isInteger(item.amount) || item.amount < 1 || item.amount > 64) {
          problems.push(`Tier ${n}, item ${k + 1}: amount (1-64)`);
        }
      });
    });
  } else if (type === "worlds") {
    for (const [name, world] of Object.entries(value as Worlds)) {
      const m = world["damage-multiplier"];
      if (!WORLD_NAME.test(name)) problems.push(`World "${name}": name`);
      if (!Number.isFinite(m) || m < 0 || m > 100) problems.push(`World "${name}": multiplier`);
    }
  }
  return problems;
}
