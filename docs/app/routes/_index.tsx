import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "VitalStrike Documentation" },
    { name: "description", content: "Dynamic Combat Feedback for Minecraft" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Announcement Badge */}
            <div className="mb-8">
              <a
                href="/blog/v1.1"
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
              >
                <span className="mr-2">🎉</span> VitalStrike v1.1 Released!
              </a>
            </div>

            {/* Hero Content */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300">
              Transform Minecraft Combat
              <br />
              <span className="text-gray-900 dark:text-white">
                With Dynamic Feedback
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Engage players with customizable damage indicators, hit effects,
              and combat analytics. Perfect for PvP and RPG servers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/docs/getting-started"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
              >
                Get Started →
              </a>
              <a
                href="https://github.com/Stawa/vitalstrike"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-900 dark:text-white ring-1 ring-gray-900/10 dark:ring-gray-100/10 rounded-lg hover:ring-gray-900/20 dark:hover:ring-gray-100/20 transition-all"
              >
                <span className="inline-flex items-center">
                  <GithubIcon className="h-5 w-5 mr-2" />
                  View on GitHub
                </span>
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
              Powerful features designed to improve player experience and server
              management
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white/80 dark:bg-dark-bg/80 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 transform transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Simple to Configure,
                <br />
                Powerful to Use
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Get started in minutes with our intuitive configuration.
                Customize every aspect of combat feedback to match your server's
                needs.
              </p>
              <div className="mt-8 space-y-4">
                {configFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary-600/5 to-primary-400/5 dark:from-primary-400/5 dark:to-primary-300/5 rounded-lg">
                <div className="w-full h-full backdrop-blur-sm rounded-lg" />
              </div>
              <div className="relative rounded-xl bg-white/80 dark:bg-dark-bg/80 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 backdrop-blur">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/80 dark:border-dark-border">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    config.yml
                  </div>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800 dark:text-gray-200">
                    <code>{`# VitalStrike Configuration
damage-indicators:
  enabled: true
  format: "&c-{damage}❤"
  duration: 1.5
  animation: "bounce"

combat-effects:
  hit-sound: "entity.player.attack.strong"
  particles: "crit"
  screen-shake: true

statistics:
  track-damage: true
  track-kills: true
  save-interval: 300 # seconds
# More configuration options available...`}</code>
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

const features = [
  {
    title: "Dynamic Damage Indicators",
    description:
      "Real-time visual feedback for damage dealt and received, with customizable colors and animations.",
    icon: <DamageIcon />,
  },
  {
    title: "Combat Analytics",
    description:
      "Detailed statistics and insights about player combat performance and server-wide trends.",
    icon: <AnalyticsIcon />,
  },
  {
    title: "Custom Effects",
    description:
      "Create unique hit effects, particles, and sounds to match your server's theme.",
    icon: <EffectsIcon />,
  },
  {
    title: "Performance Optimized",
    description:
      "Built with efficiency in mind, ensuring smooth gameplay even with many players.",
    icon: <PerformanceIcon />,
  },
  {
    title: "Easy Configuration",
    description:
      "Simple YAML configuration with hot-reload support for quick customization.",
    icon: <ConfigIcon />,
  },
  {
    title: "API Integration",
    description:
      "Comprehensive API for developers to extend and customize functionality.",
    icon: <ApiIcon />,
  },
];

const configFeatures = [
  {
    title: "Damage Indicators",
    description:
      "Customize the format, duration, and animation of damage indicators.",
  },
  {
    title: "Combat Effects",
    description:
      "Configure hit sounds, particles, and screen shake to enhance the combat experience.",
  },
  {
    title: "Statistics",
    description:
      "Track damage, kills, and other metrics to gain insights into player performance.",
  },
];

// Icons Components
function DamageIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function EffectsIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function PerformanceIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function ConfigIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ApiIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
