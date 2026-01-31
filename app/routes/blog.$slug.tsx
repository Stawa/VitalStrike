import { useLoaderData, Await, Link } from "@remix-run/react";
import { type LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { loader as changelogLoader } from "./CHANGELOG";
import type { BlogPost } from "~/types/blog";
import { Suspense, useEffect, useState } from "react";
import { BlogPostSkeleton } from "~/components/BlogSkeleton";
import { marked } from "marked";
import { FaArrowLeft, FaCalendarAlt, FaUser } from "react-icons/fa";

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await changelogLoader();
  const data = await response.json();
  const post = data.posts.find((post: BlogPost) => post.version === params.slug);

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <article className="relative">
          <Suspense fallback={<BlogPostSkeleton />}>
            <Await resolve={post}>
              {(resolvedPost) => (
                <>
                  {/* Animated background elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full animate-pulse-slow" />
                    <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary/10 rounded-full animate-float" />

                    {/* Particle effect - only render on client side */}
                    {isClient && (
                      <div className="absolute inset-0">
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full bg-primary/20 animate-float-random"
                            style={{
                              width: `${Math.random() * 6 + 2}px`,
                              height: `${Math.random() * 6 + 2}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              animationDuration: `${Math.random() * 10 + 10}s`,
                              animationDelay: `${Math.random() * 5}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Header with Timeline-like design */}
                  <header className="mb-12 relative">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                        <div className="flex items-center gap-1.5 group">
                          <FaCalendarAlt className="w-3.5 h-3.5 transition-colors group-hover:text-primary" />
                          <time className="font-medium transition-colors group-hover:text-primary">
                            {resolvedPost.date}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5 group">
                          <FaUser className="w-3.5 h-3.5 transition-colors group-hover:text-primary" />
                          <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors group-hover:text-primary">
                            {resolvedPost.author}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4 mb-8">
                      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
                        VitalStrike {resolvedPost.version}
                      </h1>
                      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                        {resolvedPost.description}
                      </p>
                    </div>
                  </header>

                  {/* Divider with timeline dot */}
                  <div className="relative flex items-center my-10">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    <div className="mx-4 w-4 h-4 rounded-full bg-primary-500 dark:bg-primary-400 shadow-md shadow-primary/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                    </div>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  </div>

                  {/* Content with enhanced card effect */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl opacity-25" />

                    <div
                      className="relative p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 prose prose-lg dark:prose-invert max-w-none
                        prose-headings:scroll-mt-28 
                        prose-headings:font-display 
                        prose-headings:font-bold 
                        prose-a:text-primary 
                        hover:prose-a:text-primary/80 
                        prose-pre:bg-gray-100/80 dark:prose-pre:bg-gray-800/80
                        prose-pre:border 
                        prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                        prose-h1:text-3xl
                        prose-h1:font-bold
                        prose-h1:text-gray-900 dark:prose-h1:text-white
                        prose-h2:text-xl
                        prose-h2:font-semibold
                        prose-h2:text-gray-800 dark:prose-h2:text-gray-100
                        prose-p:text-gray-600 dark:prose-p:text-gray-300
                        prose-p:leading-relaxed
                        prose-strong:text-gray-900 dark:prose-strong:text-white
                        prose-strong:font-semibold
                        prose-ul:space-y-2
                        prose-li:text-gray-600 dark:prose-li:text-gray-300
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

                  {/* Footer navigation */}
                  <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors border border-primary-200 dark:border-primary-800/50"
                    >
                      <FaArrowLeft className="h-4 w-4" />
                      <span className="font-medium">Back to all updates</span>
                    </Link>
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
