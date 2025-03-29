import type { LoaderFunction } from "@remix-run/node";
import { getDomainUrl } from "~/utils/misc";

export const loader: LoaderFunction = async ({ request }) => {
  const baseUrl = getDomainUrl(request);

  const content = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
  `.trim();

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
