import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Combo System Configuration";
  const description =
    "Detailed configuration guide for VitalStrike's combo system. Learn how to set up combo ranks, multipliers, decay settings, and visual effects.";

  return [
    { rel: "icon", href: "/icon.png", type: "image/png" },
    { property: "og:image", content: "/og-preview.png" },
    { name: "twitter:image", content: "/og-preview.png" },
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "VitalStrike" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content:
        "vitalstrike combo system, minecraft combo configuration, damage multipliers, combo ranks, combo decay, minecraft combat plugin",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function ComboConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "core-settings", label: "Core Settings", icon: "⚙️" },
    { id: "combo-ranks", label: "Combo Ranks", icon: "🏅" },
    { id: "combo-decay", label: "Combo Decay", icon: "⏱️" },
    { id: "multipliers", label: "Damage Multipliers", icon: "✖️" },
    { id: "visual-effects", label: "Visual Effects", icon: "✨" },
    { id: "hologram", label: "Combo Holograms", icon: "🔮" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Combo System Configuration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure VitalStrike's dynamic combo system with ranks, multipliers,
          and visual effects
        </p>
      </div>

      <TableOfContents items={tableItems} />

      {/* Configuration Sections */}
      <div className="space-y-10">
        {/* Core Settings Section */}
        <ConfigSection
          id="core-settings"
          title="Core Settings"
          icon="⚙️"
          description="Basic combo system configuration"
        >
          <ConfigBlock
            title="Basic Combo Settings"
            filename="config.yml"
            code={`# Combo System Settings
combo:
  enabled: true
  reset-time: 3 # Time in seconds before combo resets when no hits are made`}
            tip="The combo system tracks consecutive hits on entities. The reset-time determines how long (in seconds) a player can go without landing a hit before their combo resets to zero."
          />
        </ConfigSection>

        {/* Combo Ranks Section */}
        <ConfigSection
          id="combo-ranks"
          title="Combo Ranks"
          icon="🏅"
          description="Configure combo rank thresholds and appearance"
        >
          <ConfigBlock
            title="Rank Configuration"
            filename="config.yml"
            code={`# Combo Ranks
combo:
  display:
    rank:
      enabled: true
      format: " <bold><gradient:#00FF00:#00FFFF>[%s]</gradient></bold>" # %s will be replaced with the rank name
      
      # Rank thresholds
      thresholds:
        D: 0
        C: 5
        B: 10
        A: 15
        S: 25
        SS: 40
        SSS: 60
      
      # Rank colors
      colors:
        D: "<gradient:#808080:#A0A0A0>" # Gray gradient
        C: "<gradient:#00FF00:#90EE90>" # Green gradient
        B: "<gradient:#00FFFF:#87CEEB>" # Cyan gradient
        A: "<gradient:#FFD700:#FFA500>" # Gold gradient
        S: "<gradient:#FF69B4:#FF1493>" # Pink gradient
        SS: "<gradient:#9400D3:#8A2BE2>" # Purple gradient
        SSS: "<gradient:#FF0000:#FF4500>" # Red-orange gradient`}
            tip="Ranks provide visual feedback to players as they build higher combos. Each rank has a minimum combo threshold and custom gradient colors."
          />
        </ConfigSection>

        {/* Combo Decay Section */}
        <ConfigSection
          id="combo-decay"
          title="Combo Decay"
          icon="⏱️"
          description="Configure how combos decay over time"
        >
          <ConfigBlock
            title="Decay Settings"
            filename="config.yml"
            code={`# Combo Decay Settings
combo:
  decay:
    enabled: false
    time: 10 # Time in seconds before combo starts decaying
    rate: 1 # How many combo points lost per decay interval
    interval: 1 # How often (in seconds) to decay combo
    minimum: 0 # Minimum combo value after decay`}
            tip="Combo decay gradually reduces a player's combo count when they haven't attacked for a while. This prevents players from maintaining high combos indefinitely without combat activity."
          />
        </ConfigSection>

        {/* Multipliers Section */}
        <ConfigSection
          id="multipliers"
          title="Damage Multipliers"
          icon="✖️"
          description="Configure how combos affect damage output"
        >
          <ConfigBlock
            title="Multiplier Settings"
            filename="config.yml"
            code={`# Damage Multiplier Settings
combo:
  multiplier:
    enabled: false
    base: 1.0 # Base damage multiplier (1.0 = normal damage)
    per-combo: 0.1 # Additional multiplier per combo (0.1 = +10% per combo)
    max: 3.0 # Maximum damage multiplier (3.0 = 300% damage)
    ranks: # Specific multipliers for each rank
      D: 1.0
      C: 1.2
      B: 1.5
      A: 1.8
      S: 2.2
      SS: 2.6
      SSS: 3.0`}
            tip="Damage multipliers increase the damage dealt based on combo count. You can set a per-combo increment or define specific multipliers for each rank."
          />
        </ConfigSection>

        {/* Visual Effects Section */}
        <ConfigSection
          id="visual-effects"
          title="Visual Effects"
          icon="✨"
          description="Configure visual and audio effects for combos"
        >
          <ConfigBlock
            title="Effects Configuration"
            filename="config.yml"
            code={`# Visual Effects
combo:
  effects:
    enabled: true
    sound:
      enabled: true
      combo-up: "entity.experience_orb.pickup" # Sound when combo increases
      combo-milestone: "entity.player.levelup" # Sound when reaching new rank
      volume: 1.0
      pitch: 1.0
    particles:
      enabled: true
      type: "CRIT" # Particle effect type
      count: 10 # Number of particles`}
            tip="Visual effects enhance the combo experience with sounds and particles. These trigger when players increase their combo or reach new rank milestones."
          />
        </ConfigSection>

        {/* Combo Holograms Section */}
        <ConfigSection
          id="hologram"
          title="Combo Holograms"
          icon="🔮"
          description="Configure floating combo streak holograms"
        >
          <ConfigBlock
            title="Hologram Settings"
            filename="config.yml"
            code={`# Combo Display Settings
combo:
  display:
    format: "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>"
    multiplier-format: " <gray>(<gradient:#FFD700:#FFA500>%.1fx</gradient>)</gray>"
    decay-warning: "<italic><gray>(Decaying in %.1fs)</gray></italic>"
  
  hologram:
    enabled: true
    min-combo: 10
    duration: 3.0
    format: "<gradient:red:gold><bold>COMBO STREAK!</bold></gradient>"
    height: 2.0`}
            tip="Combo holograms are floating text displays that appear above players when they achieve impressive combo streaks, making their accomplishment visible to nearby players."
          />
        </ConfigSection>

        {/* Navigation Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <DocsNavigation
            previousPage={{
              title: "Configuration Overview",
              href: "/docs/configuration",
            }}
            nextPage={{
              title: "Damage Indicators Configuration",
              href: "/docs/configuration/damage",
            }}
          />
        </div>
      </div>
    </div>
  );
}
