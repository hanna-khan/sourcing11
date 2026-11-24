"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a figure when scrolled into view. Only used for statistics an
 * administrator has entered as verified in /admin/settings. Non-numeric parts
 * ("+", "%", "k") are preserved.
 */
export function Counter({ value }: { value: string }) {
  const match = /^([^\d]*)([\d,.]+)(.*)$/.exec(value);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / 1600);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(`${match![1]}${(target * eased).toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${match![3]}`);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
