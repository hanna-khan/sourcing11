"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/** Thin gold reading-progress line + back-to-top button. */
export function ScrollChrome() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setShowTop(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-gold" />
      </div>
      <button
        type="button"
        onClick={toTop}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={cn(
          "group fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-navy-deep/90 text-gold shadow-lift backdrop-blur transition-all duration-500 ease-[var(--ease-silk)] sm:bottom-8 sm:right-8",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <span className="sr-only">Back to top</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M5 14 C 8 7, 16 7, 19 14" strokeLinecap="round" />
          <path d="M12 9v11" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
}
