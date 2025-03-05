export interface BlogPost {
  id: string;
  description: string;
  date: string;
  changes: string;
  author: string;
  version: string;
}

async function fetchChangelog(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Stawa/VitalStrike/main/CHANGELOG.md"
    );
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

    const descriptionMatch = /^\n(.*?)\n\n/.exec(content.join("\n"));
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : "No description available";

    const changes = content.join("\n").trim();

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
  const posts = await fetchChangelog();
  return { posts };
}

export let blogPosts: BlogPost[] = [];
fetchChangelog().then((posts) => {
  blogPosts = posts;
});
