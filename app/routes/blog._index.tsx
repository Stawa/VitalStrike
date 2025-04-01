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
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50 text-foreground antialiased">
      {/* Hero Section - Using existing BlogHeader component */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 pt-16 pb-8">
          <Suspense fallback={<BlogHeader />}>
            <Await resolve={posts}>
              {(resolvedPosts) => {
                const latestVersion =
                  resolvedPosts.length > 0 ? resolvedPosts[0].version : "1.0.0";
                return <BlogHeader latestVersion={latestVersion} />;
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar - Now static instead of sticky */}
        <div className="z-10 mb-8 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search updates..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      resolvedPosts.map((post: BlogPost) =>
                        getVersionCategory(post.version)
                      )
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
                          onChange={(e) =>
                            setFilter(e.target.value as VersionCategory)
                          }
                          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
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
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-gray-200 dark:to-gray-800"></div>

          <Suspense
            fallback={
              <div className="space-y-12 ml-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-12 top-6 flex h-6 items-center">
                      <div className="relative h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                    <BlogCardSkeleton />
                  </div>
                ))}
              </div>
            }
          >
            <Await resolve={posts}>
              {(resolvedPosts) => {
                const filteredPosts = resolvedPosts.filter(
                  (post: BlogPost) =>
                    (filter === "all" ||
                      getVersionCategory(post.version) === filter) &&
                    (searchTerm === "" ||
                      post.version
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      post.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      post.changes
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
                );

                return (
                  <div className="space-y-12 ml-12">
                    {filteredPosts.length === 0 ? (
                      <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
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
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                          No updates found
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filter criteria.
                        </p>
                        <button
                          onClick={() => {
                            setFilter("all");
                            setSearchTerm("");
                          }}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      filteredPosts.map((post: BlogPost, index: number) => (
                        <div key={post.id} className="relative">
                          {/* Version marker - using index numbers */}
                          <div className="absolute -left-16 top-6 flex items-center">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/40 shadow-sm border border-primary-200/50 dark:border-primary-700/50 transform transition-transform duration-300 hover:scale-110">
                                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Post card */}
                          <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <BlogPostCard post={post} />
                          </div>
                        </div>
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
