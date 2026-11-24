"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowIcon, LinkButton } from "@/components/ui/Button";
import { images } from "@/data/images";
import { Fabric3DLayer } from "@/components/heroes/Fabric3DLayer";

const HEADLINE = "Your Bridge from Concept to Shipment.";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  // Entrance timeline + mouse parallax.
  useEffect(() => {
    const el = root.current;
    if (!el || !document.documentElement.classList.contains("motion-ok")) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero-arc]", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power3.inOut" })
        .fromTo("[data-hero-bg]", { scale: 1.12 }, { scale: 1, duration: 2.8, ease: "power2.out" }, 0);
    }, el);

    const fine = window.matchMedia("(pointer: fine)").matches;
    let cleanupMove: (() => void) | undefined;
    if (fine && bg.current) {
      const xTo = gsap.quickTo(bg.current, "x", { duration: 1.2, ease: "power3.out" });
      const yTo = gsap.quickTo(bg.current, "y", { duration: 1.2, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -24);
        yTo((e.clientY / window.innerHeight - 0.5) * -16);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanupMove = () => window.removeEventListener("pointermove", onMove);
    }
    return () => {
      ctx.revert();
      cleanupMove?.();
    };
  }, []);

  return (
    <section ref={root} data-hero className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-deep text-ivory lg:min-h-[max(92vh,44rem)]" aria-labelledby="hero-title">
      <div ref={bg} className="absolute -inset-8 -z-20">
        <div data-hero-bg className="absolute inset-0">
          <Image src={images.heroSilk.src} alt="" fill priority fetchPriority="high" sizes="100vw" quality={75} className="object-cover object-[60%_50%]" />
          <Fabric3DLayer palette="navySatin" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_60%,rgb(7_23_43/0.55),rgb(7_23_43/0.15)_60%,rgb(7_23_43/0.6))]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-transparent" />

      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
        <path data-hero-arc d="M-80 900 C 260 120, 1180 120, 1520 900" fill="none" stroke="var(--color-gold)" strokeOpacity="0.55" strokeWidth="1.1" pathLength={1} vectorEffect="non-scaling-stroke" />
        <path data-hero-arc d="M120 900 C 420 330, 1020 330, 1320 900" fill="none" stroke="var(--color-gold-soft)" strokeOpacity="0.2" strokeWidth="1" pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="container-x flex flex-1 flex-col justify-end pb-16 pt-[calc(var(--header-h)+3rem)] sm:pb-14 lg:justify-center lg:pb-12">
        <div className="max-w-5xl">
          <h1 id="hero-title" className="font-serif-display enter-words text-display text-ivory" style={{ "--d": "0.35s" } as React.CSSProperties}>
            {HEADLINE.split(" ").map((w, i, a) => (
              <Fragment key={i}>
                <span className="word">
                  <span className="word-inner" style={{ "--i": i } as React.CSSProperties}>
                    {w}
                  </span>
                </span>
                {i < a.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>
          <p className="enter mt-8 max-w-xl text-lead text-ivory/80" style={{ "--d": "0.7s" } as React.CSSProperties}>
            Connecting international buyers with textile sourcing solutions, trusted manufacturing partners and quality-driven execution.
          </p>
          <div className="enter mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" style={{ "--d": "0.85s" } as React.CSSProperties}>
            <LinkButton href="/request-a-quote" variant="gold" data-track="cta_click" data-track-label="Hero: Start Your Project">
              Start Your Project
            </LinkButton>
            <LinkButton href="/services" variant="outline-light" data-track="cta_click" data-track-label="Hero: Explore Our Expertise">
              Explore Our Expertise
            </LinkButton>
          </div>
        </div>
      </div>

      <nav aria-label="Product categories" className="enter container-x relative hidden pb-8 sm:block" style={{ "--d": "1.1s" } as React.CSSProperties}>
        <ul className="grid grid-cols-3 border-t border-line-dark">
          {[
            { href: "/products/garments-apparel", label: "Garments & Apparel", note: "Knitwear, wovens, denim" },
            { href: "/products/fabrics-materials", label: "Fabrics & Materials", note: "Woven and knitted fabrics" },
            { href: "/products/home-textiles", label: "Home Textiles", note: "Bed, bath, kitchen, table" },
          ].map((c) => (
            <li key={c.href} className="border-l border-line-dark px-6 first:border-l-0 first:pl-0 last:pr-0">
              <Link href={c.href} className="group flex items-center justify-between gap-4 py-5">
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-ivory">{c.label}</span>
                  <span className="mt-0.5 block text-sm text-ivory/60">{c.note}</span>
                </span>
                <ArrowIcon className="text-gold transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
