import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        dark: {
          bg: "#0B1120",
          surface: "#1e293b",
          border: "#334155",
          card: "#161e32",
        },
        animation: {
          "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          float: "float 6s ease-in-out infinite",
          "float-delayed": "float 6s ease-in-out 3s infinite",
          "float-random": "float-y 8s ease-in-out infinite",
          "gradient-x": "gradient-x 15s ease infinite",
          "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
          "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        },
        keyframes: {
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          "float-y": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-15px)" },
          },
          "fade-in-up": {
            "0%": { opacity: "0", transform: "translateY(20px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          "gradient-x": {
            "0%, 100%": {
              "background-size": "200% 200%",
              "background-position": "left center",
            },
            "50%": {
              "background-size": "200% 200%",
              "background-position": "right center",
            },
          },
        },
        scale: {
          "98": "0.98",
        },
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
    backdropFilter: {
      none: "none",
      blur: "blur(4px)",
    },
    zIndex: {
      sidebar: "40",
      "sidebar-toggle": "50",
    },
    transitionProperty: {
      sidebar: "transform, opacity",
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
