import { Link } from "@remix-run/react";
import { BsLightningChargeFill, BsArrowRightShort } from "react-icons/bs";
import { HiCalendar, HiUser } from "react-icons/hi";
import type { BlogPost } from "~/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: Readonly<BlogPostCardProps>) {
  return (
    <article className="group rounded-xl border border-gray-200 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-primary-50/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-gray-700 dark:hover:bg-primary-950/20">
      <Link to={`/blog/${post.version}`} className="block p-6 md:p-7">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-mono text-primary-600 dark:bg-gray-800 dark:text-primary-400">
                <BsLightningChargeFill className="h-3.5 w-3.5" />
                <span className="text-sm font-semibold tracking-wide">v{post.version}</span>
              </div>

              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs">
                <div className="flex items-center gap-1.5 group/date">
                  <HiCalendar className="w-3.5 h-3.5" />
                  <time className="font-medium">{post.date}</time>
                </div>
                <div className="flex items-center gap-1.5 group/author">
                  <HiUser className="w-3.5 h-3.5" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {post.author}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center text-primary-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-primary-400">
              <BsArrowRightShort className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              VitalStrike {post.version}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {post.description}
            </p>
            <div className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              {post.changes
                .split("\n")
                .slice(0, 3)
                .map((change, index) => (
                  <p key={index} className="line-clamp-1 flex items-start">
                    <span className="mt-1.5 mr-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500/60 dark:bg-primary-400/60" />
                    {change}
                  </p>
                ))}
              {post.changes.split("\n").length > 3 && (
                <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                  + {post.changes.split("\n").length - 3} more changes
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
