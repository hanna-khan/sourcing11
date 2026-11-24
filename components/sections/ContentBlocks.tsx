import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";
import { resolveImage } from "@/data/images";
import type { Pair } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

/** A genuine sequence, so it is numbered. A gold arc links each step to the next. */
export function ProcessSteps({ title, intro, steps, className }: { title: string; intro?: string; steps: Pair[]; className?: string }) {
  return (
    <section className={cn("section-y bg-ivory", className)}>
      <div className="container-x">
        <SectionHeading kicker="How it works" title={title} intro={intro} />
        <ol className={cn("mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20", steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")} data-stagger>
          {steps.map((s, i) => (
            <li key={s.title} className="relative" data-stagger-item>
              <div className="flex items-center gap-4">
                <span className="font-serif-display text-[2.75rem] leading-none text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                {i < steps.length - 1 && (
                  <svg viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true" className="hidden h-6 flex-1 text-gold lg:block">
                    <path d="M2 28 C 50 -6, 150 -6, 198 28" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </div>
              <h3 className="mt-6 text-h3 font-semibold text-navy">{s.title}</h3>
              <p className="mt-3 text-muted-strong">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function BenefitList({ title, intro, items, kicker = "What you gain" }: { title: string; intro?: string; items: Pair[]; kicker?: string }) {
  return (
    <section className="section-y bg-white">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <SectionHeading kicker={kicker} title={title} intro={intro} />
          </div>
        </div>
        <dl className="lg:col-span-6 lg:col-start-7" data-stagger>
          {items.map((b) => (
            <div key={b.title} className="border-t border-line py-9 first:border-t-0 first:pt-0 lg:first:pt-2" data-stagger-item>
              <dt className="font-serif-display text-[1.875rem] leading-tight text-navy">{b.title}</dt>
              <dd className="mt-3 max-w-lg text-muted-strong">{b.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export type RelatedItem = { title: string; href: string; excerpt: string; image: string };

export function RelatedCards({ title, items, kicker = "Related" }: { title: string; items: RelatedItem[]; kicker?: string }) {
  if (!items.length) return null;
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <SectionHeading kicker={kicker} title={title} />
        <ul className="mt-14 grid gap-8 md:grid-cols-3" data-stagger>
          {items.map((r) => (
            <li key={r.href} data-stagger-item>
              <ImageCard {...r} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ImageCard({ title, href, excerpt, image, aspect = "aspect-[4/3]", headingLevel = "h3" }: RelatedItem & { aspect?: string; headingLevel?: "h2" | "h3" }) {
  const img = resolveImage(image);
  const H = headingLevel;
  return (
    <Link href={href} className="group block">
      <div className={cn("relative overflow-hidden rounded-media bg-ivory", aspect)}>
        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.06]" />
      </div>
      <div className="mt-6 flex items-start justify-between gap-6 border-b border-line pb-6">
        <div>
          <H className="text-[1.375rem] font-semibold leading-snug text-navy">{title}</H>
          <p className="mt-2 text-[0.9375rem] text-muted-strong">{excerpt}</p>
        </div>
        <ArrowIcon className="mt-2 text-gold-ink transition-transform duration-500 group-hover:translate-x-1.5" />
      </div>
      <span className="-mt-px block h-px w-0 bg-gold transition-[width] duration-700 ease-[var(--ease-silk)] group-hover:w-full" />
    </Link>
  );
}
