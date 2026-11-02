import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";

interface Heading {
  id: string;
  label: string;
}

/** "On this page" rail. Reads every element marked with data-toc, so pages need no extra wiring. */
export default function DocsOutline() {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-toc]")).filter(
      (node) => node.id
    );
    setHeadings(nodes.map((node) => ({ id: node.id, label: node.dataset.toc ?? node.id })));
    setActive(nodes[0]?.id ?? "");

    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-[calc(var(--navbar-height)+2rem)] py-8">
      <h2 className="text-sm font-bold">On this page</h2>
      <ul className="mt-3 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              className={`block rounded-lg px-3 py-1.5 text-[15px] transition-colors ${
                active === heading.id
                  ? "bg-surface font-semibold text-ink"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              {heading.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
