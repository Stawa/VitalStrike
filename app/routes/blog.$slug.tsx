import { useLoaderData, Link } from "@remix-run/react";
import { type LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { loader as changelogLoader } from "./CHANGELOG";
import type { BlogPost } from "~/types/blog";
import { ReleaseGroups, releaseStatus } from "~/components/ReleaseNotes";
import { marked } from "marked";

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await changelogLoader();
  const data = await response.json();
  const posts: BlogPost[] = data.posts;
  const index = posts.findIndex((post) => post.version === params.slug);

  if (index === -1) {
    throw new Response("Release not found", { status: 404 });
  }

  return {
    post: posts[index],
    status: releaseStatus(posts[index], index),
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { rel: "icon", href: "/icon.png", type: "image/png" },
      { title: "Release not found - VitalStrike" },
    ];
  }

  const { post } = data;
  const title = `VitalStrike ${post.version} - Changelog`;

  return [
    { rel: "icon", href: "/icon.png", type: "image/png" },
    { property: "og:image", content: "/og-preview.png" },
    { name: "twitter:image", content: "/og-preview.png" },
    { title },
    { name: "description", content: post.description.replace(/[*_`]/g, "") },
    { property: "og:title", content: title },
    { property: "og:description", content: post.description.replace(/[*_`]/g, "") },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
  ];
};

const cardClass =
  "group block rounded-2xl bg-surface p-5 transition-colors hover:bg-gray-200 dark:hover:bg-dark-surface";

export default function ReleasePage() {
  const { post, status, newer, older } = useLoaderData<typeof loader>();
  const description = marked.parseInline(post.description, { async: false }) as string;

  return (
    <div className="page-x pb-20 pt-8 sm:pt-12">
      <Link
        to="/blog"
        className="text-[15px] font-semibold text-muted-foreground transition-colors hover:text-ink"
      >
        ← All releases
      </Link>

      <header className="mt-6 grid gap-4 pb-2 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium text-muted-foreground">
            {status !== "Unreleased" && <time>{post.date}</time>}
            {status && (
              <span className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-ground">
                {status}
              </span>
            )}
          </div>
          <h1 className="font-heading mt-3 text-[clamp(2.75rem,5vw,5.5rem)]">
            VitalStrike {post.version}
          </h1>
        </div>
        <p
          className="text-lg leading-relaxed text-muted-foreground lg:col-span-5 lg:max-w-xl 2xl:text-xl [&_strong]:font-semibold [&_strong]:text-ink"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </header>

      <ReleaseGroups changes={post.changes} />

      <nav aria-label="Other releases" className="mt-12 grid gap-3 sm:grid-cols-2">
        {older ? (
          <Link to={`/blog/${older.version}`} className={cardClass}>
            <span className="text-sm text-muted-foreground">← Older</span>
            <span className="mt-1 block text-lg font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {older.version}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link to={`/blog/${newer.version}`} className={`${cardClass} sm:text-right`}>
            <span className="text-sm text-muted-foreground">Newer →</span>
            <span className="mt-1 block text-lg font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {newer.version}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
