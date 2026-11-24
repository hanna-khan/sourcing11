"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowIcon } from "@/components/ui/Button";
import { journey } from "@/data/journey";
import { images } from "@/data/images";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sticky storytelling on desktop: the image column stays pinned while the
 * stages scroll past; a gold progress line fills and the active stage swaps
 * the image. On mobile and with reduced motion it becomes a vertical timeline.
 */
export function Journey({ detailed = false, headingLevel = "h2" }: { detailed?: boolean; headingLevel?: "h2" | "h3" }) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const StageHeading = headingLevel === "h2" ? "h3" : "h4";

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-stage]", el);
      panels.forEach((p, i) => {
        ScrollTrigger.create({
          trigger: p,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      if (progress.current) {
        gsap.fromTo(progress.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.querySelector("[data-stages]"), start: "top 55%", end: "bottom 55%", scrub: true } });
      }
    });
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-stage]", el).forEach((p) => {
        gsap.fromTo(p, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 85%", once: true } });
      });
      if (progress.current) {
        gsap.fromTo(progress.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.querySelector("[data-stages]"), start: "top 70%", end: "bottom 70%", scrub: true } });
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      {/* Sticky media column (desktop) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2.5rem)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-navy">
            {journey.map((s, i) => (
              <Image
                key={s.number}
                src={images[s.image].src}
                alt={i === active ? images[s.image].alt : ""}
                fill
                sizes="38vw"
                className={cn("object-cover transition-[opacity,transform] duration-[1.2s] ease-[var(--ease-silk)]", i === active ? "scale-100 opacity-100" : "scale-110 opacity-0")}
              />
            ))}
            <span className="absolute inset-0 rounded-t-[999px] ring-1 ring-inset ring-gold/30" />
            <div className="absolute inset-x-8 bottom-8 flex items-end justify-between text-ivory">
              <span className="font-serif-display text-[5rem] leading-none text-gold-soft" aria-hidden="true">
                {journey[active].number}
              </span>
              <span className="mb-3 text-sm text-ivory/80" aria-live="polite">
                Stage {active + 1} of {journey.length}: {journey[active].title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stages */}
      <ol data-stages className="relative lg:col-span-6 lg:col-start-7">
        <span aria-hidden="true" className="absolute bottom-6 left-[1.1875rem] top-6 w-px bg-line [.on-dark_&]:bg-line-dark" />
        <span ref={progress} aria-hidden="true" className="absolute bottom-6 left-[1.1875rem] top-6 w-px origin-top bg-gold" />
        {journey.map((s, i) => (
          <li key={s.number} data-stage className={cn("relative pl-16 lg:flex lg:min-h-[54vh] lg:items-center", i === 0 ? "pb-14 lg:pb-0" : "py-14 lg:py-0")}>
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-14 flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-500 lg:top-1/2 lg:-translate-y-1/2",
                i === 0 && "top-0",
                i <= active ? "border-gold bg-gold text-navy-deep" : "border-gold/50 bg-white text-gold-ink [.on-dark_&]:bg-navy [.on-dark_&]:text-gold-soft",
              )}
            >
              {s.number}
            </span>
            <div data-stage-text>
              <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-media lg:hidden">
                <Image src={images[s.image].src} alt={images[s.image].alt} fill sizes="92vw" className="object-cover" />
              </div>
              <StageHeading
                className={cn(
                  "font-serif-display text-[2.75rem] leading-none transition-colors duration-500",
                  i === active ? "text-gold-ink [.on-dark_&]:text-gold-soft" : "text-navy [.on-dark_&]:text-ivory",
                )}
              >
                {s.title}
              </StageHeading>
              <p className="mt-5 max-w-lg text-[1.125rem] leading-relaxed text-ink [.on-dark_&]:text-ivory/85">{detailed ? s.detail : s.summary}</p>
              {detailed && (
                <ul className="mt-6 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[0.9375rem] text-muted-strong [.on-dark_&]:text-ivory/70">
                      <span aria-hidden="true" className="h-px w-5 bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
              {s.service && (
                <Link href={`/services/${s.service}`} className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold text-gold-ink [.on-dark_&]:text-gold-soft">
                  <span className="link-arc">
                    How we handle this<span className="sr-only">: {s.service.replace(/-/g, " ")}</span>
                  </span>
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
