import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { resolveImage } from "@/data/images";
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function CategoriesShowcase({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="section-y bg-ivory" aria-labelledby="categories-title">
      <div className="container-x">
        <SectionHeading id="categories-title" kicker="Product categories" title="Explore Our Textile Categories." intro="Each category is matched to manufacturing partners with the right product focus, from knitwear and denim to bed linen and fabrics by the metre." />
        <div className="mt-20 space-y-24 lg:space-y-36">
          {categories.map((c, i) => {
            const img = resolveImage(c.image);
            const flip = i % 2 === 1;
            return (
              <article key={c.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8" aria-labelledby={`cat-${c.slug}`}>
                <Link
                  href={`/products/${c.slug}`}
                  aria-hidden="true"
                  tabIndex={-1}
                  className={cn("group relative block lg:col-span-7", flip && "lg:order-2 lg:col-start-6")}
                >
                  <div className="relative aspect-[16/11] overflow-hidden rounded-media bg-navy" data-mask>
                    <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 56vw, 92vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.05]" />
                    <span className="absolute inset-0 bg-navy-deep/0 transition-colors duration-700 group-hover:bg-navy-deep/10" />
                    <span className="absolute bottom-0 left-1/2 aspect-[2/1] w-[70%] -translate-x-1/2 translate-y-full rounded-t-full border border-b-0 border-gold-soft/70 transition-transform duration-[1.1s] ease-[var(--ease-silk)] group-hover:translate-y-[35%]" />
                  </div>
                </Link>
                <div className={cn("lg:col-span-4", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9")}>
                  <h3 id={`cat-${c.slug}`} className="font-serif-display text-h2 text-navy" data-reveal>
                    {c.title}
                  </h3>
                  <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted-strong" data-reveal data-delay="0.1">
                    {c.intro}
                  </p>
                  <ul className="mt-8 flex flex-wrap gap-2" data-reveal data-delay="0.15" aria-label={`${c.title} examples`}>
                    {c.productTypes.slice(0, 5).map((t) => (
                      <li key={t} className="rounded-pill border border-navy/15 px-3.5 py-1.5 text-sm text-navy">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10" data-reveal data-delay="0.2">
                    <LinkButton href={`/products/${c.slug}`} variant="outline-dark" aria-label={`Explore ${c.title}`}>
                      Explore {c.title}
                    </LinkButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
