import { FaArrowRight, FaHome } from "react-icons/fa";

interface ErrorProps {
  error: {
    status: number;
    statusText: string;
    data?: unknown;
  };
}

export default function ErrorComponent({ error }: Readonly<ErrorProps>) {
  return (
    <section className="grid flex-1 place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="max-w-xl animate-fade-in-up text-center">
        <p className="text-6xl font-bold tracking-tight text-primary-600 dark:text-primary-400 sm:text-7xl">
          {error.status}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {error.statusText}
        </h1>
        {error.data == null ? null : (
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{String(error.data)}</p>
        )}
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <FaHome className="h-4 w-4" aria-hidden="true" />
            Return Home
          </a>
          <a
            href="/docs"
            className="inline-flex items-center justify-center gap-2 rounded-2xl  bg-surface px-6 py-3 text-base font-semibold text-gray-800 transition-colors hover:bg-surface dark:border-white/10 dark:bg-surface dark:text-gray-200 dark:hover:bg-surface"
          >
            View Documentation
            <FaArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
