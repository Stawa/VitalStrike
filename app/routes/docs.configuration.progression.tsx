import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { FaHeart, FaSkull, FaStar, FaGift, FaDownload } from "react-icons/fa";
import { PageHeader } from "~/components/PageHeader";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Health Bars, Kills and Levels";
  const description =
    "Configure health bars, the kill indicator, RPG levels, lifetime-damage rewards, the resource pack and the update checker in VitalStrike 2.0.0.";

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
    { name: "theme-color", content: "#2456d6" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function ProgressionConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "health-bar", label: "Health Bar", icon: <FaHeart /> },
    { id: "kill-indicator", label: "Kill Indicator", icon: <FaSkull /> },
    { id: "levels", label: "Levels", icon: <FaStar /> },
    { id: "rewards", label: "Rewards", icon: <FaGift /> },
    { id: "pack-and-updates", label: "Resource Pack & Updates", icon: <FaDownload /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div>
        <PageHeader title={<>Health bars, kills and levels</>}>
          Added or reworked in 2.0.0. All values below are the shipped defaults, and each section
          can be switched off with its own <code>enabled</code> option.
        </PageHeader>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="health-bar"
            title="Health Bar"
            icon={<FaHeart className="text-xl" />}
            description="A bar floats above anything that takes damage or heals, then disappears."
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Health bar"
              filename="config.yml"
              code={`health-bar:
  enabled: true
  duration: 4.0    # seconds shown after the last hit or heal
  height: 0.75     # blocks above the top of the head
  length: 10       # segments in the bar
  format: "%bar% <white>%health%<gray>/%max% <red>❤"`}
              tip="Placeholders: %bar%, %health% and %max%."
            />
            <ConfigBlock
              title="Heal indicators"
              filename="config.yml"
              code={`display:
  show-heals: true   # green "+x" numbers, using the "heal" damage format`}
              tip="Set show-heals to false if you only want damage numbers."
            />
          </ConfigSection>

          <ConfigSection
            id="kill-indicator"
            title="Kill Indicator"
            icon={<FaSkull className="text-xl" />}
            description="A floating marker, an action bar message and a sound when you kill something."
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Kill indicator"
              filename="config.yml"
              code={`kill-indicator:
  enabled: true
  format: "<bold><gradient:#FF0000:#8B0000>☠ SLAIN</gradient></bold> <gray>%victim%</gray> <gold>+%xp% XP</gold>"
  actionbar: "<gold>Lv %level% %bar% <gray>| <red>☠ <white>%victim% <gold>+%xp% XP"
  sound: "entity.player.levelup"`}
              tip="Placeholders: %victim%, %xp%, %level% and %bar% (progress to the next level)."
            />
          </ConfigSection>

          <ConfigSection
            id="levels"
            title="Levels"
            icon={<FaStar className="text-xl" />}
            description="Kills grant XP based on the victim's max health. Levels are saved in stats.yml."
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Level curve"
              filename="config.yml"
              code={`levels:
  enabled: true
  xp-per-health: 1.0   # a 20 HP zombie gives 20 XP
  base-xp: 100
  exponent: 1.5
  max-level: 100
  level-up:
    title: "<bold><gradient:#FFD700:#FFA500>LEVEL UP!</gradient></bold>"
    subtitle: "<yellow>You reached level <white>%level%"
    sound: "ui.toast.challenge_complete"`}
              tip="XP needed to leave level L is base-xp × L^exponent. With the defaults, level 1 to 2 takes 100 XP and level 10 to 11 takes about 3,162 XP."
            />
          </ConfigSection>

          <ConfigSection
            id="rewards"
            title="Rewards"
            icon={<FaGift className="text-xl" />}
            description="One-time milestone rewards for lifetime damage dealt. Each tier is paid out once per player."
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Reward tiers"
              filename="config.yml"
              code={`rewards:
  enabled: true
  tiers:
    - damage: 50.0
      xp: 10
      items:
        - material: "IRON_INGOT"
          amount: 3
    - damage: 100.0
      xp: 50
      items:
        - material: "DIAMOND"
          amount: 1
        - material: "GOLDEN_APPLE"
          amount: 1
    - damage: 200.0
      xp: 100
      items:
        - material: "NETHERITE_SCRAP"
          amount: 1
  # Start over after the last tier, each lap needing more damage.
  # Tiers at 50/100/150: tier 1 again at 200, tier 2 at 250, tier 3 at 300, tier 1 at 350...
  loop:
    enabled: false
    cycle-damage: 0.0 # 0 = use the last tier's damage`}
              tip="Progress is stored as the number of tiers claimed, so keep the tiers in the same order if you edit them later. With loop on, players who already claimed every tier carry on from the next lap."
            />
          </ConfigSection>

          <ConfigSection
            id="pack-and-updates"
            title="Resource Pack & Updates"
            icon={<FaDownload className="text-xl" />}
            description="Optional extras: the resource pack for the Vital Awakening item, and the update notice."
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Resource pack and update checker"
              filename="config.yml"
              code={`resource-pack:
  url: "https://github.com/Stawa/VitalAwakening/raw/refs/heads/main/output/VitalAwakening_2.0.0-SNAPSHOT.zip"
  auto-send: false
  hint:
    enabled: true

update-checker:
  enabled: true`}
              tip="The pack's SHA-1 is computed automatically, off the main thread. Players with vitalstrike.update-notify are told about new releases when they join."
            />
          </ConfigSection>
        </div>
      </div>

      <div>
        <DocsNavigation
          previousPage={{ title: "Knockdown System", href: "/docs/configuration/knockdown" }}
          nextPage={{ title: "Commands", href: "/docs/commands" }}
        />
      </div>
    </div>
  );
}
