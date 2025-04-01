import { useLatestVersion } from "~/hooks/useLatestVersion";
import { useState, useEffect } from "react";
import { FaDownload, FaGithub, FaCube } from "react-icons/fa";

export default function Downloads() {
  const { version, loading } = useLatestVersion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const downloadOptions = [
    {
      name: "CurseForge",
      description:
        "Download from CurseForge, the largest Minecraft mods platform",
      icon: <FaDownload className="text-2xl" />,
      href: "https://www.curseforge.com/minecraft/bukkit-plugins/vitalstrike",
      color: "from-orange-500/20 to-red-600/20",
      borderColor: "border-orange-200 dark:border-orange-800/40",
      iconBg: "bg-orange-500 dark:bg-orange-600",
      version: loading ? "Latest" : version,
    },
    {
      name: "Modrinth",
      description: "Get it from Modrinth, a modern and open-source platform",
      icon: <FaCube className="text-2xl" />,
      href: "https://modrinth.com/plugin/vitalstrike/",
      color: "from-green-500/20 to-emerald-600/20",
      borderColor: "border-green-200 dark:border-green-800/40",
      iconBg: "bg-green-500 dark:bg-green-600",
      version: loading ? "Latest" : version,
    },
    {
      name: "GitHub",
      description: "Download directly from our GitHub releases",
      icon: <FaGithub className="text-2xl" />,
      href: "https://github.com/Stawa/VitalStrike/releases",
      color: "from-blue-500/20 to-indigo-600/20",
      borderColor: "border-blue-200 dark:border-blue-800/40",
      iconBg: "bg-blue-500 dark:bg-blue-600",
      version: loading ? "Latest" : version,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased flex flex-col justify-center py-12">
      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden flex flex-col items-center justify-center text-center mb-8">
        <div className="relative z-10 pt-4 pb-8">
          <div className="text-center px-4 md:px-6 lg:px-8 py-4 relative">
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

            <div className="mb-4 inline-flex bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 px-4 py-2 rounded-full shadow-sm border border-primary-200/50 dark:border-primary-700/50">
              <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                Download Now
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              Get{" "}
              <span className="text-primary-600 dark:text-primary-400">
                VitalStrike
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your preferred platform to download VitalStrike
            </p>
          </div>
        </div>
      </div>

      {/* Download Options Grid - Enhanced with better spacing and animations */}
      <div className="items-center justify-center mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/10 via-transparent to-primary-100/10 dark:from-primary-900/10 dark:via-transparent dark:to-primary-800/10 rounded-3xl -m-6 pointer-events-none" />
          {downloadOptions.map((option, index) => (
            <a
              key={index}
              href={option.href}
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
    </div>
  );
}
