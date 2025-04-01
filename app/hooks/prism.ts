import { useEffect } from "react";
import "prismjs/themes/prism.css";
import "prismjs/themes/prism-tomorrow.css";

const customStyles = `
  code[class*="language-"],
  pre[class*="language-"] {
    background: none;
    text-shadow: none;
  }
`;

const loadPrism = async () => {
  const Prism = await import("prismjs");

  if (!document.querySelector("#prism-custom-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "prism-custom-styles";
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);
  }

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

export const PrismHighlight = () => {
  useHighlightCode();
  return null;
};
