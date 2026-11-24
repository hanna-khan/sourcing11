import Image from "next/image";
import { LinkButton, TextLink } from "@/components/ui/Button";
import { SplitWords } from "@/components/animations/SplitWords";
import { images } from "@/data/images";

export function CtaBand({
  title = "Have a Product in Mind? Let's Bring It to Life.",
  intro = "Share what you are making, the quantities you are planning and when you need it. We will come back with how we would approach it.",
  primary = { label: "Request a Quote", href: "/request-a-quote" },
  secondary = { label: "Contact us", href: "/contact" },
}: {
  title?: string;
  intro?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-deep text-ivory" aria-labelledby="cta-title">
      <div className="absolute inset-x-0 -inset-y-[15%] -z-10 opacity-45" data-parallax="0.2">
        <Image src={images.navyTwill.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/40" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy-deep to-transparent" />
      <svg aria-hidden="true" viewBox="0 0 1200 400" className="pointer-events-none absolute -right-40 top-1/2 -z-10 hidden h-[34rem] w-auto -translate-y-1/2 md:block">
        <path d="M60 380 C 260 -100, 940 -100, 1140 380" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" pathLength={1} data-draw="scrub" />
      </svg>
      <div className="container-x section-y">
        <div className="max-w-3xl">
          <SplitWords as="h2" id="cta-title" text={title} className="font-serif-display text-h2 text-ivory" />
          <p className="mt-8 max-w-xl text-lead text-ivory/75" data-reveal data-delay="0.2">
            {intro}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4" data-reveal data-delay="0.3">
            <LinkButton href={primary.href} variant="gold">
              {primary.label}
            </LinkButton>
            <TextLink href={secondary.href} tone="light">
              {secondary.label}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
