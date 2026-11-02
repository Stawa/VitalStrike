import { useEffect, useState } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { FaBars, FaTimes } from "react-icons/fa";
import DocsSidebar from "~/components/DocsSidebar";
import DocsOutline from "~/components/DocsOutline";

export default function DocsLayout() {
  const { pathname } = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen]);

  return (
    <div className="page-x flex w-full flex-1 gap-10">
      <button
        type="button"
        onClick={() => setIsDrawerOpen((open) => !open)}
        className="fixed bottom-4 left-4 z-[60] inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-ground transition-opacity hover:opacity-90 lg:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        aria-label={isDrawerOpen ? "Close docs menu" : "Open docs menu"}
        aria-expanded={isDrawerOpen}
        aria-controls="docs-drawer"
      >
        {isDrawerOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        <span>Menu</span>
      </button>

      <div
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 lg:hidden ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="docs-drawer"
        className={`fixed inset-y-0 left-0 z-[58] w-[min(20rem,85vw)] transform bg-ground px-4 transition-[transform,visibility] duration-300 ease-in-out lg:sticky lg:top-navbar lg:z-20 lg:h-[calc(100vh-var(--navbar-height))] lg:w-64 lg:shrink-0 lg:translate-x-0 lg:bg-transparent lg:px-0 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full max-lg:invisible"
        }`}
      >
        <DocsSidebar />
      </aside>

      <div className="min-w-0 flex-1 pb-24 pt-6 lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-3xl 2xl:max-w-4xl">
          <Outlet />
        </div>
      </div>

      <aside className="hidden w-60 shrink-0 xl:block">
        <DocsOutline />
      </aside>
    </div>
  );
}
