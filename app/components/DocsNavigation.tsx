import { Link } from "@remix-run/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface DocsNavigationProps {
  previousPage?: {
    title: string;
    href: string;
  };
  nextPage?: {
    title: string;
    href: string;
  };
}

export function DocsNavigation({
  previousPage,
  nextPage,
}: Readonly<DocsNavigationProps>) {
  return (
    <nav className="mt-16 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousPage && (
          <Link
            to={previousPage.href}
            className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 transition-colors p-6 flex items-center group"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mr-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-colors">
              <FaArrowLeft className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Previous
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {previousPage.title}
              </div>
            </div>
          </Link>
        )}

        {nextPage && (
          <Link
            to={nextPage.href}
            className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500/50 transition-colors p-6 flex items-center justify-between group"
          >
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Next
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {nextPage.title}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 ml-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-colors">
              <FaArrowRight className="text-primary-600 dark:text-primary-400" />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
