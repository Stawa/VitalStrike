import { cssBundleHref } from "@remix-run/css-bundle";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Navigation } from "~/components/Navigation";
import Error from "~/components/Error";
import { Footer } from "~/components/Footer";
import BackToTop from "~/components/BackToTop";
import "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap",
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// Runs before first paint so the saved theme never flashes the wrong colors.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):"system";var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col bg-ground text-ink antialiased selection:bg-primary-600 selection:text-white">
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navigation />
          <main id="main" className="flex w-full min-w-0 flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </div>
        <BackToTop />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
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
    data: "An unexpected error occurred. Please try again, or report it on GitHub if it keeps happening.",
  };

  return (
    <Document title={"500 - Internal Server Error"}>
      <Error error={errorData} />
    </Document>
  );
}
