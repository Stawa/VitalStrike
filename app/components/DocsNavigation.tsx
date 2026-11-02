import { Link } from "@remix-run/react";

interface DocsNavigationProps {
  previousPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

const cardClass =
  "group block rounded-2xl bg-surface p-5 transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface";

export function DocsNavigation({ previousPage, nextPage }: Readonly<DocsNavigationProps>) {
  return (
    <nav aria-label="Previous and next pages" className="mt-16 grid gap-3 sm:grid-cols-2">
      {previousPage ? (
        <Link to={previousPage.href} className={cardClass}>
          <span className="text-sm text-muted-foreground">← Previous</span>
          <span className="mt-1 block text-lg font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {previousPage.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {nextPage && (
        <Link to={nextPage.href} className={`${cardClass} sm:text-right`}>
          <span className="text-sm text-muted-foreground">Next →</span>
          <span className="mt-1 block text-lg font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {nextPage.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
