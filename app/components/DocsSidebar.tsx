import { NavLink } from "@remix-run/react";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface NavItem {
  title: string;
  href: string;
  external?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Start here",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Getting started", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Overview", href: "/docs/configuration" },
      { title: "Basic settings", href: "/docs/configuration/basic" },
      { title: "Damage indicators", href: "/docs/configuration/damage" },
      { title: "Combo system", href: "/docs/configuration/combo" },
      { title: "Display", href: "/docs/configuration/display" },
      { title: "Messages", href: "/docs/configuration/messages" },
      { title: "Permissions", href: "/docs/configuration/permissions" },
      { title: "Knockdown", href: "/docs/configuration/knockdown" },
      { title: "Health bars and levels", href: "/docs/configuration/progression" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Commands", href: "/docs/commands" },
      { title: "JavaDoc", href: "https://stawa.github.io/VitalStrike/javadoc/", external: true },
    ],
  },
];

const itemClass = "block rounded-lg px-3 py-2 text-[15px] transition-colors";

export default function DocsSidebar() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const groups = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.title.toLowerCase().includes(q)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav
      aria-label="Documentation"
      className="flex h-full flex-col gap-6 overflow-y-auto px-1 py-6 lg:py-8"
    >
      <div className="relative">
        <FaSearch
          className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs"
          aria-label="Search docs"
          className="h-11 w-full rounded-full bg-surface pl-10 pr-10 text-[15px] text-ink placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-ink"
          >
            <FaTimes className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="px-3 text-sm font-bold">{group.title}</h2>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${itemClass} text-muted-foreground hover:bg-surface hover:text-ink`}
                  >
                    {item.title} →
                  </a>
                ) : (
                  <NavLink
                    to={item.href}
                    end
                    className={({ isActive }) =>
                      `${itemClass} ${
                        isActive
                          ? "bg-surface font-semibold text-ink"
                          : "text-muted-foreground hover:bg-surface hover:text-ink"
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {groups.length === 0 && (
        <p className="px-3 text-[15px] text-muted-foreground">
          Nothing matches &quot;{query}&quot;.
        </p>
      )}
    </nav>
  );
}
