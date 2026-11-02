import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        // "Strike" red: the one accent, used on actions and links.
        primary: {
          DEFAULT: "#d6343c",
          50: "#fff1f1",
          100: "#ffe0e1",
          200: "#ffc7c9",
          300: "#ff9ea2",
          400: "#f76b72",
          500: "#e9474f",
          600: "#d6343c",
          700: "#b32730",
          800: "#942229",
          900: "#7a2228",
          950: "#430d11",
        },
        gray: {
          50: "#f6f7f8",
          100: "#eceef1",
          200: "#dde0e5",
          300: "#c3c8d0",
          400: "#9aa1ad",
          500: "#6f7785",
          600: "#535b69",
          700: "#3d4450",
          800: "#252a33",
          900: "#171a1f",
          950: "#0e1013",
        },
        dark: {
          bg: "#0e1013",
          surface: "#1b1f26",
          border: "#2a2f38",
          card: "#14171c",
        },
        ground: "rgb(var(--ground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        ink: "rgb(var(--foreground) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      spacing: {
        navbar: "var(--navbar-height)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
