import { useState } from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { Navigation } from "~/components/Navigation";
import Error from "~/components/Error";
import DocsSidebar from "~/components/DocsSidebar";
import { Footer } from "~/components/Footer";
import { WIPBanner } from "~/components/WIPBanner";
import { FaChevronRight } from "react-icons/fa";
import "~/tailwind.css";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

function Document({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 antialiased flex flex-col selection:bg-primary-500 selection:text-white">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-slate-900 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-400 dark:[mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <WIPBanner />
          <Navigation />
          <div className="flex-1 flex flex-col w-full">{children}</div>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith("/docs");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Document>
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-1">
          {isDocsPage && (
            <>
              {/* Mobile Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed z-[60] left-4 bottom-4 xl:hidden bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200"
                aria-label="Toggle Sidebar"
              >
                <FaChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isSidebarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile Sidebar Overlay */}
              <button
                type="button"
                className={`fixed inset-0 z-[55] xl:hidden bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
                  isSidebarOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close Sidebar"
              />

              {/* Mobile Sidebar */}
              <div
                className={`fixed left-0 top-0 z-[58] h-full w-[280px] bg-white dark:bg-dark-bg shadow-xl xl:hidden transform transition-transform duration-300 ease-in-out ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ touchAction: "pan-y" }}
              >
                <div className="h-full pt-[calc(var(--navbar-height)+2rem)] overflow-y-auto">
                  <DocsSidebar />
                </div>
              </div>

              {/* Desktop Sidebar */}
              <div className="sticky left-0 top-[calc(var(--navbar-height)+2rem)] hidden xl:block h-[calc(100vh-var(--navbar-height)-2rem)] w-[280px] border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="h-full overflow-y-auto">
                  <DocsSidebar />
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 w-full relative z-10">
            <div
              className={`mx-auto ${
                isDocsPage ? "max-w-6xl" : "max-w-8xl"
              } px-4 sm:px-6 lg:px-8 py-8`}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document title={`${error.status} - ${error.statusText}`}>
        <Error error={error} />
      </Document>
    );
  }

  const errorData = {
    status: 500,
    statusText: "Internal Server Error",
    data: "An unexpected error occurred. Our team has been notified and is working to resolve the issue.",
  };

  return (
    <Document title={"500 - Internal Server Error"}>
      <Error error={errorData} />
    </Document>
  );
}
