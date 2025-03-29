import type { LoaderFunction } from "@remix-run/node";
import { getDomainUrl } from "~/utils/misc";
import { loader as changelogLoader } from "./CHANGELOG";
import { BlogPost } from "~/types/blog";

export const loader: LoaderFunction = async ({ request }) => {
  const baseUrl = getDomainUrl(request);

  // Static pages
  const staticPages = [
    "",
    "/blog",
    "/docs",
    "/docs/getting-started",
    "/docs/configuration",
  ];

  const response = await changelogLoader();
  const { posts } = await response.json();
  const dynamicBlogUrls = posts.map(
    (post: BlogPost) => `/blog/${post.version}`
  );

  const allPages = [...staticPages, ...dynamicBlogUrls];

  const content = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join("")}
</urlset>
  `.trim();

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
