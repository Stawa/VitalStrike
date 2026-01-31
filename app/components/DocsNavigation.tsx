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

export function DocsNavigation({ previousPage, nextPage }: Readonly<DocsNavigationProps>) {
  return (
    <nav className="mt-16 mb-8">
      <div className="relative flex items-center mb-8">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <h2 className="flex-shrink-0 mx-4 text-xl font-bold text-gray-900 dark:text-white">
          Continue Reading
        </h2>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousPage && (
          <Link
            to={previousPage.href}
            className="group relative rounded-xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50"
          >
            <div className="flex items-center w-full">
              <div className="mr-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary-700 shadow-sm transition-colors group-hover:bg-primary/15 dark:text-primary-300">
                <FaArrowLeft className="text-base" />
              </div>
              <div className="flex-grow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Previous</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {previousPage.title}
                </div>
              </div>
            </div>
          </Link>
        )}

        {nextPage && (
          <Link
            to={nextPage.href}
            className="group relative rounded-xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50"
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex-grow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {nextPage.title}
                </div>
              </div>
              <div className="ml-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary-700 shadow-sm transition-colors group-hover:bg-primary/15 dark:text-primary-300">
                <FaArrowRight className="text-base" />
              </div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
