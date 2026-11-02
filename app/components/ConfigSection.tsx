import React from "react";
import { CodeBlock } from "~/components/CodeBlock";

interface ConfigSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function ConfigSection({
  id,
  title,
  description,
  children,
  className = "",
}: Readonly<ConfigSectionProps>) {
  return (
    <section id={id} data-toc={title} className={`relative ${className}`}>
      <h2 className="font-heading text-2xl sm:text-3xl">{title}</h2>
      <p className="mb-6 mt-2 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

interface ConfigBlockProps {
  title: string;
  filename: string;
  code: string;
  tip?: string;
}

export function ConfigBlock({ title, filename, code, tip }: Readonly<ConfigBlockProps>) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-base font-bold">{title}</h3>
      <CodeBlock code={code} filename={filename} />
      {tip && (
        <p className="mt-3 max-w-3xl px-1 text-[15px] leading-relaxed text-muted-foreground">
          {tip}
        </p>
      )}
    </div>
  );
}
