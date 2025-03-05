export function BlogCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>

        <div className="space-y-2">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>

        <div className="space-y-4 mb-8">
          <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>

        <div className="flex items-center gap-4">
          <div className="h-11 w-11 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        </div>
      </header>

      <div className="border-t border-border mb-8" />

      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
