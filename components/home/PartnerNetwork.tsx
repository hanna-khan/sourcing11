import Link from "next/link";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ArrowIcon } from "@/components/ui/Button";

const capabilities = [
  { title: "Supplier identification", body: "Shortlisting partners whose current production matches your product, quality level and order size." },
  { title: "Partner coordination", body: "Structured briefs, clarifications and follow-up with each manufacturing partner, in your interest." },
  { title: "Product categories", body: "Garments and apparel, fabrics and materials, and home textiles — each with partners suited to them." },
  { title: "Production follow-up", body: "Progress, quality and timelines tracked from fabric in-house to packed cartons." },
  { title: "Sourcing capabilities", body: "Fabric and trims sourcing, sampling, merchandising, inspection and shipment coordination." },
];

const nodes = [
  { label: "Your brand", sub: "Product, quantities, standards" },
  { label: "Sourcing Eleven", sub: "Brief, coordination, follow-up" },
  { label: "Manufacturing partners", sub: "Independent, matched to the product" },
];

export function PartnerNetwork() {
  return (
    <section className="on-dark section-y relative overflow-hidden bg-navy text-ivory" aria-labelledby="network-title">
      <div className="container-x">
        <SectionHeading
          id="network-title"
          kicker="Manufacturing partner network"
          title="The right partner for each product — coordinated by one team."
          intro="We work with independent garment, fabric and home textile manufacturers in Pakistan. Sourcing Eleven does not own factories: we identify the partner that fits your product and coordinate the work between you."
        />

        {/* Bridge diagram */}
        <div className="relative mt-20" aria-hidden="true">
          <svg viewBox="0 0 1200 220" className="hidden w-full md:block" preserveAspectRatio="none">
            <path d="M200 150 C 300 20, 500 20, 600 150" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" pathLength={1} data-draw />
            <path d="M600 150 C 700 20, 900 20, 1000 150" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" pathLength={1} data-draw />
            <path d="M1000 150 C 1040 100, 1100 100, 1140 150" fill="none" stroke="var(--color-gold-soft)" strokeOpacity="0.5" strokeWidth="1" pathLength={1} data-draw />
            <path d="M1000 150 C 960 100, 900 100, 860 150" fill="none" stroke="var(--color-gold-soft)" strokeOpacity="0.5" strokeWidth="1" pathLength={1} data-draw />
            {[200, 600, 1000].map((x) => (
              <circle key={x} cx={x} cy="150" r="5" fill="var(--color-gold)" />
            ))}
            {[860, 1140].map((x) => (
              <circle key={x} cx={x} cy="150" r="3.5" fill="var(--color-gold-soft)" fillOpacity="0.7" />
            ))}
          </svg>
        </div>
        <ol className="grid gap-10 md:-mt-6 md:grid-cols-3 md:gap-0">
          {nodes.map((n, i) => (
            <li key={n.label} className="relative border-l border-gold/40 pl-6 md:border-0 md:pl-0 md:text-center" data-reveal data-delay={String(0.15 * i)}>
              <p className="font-serif-display text-[2rem] leading-tight text-ivory">{n.label}</p>
              <p className="mt-2 text-[0.9375rem] text-ivory/70">{n.sub}</p>
            </li>
          ))}
        </ol>

        <div className="mt-24 grid gap-px overflow-hidden rounded-card bg-line-dark sm:grid-cols-2 lg:grid-cols-5" data-stagger>
          {capabilities.map((c) => (
            <div key={c.title} className="bg-navy p-8" data-stagger-item>
              <h3 className="text-[1.0625rem] font-semibold text-gold-soft">{c.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/75">{c.body}</p>
            </div>
          ))}
        </div>
        <Link href="/capabilities" className="group mt-12 inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-ivory">
          <span className="link-arc">See our sourcing capabilities</span>
          <ArrowIcon className="text-gold transition-transform group-hover:translate-x-1.5" />
        </Link>
      </div>
    </section>
  );
}
