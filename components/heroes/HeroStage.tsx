"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenIdleAfterLoad } from "@/lib/utils/webgl";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps a hero visual. Children marked data-depth="0.2…1" drift with the
 * pointer (fine pointers only) and separate in depth as the hero scrolls away.
 * No animation loop: pointer motion uses quickTo tweens, scroll uses scrub.
 */
export function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: gsap.Context | undefined;
    let removePointer: (() => void) | undefined;

    const cancel = whenIdleAfterLoad(() => {
      const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
      if (!layers.length) return;
      ctx = gsap.context(() => {
        const hero = el.closest("section") ?? el;
        layers.forEach((layer) => {
          const d = Number(layer.dataset.depth || 0.3);
          gsap.to(layer, { yPercent: d * 18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
        });
      }, el);

      if (window.matchMedia("(pointer: fine)").matches) {
        const movers = layers.map((layer) => {
          const d = Number(layer.dataset.depth || 0.3);
          return {
            d,
            x: gsap.quickTo(layer, "x", { duration: 1.1, ease: "power3.out" }),
            y: gsap.quickTo(layer, "y", { duration: 1.1, ease: "power3.out" }),
          };
        });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const m of movers) {
            m.x(nx * 36 * m.d);
            m.y(ny * 24 * m.d);
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        removePointer = () => window.removeEventListener("pointermove", onMove);
      }
    });

    return () => {
      cancel();
      removePointer?.();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  );
}
