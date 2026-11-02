import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its child in once, when it first scrolls into view.
 * Content is visible on the server and without script; only elements below the fold
 * are hidden after hydration, and reduced-motion users never see the travel.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: Readonly<{ children: React.ReactNode; delay?: number; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${state === "hidden" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"} transition-[opacity,transform] duration-700 ease-out`}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
