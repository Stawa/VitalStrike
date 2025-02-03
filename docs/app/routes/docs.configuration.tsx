import { FaRegCopy } from "react-icons/fa";
import type { MetaFunction } from "@remix-run/node";
import { useHighlightCode } from "~/hooks/prism";

export const meta: MetaFunction = () => {
  const title = "VitalStrike Documentation - Configuration";
  const description =
    "Comprehensive configuration guide for VitalStrike. Learn about color formats, damage indicators, combo systems, and all available configuration options.";

  return [
    { rel: 'icon', href: '/icon.png', type: 'image/png' },
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
      content: "vitalstrike configuration, minecraft plugin settings, damage indicators, combo system, color formats, minecraft server configuration",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function Configuration() {
  useHighlightCode();

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-800/20">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Configuration Reference
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            VitalStrike Configuration Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete documentation of all configuration options and their usage
          </p>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-16">
          {[
            {
              title: "Color Formats",
              id: "color-formats",
              description: "VitalStrike supports both MiniMessage format and traditional Minecraft color codes.",
              subsections: [
                {
                  title: "MiniMessage Format",
                  content: `# Available colors:
<red>, <dark_red>
<blue>, <dark_blue>
<green>, <dark_green>
<aqua>, <dark_aqua>
<purple>, <dark_purple>
<yellow>, <gold>
<gray>, <dark_gray>
<black>, <white>

# Formatting:
<bold>, <italic>, <underlined>
<strikethrough>, <obfuscated>

# Gradients:
<gradient:color1:color2>text</gradient>`,
                  explanation: "MiniMessage format provides a more modern and flexible way to format text with support for gradients and advanced styling."
                },
                {
                  title: "Minecraft Color Codes",
                  content: `# Color Codes:
&0: Black         &1: Dark Blue
&2: Dark Green    &3: Dark Aqua
&4: Dark Red      &5: Dark Purple
&6: Gold          &7: Gray
&8: Dark Gray     &9: Blue
&a: Green         &b: Aqua
&c: Red           &d: Light Purple
&e: Yellow        &f: White

# Formatting Codes:
&l: Bold          &o: Italic
&n: Underline     &m: Strikethrough
&k: Obfuscated    &r: Reset`,
                  explanation: "Traditional Minecraft color codes are still supported for backwards compatibility and simpler styling needs."
                }
              ]
            },
            {
              title: "Damage Indicators",
              id: "damage-indicators",
              description: "Customize the appearance and behavior of damage indicators.",
              subsections: [
                {
                  title: "Damage Formats",
                  content: `damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  poison: "<gradient:#50C878:#228B22>-%.1f ☠</gradient>"
  fire: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>"
  magic: "<gradient:#9400D3:#800080>-%.1f ✨</gradient>"`,
                  explanation: "Configure how different types of damage are displayed, including support for gradients, emojis, and custom formatting."
                },
                {
                  title: "Display Settings",
                  content: `display:
  duration: 1.5 # How long numbers stay visible
  position:
    y: -0.2 # Vertical offset
    x: -0.5 # Horizontal offset
    random-offset: -1 # Random variation
    direction: "down" # Movement direction`,
                  explanation: "Control the positioning, duration, and animation of damage indicators."
                }
              ]
            },
            {
              title: "Combo System",
              id: "combo-system",
              description: "Configure the combo system mechanics and display.",
              subsections: [
                {
                  title: "Core Settings",
                  content: `combo:
  enabled: true
  reset-time: 3 # Time in seconds
  decay:
    enabled: false
    time: 10
    rate: 1
    interval: 1
    minimum: 0`,
                  explanation: "Basic combo system settings including timing and decay mechanics."
                },
                {
                  title: "Multiplier Settings",
                  content: `multiplier:
  enabled: false
  base: 1.0
  per-combo: 0.1
  max: 3.0
  ranks:
    D: 1.0
    C: 1.2
    B: 1.5
    A: 1.8
    S: 2.2
    SS: 2.6
    SSS: 3.0`,
                  explanation: "Configure damage multipliers based on combo count and ranks."
                }
              ]
            }
          ].map((section, index) => (
            <section key={index} id={section.id} className="language-yaml bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {section.description}
              </p>

              <div className="space-y-8">
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="border-t border-gray-100 dark:border-gray-800 pt-8 first:border-0 first:pt-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {subsection.title}
                    </h3>
                    <div className="relative">
                      <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto">
                        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                          {subsection.content}
                        </code>
                        <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-600">
                          <FaRegCopy className="text-xl" />
                        </button>
                      </pre>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      {subsection.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
} 