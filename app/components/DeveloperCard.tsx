import type { ReactNode } from "react";

interface DeveloperRole {
  label: string;
  tone?: "primary" | "neutral";
}

interface DeveloperCardProps {
  name: string;
  avatarUrl: string;
  roles?: DeveloperRole[];
  bio?: ReactNode;
  githubUrl: string;
  className?: string;
}

export function DeveloperCard({
  name,
  avatarUrl,
  roles = [],
  bio,
  githubUrl,
  className = "",
}: Readonly<DeveloperCardProps>) {
  return (
    <div className={`flex gap-5 rounded-3xl bg-surface p-5 sm:p-6 ${className}`}>
      <img
        src={avatarUrl}
        alt=""
        width={72}
        height={72}
        className="h-[72px] w-[72px] shrink-0 rounded-2xl"
        loading="lazy"
      />
      <div className="min-w-0">
        <h3 className="text-xl font-extrabold tracking-tight">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            {name}
          </a>
        </h3>
        {roles.length > 0 && (
          <p className="mt-0.5 text-[15px] font-semibold text-primary-700 dark:text-primary-300">
            {roles.map((role) => role.label).join(" · ")}
          </p>
        )}
        {bio == null ? null : (
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{bio}</p>
        )}
      </div>
    </div>
  );
}
