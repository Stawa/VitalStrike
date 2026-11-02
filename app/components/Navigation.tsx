import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "@remix-run/react";
import { FaBars, FaDesktop, FaGithub, FaMoon, FaStar, FaSun, FaTimes } from "react-icons/fa";
import { useTheme } from "~/hooks/useThemes";

const links = [
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/blog" },
];

const GITHUB_URL = "https://github.com/Stawa/VitalStrike";

const themeLabels = {
  light: { icon: FaSun, label: "Light theme" },
  dark: { icon: FaMoon, label: "Dark theme" },
  system: { icon: FaDesktop, label: "System theme" },
} as const;

function ThemeToggle() {
  const { toggleTheme, theme, mounted } = useTheme();
  const { icon: Icon, label } =
    themeLabels[theme as keyof typeof themeLabels] ?? themeLabels.system;

  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-ink"
      onClick={() => toggleTheme()}
      aria-label={`${label}. Click to change theme.`}
      title={label}
    >
      {mounted ? <Icon className="h-4 w-4" aria-hidden="true" /> : <span className="h-4 w-4" />}
    </button>
  );
}

function StarButton({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-200 dark:hover:bg-dark-border ${className}`}
    >
      <FaGithub className="h-4 w-4" aria-hidden="true" />
      <span>Star on GitHub</span>
      <FaStar
        className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover:rotate-12"
        aria-hidden="true"
      />
    </a>
  );
}

export function Navigation() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-ground">
      <nav aria-label="Main" className="page-x">
        <div className="flex h-navbar items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex shrink-0 items-center gap-2.5 text-ink">
              <img src="/Icon.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-extrabold tracking-tight">VitalStrike</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                      isActive
                        ? "bg-surface text-ink"
                        : "text-muted-foreground hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <StarButton />
            <Link
              to="/downloads"
              className="inline-flex h-10 items-center rounded-full bg-primary-600 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Download
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              {isOpen ? (
                <FaTimes className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FaBars className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!isOpen} className="md:hidden">
        <div className="mx-4 mb-3 space-y-1 rounded-2xl bg-surface p-3">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="block rounded-xl px-4 py-3 text-lg font-semibold text-ink hover:bg-raised"
            >
              {link.name}
            </NavLink>
          ))}
          <StarButton className="mt-2 w-full justify-center !bg-raised" />
          <Link
            to="/downloads"
            className="mt-2 flex h-12 items-center justify-center rounded-xl bg-primary-600 text-base font-semibold text-white"
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}
