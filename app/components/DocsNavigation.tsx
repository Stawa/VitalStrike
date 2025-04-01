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
            className="group relative overflow-hidden bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 hover:border-primary-500 dark:hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-6 flex items-center"
          >
            {/* Gradient background that appears on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center w-full">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full p-3 mr-4 text-white shadow-md">
                <FaArrowLeft className="text-lg" />
              </div>
              <div className="flex-grow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Previous
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {previousPage.title}
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tl-xl transform rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
          </Link>
        )}

        {nextPage && (
          <Link
            to={nextPage.href}
            className="group relative overflow-hidden bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-purple-200/50 dark:border-purple-800/50 hover:border-primary-500 dark:hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-6 flex items-center justify-between"
          >
            {/* Gradient background that appears on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center w-full justify-between">
              <div className="flex-grow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Next
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {nextPage.title}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3 ml-4 text-white shadow-md">
                <FaArrowRight className="text-lg" />
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/20 dark:bg-white/5 rounded-tr-xl transform -rotate-45 group-hover:bg-primary-500/20 transition-colors duration-300"></div>
          </Link>
        )}
      </div>
    </nav>
  );
}
