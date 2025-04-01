import { BsLightningCharge } from "react-icons/bs";
import { useEffect, useState } from "react";

interface BlogHeaderProps {
  latestVersion?: string;
}

export function BlogHeader({ latestVersion = "1.0.0" }: BlogHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="text-center mb-16 space-y-8 relative py-8">
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

      {/* Badge with enhanced animation */}
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all duration-300 transform hover:scale-105 group relative z-10 shadow-sm">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 animate-gradient-x"></div>
        <BsLightningCharge className="w-4 h-4 relative" />
        <span className="text-sm font-semibold tracking-wide relative">
          Development Updates
        </span>
      </div>

      {/* Main content with parallax effect */}
      <div
        className={`space-y-6 relative z-10 transition-all duration-700 ${
          scrolled ? "transform -translate-y-2 scale-98" : ""
        }`}
      >
        <h1 className="text-6xl font-black tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-500 dark:from-primary-300 dark:via-primary-400 dark:to-primary-500 animate-gradient-x">
          VitalStrike Changelog
        </h1>

        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
          Explore the journey of continuous improvement and innovation behind
          <span className="font-medium text-primary dark:text-primary-400 ml-2 inline-flex items-center gap-1">
            VitalStrike
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </span>
        </p>

        {/* Enhanced version badge - now using the prop */}
        <div className="flex justify-center mt-4">
          <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md text-sm font-medium border border-primary-200 dark:border-primary-800 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Latest Version: v{latestVersion}
          </div>
        </div>
      </div>
    </header>
  );
}
