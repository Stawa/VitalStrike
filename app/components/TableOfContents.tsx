import type { ReactNode } from "react";

interface TableItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface TableOfContentsProps {
  items: TableItem[];
}

export function TableOfContents({ items }: Readonly<TableOfContentsProps>) {
  return (
    <div className="mb-12">
      <div className="rounded-xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-primary-600 dark:bg-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Navigation
            </h2>
          </div>

          {/* Navigation Grid */}
          <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group p-4 rounded-xl bg-white/70 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                    <div className="text-xl text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <span className="flex-1 font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.label}
                  </span>

                  {/* Arrow */}
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-all duration-300 transform group-hover:translate-x-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
