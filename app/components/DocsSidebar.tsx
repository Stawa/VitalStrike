import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FaBook, FaWrench, FaTerminal, FaChevronRight } from "react-icons/fa";

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
  const [activeSection, setActiveSection] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const sectionsToExpand = navigation
      .filter((section) =>
        section.items.some(
          (item) =>
            currentPath.startsWith(item.href.split("#")[0]) ||
            item.items?.some((subItem) =>
              currentPath.startsWith(subItem.href.split("#")[0])
            )
        )
      )
      .map((section) => section.title);

    setExpandedSections(sectionsToExpand);

    const sections = document.querySelectorAll("section[id]");
    const observerOptions = {
      rootMargin: "0px 0px -50% 0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/docs") {
      return location.pathname === "/docs" || location.pathname === "/docs/";
    }
    return location.pathname.startsWith(href.split("#")[0]);
  };

  const isChildActive = (href: string) => {
    const sectionId = href.split("#")[1];
    return activeSection === sectionId;
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div
      id="doc-menu"
      className="relative h-full w-full overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
      style={{ touchAction: "pan-y", userSelect: "none" }}
    >
      {navigation.map((section) => {
        const isExpanded = expandedSections.includes(section.title);

        return (
          <div key={section.title} className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer group py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
              onClick={() => toggleSection(section.title)}
            >
              <div className="flex items-center gap-2">
                <span className="text-primary-500 dark:text-primary-400">
                  {section.icon}
                </span>
                <p
                  className="font-medium text-[15px] text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  style={{ fontVariant: "all-small-caps" }}
                >
                  {section.title}
                </p>
              </div>
              <FaChevronRight
                className={`text-xs text-gray-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </div>

            <div
              className={`space-y-1 mt-1 overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {section.items.map((item) => (
                <div key={item.href} className="group pl-2">
                  <Link
                    to={item.href}
                    className="block no-underline hover:no-underline"
                  >
                    <div
                      className={`
                        relative flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${
                          isActive(item.href)
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        }
                      `}
                    >
                      {item.code ? (
                        <code className="font-mono text-[13px] py-0.5 px-1.5 rounded-md bg-primary-100/50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          {item.title}
                        </code>
                      ) : (
                        item.title
                      )}
                    </div>
                  </Link>
                  {item.items && (
                    <div className="mt-1 ml-4 pl-2 border-l border-gray-200 dark:border-gray-700">
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
                                  ? "bg-primary-50/50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 font-medium"
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
