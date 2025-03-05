import { useLoaderData, Await } from "@remix-run/react";
import { type LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { loader as changelogLoader } from "./CHANGELOG";
import type { BlogPost } from "~/types/blog";
import { Suspense } from "react";
import { BlogPostSkeleton } from "~/components/BlogSkeleton";
import { marked } from "marked";

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await changelogLoader();
  const data = await response.json();
  const post = data.posts.find(
    (post: BlogPost) => post.version === params.slug
  );

  if (!post) {
    throw new Response("Blog post not found", { status: 404 });
  }

  return { post };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { rel: "icon", href: "/icon.png", type: "image/png" },
      { property: "og:image", content: "/og-preview.png" },
      { name: "twitter:image", content: "/og-preview.png" },
      { title: "Post Not Found - VitalStrike" },
      { description: "The requested blog post could not be found." },
    ];
  }

  const { post } = data;
  const title = `VitalStrike ${post.version} - Changelog`;

  return [
    { rel: "icon", href: "/icon.png", type: "image/png" },
    { property: "og:image", content: "/og-preview.png" },
    { name: "twitter:image", content: "/og-preview.png" },
    { title },
    { name: "description", content: post.description },
    { property: "og:title", content: title },
    { property: "og:description", content: post.description },
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: post.date },
    { property: "article:author", content: post.author },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: post.description },
  ];
};

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <article className="relative">
          <Suspense fallback={<BlogPostSkeleton />}>
            <Await resolve={post}>
              {(resolvedPost) => (
                <>
                  {/* Enhanced Header */}
                  <header className="mb-12">
                    {/* Version Badge */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/15 transition-colors text-primary py-1.5 rounded-full text-sm font-medium group">
                        <svg
                          className="w-4 h-4 group-hover:rotate-12 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>{resolvedPost.version}</span>
                      </div>
                      <time className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {resolvedPost.date}
                      </time>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4 mb-8">
                      <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                        VitalStrike {resolvedPost.version}
                      </h1>
                      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        {resolvedPost.description}
                      </p>
                    </div>

                    {/* Author Card */}
                    <div className="inline-flex items-center gap-4 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-transparent hover:from-primary/10 hover:via-primary/15 transition-colors">
                      <div className="relative">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center ring-[3px] ring-background">
                          <span className="font-medium text-background">
                            {resolvedPost.author[0]}
                          </span>
                        </div>
                        <div
                          className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center ring-2 ring-primary/20"
                          style={{ backgroundColor: "#3b82f6" }}
                        >
                          <svg
                            className="w-3 h-3 text-primary"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {resolvedPost.author}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Plugin Developer
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Divider */}
                  <div
                    className="border-t border-border mb-8"
                    aria-hidden="true"
                  />

                  {/* Content with enhanced card effect */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary-foreground/5 to-transparent rounded-xl transition-opacity group-hover:opacity-75" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl opacity-25" />
                    <div
                      className="relative bg-background/90 backdrop-blur-sm rounded-xl prose prose-lg dark:prose-invert max-w-none
                        prose-headings:scroll-mt-28 
                        prose-headings:font-display 
                        prose-headings:font-bold 
                        prose-a:text-primary 
                        hover:prose-a:text-primary/80 
                        prose-pre:bg-muted/50 
                        prose-pre:border 
                        prose-pre:border-border 
                        prose-h1:text-3xl
                        prose-h1:font-bold
                        prose-h1:text-foreground
                        prose-h2:text-xl
                        prose-h2:font-semibold
                        prose-h2:text-foreground/90
                        prose-p:text-muted-foreground
                        prose-p:leading-relaxed
                        prose-strong:text-foreground
                        prose-strong:font-semibold
                        prose-ul:space-y-2
                        prose-li:text-muted-foreground
                        prose-li:leading-relaxed
                        [&>h1:first-child]:mt-0
                        [&>h2]:mt-8
                        [&>h2]:mb-4
                        [&>p]:my-4
                        [&>ul]:my-6
                        [&>ul>li]:relative
                        [&>ul>li]:pl-6
                        [&>ul>li]:before:absolute
                        [&>ul>li]:before:left-0
                        [&>ul>li]:before:top-3
                        [&>ul>li]:before:h-1.5
                        [&>ul>li]:before:w-1.5
                        [&>ul>li]:before:rounded-full
                        [&>ul>li]:before:bg-primary/50
                        [&>ul>li]:hover:before:bg-primary
                        [&>ul>li]:before:transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: marked(resolvedPost.changes),
                      }}
                    />
                  </div>
                </>
              )}
            </Await>
          </Suspense>
        </article>
      </div>
    </div>
  );
}
