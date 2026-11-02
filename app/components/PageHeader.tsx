import type { ReactNode } from "react";

export function PageHeader({
  title,
  children,
}: Readonly<{ title: ReactNode; children?: ReactNode }>) {
  return (
    <header className="pb-10">
      <h1 className="font-heading text-4xl sm:text-5xl">{title}</h1>
      {children && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{children}</p>
      )}
    </header>
  );
}
