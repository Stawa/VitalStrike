import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Damage Configuration";
  const description =
    "Configure damage indicators, formats, and visual effects for different damage types in VitalStrike.";

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
        "vitalstrike damage, minecraft damage indicators, damage configuration, damage types, custom sounds",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function DamageConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "simple-formats", label: "Simple Damage Formats", icon: "💫" },
    { id: "group-formats", label: "Group-Based Formats", icon: "👥" },
    { id: "damage-types", label: "Damage Types", icon: "⚔️" },
    { id: "custom-sounds", label: "Custom Sounds", icon: "🔊" },
  ];

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Configuration Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Damage Indicators
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure damage indicators, formats, and visual effects for different
          damage types
        </p>
      </div>

      <TableOfContents items={tableItems} />

      <div className="space-y-10">
        <ConfigSection
          id="simple-formats"
          title="Simple Damage Formats"
          icon="💫"
          description="Basic damage indicator formats for different types of damage"
        >
          <ConfigBlock
            title="Basic Format Configuration"
            filename="config.yml"
            code={`damage-indicator: "simple-damage-formats" # Default damage indicator format

simple-damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  poison: "<gradient:#50C878:#228B22>-%.1f ☠</gradient>"
  fire: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>"
  magic: "<gradient:#9400D3:#800080>-%.1f ✨</gradient>"
  heal: "<green>+%.1f ❤"`}
            tip="Simple formats provide an easy way to customize damage indicators. Use %.1f as a placeholder for the damage amount."
          />
        </ConfigSection>

        <ConfigSection
          id="group-formats"
          title="Group-Based Formats"
          icon="👥"
          description="Permission-based damage indicator formats"
        >
          <ConfigBlock
            title="Group Format Configuration"
            filename="config.yml"
            code={`group-damage-formats:
  default:
    use-simple-formats: true
    damage-formats:
      default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
      
  water:
    permission: "vitalstrike.group.water"
    damage-formats:
      default: "<gradient:#1E90FF:#00BFFF>-%.1f 💧</gradient>"
      critical: "<bold><gradient:#0000FF:#000080>-%.1f 🌊</gradient></bold>"`}
            tip="Group formats allow different players to have different damage indicator styles based on their permissions."
          />
        </ConfigSection>

        <ConfigSection
          id="damage-types"
          title="Damage Types"
          icon="⚔️"
          description="Configure formats for specific damage types"
        >
          <ConfigBlock
            title="Damage Type Formats"
            filename="config.yml"
            code={`simple-damage-formats:
  fall: "<gradient:#A9A9A9:#696969>-%.1f 💨</gradient>"
  drown: "<gradient:#1E90FF:#0000CD>-%.1f 💧</gradient>"
  explosion: "<gradient:#FF4500:#8B0000>-%.1f 💥</gradient>"
  contact: "<green>-%.1f 🌵"
  dragon: "<dark_purple>-%.1f 🐉"
  sweep: "<red>-%.1f ⚔"
  void: "<dark_gray>-%.1f ⬇"
  wither: "<dark_gray>-%.1f 💀"`}
            tip="Each damage type can have its own unique format and emoji indicator."
          />
        </ConfigSection>

        <ConfigSection
          id="custom-sounds"
          title="Custom Sounds"
          icon="🔊"
          description="Configure sounds for different damage types"
        >
          <ConfigBlock
            title="Sound Configuration"
            filename="config.yml"
            code={`damage-type-sounds:
  entity_attack: "entity.player.attack.strong"
  critical: "entity.player.attack.crit"
  poison: "entity.spider.hurt"
  fire: "block.fire.ambient"
  magic: "entity.illusioner.cast_spell"
  fall: "entity.player.small_fall"
  drowning: "block.water.ambient"
  explosion: "entity.generic.explode"`}
            tip="Each damage type can play a unique sound effect. Use Minecraft sound IDs to specify the sounds."
          />
        </ConfigSection>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Basic Settings",
            href: "/docs/configuration/basic",
          }}
          nextPage={{
            title: "Combo System",
            href: "/docs/configuration/combo",
          }}
        />
      </div>
    </div>
  );
}
