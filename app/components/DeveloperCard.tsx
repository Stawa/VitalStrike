import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";

type DeveloperRoleTone = "primary" | "neutral";

interface DeveloperRole {
  label: string;
  tone?: DeveloperRoleTone;
}

interface DeveloperCardProps {
  name: string;
  avatarUrl: string;
  roles?: DeveloperRole[];
  bio?: ReactNode;
  githubUrl: string;
  className?: string;
}

function roleClassName(tone: DeveloperRoleTone) {
  if (tone === "primary") {
    return "inline-flex items-center rounded-full border border-primary-500/20 bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-200";
  }

  return "inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800/70 dark:bg-gray-900/50 dark:text-gray-200";
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
    <div
      className={`rounded-2xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800/70 dark:bg-gray-900/50 ${className}`}
    >
      <div className="flex flex-col gap-5">
        <div className="shrink-0">
          <img
            src={avatarUrl}
            alt={name}
            className="h-16 w-16 rounded-2xl ring-1 ring-gray-200/70 dark:ring-gray-800/70"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
            {roles.map((role) => (
              <span key={role.label} className={roleClassName(role.tone ?? "neutral")}>
                {role.label}
              </span>
            ))}
          </div>

          {bio == null ? null : (
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>
          )}

          <div className="mt-4 flex flex-col gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-95 dark:bg-white dark:text-gray-900"
            >
              <FaGithub className="h-4 w-4" />
              GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
