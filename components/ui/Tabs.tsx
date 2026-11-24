"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Accessible tabs (roving tabindex, arrow-key navigation) with a sliding gold indicator. */
export function Tabs({ tabs, className }: { tabs: { label: string; content: ReactNode }[]; className?: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-orientation="horizontal" className="flex gap-2 overflow-x-auto border-b border-line [scrollbar-width:none]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-t-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-p-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn("relative min-h-12 whitespace-nowrap px-4 py-3 text-[0.9375rem] font-semibold transition-colors", active === i ? "text-navy" : "text-muted-strong hover:text-navy")}
          >
            {t.label}
            <span aria-hidden="true" className={cn("absolute inset-x-3 -bottom-px h-[2px] origin-left bg-gold transition-transform duration-500 ease-[var(--ease-silk)]", active === i ? "scale-x-100" : "scale-x-0")} />
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`${id}-p-${i}`} aria-labelledby={`${id}-t-${i}`} hidden={active !== i} tabIndex={0} className="pt-10 outline-none">
          {t.content}
        </div>
      ))}
    </div>
  );
}
