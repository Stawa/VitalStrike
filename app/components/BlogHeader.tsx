import { BsLightningCharge } from "react-icons/bs";

interface BlogHeaderProps {
  latestVersion?: string;
}

export function BlogHeader({ latestVersion = "1.0.0" }: BlogHeaderProps) {
  return (
    <header className="relative py-14 sm:py-16 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.10),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.08),transparent_60%)]" />

      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200">
          <BsLightningCharge className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          Development Updates
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          VitalStrike <span className="text-primary-600 dark:text-primary-400">Changelog</span>
        </h1>

        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
          Explore the journey of continuous improvement and innovation behind
          <span className="font-bold"> VitalStrike.</span>
        </p>

        <div className="mt-6 flex justify-center">
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-mono text-primary-600 dark:bg-gray-800 dark:text-primary-400">
            Latest {`v${latestVersion}`}
          </div>
        </div>
      </div>
    </header>
  );
}
