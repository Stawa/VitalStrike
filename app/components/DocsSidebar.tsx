import { Link, useLocation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { FaBook, FaWrench, FaTerminal, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";

interface NavItem {
  title: string;
  href: string;
  code?: boolean;
  items?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  icon?: React.ReactNode;
}

const navigation: NavSection[] = [
  {
    title: "Intro",
    icon: <FaBook />,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Getting Started", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Configuration",
    icon: <FaWrench />,
    items: [
      {
        title: "Configuration Guide",
        href: "/docs/configuration",
        items: [
          { title: "Basic Settings", href: "/docs/configuration/basic" },
          { title: "Damage Indicators", href: "/docs/configuration/damage" },
          { title: "Combo System", href: "/docs/configuration/combo" },
          { title: "Display Settings", href: "/docs/configuration/display" },
          { title: "Messages", href: "/docs/configuration/messages" },
          { title: "Permissions", href: "/docs/configuration/permissions" },
          { title: "Knockdown System", href: "/docs/configuration/knockdown" },
        ],
      },
    ],
  },
  {
    title: "Commands",
    icon: <FaTerminal />,
    items: [{ title: "Command List", href: "/docs/commands" }],
  },
];

export default function DocsSidebar() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const filteredNavigation = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return navigation;
    }

    return navigation
      .map((section) => {
        const filteredItems = section.items
          .map((item) => {
            if (!item.items) {
              return item.title.toLowerCase().includes(normalizedQuery) ? item : null;
            }

            const filteredSubItems = item.items.filter((subItem) =>
              subItem.title.toLowerCase().includes(normalizedQuery)
            );

            if (item.title.toLowerCase().includes(normalizedQuery) || filteredSubItems.length > 0) {
              return {
                ...item,
                items: filteredSubItems.length > 0 ? filteredSubItems : item.items,
              };
            }

            return null;
          })
          .filter((item): item is NavItem => Boolean(item));

        return filteredItems.length > 0 ? { ...section, items: filteredItems } : null;
      })
      .filter((section): section is NavSection => Boolean(section));
  }, [query]);

  useEffect(() => {
    if (query.trim().length > 0) {
      setExpandedSections(filteredNavigation.map((section) => section.title));
      setExpandedItems(
        filteredNavigation.flatMap((section) =>
          section.items
            .filter((item) => item.items && item.items.length > 0)
            .map((item) => item.href)
        )
      );
      return;
    }

    const currentPath = location.pathname;
    const sectionsToExpand = navigation
      .filter((section) =>
        section.items.some(
          (item) =>
            currentPath.startsWith(item.href.split("#")[0]) ||
            item.items?.some((subItem) => currentPath.startsWith(subItem.href.split("#")[0]))
        )
      )
      .map((section) => section.title);

    setExpandedSections(sectionsToExpand);

    const itemsToExpand = navigation.flatMap((section) =>
      section.items
        .filter(
          (item) =>
            item.items &&
            item.items.length > 0 &&
            (currentPath.startsWith(item.href.split("#")[0]) ||
              item.items.some((subItem) => currentPath.startsWith(subItem.href.split("#")[0])))
        )
        .map((item) => item.href)
    );

    setExpandedItems(itemsToExpand);
  }, [filteredNavigation, location.pathname, query]);

  const isActive = (href: string) => {
    if (href === "/docs") {
      return location.pathname === "/docs" || location.pathname === "/docs/";
    }
    return location.pathname.startsWith(href.split("#")[0]);
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleItem = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  return (
    <div
      id="doc-menu"
      className="relative h-full w-full overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
      style={{ touchAction: "pan-y", userSelect: "none" }}
    >
      <div className="mb-5">
        <div className="px-1">
          <div className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            Documentation
          </div>
          <div className="mt-3 relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2.5 pl-10 text-sm text-gray-900 shadow-sm backdrop-blur-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-white"
            />
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {query.trim().length > 0 && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredNavigation.length === 0 ? (
        <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4 text-sm text-gray-600 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-300">
          No matches found.
        </div>
      ) : null}

      {filteredNavigation.map((section) => {
        const isExpanded = expandedSections.includes(section.title);

        return (
          <div key={section.title} className="mb-4">
            <button
              type="button"
              className="w-full flex items-center justify-between cursor-pointer group py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
              onClick={() => toggleSection(section.title)}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-2">
                <span className="text-primary-500 dark:text-primary-400">{section.icon}</span>
                <p className="text-[13px] font-semibold tracking-wide text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase">
                  {section.title}
                </p>
              </div>
              <FaChevronRight
                className={`text-xs text-gray-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            <div
              className={`space-y-1 mt-1 overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {section.items.map((item) => (
                <div key={item.href} className="group pl-2">
                  {!item.items || item.items.length === 0 ? (
                    <Link to={item.href} className="block no-underline hover:no-underline">
                      <div
                        className={`
                          relative flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActive(item.href)
                              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                          }
                        `}
                      >
                        {isActive(item.href) ? (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary-500 dark:bg-primary-400" />
                        ) : null}
                        {item.code ? (
                          <code className="font-mono text-[13px] py-0.5 px-1.5 rounded-md bg-primary-100/50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                            {item.title}
                          </code>
                        ) : (
                          <span className="pl-2">{item.title}</span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div
                        className={`
                          relative flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActive(item.href)
                              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                          }
                        `}
                      >
                        {isActive(item.href) ? (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary-500 dark:bg-primary-400" />
                        ) : null}
                        <Link
                          to={item.href}
                          className="flex-1 flex items-center no-underline hover:no-underline"
                        >
                          {item.code ? (
                            <code className="font-mono text-[13px] py-0.5 px-1.5 rounded-md bg-primary-100/50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                              {item.title}
                            </code>
                          ) : (
                            <span className="pl-2">{item.title}</span>
                          )}
                        </Link>
                        <button
                          type="button"
                          className="ml-2 rounded-md p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          onClick={() => toggleItem(item.href)}
                          aria-expanded={expandedItems.includes(item.href)}
                          aria-label={`Toggle ${item.title}`}
                        >
                          <FaChevronRight
                            className={`text-xs transition-transform duration-300 ${
                              expandedItems.includes(item.href) ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div
                        className={`mt-1 ml-4 pl-2 border-l border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                          expandedItems.includes(item.href)
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className="block no-underline hover:no-underline"
                          >
                            <div
                              className={`
                                group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                                ${
                                  isActive(subItem.href)
                                    ? "bg-primary-50/50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 font-semibold"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                                }
                              `}
                            >
                              <div
                                className={`
                                w-1.5 h-1.5 rounded-full mr-3 transition-all duration-200
                                ${
                                  isActive(subItem.href)
                                    ? "bg-primary-500 dark:bg-primary-400"
                                    : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                                }
                              `}
                              />
                              {subItem.title}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="h-[50px]"></div>
    </div>
  );
}
