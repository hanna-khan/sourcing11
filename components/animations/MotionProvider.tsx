"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * One motion language for the whole site, driven by data attributes so server
 * components stay server components:
 *   data-reveal            fade + rise when scrolled into view (data-delay="0.1")
 *   data-split             word-by-word heading reveal (use <SplitWords>)
 *   data-draw              SVG stroke drawing (element must use pathLength="1")
 *   data-draw="scrub"      stroke drawing tied to scroll position
 *   data-parallax="0.15"   vertical parallax, factor of element height
 *   data-mask              image mask wipe + settle scale
 *   data-stagger           children with [data-stagger-item] reveal in sequence
 * Elements inside [data-hero] are left for the hero's own timeline.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.classList.remove("motion-ok");
      return;
    }
    root.classList.add("motion-ok", "motion-ready");

    const notHero = (el: Element) => !el.closest("[data-hero]");
    const ease = "expo.out";

    let ctx: gsap.Context | undefined;
    const setup = () => {
    ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(notHero).forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease,
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-split]").filter(notHero).forEach((el) => {
        gsap.to(el.querySelectorAll(".word-inner"), {
          y: 0,
          duration: 1.1,
          ease,
          stagger: 0.045,
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").filter(notHero).forEach((el) => {
        const items = el.querySelectorAll("[data-stagger-item]");
        gsap.fromTo(
          items,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1, ease, stagger: 0.09, scrollTrigger: { trigger: el, start: "top 85%", once: true } },
        );
      });

      gsap.utils.toArray<SVGGeometryElement>("[data-draw]").filter(notHero).forEach((el) => {
        const scrub = el.getAttribute("data-draw") === "scrub";
        gsap.fromTo(
          el,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: scrub
              ? { trigger: el.closest("section") ?? el, start: "top 75%", end: "bottom 60%", scrub: 0.6 }
              : { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").filter(notHero).forEach((el) => {
        const f = Number(el.dataset.parallax || 0.12);
        gsap.fromTo(
          el,
          { yPercent: -f * 50 },
          {
            yPercent: f * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mask]").filter(notHero).forEach((el) => {
        const media = el.querySelector("img, video, canvas");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
        if (media) tl.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 1.8, ease }, 0);
      });
    });

    };

    // Scroll effects only affect content below the fold, so build them once the
    // main thread is idle instead of competing with the first paint.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const idleId = w.requestIdleCallback ? w.requestIdleCallback(setup, { timeout: 1200 }) : window.setTimeout(setup, 200);

    // Fonts and images can shift layout after first paint.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      window.removeEventListener("load", refresh);
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
