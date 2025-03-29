import { useState, useEffect } from "react";

interface GitHubRelease {
  tag_name: string;
}

export function useLatestVersion() {
  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestVersion() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/Stawa/VitalStrike/releases/latest"
        );
        const data: GitHubRelease = await response.json();
        setVersion(data.tag_name.replace("v", ""));
      } catch (error) {
        console.error("Failed to fetch latest version:", error);
        setVersion("2.1.4"); // Fallback version
      } finally {
        setLoading(false);
      }
    }

    fetchLatestVersion();
  }, []);

  return { version, loading };
}
