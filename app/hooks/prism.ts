import { useEffect } from "react";
import "prismjs/themes/prism.css"; // Add the base Prism CSS
import "prismjs/themes/prism-tomorrow.css"; // Optional: dark theme

// Add custom styles to remove background
const customStyles = `
  code[class*="language-"],
  pre[class*="language-"] {
    background: none;
    text-shadow: none;
  }
`;

// Dynamic imports for Prism languages
const loadPrism = async () => {
  const Prism = await import("prismjs");

  // Add custom styles to document
  if (!document.querySelector("#prism-custom-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "prism-custom-styles";
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);
  }

  // Dynamically import language support
  await Promise.all([
    import("prismjs/components/prism-yaml"),
    import("prismjs/components/prism-javascript"),
    import("prismjs/components/prism-typescript"),
    import("prismjs/components/prism-jsx"),
    import("prismjs/components/prism-tsx"),
  ]);

  return Prism;
};

export const useHighlightCode = () => {
  useEffect(() => {
    const highlightCode = async () => {
      const Prism = await loadPrism();
      requestAnimationFrame(() => {
        Prism.highlightAll();
      });
    };

    highlightCode();
  }, []);
};

// If you want a component-based approach
export const PrismHighlight = () => {
  useHighlightCode();
  return null;
};
