import { useState, useEffect } from "react";
import { getCookie, setCookie } from "~/hooks/cookie";

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("system"); // Default to system on server

  useEffect(() => {
    const savedTheme = getCookie("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  const isDarkMode = mounted
    ? theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    : false; // Default to light theme during SSR

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode, mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const root = window.document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme, mounted]);

  const toggleTheme = (newTheme?: string) => {
    if (!mounted) return;

    setTheme((current) => {
      const nextTheme =
        newTheme ??
        (current === "light"
          ? "dark"
          : current === "dark"
          ? "system"
          : "light");
      setCookie("theme", nextTheme, {
        path: "/",
        expires: "never",
      });
      return nextTheme;
    });
  };

  return {
    isDarkMode,
    toggleTheme,
    theme,
    mounted,
  };
}
