"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resolveImage } from "@/data/images";

gsap.registerPlugin(ScrollTrigger);

export type GalleryItem = { title: string; body: string; meta?: string; image: string };

/**
 * Desktop: the section pins and vertical scroll drives the track sideways.
 * Touch / small screens / reduced motion: a native, swipeable scroll-snap row.
 */
export function HorizontalGallery({ items, title, intro, labelledBy }: { items: GalleryItem[]; title: string; intro?: string; labelledBy: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const t = track.current;
      const s = section.current;
      if (!t || !s) return;
      const distance = () => Math.max(0, t.scrollWidth - t.clientWidth);
      if (distance() < 40) return;
      gsap.set(t, { overflow: "visible" });
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: s, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(t, { clearProps: "all" });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-white py-[var(--section-y)] lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-16" aria-labelledby={labelledBy}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="kicker">Product types</p>
            <h2 id={labelledBy} className="font-serif-display mt-5 text-h2 text-navy">
              {title}
            </h2>
            {intro && <p className="mt-5 text-lead text-muted-strong">{intro}</p>}
          </div>
          <p className="text-sm text-muted-strong">
            <span className="hidden lg:inline">Scroll to move through the range</span>
            <span className="lg:hidden">Swipe to see more</span>
          </p>
        </div>
      </div>
      <ul
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:thin] lg:mt-14 lg:gap-8"
        tabIndex={0}
        aria-label={`${title} — scrollable list`}
      >
        {items.map((it) => {
          const img = resolveImage(it.image);
          return (
            <li key={it.title} className="group w-[78vw] flex-none snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[26rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-ivory">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, 78vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.06]" />
              </div>
              <h3 className="mt-6 text-[1.375rem] font-semibold text-navy">{it.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-strong">{it.body}</p>
              {it.meta && <p className="mt-3 text-sm text-gold-ink">{it.meta}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
