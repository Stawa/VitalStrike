/** How raw config paths are presented in the web editor: sections, groups and readable labels. */

export const SECTION_ORDER = [
  "general",
  "display",
  "simple-damage-formats",
  "group-damage-formats",
  "damage-type-sounds",
  "health-bar",
  "kill-indicator",
  "combo",
  "knockdown-system",
  "levels",
  "rewards",
  "leaderboard",
  "world-settings",
  "resource-pack",
  "messages",
] as const;

export const SECTION_INFO: Record<string, { title: string; blurb: string }> = {
  general: { title: "General", blurb: "Turn the plugin and its update check on or off." },
  display: {
    title: "Damage numbers",
    blurb: "How long numbers stay, where they appear and how they move.",
  },
  "simple-damage-formats": {
    title: "Damage text",
    blurb: "The text shown for each kind of damage.",
  },
  "group-damage-formats": {
    title: "Group styles",
    blurb: "Different damage text per permission group.",
  },
  "damage-type-sounds": { title: "Sounds", blurb: "The sound played for each kind of damage." },
  "health-bar": { title: "Health bar", blurb: "The bar shown above what you hit." },
  "kill-indicator": { title: "Kill marker", blurb: "The marker shown when something dies." },
  combo: { title: "Combos", blurb: "Chained hits, ranks, bonuses and effects." },
  "knockdown-system": {
    title: "Knockdown and revive",
    blurb: "Being downed instead of dying, and getting back up.",
  },
  levels: { title: "Levels", blurb: "XP and level progression." },
  rewards: { title: "Rewards", blurb: "What players earn at damage milestones." },
  leaderboard: { title: "Leaderboard", blurb: "The top lists shown by /vs top." },
  "world-settings": { title: "Worlds", blurb: "Switch worlds off or scale damage per dimension." },
  "resource-pack": {
    title: "Resource pack",
    blurb: "The optional pack with the Vital Awakening model.",
  },
  messages: { title: "Messages", blurb: "Chat messages sent by the plugin." },
};

const MERGED: Record<string, string> = {
  "update-checker": "general",
  "damage-indicator": "general",
  "damage-type-sounds-settings": "damage-type-sounds",
};

export function pretty(segment: string): string {
  const text = segment.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function sectionOf(path: string): string {
  const top = path.split(".")[0] ?? path;
  if (!path.includes(".")) return "general";
  return MERGED[top] ?? top;
}

export function sectionTitle(section: string): string {
  return SECTION_INFO[section]?.title ?? pretty(section);
}

/** The heading a setting sits under inside its section, and its own readable name. */
export function labelOf(path: string): { group: string; label: string } {
  const segments = path.split(".");
  const top = segments[0] ?? path;
  const section = sectionOf(path);
  const rest = section === top && segments.length > 1 ? segments.slice(1) : segments;
  if (rest.length === 1) return { group: "", label: pretty(rest[0] ?? path) };
  return {
    group: pretty(rest[0] ?? ""),
    label: rest.slice(1).map(pretty).join(" › "),
  };
}

/** A comment block as plain text: no leading "#", no empty lines. */
export function plainComment(comment: string): string {
  return comment
    .split("\n")
    .map((line) => line.replace(/^#\s?/, "").trim())
    .filter(Boolean)
    .join("\n");
}
