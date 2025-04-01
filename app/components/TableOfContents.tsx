interface TableItem {
  id: string;
  label: string;
  icon: string;
}

interface TableOfContentsProps {
  items: TableItem[];
}

export function TableOfContents({ items }: Readonly<TableOfContentsProps>) {
  return (
    <div className="mb-12">
      <div className="relative overflow-hidden bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 p-6 shadow-md">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-100 transition-opacity duration-300"></div>

        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 transition-opacity duration-500" />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="h-10 w-1.5 bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 rounded-full shadow-sm" />
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Quick Navigation
            </h2>
          </div>

          {/* Navigation Grid */}
          <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group relative overflow-hidden p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 dark:hover:border-primary-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Grid pattern background that appears on hover */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-0.5 shadow-sm">
                    <div className="w-full h-full rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl text-gray-700 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400">
                        {item.icon}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <span className="flex-1 font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.label}
                  </span>

                  {/* Arrow */}
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-all duration-300 transform group-hover:translate-x-1">
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

                {/* Decorative corner accent */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
              </a>
            ))}
          </nav>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45"></div>
      </div>
    </div>
  );
}
