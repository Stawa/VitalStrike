import { useEffect, useId, useRef, useState } from "react";

const TIP_WIDTH = 288;
const MARGIN = 16;

/** A small "?" that shows a description on hover or focus, and toggles on tap. */
export function HelpTip({ text, label }: Readonly<{ text: string; label: string }>) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);

  const show = () => {
    // Keep the bubble inside the screen however far right the "?" ended up.
    const rect = root.current?.getBoundingClientRect();
    if (rect) {
      const width = Math.min(TIP_WIDTH, window.innerWidth - MARGIN * 2);
      const overflow = rect.left + width - (window.innerWidth - MARGIN);
      setShift(Math.max(MARGIN - rect.left, overflow > 0 ? -overflow : 0));
    }
    setOpen(true);
  };

  // Tapping anywhere else closes it (iOS Safari does not blur buttons on tap).
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <span
      ref={root}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : show())}
        onFocus={show}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-raised text-[12px] font-bold text-muted-foreground transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          style={{ left: shift, width: `min(${TIP_WIDTH}px, calc(100vw - ${MARGIN * 2}px))` }}
          className="absolute top-full z-30 mt-2 whitespace-pre-wrap rounded-xl bg-raised p-3 text-[13px] font-normal leading-relaxed text-ink shadow-lg ring-1 ring-border"
        >
          {text}
        </span>
      )}
    </span>
  );
}
