import type { BlogPost } from "~/types/blog";

async function fetchChangelog(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Stawa/VitalStrike/main/CHANGELOG.md"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch changelog: ${response.statusText}`);
    }

    const markdown = await response.text();
    return parseChangelog(markdown);
  } catch (error) {
    console.error("Failed to fetch changelog:", error);
    return [];
  }
}

function parseChangelog(markdown: string): BlogPost[] {
  const posts: BlogPost[] = [];
  const sections = markdown.split(/^## \[/m).slice(1);

  for (const section of sections) {
    const [versionLine, ...content] = section.split("\n");
    const [version, date] = versionLine.split("] - ");

    const description = content[0] || "No description available";
    const changes = content.slice(2).join("\n").trim();

    posts.push({
      id: version,
      version: version,
      date: formatDate(date),
      changes: changes,
      description,
      author: "Stawa",
    });
  }

  return posts;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function loader() {
  try {
    const posts = await fetchChangelog();
    return Response.json({ posts, error: null });
  } catch (error) {
    return Response.json({
      posts: [],
      error: "Failed to load changelog. Please try again later.",
    });
  }
}
