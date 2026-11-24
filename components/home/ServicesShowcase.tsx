import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ArrowIcon, TextLink } from "@/components/ui/Button";
import { resolveImage } from "@/data/images";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function ServicesShowcase({ services }: { services: Service[] }) {
  return (
    <section className="section-y bg-white" aria-labelledby="services-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="services-title" kicker="Services" title="One Sourcing Partner. Every Step Connected." intro="Six connected services that carry a product from the first brief to the final shipment — use one, or let us run the whole journey." />
          <div data-reveal>
            <TextLink href="/services">View all services</TextLink>
          </div>
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3" data-stagger>
          {services.map((s, i) => (
            <li key={s.slug} data-stagger-item>
              <div className={cn(i % 3 === 1 && "lg:translate-y-20", i % 3 === 2 && "lg:translate-y-8")}>
                <ServiceCard service={s} />
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden h-20 lg:block" />
      </div>
    </section>
  );
}

export function ServiceCard({ service: s }: { service: Service }) {
  const img = resolveImage(s.image);
  return (
    <Link href={`/services/${s.slug}`} className="group relative block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-navy">
        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.07]" />
        <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
        <svg aria-hidden="true" viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute inset-x-6 top-6 h-10 w-[calc(100%-3rem)] text-gold">
          <path d="M2 58 C 40 2, 160 2, 198 58" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1.2s] ease-[var(--ease-silk)] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]" />
        </svg>
        <div className="absolute inset-x-6 bottom-6 text-ivory">
          <h3 className="font-serif-display text-[2rem] leading-tight">{s.cardTitle}</h3>
          <p className="mt-3 max-h-0 overflow-hidden text-[0.9375rem] leading-relaxed text-ivory/80 opacity-0 transition-all duration-700 ease-[var(--ease-silk)] group-hover:max-h-32 group-hover:opacity-100 group-focus-visible:max-h-32 group-focus-visible:opacity-100 [@media(hover:none)]:max-h-32 [@media(hover:none)]:opacity-100">
            {s.excerpt}
          </p>
          <span className="mt-5 flex items-center gap-3 text-sm font-semibold text-gold-soft">
            Explore
            <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
