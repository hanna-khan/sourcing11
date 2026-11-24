import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { SplitWords } from "@/components/animations/SplitWords";
import { JsonLd } from "@/components/seo/JsonLd";
import { TextLink } from "@/components/ui/Button";
import { images } from "@/data/images";
import { getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils/cn";

export const revalidate = 3600;

const TITLE = "About Us — Textile Buying House in Pakistan";
const DESCRIPTION =
  "Sourcing Eleven is a textile buying and sourcing agency in Pakistan. Learn how we work, what we believe and why international buyers use us to connect with manufacturing partners.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/about" });
}

const philosophy = [
  { title: "Clarity before speed", body: "A complete brief and a clear approval record save more time than any shortcut. We slow down at the start so the rest of the project can move quickly." },
  { title: "Honest reporting", body: "We tell you what we see — including delays and quality issues — with the facts, the options and our recommendation." },
  { title: "Fit over volume", body: "Because we don't own factories, we can recommend the partner that suits your product rather than the one with spare capacity." },
];

const approach = [
  { title: "We start from your product", body: "Specifications, quantities, price position and timelines determine which partners we approach — not a fixed supplier list." },
  { title: "We keep one written record", body: "Briefs, comments, approvals and decisions are documented, so production always works to the latest agreed standard." },
  { title: "We stay close to the work", body: "Being based in Pakistan means we can follow samples and production in person and resolve questions in the factory's working hours." },
  { title: "We hand over cleanly", body: "From inspection to shipment, each step is coordinated so that goods leave complete, checked and properly documented." },
];

const reasons = [
  "A single point of contact for the whole sourcing journey",
  "Independent recommendations — we do not own manufacturing facilities",
  "Structured briefs that produce comparable quotations",
  "Development and production tracked against your approved sample",
  "Inspection coordination with your nominated QA partners",
  "Clear, regular updates in plain international business English",
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/about", title: TITLE, description: DESCRIPTION, type: "AboutPage" })} />
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        kicker="About Sourcing Eleven"
        title="A bridge between international buyers and the right manufacturing partners."
        intro="We are a textile buying and sourcing agency in Pakistan, coordinating garments, fabrics and home textiles for brands, retailers, wholesalers and importers."
        visual={{ type: "bridge", images: ["champagneSilk", "warp"] }}
      />

      <section className="section-y bg-white" aria-labelledby="who-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="who-title" kicker="Who we are" title="An agency, not a factory." />
          </div>
          <div className="space-y-6 text-[1.125rem] leading-[1.8] lg:col-span-6 lg:col-start-7" data-reveal>
            <p>
              Sourcing Eleven works on behalf of international buyers. We identify manufacturing partners suited to each product, brief them properly, and coordinate development, production, quality checks and shipment — so our clients have a dependable presence in Pakistan without building their own sourcing office.
            </p>
            <p className="text-muted-strong">
              We focus on three categories: garments and apparel, fabrics and materials, and home textiles. Within them, our job is to understand what you are making, find the partners best placed to make it, and keep every step connected until the goods are on their way to you.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y relative overflow-hidden bg-ivory" aria-labelledby="story-title">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px]" data-mask>
              <Image src={images.warp.src} alt={images.warp.alt} fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="kicker" data-reveal>
              Our story
            </p>
            <SplitWords as="h2" id="story-title" text="Named for the bridge between concept and shipment." className="font-serif-display mt-5 text-h2 text-navy" />
            <div className="mt-8 space-y-6 text-[1.0625rem] leading-[1.8] text-ink" data-reveal>
              <p>
                Sourcing Eleven was set up to make sourcing from Pakistan simpler for international buyers. The textile industry here runs from fibre to finished product, and that depth creates real opportunity — but finding the right partner for a specific product, and keeping a project on track from another time zone, takes local knowledge and steady follow-up.
              </p>
              <p>
                Our logo — a single golden arc above the name — describes the work: a bridge from the buyer&apos;s idea to the finished, shipped product, built one careful step at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark section-y bg-navy text-ivory" aria-labelledby="vm-title">
        <div className="container-x">
          <h2 id="vm-title" className="sr-only">
            Vision and mission
          </h2>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
            {[
              { label: "Our vision", text: "To be the sourcing partner international buyers trust to connect their ideas with Pakistan's textile manufacturers — clearly, honestly and reliably." },
              { label: "Our mission", text: "To coordinate every step from concept to shipment with care for detail, so our buyers receive the right product, at the agreed standard, on time." },
            ].map((b, i) => (
              <div key={b.label} className={cn("border-t border-gold/40 pt-10", i === 1 && "lg:mt-24")} data-reveal data-delay={String(i * 0.15)}>
                <p className="kicker">{b.label}</p>
                <p className="font-serif-display mt-6 text-[clamp(1.75rem,1.4rem+1.4vw,2.75rem)] leading-[1.2] text-ivory">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white" aria-labelledby="philosophy-title">
        <div className="container-x">
          <SectionHeading id="philosophy-title" kicker="Business philosophy" title="What we hold ourselves to." />
          <div className="mt-16 grid gap-12 md:grid-cols-3" data-stagger>
            {philosophy.map((p) => (
              <div key={p.title} data-stagger-item>
                <svg viewBox="0 0 80 30" aria-hidden="true" className="h-6 w-16 text-gold">
                  <path d="M2 28 C 18 2, 62 2, 78 28" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <h3 className="mt-6 text-h3 font-semibold text-navy">{p.title}</h3>
                <p className="mt-3 text-muted-strong">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="approach-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <SectionHeading id="approach-title" kicker="Our sourcing approach" title="How we work with every buyer." />
              <div className="mt-8" data-reveal>
                <TextLink href="/our-process">See the six-stage process</TextLink>
              </div>
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {approach.map((a, i) => (
              <li key={a.title} className="grid grid-cols-[3.5rem_1fr] border-t border-line py-9" data-reveal>
                <span className="font-serif-display text-[2rem] leading-none text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.25rem] font-semibold text-navy">{a.title}</h3>
                  <p className="mt-2 text-muted-strong">{a.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {settings.team.length > 0 && (
        <section className="section-y bg-white" aria-labelledby="team-title">
          <div className="container-x">
            <SectionHeading id="team-title" kicker="Team" title="The people coordinating your orders." />
            <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {settings.team.map((m) => (
                <li key={m.title} className="border-t border-gold pt-6">
                  <p className="text-[1.25rem] font-semibold text-navy">{m.title}</p>
                  <p className="mt-1 text-muted-strong">{m.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section-y bg-white" aria-labelledby="why-work-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="why-work-title" kicker="Why work with us" title="What buyers get from working with Sourcing Eleven." />
          </div>
          <ul className="lg:col-span-6 lg:col-start-7" data-stagger>
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-4 border-b border-line py-5 text-[1.0625rem] text-navy" data-stagger-item>
                <span aria-hidden="true" className="mt-3 h-px w-6 flex-none bg-gold" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
