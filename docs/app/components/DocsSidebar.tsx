import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

interface NavSection {
  title: string;
  items: {
    title: string;
    href: string;
    code?: boolean;
    items?: {
      title: string;
      href: string;
    }[];
  }[];
}

const navigation: NavSection[] = [
  {
    title: "Intro",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Getting Started", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Configuration",
    items: [{ title: "Basic Settings", href: "/docs/configuration" }],
  },
];

export default function DocsSidebar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
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
  }, []);

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

  return (
    <div
      id="doc-menu"
      className="relative h-full w-full overflow-y-auto px-4 py-4"
    >
      {navigation.map((section) => (
        <div key={section.title}>
          <p
            className="whitespace-nowrap py-2 text-[15px] text-gray-400 dark:text-gray-400"
            style={{ fontVariant: "all-petite-caps" }}
          >
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <div key={item.href} className="group">
                <Link
                  to={item.href}
                  className="block no-underline hover:no-underline"
                >
                  <div
                    className={`
                      relative flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                      ${
                        isActive(item.href)
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium"
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
                              isChildActive(subItem.href)
                                ? "text-primary-700 dark:text-primary-300 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            }
                          `}
                        >
                          <div
                            className={`
                            w-1.5 h-1.5 rounded-full mr-3 transition-all duration-200
                            ${
                              isChildActive(subItem.href)
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
      ))}
      <div className="h-[50px]"></div>
    </div>
  );
}
