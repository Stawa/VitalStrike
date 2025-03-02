import { Link } from "@remix-run/react";
import { BsLightningChargeFill, BsArrowRightShort } from "react-icons/bs";
import { HiCalendar, HiUser } from "react-icons/hi";

interface BlogPost {
  id: string;
  version: string;
  date: string;
  author: string;
  description: string;
  changes: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Link
        to={`/blog/${post.version}`}
        className="relative block p-8 md:p-10 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 transform transition-all duration-300 hover:scale-105 hover:bg-primary/15">
                <BsLightningChargeFill className="w-3.5 h-3.5" />
                <span className="font-semibold tracking-wide">
                  {post.version}
                </span>
              </div>

              <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <HiCalendar className="w-4 h-4" />
                  <time className="text-sm font-medium">{post.date}</time>
                </div>
                <div className="flex items-center gap-2">
                  <HiUser className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center text-primary opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <BsArrowRightShort className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              VitalStrike {post.version}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {post.description}
            </p>
            <div className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              {post.changes
                .split("\n")
                .slice(0, 3)
                .map((change, index) => (
                  <p key={index} className="line-clamp-1">
                    {change}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
