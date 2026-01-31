import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { FaHeartbeat, FaRunning, FaVial } from "react-icons/fa";
import BackToTop from "~/components/BackToTop";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Knockdown System";
  const description = "Configure the knockdown and revival system in VitalStrike.";

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
      content: "vitalstrike knockdown, minecraft plugin revival, vital awakening, downed state",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function KnockdownConfiguration() {
  useHighlightCode();

  const tableItems = [
    { id: "basic-settings", label: "Basic Settings", icon: <FaHeartbeat /> },
    { id: "external-revive", label: "External Revive", icon: <FaRunning /> },
    { id: "vital-awakening", label: "Vital Awakening", icon: <FaVial /> },
    { id: "effects", label: "Effects & Messages", icon: <FaRunning /> },
  ];

  return (
    <div className="text-foreground antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200">
            Configuration
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Knockdown <span className="text-primary-600 dark:text-primary-400">System</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Configure the knockdown and revival mechanics for your server.
          </p>
        </header>

        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="basic-settings"
            title="Basic Settings"
            icon={<FaHeartbeat className="text-xl" />}
            description="Configure knockdown system basics"
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Basic Knockdown Configuration"
              filename="config.yml"
              code={`knockdown-system:
  enabled: true
  down-duration: 30
  downed-health: 20.0`}
              tip="These settings control the basic behavior of the knockdown system."
            />
          </ConfigSection>

          <ConfigSection
            id="external-revive"
            title="External Revive"
            icon={<FaRunning className="text-xl" />}
            description="Configure reviving downed players"
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="External Revive Configuration"
              filename="config.yml"
              code={`knockdown-system:
  external-revive:
    require-vital-awakening: false
    range: 3.0
    duration: 5.0`}
              tip="Controls how other players can revive a downed player."
            />
          </ConfigSection>

          <ConfigSection
            id="vital-awakening"
            title="Vital Awakening"
            icon={<FaVial className="text-xl" />}
            description="Configure vital awakening settings"
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Vital Awakening Configuration"
              filename="config.yml"
              code={`knockdown-system:
  vital-awakening:
    instant-use: false
    use-duration: 4.0`}
              tip="Configure how Vital Awakening items work"
            />
          </ConfigSection>

          <ConfigSection
            id="effects"
            title="Effects & Messages"
            icon={<FaRunning className="text-xl" />}
            description="Configure effects and messages"
            className="scroll-mt-24"
          >
            <ConfigBlock
              title="Effects & Messages Configuration"
              filename="config.yml"
              code={`knockdown-system:
  effects:
    messages:
      cannot-revive: "<red>You cannot revive this player right now."
      revive-failed: "<red>Revival failed! Stay closer to the player."
      revive-complete: "<green>You have been revived by %player%!"
      self-revived: "<green>You used Vital Awakening to revive yourself!"
      being-revived: "<yellow>Being revived by %player%..."
      reviving-player: "<yellow>Reviving %player%..."
      downed: "<red>You have been knocked down! Wait for help or death in %time% seconds"
    boss-bar:
      reviving:
        color: "YELLOW"
        style: "SOLID"
        title: "<yellow>Reviving %player%..."
      being-revived:
        color: "YELLOW"
        style: "SOLID"
        title: "<yellow>Being revived by %player%..."
    down:
      slowness: 255
      blindness: 1
    reviver:
      show_bossbar: true
      particle_effect: "HEART"
      sound_effect: "block.note_block.chime"`}
              tip="Configure status effects, particles, sounds, and messages"
            />
          </ConfigSection>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <DocsNavigation
          previousPage={{
            title: "Permissions",
            href: "/docs/configuration/permissions",
          }}
          nextPage={{
            title: "Commands",
            href: "/docs/commands",
          }}
        />
      </div>
      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
