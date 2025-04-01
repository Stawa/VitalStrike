import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";
import { DocsNavigation } from "~/components/DocsNavigation";
import { ConfigSection, ConfigBlock } from "~/components/ConfigSection";
import { TableOfContents } from "~/components/TableOfContents";
import { useState, useEffect } from "react";
import {
  FaHeartbeat,
  FaRunning,
  FaVial,
} from "react-icons/fa";
import BackToTop from "~/components/BackToTop";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Knockdown System";
  const description =
    "Configure the knockdown and revival system in VitalStrike.";

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
        "vitalstrike knockdown, minecraft plugin revival, vital awakening, downed state",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function KnockdownConfiguration() {
  useHighlightCode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tableItems = [
    { id: "basic-settings", label: "Basic Settings", icon: "💔" },
    { id: "vital-awakening", label: "Vital Awakening", icon: "⚡" },
    { id: "effects", label: "Effects & Messages", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased">
      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 pt-16 pb-8">
          <div className="text-center px-4 md:px-6 lg:px-8 py-8 md:py-12 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full animate-pulse-slow" />
              <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary/10 rounded-full animate-float" />
              <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-primary/5 rounded-full animate-float-delayed" />

              {/* Particle effect - only render on client side */}
              {isClient && (
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-primary/20 animate-float-random"
                      style={{
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6 inline-flex bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 px-4 py-2 rounded-full shadow-sm border border-primary-200/50 dark:border-primary-700/50">
              <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                Configuration Guide
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              Knockdown{" "}
              <span className="text-primary-600 dark:text-primary-400">
                System
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Configure the knockdown and revival mechanics for your server
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <TableOfContents items={tableItems} />

        <div className="space-y-16">
          <ConfigSection
            id="basic-settings"
            title="Basic Settings"
            icon={<FaHeartbeat className="text-xl" />}
            description="Configure knockdown system basics"
            className="scroll-mt-24"
            iconBg="bg-gradient-to-br from-red-500 to-rose-500"
          >
            <ConfigBlock
              title="Basic Knockdown Configuration"
              filename="config.yml"
              code={`knockdown-system:
  enabled: true
  down-duration: 30
  revive-duration: 5.0
  revive-range: 3.0
  downed-health: 20.0`}
              tip="These settings control the basic behavior of the knockdown system."
            />
          </ConfigSection>

          <ConfigSection
            id="vital-awakening"
            title="Vital Awakening"
            icon={<FaVial className="text-xl" />}
            description="Configure vital awakening settings"
            className="scroll-mt-24"
            iconBg="bg-gradient-to-br from-purple-500 to-indigo-500"
          >
            <ConfigBlock
              title="Vital Awakening Configuration"
              filename="config.yml"
              code={`  vital-awakening:
    instant-use: false # Set to true for instant use, false for hold-to-use
    use-duration: 4.0 # Time in seconds to hold right-click when instant-use is false`}
              tip="Configure how Vital Awakening items work"
            />
          </ConfigSection>

          <ConfigSection
            id="effects"
            title="Effects & Messages"
            icon={<FaRunning className="text-xl" />}
            description="Configure effects and messages"
            className="scroll-mt-24"
            iconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
          >
            <ConfigBlock
              title="Effects & Messages Configuration"
              filename="config.yml"
              code={`  effects:
    down:
      slowness: 255
      blindness: 1
    reviver:
      show_bossbar: true
      particle_effect: "HEART"
      sound_effect: "block.note_block.chime"
    messages:
      self-revived: "<green>You used Vital Awakening to revive yourself!"
      downed: "<red>You have been knocked down! Wait for help or death in %time% seconds"
      reviving: "<green>Being revived by %player%... (%progress%%)"
      revived: "<green>You have been revived by %player%!"
      revive-failed: "<red>Revive interrupted!"
      cannot-revive: "<red>Cannot revive this player!"`}
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
            title: "Combat System",
            href: "/docs/configuration/combat",
          }}
        />
      </div>
      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
