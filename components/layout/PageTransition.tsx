"use client";

import { m, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";


/**
 * Soft entrance on client-side navigation. The first server-rendered page is
 * never hidden, so LCP and no-JS rendering are unaffected.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // Skip the entrance on the very first (server-rendered) page only.
  const [first] = useState(() => {
    if (typeof window === "undefined") return true;
    const w = window as Window & { __s11Navigated?: boolean };
    const isFirst = !w.__s11Navigated;
    w.__s11Navigated = true;
    return isFirst;
  });
  const skip = first || reduce;
  return (
    <m.div initial={skip ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </m.div>
  );
}
