import type { ReactNode } from "react";

interface TableItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TableOfContentsProps {
  items: TableItem[];
}

/** Jump links for screens that have no "On this page" rail (the rail takes over from xl). */
export function TableOfContents({ items }: Readonly<TableOfContentsProps>) {
  return (
    <nav aria-label="On this page" className="mb-10 xl:hidden">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-block rounded-full bg-surface px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
