import { useState } from "react";

type WIPBannerProps = {
  title?: string;
  message?: React.ReactNode;
  tone?: "primary" | "info";
  variant?: "bar" | "card";
};

export function WIPBanner({
  title = "Work in Progress",
  message = "This documentation is currently under active development.",
  tone = "primary",
  variant = "bar",
}: WIPBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const wrapperClassName =
    variant === "card"
      ? "rounded-xl border border-gray-200/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50"
      : "w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-dark-bg/70";

  const innerClassName =
    variant === "card"
      ? "flex items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-5"
      : "mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-6";

  const pillClassName =
    tone === "info"
      ? "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200"
      : "border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-200";

  return (
    <div className={wrapperClassName}>
      <div className={innerClassName}>
        <div
          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${pillClassName}`}
        >
          {tone === "info" ? "Updated" : "WIP"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              {title}
            </span>
            <span className="hidden text-gray-400 sm:inline dark:text-gray-500">•</span>
            <span className="text-sm leading-6 text-gray-600 dark:text-gray-300">{message}</span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
