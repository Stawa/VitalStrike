import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Await } from "@remix-run/react";
import { BlogHeader } from "~/components/BlogHeader";
import { BlogPostCard } from "~/components/BlogPostCard";
import { loader as changelogLoader } from "./CHANGELOG";
import { BlogPost } from "~/types/blog";
import { Suspense } from "react";
import { BlogCardSkeleton } from "~/components/BlogSkeleton";

export async function loader() {
  return changelogLoader();
}

export const meta: MetaFunction = () => {
  return [
    { rel: "icon", href: "/icon.png", type: "image/png" },
    { property: "og:image", content: "/og-preview.png" },
    { name: "twitter:image", content: "/og-preview.png" },
    { title: "VitalStrike Changelog | Development Updates" },
    {
      name: "description",
      content:
        "Explore the journey of continuous improvement and innovation behind VitalStrike. Stay up to date with our latest updates, features, and improvements.",
    },
    {
      property: "og:title",
      content: "VitalStrike Changelog | Development Updates",
    },
    {
      property: "og:description",
      content:
        "Explore the journey of continuous improvement and innovation behind VitalStrike. Stay up to date with our latest updates, features, and improvements.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "VitalStrike Changelog | Development Updates",
    },
    {
      name: "twitter:description",
      content:
        "Explore the journey of continuous improvement and innovation behind VitalStrike. Stay up to date with our latest updates, features, and improvements.",
    },
  ];
};

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen py-24 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <BlogHeader />

        <Suspense
          fallback={
            <div className="space-y-12">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <BlogCardSkeleton />
                  {i < 2 && (
                    <div className="my-12 border-b border-gray-200 dark:border-gray-800/50" />
                  )}
                </div>
              ))}
            </div>
          }
        >
          <Await resolve={posts}>
            {(resolvedPosts) => (
              <div className="space-y-12">
                {resolvedPosts.map((post: BlogPost, index: number) => (
                  <div
                    key={post.id}
                    className="group transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <BlogPostCard post={post} />
                    {index < resolvedPosts.length - 1 && (
                      <div className="my-12 border-b border-gray-200 dark:border-gray-800/50" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
