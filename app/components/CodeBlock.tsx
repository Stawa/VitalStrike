import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
}

/** A highlighted code panel: file name and copy button on top, code below. Colours follow the theme tokens. */
export function CodeBlock({
  code,
  filename = "config.yml",
  language = "yaml",
  className = "",
}: Readonly<CodeBlockProps>) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure data-ui className={`min-w-0 overflow-hidden rounded-2xl bg-raised ${className}`}>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="text-sm font-semibold text-muted-foreground">{filename}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink transition-opacity hover:opacity-80"
          aria-label={`Copy ${filename} snippet`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre
        className={`language-${language} scrollbar-thin overflow-x-auto px-5 pb-5 pt-1 text-[13.5px] leading-[1.75]`}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </figure>
  );
}
