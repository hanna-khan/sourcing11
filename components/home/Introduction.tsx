import Image from "next/image";
import { SplitWords } from "@/components/animations/SplitWords";
import { TextLink } from "@/components/ui/Button";
import { images } from "@/data/images";

export function Introduction() {
  return (
    <section id="introduction" className="section-y relative overflow-hidden bg-ivory" aria-labelledby="intro-title">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pr-10">
          <p className="kicker" data-reveal>
            About Sourcing Eleven
          </p>
          <SplitWords as="h2" id="intro-title" text="Bringing Ideas to Life Through Smarter Textile Sourcing." className="font-serif-display mt-6 text-h2 text-navy" />
          <div className="mt-10 max-w-xl space-y-6 text-[1.125rem] leading-[1.8] text-ink" data-reveal data-delay="0.15">
            <p>
              Sourcing Eleven is a textile buying and sourcing agency based in Pakistan. We work for international brands, retailers, wholesalers and importers who want to make garments, fabrics or home textiles with the right manufacturing partner — and want someone on the ground to keep every step connected.
            </p>
            <p className="text-muted-strong">
              We don&apos;t own factories. That independence lets us recommend the partner that fits your product, then coordinate development, sampling, production, quality checks and shipment on your behalf.
            </p>
          </div>
          <figure className="mt-12 max-w-lg border-l border-gold pl-6" data-reveal data-delay="0.25">
            <blockquote className="font-serif-display text-[1.75rem] leading-snug text-navy">
              The bridge in our logo is the job: connecting what you have in mind with the people best placed to make it.
            </blockquote>
          </figure>
          <div className="mt-10" data-reveal data-delay="0.3">
            <TextLink href="/about">Discover more about us</TextLink>
          </div>
        </div>

        <div className="relative lg:col-span-6 lg:pl-6">
          <div className="relative ml-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-[999px] bg-navy" data-mask>
            <Image src={images.linenIvory.src} alt={images.linenIvory.alt} fill sizes="(min-width: 1024px) 42vw, 86vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-10 left-0 w-[46%] overflow-hidden rounded-media border-[6px] border-ivory shadow-lift sm:-bottom-14" data-parallax="0.35">
            <div className="relative aspect-[4/3]">
              <Image src={images.swatchFan.src} alt={images.swatchFan.alt} fill sizes="(min-width: 1024px) 20vw, 44vw" className="object-cover" />
            </div>
          </div>
          <svg aria-hidden="true" viewBox="0 0 400 200" className="absolute -top-10 left-[10%] w-[60%] text-gold">
            <path d="M10 190 C 80 10, 320 10, 390 190" fill="none" stroke="currentColor" strokeWidth="1" pathLength={1} data-draw />
          </svg>
        </div>
      </div>
    </section>
  );
}
