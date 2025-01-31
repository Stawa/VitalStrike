import { Link } from "@remix-run/react";
import { blogPosts } from "./CHANGELOG";
import { Calendar, ArrowRight, Zap } from "lucide-react";

export default function BlogIndex() {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span className="text-sm font-medium">Development Updates</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-black dark:text-white">
            VitalStrike Changelog
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Explore the journey of continuous improvement and innovation behind
            VitalStrike
          </p>
        </header>

        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <div key={post.id} className="group">
              <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/30">
                <Link
                  to={`/blog/${post.version}`}
                  className="block p-6 md:p-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          <Zap className="w-4 h-4 stroke-[2.5]" />
                          {post.version}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 stroke-[1.5]" />
                          <time className="text-sm">{post.date}</time>
                          <span className="mx-1 text-xs">•</span>
                          <span className="text-sm">
                            by{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {post.author}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          VitalStrike {post.version}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-base">
                          {post.description}
                        </p>
                        <div className="prose prose-sm max-w-none line-clamp-3 text-gray-500 dark:text-gray-400">
                          {post.changes.split("\n").slice(0, 3).join("\n")}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-6 w-6 text-primary transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>

              {index < blogPosts.length - 1 && (
                <div className="my-6 border-b border-gray-200 dark:border-gray-800 opacity-50"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
