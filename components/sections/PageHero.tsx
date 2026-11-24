import type { CSSProperties, ReactNode } from "react";
import { SplitWords } from "@/components/animations/SplitWords";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { HeroVisualView, wideVisuals, type HeroVisual } from "@/components/heroes/HeroVisuals";
import { cn } from "@/lib/utils/cn";

/**
 * Navy inner-page hero: breadcrumbs, H1 with word reveal, intro, actions and a
 * page-specific visual (see components/heroes). Layered background: a soft
 * gold glow and two bridge arcs drawn on load.
 */
export function PageHero({
  title,
  intro,
  kicker,
  crumbs,
  image,
  imageAlt,
  visual,
  children,
  compact,
}: {
  title: string;
  intro?: string;
  kicker?: string;
  crumbs: Crumb[];
  /** Shorthand for an arch visual */
  image?: string;
  imageAlt?: string;
  visual?: HeroVisual;
  children?: ReactNode;
  compact?: boolean;
}) {
  const vis: HeroVisual | undefined = visual ?? (image ? { type: "arch", image, alt: imageAlt } : undefined);
  const wide = vis ? wideVisuals.includes(vis.type) : false;
  const d = (s: string) => ({ "--d": s }) as CSSProperties;

  return (
    <section className="on-dark grain relative isolate overflow-hidden bg-navy text-ivory">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[30%] h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(199_163_101/0.16),transparent)]" />
        <div className="absolute -bottom-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(7_23_43/0.9),transparent)]" />
        <svg viewBox="0 0 1440 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M-60 640 C 300 40, 1140 40, 1500 640" fill="none" stroke="var(--color-gold)" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} className="hero-draw" style={d("0.1s")} />
          <path d="M240 640 C 520 260, 920 260, 1200 640" fill="none" stroke="var(--color-gold-soft)" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} className="hero-draw" style={d("0.5s")} />
        </svg>
      </div>

      <div
        className={cn(
          "container-x grid gap-12 pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24",
          !wide && vis && "items-center lg:grid-cols-12",
          compact ? "lg:pt-[calc(var(--header-h)+4rem)]" : "lg:pt-[calc(var(--header-h)+5rem)]",
        )}
      >
        {wide ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Breadcrumbs items={crumbs} />
              {kicker && <p className="kicker enter mt-10">{kicker}</p>}
              <SplitWords as="h1" entrance delay={0.1} text={title} className="font-serif-display mt-6 text-h1 text-ivory" />
            </div>
            <div className="lg:col-span-5">
              {intro && (
                <p className="enter text-lead text-ivory/80" style={d("0.25s")}>
                  {intro}
                </p>
              )}
              {children && (
                <div className="enter mt-8 flex flex-wrap gap-4" style={d("0.35s")}>
                  {children}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={cn(vis ? "lg:col-span-6 xl:col-span-7" : "lg:max-w-4xl")}>
            <Breadcrumbs items={crumbs} />
            {kicker && <p className="kicker enter mt-10">{kicker}</p>}
            <SplitWords as="h1" entrance delay={0.1} text={title} className="font-serif-display mt-6 text-h1 text-ivory" />
            {intro && (
              <p className="enter mt-8 max-w-2xl text-lead text-ivory/80" style={d("0.25s")}>
                {intro}
              </p>
            )}
            {children && (
              <div className="enter mt-10 flex flex-wrap gap-4" style={d("0.35s")}>
                {children}
              </div>
            )}
          </div>
        )}
        {vis && (
          <div className={cn(wide ? "w-full" : "lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8 lg:py-6")}>
            <HeroVisualView visual={vis} />
          </div>
        )}
      </div>
    </section>
  );
}
