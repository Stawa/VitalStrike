import type { MetaFunction } from "@remix-run/node";
import { blogPosts } from "./CHANGELOG";
import { BlogHeader } from "~/components/BlogHeader";
import { BlogPostCard } from "~/components/BlogPostCard";


export const meta: MetaFunction = () => {
  return [
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
  return (
    <div className="min-h-screen py-24 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <BlogHeader />

        <div className="space-y-12">
          {blogPosts.map((post, index) => (
            <div key={post.id} className="group transform transition-all duration-300 hover:-translate-y-1">
              <BlogPostCard post={post} />
              
              {index < blogPosts.length - 1 && (
                <div className="my-12 border-b border-gray-200 dark:border-gray-800/50"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
