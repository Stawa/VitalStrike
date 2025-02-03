import { Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "~/hooks/useThemes";
import { useLatestVersion } from "~/hooks/useLatestVersion";

export function Navigation() {
  const { toggleTheme, isDarkMode } = useTheme();
  const { version, loading } = useLatestVersion();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
  ];

  const downloadLinks = [
    { 
      name: loading ? "Paper" : `Paper (v${version})`, 
      href: "https://hangar.papermc.io/Stawa/VitalStrike" 
    },
    { 
      name: loading ? "Modrinth" : `Modrinth (v${version})`, 
      href: "https://modrinth.com/plugin/vitalstrike/" 
    },
    { 
      name: loading ? "GitHub" : `GitHub (v${version})`, 
      href: "https://github.com/Stawa/VitalStrike/releases" 
    },
  ];

  return (
    <nav className="bg-white dark:bg-dark-bg border-b border-gray-200/80 dark:border-dark-border sticky top-0 z-40 backdrop-blur-sm bg-white/80 dark:bg-dark-bg/80">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
              >
                <img 
                    src="/Icon.png" 
                    alt="VitalStrike Logo" 
                    className="h-8 w-8"
                />
                VitalStrike
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {link.name}
                </Link>
              ))}
              <div className="relative inline-flex items-center h-full">
                <button
                  ref={buttonRef}
                  className="inline-flex items-center px-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  Downloads
                  <svg
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-1/2 z-10 top-full pt-2 w-56 -translate-x-1/2 transform"
                    role="menu"
                  >
                    <div className="rounded-lg bg-white/90 dark:bg-dark-bg/90 shadow-lg border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-md">
                      <div className="p-1.5">
                        {downloadLinks.map((link) => (
                          <a
                            key={link.name}
                            href={link.href}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 rounded-md transition-all duration-200 group"
                            role="menuitem"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <span className="flex-1 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                              {link.name}
                            </span>
                            <svg
                              className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block flex-shrink-0">
              <a
                href="https://github.com/Stawa/VitalStrike"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <GitHubIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Star on GitHub
              </a>
            </div>
            <div className="ml-4">
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => toggleTheme()}
              >
                <span className="sr-only">Toggle theme</span>
                {mounted ? (
                  isDarkMode ? (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  )
                ) : null}
              </button>
            </div>
            <div className="ml-4 sm:hidden">
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
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="space-y-1 px-3 pb-3 pt-2 shadow-lg border-t border-gray-200/80 dark:border-dark-border bg-white dark:bg-dark-bg">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-primary-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-200/80 dark:border-dark-border mt-2 pt-2">
            <div className="px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300">
              Downloads
            </div>
            {downloadLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block rounded-lg px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-primary-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Icon components remain the same

function GitHubIcon({ className }: { className?: string }) {
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

function SunIcon({ className }: { className?: string }) {
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

function MoonIcon({ className }: { className?: string }) {
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

function MenuIcon({ className }: { className?: string }) {
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

function XIcon({ className }: { className?: string }) {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
