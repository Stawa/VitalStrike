import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FeaturedRelease, ReleaseSummary, releaseStatus } from "~/components/ReleaseNotes";
import { loader as changelogLoader } from "./CHANGELOG";
import type { BlogPost } from "~/types/blog";

export async function loader() {
  return changelogLoader();
}

export const meta: MetaFunction = () => {
  const title = "Changelog - VitalStrike";
  const description =
    "Every VitalStrike release: what was added, changed, fixed and removed, version by version.";

  return [
    { rel: "icon", href: "/icon.png", type: "image/png" },
    { property: "og:image", content: "/og-preview.png" },
    { name: "twitter:image", content: "/og-preview.png" },
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
};

export default function Changelog() {
  const { posts } = useLoaderData<typeof loader>() as { posts: BlogPost[] };
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const all = posts.map((post, index) => ({ post, status: releaseStatus(post, index) }));
  const visible = all.filter(
    ({ post }) =>
      !q || `${post.version} ${post.description} ${post.changes}`.toLowerCase().includes(q)
  );
  const showFeatured = !q && visible.length > 0;
  const [featured, ...rest] = showFeatured ? visible : [];
  const list = showFeatured ? rest : visible;

  return (
    <div className="page-x pb-20 pt-8 sm:pt-12">
      <header className="grid gap-4 pb-10 lg:grid-cols-12 lg:items-end">
        <h1 className="font-heading text-[clamp(2.75rem,5vw,5.5rem)] lg:col-span-7">Changelog</h1>
        <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5 lg:max-w-xl 2xl:text-xl">
          What changed in each release. Open one for the full notes.
        </p>
      </header>

      <div className="mb-6">
        <label className="relative block max-w-md">
          <span className="sr-only">Search releases</span>
          <FaSearch
            className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search every release, for example “combo”"
            className="h-12 w-full rounded-full bg-surface pl-11 pr-5 text-[15px] text-ink placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </label>
      </div>

      {featured && <FeaturedRelease post={featured.post} status={featured.status} />}

      {list.length > 0 && (
        <section
          aria-label={showFeatured ? "Earlier releases" : "Matching releases"}
          className="mt-6"
        >
          {showFeatured && (
            <h2 className="mb-4 mt-10 text-2xl font-extrabold tracking-tight">Earlier releases</h2>
          )}
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {list.map(({ post, status }) => (
              <li key={post.id} className="contents">
                <ReleaseSummary post={post} status={status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {visible.length === 0 && (
        <div className="rounded-3xl bg-surface p-10">
          <h2 className="text-xl font-bold">No release matches &quot;{query}&quot;</h2>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 rounded-full bg-ink px-6 py-3 text-base font-semibold text-ground transition-opacity hover:opacity-90"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
