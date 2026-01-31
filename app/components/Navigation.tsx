import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useTheme } from "~/hooks/useThemes";

export function Navigation() {
  const { toggleTheme, isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Downloads", href: "/downloads" },
  ];

  return (
    <nav className="top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-dark-bg/70 border-b border-gray-200/50 dark:border-white/10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <div className="flex flex-shrink-0 items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
              >
                <img src="/Icon.png" alt="VitalStrike Logo" className="h-8 w-8" />
                <span>VitalStrike</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block flex-shrink-0">
              <a
                href="https://github.com/Stawa/VitalStrike"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-x-2 rounded-full bg-gray-900 dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-gray-900 shadow-sm hover:opacity-90 transition-opacity"
              >
                <GitHubIcon className="h-5 w-5" aria-hidden="true" />
                <span>Star on GitHub</span>
              </a>
            </div>
            <div className="flex items-center border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white focus:outline-none transition-colors"
                onClick={() => toggleTheme()}
                aria-label="Toggle theme"
              >
                {mounted ? (
                  isDarkMode ? (
                    <SunIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-5 w-5" aria-hidden="true" />
                  )
                ) : (
                  <div className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 pb-4 pt-2 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://github.com/Stawa/VitalStrike"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
          >
            <GitHubIcon className="h-5 w-5" />
            Star on GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

function GitHubIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function SunIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function MenuIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function XIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
