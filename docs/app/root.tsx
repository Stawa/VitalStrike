import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";
import { WIPBanner } from "~/components/WIPBanner";
import { Error } from "~/components/Error";
import "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function Document({
  children,
  title = "VitalStrike Documentation",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 antialiased flex flex-col">
        <WIPBanner />
        <Navigation />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <main className="flex-grow">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
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
