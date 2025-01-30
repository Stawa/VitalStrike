import { Link } from "@remix-run/react";
import { blogPosts } from "./CHANGELOG";

export default function BlogIndex() {
  return (
    <div className="min-h-screen py-16 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-24">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Track VitalStrike's development progress and feature updates
          </p>
        </header>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <div key={post.id}>
              <article className="group relative first:pt-0 hover:bg-muted/50 rounded-lg transition-all duration-300 ease-in-out hover:pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{post.version}</span>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {post.date}
                      </time>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">by</span>
                        <span className="text-sm font-medium text-foreground">
                          {post.author}
                        </span>
                      </div>
                    </div>

                    <Link to={`/blog/${post.version}`} className="group/link block space-y-3">
                      <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 ease-in-out group-hover/link:text-primary">
                        VitalStrike {post.version}
                      </h2>
                      <p className="text-muted-foreground text-sm group-hover/link:text-foreground/80 transition-colors duration-300 ease-in-out">
                        {post.description}
                      </p>
                      <div className="prose prose-sm prose-muted max-w-none line-clamp-3 text-muted-foreground/80">
                        {post.changes.split('\n').slice(0, 3).join('\n')}
                      </div>
                    </Link>
                  </div>

                  <div className="ml-6 flex items-center self-center">
                    <div className="h-6 w-6 text-muted-foreground/50 transform transition-all duration-300 ease-in-out group-hover:text-primary group-hover:translate-x-1">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
              {index < blogPosts.length - 1 && (
                <hr className="border-t border-border mt-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
