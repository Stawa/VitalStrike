import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Await, Link } from "@remix-run/react";
import { Suspense } from "react";
import { useHighlightCode } from "~/hooks/prism";
import { DeveloperCard } from "~/components/DeveloperCard";
import { loader as changelogLoader } from "./CHANGELOG";
import {
  FaBolt,
  FaChartLine,
  FaSkull,
  FaTrophy,
  FaGithub,
  FaArrowRight,
  FaGlobe,
  FaUserTag,
  FaCode,
  FaCheck,
} from "react-icons/fa";

export async function loader() {
  return changelogLoader();
}

export const meta: MetaFunction = () => {
  const title = "VitalStrike - Dynamic Combat Feedback for Minecraft";
  const description =
    "Enhance your Minecraft PvP with dynamic damage indicators, combo multipliers, knockdowns, and leaderboards. Perfect for boosting your server's combat experience.";

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
        "minecraft, plugin, combat, damage indicators, pvp, combo multipliers, knockdowns, leaderboards, server plugin",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

const features = [
  {
    name: "Dynamic Damage Indicators",
    description:
      "Visualize damage with customizable formats, gradients, and animations. Support for all damage types with unique icons and colors.",
    icon: <FaBolt />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    name: "Combo System",
    description:
      "Track consecutive hits with a ranking system from D to SSS. Apply increasing damage multipliers based on combo streaks.",
    icon: <FaChartLine />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Knockdown Mechanics",
    description:
      "Players can be downed instead of killed, allowing teammates to revive them with Vital Awakening items or abilities.",
    icon: <FaSkull />,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Competitive Leaderboards",
    description:
      "Track and display top players by damage dealt, highest combos, and average damage with customizable formatting.",
    icon: <FaTrophy />,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "World & Dimension Controls",
    description:
      "Configure different damage multipliers per dimension and disable features in specific worlds. WorldGuard integration for PvP regions.",
    icon: <FaGlobe />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Permission-Based Formatting",
    description:
      "Assign unique damage indicator styles to different player groups with permission-based formatting system.",
    icon: <FaUserTag />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const configHighlights = [
  {
    title: "Extensive Customization",
    description:
      "Configure every aspect from damage indicator styles to combo ranks with support for gradients, animations, and custom icons.",
  },
  {
    title: "Revival System",
    description:
      "Set up knockdown mechanics with configurable revival durations, effects, and the Vital Awakening item system.",
  },
  {
    title: "Performance Optimized",
    description:
      "Fine-tune display settings, animation speeds, and world-specific configurations for optimal server performance.",
  },
];

const configSnippet = `# VitalStrike Configuration
damage-indicator: "simple-damage-formats"
simple-damage-formats:
  default: "<gradient:#FF6B6B:#FF8787>-%.1f ❤</gradient>"
  critical: "<bold><gradient:#FF0000:#8B0000>-%.1f ⚡</gradient></bold>"
  fire: "<gradient:#FFD700:#FF4500>-%.1f 🔥</gradient>"

combo:
  enabled: true
  reset-time: 3
  multiplier:
    enabled: true
    base: 1.0
    per-combo: 0.1
    max: 3.0
  display:
    format: "<bold><gradient:#FF0000:#FFD700>✦ %dx COMBO ✦</gradient></bold>"
    rank:
      enabled: true
      thresholds:
        D: 0
        C: 5
        B: 10
        A: 15
        S: 25
        SS: 40
        SSS: 60

knockdown-system:
  enabled: true
  down-duration: 30
  revive-duration: 5.0
  revive-range: 3.0
  vital-awakening:
    instant-use: false
    use-duration: 4.0`;

export default function Index() {
  useHighlightCode();
  const { posts } = useLoaderData<typeof loader>();
  const latestPost = posts[0];

  return (
    <div className="relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] -z-10 opacity-60 dark:opacity-20 pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[120px] -z-10 opacity-40 dark:opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Announcement Badge */}
            <Suspense
              fallback={
                <div className="flex justify-center mb-8">
                  <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
              }
            >
              <Await resolve={latestPost}>
                {(resolvedPost) => (
                  <div className="flex justify-center mb-8">
                    <Link
                      to={`/blog/${resolvedPost.id}`}
                      className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      VitalStrike {resolvedPost.version} Released
                      <FaArrowRight className="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                )}
              </Await>
            </Suspense>

            {/* Hero Content */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl mb-8">
              <span className="text-gray-900 dark:text-white">Elevate Minecraft Combat</span>
              <br />
              <span className="text-primary-600 dark:text-primary-400">With Dynamic PvP</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Enhance your server with damage indicators, combo multipliers, knockdown mechanics,
              and competitive leaderboards. The ultimate combat experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary Button */}
              <Link
                to="/docs/getting-started"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-xl shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started
                <FaArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary Button */}
              <a
                href="https://github.com/Stawa/vitalstrike"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaGithub className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need for Combat Enhancement
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed to improve player experience and server management
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative p-6 bg-white/80 dark:bg-dark-bg/80 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 transform transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Lead Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <FaUserTag className="w-4 h-4" />
            <span>Maintained By</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Who&apos;s In Charge
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            VitalStrike is actively maintained by the main developer. You can reach out on GitHub
            for issues, suggestions, and contributions.
          </p>
        </div>

        <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <DeveloperCard
              className="w-full"
              name="Stawa"
              avatarUrl="https://github.com/Stawa.png"
              roles={[
                { label: "Main Developer", tone: "primary" },
                { label: "Maintainer", tone: "neutral" },
              ]}
              bio="Responsible for the plugin, releases, and keeping the docs aligned with the latest features."
              githubUrl="https://github.com/Stawa/"
            />
            <DeveloperCard
              className="w-full"
              name="TeenYsDaMan"
              avatarUrl="https://github.com/TeenYsDaMan.png"
              roles={[{ label: "Resource Pack", tone: "primary" }]}
              bio="Responsible for the resource pack, which includes models, and textures for the plugin to enhance the player experience."
              githubUrl="https://github.com/TeenYsDaMan/"
            />
          </div>
        </div>
      </section>

      {/* Config Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="mb-12 lg:mb-0 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
                <FaCode className="w-4 h-4" />
                <span>Developer Friendly</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                Simple to Configure,
                <br />
                <span className="text-primary-600 dark:text-primary-400">Powerful to Use</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Get started in minutes with our intuitive configuration. Customize every aspect of
                combat feedback to match your server&apos;s needs.
              </p>

              <div className="space-y-6">
                {configHighlights.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mt-1">
                      <FaCheck className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Code Block */}
            <div className="relative min-w-0">
              <div className="relative rounded-xl bg-[#0d1117] border border-gray-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#161b22]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-xs text-gray-400 font-mono">config.yml</span>
                </div>
                <div className="p-4 overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  <pre className="text-sm font-mono leading-relaxed">
                    <code className="language-yaml">{configSnippet}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
