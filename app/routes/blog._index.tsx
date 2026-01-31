import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Await } from "@remix-run/react";
import { BlogHeader } from "~/components/BlogHeader";
import { BlogPostCard } from "~/components/BlogPostCard";
import { loader as changelogLoader } from "./CHANGELOG";
import { BlogPost } from "~/types/blog";
import { Suspense, useState } from "react";
import { BlogCardSkeleton } from "~/components/BlogSkeleton";
import { FaSearch, FaFilter } from "react-icons/fa";
import BackToTop from "~/components/BackToTop";

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
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getVersionCategory = (version: string) => {
    const majorVersion = version.split(".")[0];
    return `v${majorVersion}.x`;
  };

  return (
    <div className="relative">
      <Suspense fallback={<BlogHeader />}>
        <Await resolve={posts}>
          {(resolvedPosts) => {
            const latestVersion = resolvedPosts.length > 0 ? resolvedPosts[0].version : "1.0.0";
            return <BlogHeader latestVersion={latestVersion} />;
          }}
        </Await>
      </Suspense>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar - Now static instead of sticky */}
        <div className="z-10 mb-10 rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search updates..."
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-10 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400/25"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Suspense fallback={null}>
              <Await resolve={posts}>
                {(resolvedPosts) => {
                  type VersionCategory = "all" | `v${string}.x`;
                  const categories: VersionCategory[] = [
                    "all",
                    ...new Set(
                      resolvedPosts.map((post: BlogPost) => getVersionCategory(post.version))
                    ),
                  ] as VersionCategory[];

                  return (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center mr-2">
                        <FaFilter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Filter:
                        </span>
                      </div>
                      <div className="relative">
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as VersionCategory)}
                          className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400/25"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category === "all" ? "All Versions" : category}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg
                            className="h-4 w-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </div>
        {/* Timeline Header */}
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <h2 className="flex-shrink-0 mx-4 text-xl font-bold text-gray-900 dark:text-white">
            Release Timeline
          </h2>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        {/* Timeline with Posts */}
        <div className="relative">
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <Await resolve={posts}>
              {(resolvedPosts) => {
                const filteredPosts = resolvedPosts.filter(
                  (post: BlogPost) =>
                    (filter === "all" || getVersionCategory(post.version) === filter) &&
                    (searchTerm === "" ||
                      post.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      post.changes.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                return (
                  <div className="space-y-4">
                    {filteredPosts.length === 0 ? (
                      <div className="rounded-xl border border-gray-200 bg-white/70 p-10 text-center shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                          No updates found
                        </h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          Try adjusting your search or filter criteria.
                        </p>
                        <button
                          onClick={() => {
                            setFilter("all");
                            setSearchTerm("");
                          }}
                          className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      filteredPosts.map((post: BlogPost) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))
                    )}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>
        {/* Back to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
