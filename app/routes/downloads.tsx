import { useLatestVersion } from "~/hooks/useLatestVersion";
import { useState, useEffect } from "react";
import { FaDownload, FaGithub, FaCube, FaFileAlt } from "react-icons/fa";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  const title = "Downloads - VitalStrike";
  const description =
    "Download VitalStrike plugin for your Minecraft server. Get the latest version from CurseForge, Modrinth, or GitHub. Includes resource pack for enhanced visual experience.";

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
        "vitalstrike download, minecraft plugin download, combat plugin, damage indicators, resource pack, minecraft server enhancement",
    },
    { name: "theme-color", content: "#4f46e5" },
    { name: "application-name", content: "VitalStrike" },
  ];
};

export default function Downloads() {
  const { version, loading } = useLatestVersion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pluginDownloadOptions = [
    {
      name: "CurseForge",
      description:
        "Download from CurseForge, the largest Minecraft mods platform",
      icon: <FaDownload className="text-2xl" />,
      href: "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike",
      color: "from-orange-500/10 to-orange-600/10",
      borderColor: "border-orange-100 dark:border-orange-900/30",
      iconBg: "bg-orange-500",
      version: loading ? "Latest" : version,
    },
    {
      name: "Modrinth",
      description: "Get it from Modrinth, a modern and open-source platform",
      icon: <FaCube className="text-2xl" />,
      href: "https://modrinth.com/plugin/vitalstrike/",
      color: "from-primary-500/10 to-primary-600/10",
      borderColor: "border-primary-100 dark:border-primary-900/30",
      iconBg: "bg-primary-500",
      version: loading ? "Latest" : version,
    },
    {
      name: "GitHub",
      description: "Download directly from our GitHub releases",
      icon: <FaGithub className="text-2xl" />,
      href: "https://github.com/Stawa/VitalStrike/releases",
      color: "from-gray-500/10 to-gray-600/10",
      borderColor: "border-gray-100 dark:border-gray-900/30",
      iconBg: "bg-gray-700",
      version: loading ? "Latest" : version,
    },
  ];

  const resourcePackOption = {
    name: "VitalAwakening",
    description: "Download our resource pack to enhance your visual experience",
    icon: <FaFileAlt className="text-2xl" />,
    href: "https://github.com/Stawa/VitalAwakening",
    color: "from-primary-500/10 to-primary-600/10",
    borderColor: "border-primary-100 dark:border-primary-900/30",
    iconBg: "bg-primary-500",
    version: "Resource Pack",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/50 dark:from-background dark:to-gray-900/30 text-foreground antialiased">
      {/* Hero Section */}
      <div className="relative overflow-hidden flex flex-col items-center justify-center text-center py-16 md:py-24">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative space-y-8">
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

            <div className="inline-flex bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 px-6 py-3 rounded-full shadow-lg border border-primary-200/50 dark:border-primary-700/50 transform hover:scale-105 transition-transform duration-300">
              <span className="text-primary-700 dark:text-primary-300 font-semibold text-base">
                Download Now
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              Get{" "}
              <span className="text-primary-600 dark:text-primary-400 inline-block transform hover:scale-105 transition-transform duration-300">
                VitalStrike
              </span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose your preferred platform to download VitalStrike and enhance
              your Minecraft experience
            </p>
          </div>
        </div>
      </div>

      {/* Plugin Download Options Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Download Plugin
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our trusted distribution platforms
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10 max-w-6xl mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/10 via-transparent to-primary-100/10 dark:from-primary-900/10 dark:via-transparent dark:to-primary-800/10 rounded-3xl -m-6 pointer-events-none" />
          {pluginDownloadOptions.map((option, index) => (
            <a
              key={index}
              href={option.href}
              target="_blank"
              className={`group relative overflow-hidden flex flex-col p-6 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border ${option.borderColor} hover:border-primary-500 dark:hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10`}
            >
              {/* Gradient background that appears on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:scale-105`}
              />
              {/* Animated glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-br from-primary-400/20 to-primary-600/20" />

              {/* Content positioned above the gradient */}
              <div className="relative z-10 pt-4 pb-2">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-full ${option.iconBg} text-white`}
                  >
                    {option.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {option.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {option.description}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    v{option.version}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Download →
                  </span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 group-hover:scale-150 transition-all duration-500 ease-out" />
              {/* Additional decorative elements */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-500/10 dark:bg-primary-400/10 rounded-br-xl transform -rotate-45 group-hover:scale-150 transition-all duration-500 ease-out" />
            </a>
          ))}
        </div>
      </div>

      {/* Resource Pack Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Download Resource Pack
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Take your gameplay to the next level with our custom-designed
            resources
          </p>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Background decoration for resource pack */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-100/20 dark:from-purple-900/20 dark:via-transparent dark:to-pink-800/20 rounded-3xl -m-6 pointer-events-none" />

          <a
            href={resourcePackOption.href}
            target="_blank"
            className={`group relative overflow-hidden flex flex-col p-6 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border ${resourcePackOption.borderColor} hover:border-primary-500 dark:hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10`}
          >
            {/* Gradient background that appears on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${resourcePackOption.color} opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:scale-105`}
            />
            {/* Animated glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-br from-purple-400/20 to-pink-600/20" />

            <div className="relative z-10 flex items-center">
              <div className="mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                <div
                  className={`h-12 w-12 flex items-center justify-center rounded-full ${resourcePackOption.iconBg} text-white`}
                >
                  {resourcePackOption.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {resourcePackOption.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {resourcePackOption.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {resourcePackOption.version}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Download →
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-purple-500/20 group-hover:scale-150 transition-all duration-500 ease-out" />
            {/* Additional decorative elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-500/10 dark:bg-purple-400/10 rounded-br-xl transform -rotate-45 group-hover:scale-150 transition-all duration-500 ease-out" />
          </a>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
