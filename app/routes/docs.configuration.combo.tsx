import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { FaInfoCircle, FaCog, FaMedal, FaClock, FaBolt } from "react-icons/fa";
import { GiHolosphere } from "react-icons/gi";
import { IoSparklesSharp } from "react-icons/io5";
import BackToTop from "~/components/BackToTop";

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
    { id: "core-settings", label: "Core Settings", icon: <FaCog /> },
    { id: "combo-ranks", label: "Combo Ranks", icon: <FaMedal /> },
    { id: "combo-decay", label: "Combo Decay", icon: <FaClock /> },
    { id: "multipliers", label: "Damage Multipliers", icon: <FaBolt /> },
    { id: "visual-effects", label: "Visual Effects", icon: <IoSparklesSharp /> },
    { id: "hologram", label: "Combo Holograms", icon: <GiHolosphere /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Combo <span className="text-primary-600 dark:text-primary-400">System</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Configure ranks, multipliers, decay behavior, and visual effects.
          </p>
        </header>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="core-settings"
            title="Core Settings"
            icon={<FaCog className="text-xl" />}
            description="Basic combo system configuration"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                The core settings control the basic functionality of the combo system. You can
                enable or disable the system and configure how long a player&apos;s combo will
                persist after their last hit.
              </p>
            </div>

            <ConfigBlock
              title="Basic Combo Settings"
              filename="config.yml"
              code={`# Combo System Settings
combo:
  enabled: true
  reset-time: 3 # Time in seconds before combo resets when no hits are made`}
              tip="The combo system tracks consecutive hits on entities. The reset-time determines how long (in seconds) a player can go without landing a hit before their combo resets to zero."
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                How Combos Work
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                When a player hits an entity, their combo count increases by one. If they don&apos;t
                land another hit within the reset-time, their combo resets to zero. Higher combos
                can unlock better ranks, increased damage, and special visual effects.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="combo-ranks"
            title="Combo Ranks"
            icon={<FaMedal className="text-xl" />}
            description="Configure combo rank thresholds and appearance"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Combo ranks provide visual feedback to players as they build higher combos. Each
                rank has a minimum combo threshold and custom gradient colors, creating a
                progression system that rewards skilled players.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800/40 shadow-md"
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Beginner Ranks
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <span className="text-gray-500">D Rank:</span> 0-4 hits
                  </li>
                  <li>
                    <span className="text-green-500">C Rank:</span> 5-9 hits
                  </li>
                  <li>
                    <span className="text-cyan-500">B Rank:</span> 10-14 hits
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Advanced Ranks
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <span className="text-amber-500">A Rank:</span> 15-24 hits
                  </li>
                  <li>
                    <span className="text-pink-500">S Rank:</span> 25-39 hits
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Master Ranks
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <span className="text-purple-500">SS Rank:</span> 40-59 hits
                  </li>
                  <li>
                    <span className="text-red-500">SSS Rank:</span> 60+ hits
                  </li>
                </ul>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="combo-decay"
            title="Combo Decay"
            icon={<FaClock className="text-xl" />}
            description="Configure how combos decay over time"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Combo decay gradually reduces a player&apos;s combo count when they haven&apos;t
                attacked for a while. This prevents players from maintaining high combos
                indefinitely without combat activity, adding a strategic element to combat.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-red-200 dark:border-red-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Decay vs Reset
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                While the reset-time immediately sets combo to zero after inactivity, decay
                gradually reduces it over time. For example, with decay enabled, a 50-combo might
                decrease to 45, then 40, etc., rather than instantly dropping to 0.
              </p>
            </div>
          </ConfigSection>

          <ConfigSection
            id="multipliers"
            title="Damage Multipliers"
            icon={<FaBolt className="text-xl" />}
            description="Configure how combos affect damage output"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Damage multipliers increase the damage dealt based on combo count. This rewards
                players for maintaining high combos by making their attacks more powerful, creating
                a satisfying progression system during combat.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800/40 shadow-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200 dark:border-purple-800/40 shadow-sm">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Per-Combo Scaling
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  With <code>per-combo: 0.1</code>, each combo point adds 10% damage. A 5-combo
                  would deal 1.5x damage (base 1.0 + 5 × 0.1), while a 10-combo would deal 2.0x
                  damage, up to the maximum multiplier.
                </p>
              </div>
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200 dark:border-purple-800/40 shadow-sm">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Rank-Based Scaling
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alternatively, you can set specific multipliers for each rank. This creates
                  distinct power tiers rather than a smooth progression, making rank-ups feel more
                  impactful and rewarding.
                </p>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="visual-effects"
            title="Visual Effects"
            icon={<IoSparklesSharp className="text-xl" />}
            description="Configure visual and audio effects for combos"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Visual effects enhance the combo experience with sounds and particles. These trigger
                when players increase their combo or reach new rank milestones, providing satisfying
                feedback that makes combat more engaging.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-pink-200 dark:border-pink-800/40 shadow-md"
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">Sound Effects</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Sound effects provide audio feedback for combo actions:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <span className="font-medium">combo-up:</span> Plays when combo increases
                  </li>
                  <li>
                    <span className="font-medium">combo-milestone:</span> Plays when reaching a new
                    rank
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/40">
                <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">
                  Particle Effects
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Common particle types include:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>CRIT - Small critical hit particles</li>
                  <li>FLAME - Fire particles</li>
                  <li>HEART - Heart particles</li>
                  <li>SPELL_WITCH - Purple magic particles</li>
                  <li>TOTEM - Colorful celebration particles</li>
                </ul>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            id="hologram"
            title="Combo Holograms"
            icon={<GiHolosphere className="text-xl" />}
            description="Configure floating combo streak holograms"
            className="scroll-mt-24"
          >
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              <p>
                Combo holograms are floating text displays that appear above players when they
                achieve impressive combo streaks. These make accomplishments visible to nearby
                players, adding a social element to the combat system.
              </p>
            </div>

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
              className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-teal-200 dark:border-teal-800/40 shadow-md"
            />

            <div className="mt-6 p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40">
              <h4 className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-2 flex items-center">
                <FaInfoCircle className="w-5 h-5 mr-2" />
                Format Variables
              </h4>
              <p className="text-sm text-teal-700 dark:text-teal-400">
                In the display format,{" "}
                <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">%d</code> is
                replaced with the combo count,
                <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">%.1f</code> is
                replaced with the damage multiplier (with one decimal place), and{" "}
                <code className="px-1 py-0.5 bg-teal-100 dark:bg-teal-900/50 rounded">%.1fs</code>{" "}
                shows the time remaining before decay (in seconds).
              </p>
            </div>
          </ConfigSection>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <DocsNavigation
            previousPage={{
              title: "Damage Indicators",
              href: "/docs/configuration/damage",
            }}
            nextPage={{
              title: "Display Settings",
              href: "/docs/configuration/display",
            }}
          />
        </div>
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
