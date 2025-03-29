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
      <div className="relative">
        {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-shrink-0">
                <div className="h-10 w-1.5 bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 rounded-full" />
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
                  className="group relative overflow-hidden p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 dark:hover:border-primary-400/50 transition-all duration-300"
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-center gap-4">
                    {/* Icon Container */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-0.5">
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
                    <span className="text-lg text-primary-500/40 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
  );
}
