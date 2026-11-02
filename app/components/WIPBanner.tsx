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
      ? "rounded-2xl bg-surface"
      : "w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-dark-bg/70";

  const innerClassName =
    variant === "card"
      ? "flex items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-5"
      : "mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-6";

  const pillClassName = "bg-primary-600 text-white";

  return (
    <div className={wrapperClassName}>
      <div className={innerClassName}>
        <div
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold ${pillClassName}`}
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
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
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
