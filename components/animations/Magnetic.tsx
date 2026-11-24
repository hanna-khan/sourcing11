"use client";

import { useRef, type ReactNode } from "react";

/** Magnetic-style hover: the child drifts a few pixels toward the pointer. Fine pointers only. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (document.documentElement.classList.contains("motion-ok") === false) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${Math.max(-10, Math.min(10, x))}px, ${Math.max(-8, Math.min(8, y))}px, 0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ display: "inline-flex", transition: "transform 0.5s var(--ease-silk)" }}
    >
      {children}
    </span>
  );
}
