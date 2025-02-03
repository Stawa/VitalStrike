interface ErrorProps {
  error: any;
}

export default function Error({ error }: ErrorProps) {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="mt-8 text-6xl font-bold tracking-tight text-primary">
          {error.status}
        </h1>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {error.statusText}
        </p>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {error.data}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg shadow-md transition-all duration-300 ease-in-out"
          >
            <span className="flex items-center justify-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return Home
            </span>
          </a>
          <a
            href="/docs"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-primary-600 bg-primary-100 rounded-lg transition-all duration-300 ease-in-out"
          >
            <span className="flex items-center justify-center">
              View Documentation
              <svg
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
