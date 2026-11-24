"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { resolveImage } from "@/data/images";
import { cn } from "@/lib/utils/cn";

/** Image grid that opens an accessible lightbox (arrow keys, Escape, focus return). */
export function LightboxGallery({ images: keys, label }: { images: string[]; label: string }) {
  const items = keys.map((k) => resolveImage(k));
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen((cur) => {
      if (cur !== null) window.setTimeout(() => triggers.current[cur]?.focus(), 0);
      return null;
    });
  }, []);
  const go = useCallback((d: number) => setOpen((cur) => (cur === null ? cur : (cur + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        const btns = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        if (!btns.length) return;
        e.preventDefault();
        const idx = btns.indexOf(document.activeElement as HTMLButtonElement);
        btns[(idx + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6" aria-label={label}>
        {items.map((img, i) => (
          <li key={img.src + i} className={cn(i === 0 && "col-span-2 row-span-2")}>
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-media bg-ivory"
            >
              <Image src={img.src} alt={img.alt} fill sizes={i === 0 ? "(min-width: 768px) 46vw, 92vw" : "(min-width: 768px) 22vw, 46vw"} className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-[1.06]" />
              <span className="absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="rounded-pill bg-navy-deep/80 px-3 py-1.5 text-xs font-semibold text-ivory">View larger</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <m.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`${label}: image ${open + 1} of ${items.length}`}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/95 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <m.figure
              key={open}
              className="relative w-full max-w-5xl"
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-media">
                <Image src={items[open].src} alt={items[open].alt} fill sizes="90vw" className="object-cover" />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-ivory/80">
                <span>{items[open].alt}</span>
                <span className="flex-none text-gold-soft">
                  {open + 1} / {items.length}
                </span>
              </figcaption>
            </m.figure>
            <div className="absolute right-4 top-4 flex gap-2 sm:right-8 sm:top-8">
              {items.length > 1 && (
                <>
                  <LightboxButton label="Previous image" onClick={() => go(-1)} d="M15 5l-7 7 7 7" />
                  <LightboxButton label="Next image" onClick={() => go(1)} d="M9 5l7 7-7 7" />
                </>
              )}
              <LightboxButton ref={closeBtn} label="Close gallery" onClick={close} d="M5 5l14 14M19 5L5 19" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LightboxButton({ label, onClick, d, ref }: { label: string; onClick: () => void; d: string; ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <button ref={ref} type="button" onClick={onClick} className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-ivory transition-colors hover:border-gold hover:bg-white/5">
      <span className="sr-only">{label}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
