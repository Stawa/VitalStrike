import { Link } from "@remix-run/react";
import { BsLightningChargeFill, BsArrowRightShort } from "react-icons/bs";
import { HiCalendar, HiUser } from "react-icons/hi";
import type { BlogPost } from "~/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: Readonly<BlogPostCardProps>) {
  return (
    <article className="group relative bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-25 transition-opacity duration-500" />

      <Link
        to={`/blog/${post.version}`}
        className="relative block p-6 md:p-8 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary-700 dark:text-primary-300 border border-primary/20 transform transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                <BsLightningChargeFill className="w-3 h-3 group-hover:animate-pulse" />
                <span className="text-sm font-semibold tracking-wide">
                  v{post.version}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs">
                <div className="flex items-center gap-1.5 group/date">
                  <HiCalendar className="w-3.5 h-3.5 transition-colors group-hover/date:text-primary" />
                  <time className="font-medium transition-colors group-hover/date:text-primary">
                    {post.date}
                  </time>
                </div>
                <div className="flex items-center gap-1.5 group/author">
                  <HiUser className="w-3.5 h-3.5 transition-colors group-hover/author:text-primary" />
                  <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors group-hover/author:text-primary">
                    {post.author}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center text-primary opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <BsArrowRightShort className="w-6 h-6 animate-bounce-x" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              VitalStrike {post.version}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {post.description}
            </p>
            <div className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400 font-light leading-relaxed mt-4">
              {post.changes
                .split("\n")
                .slice(0, 3)
                .map((change, index) => (
                  <p
                    key={index}
                    className="line-clamp-1 group-hover:text-primary/80 transition-colors flex items-start"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-400/70 dark:bg-primary-500/70 mt-1.5 mr-2 flex-shrink-0"></span>
                    {change}
                  </p>
                ))}
              {post.changes.split("\n").length > 3 && (
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-2">
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
