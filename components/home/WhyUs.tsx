import { SectionHeading } from "@/components/sections/SectionHeading";
import { Counter } from "@/components/animations/Counter";
import type { Pair } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const reasons = [
  {
    title: "Buyer-focused approach",
    body: "We represent you, not a factory. Recommendations are based on what fits your product, price and timeline — and we tell you plainly when something doesn't.",
  },
  {
    title: "Sourcing expertise",
    body: "Knowing which partners make which products well, what a complete brief looks like and where projects usually slip lets us shorten the path to a good sample.",
  },
  {
    title: "Coordinated execution",
    body: "Development, merchandising, production follow-up, inspection and shipment are handled as one connected job, with one point of contact and one written record.",
  },
  {
    title: "Quality-conscious processes",
    body: "Your approved sample and specification are the standard. We check against them early and often, and follow up corrective actions rather than just reporting them.",
  },
];

export function WhyUs({ stats }: { stats: Pair[] }) {
  return (
    <section className="section-y relative overflow-hidden bg-white" aria-labelledby="why-title">
      <div className="container-x">
        <SectionHeading id="why-title" kicker="Why Sourcing Eleven" title="A sourcing partner who stays close to the detail." />
        <div className="mt-16 lg:mt-24">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={cn("grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-8 lg:py-12", i === reasons.length - 1 && "border-b")}
              data-reveal
            >
              <h3 className={cn("font-serif-display text-[2.25rem] leading-[1.05] text-navy sm:text-[2.75rem] lg:col-span-5", i % 2 === 1 && "lg:col-start-3")}>{r.title}</h3>
              <p className={cn("max-w-xl text-[1.0625rem] leading-relaxed text-muted-strong lg:col-span-5 lg:pt-3", i % 2 === 1 ? "lg:col-start-8" : "lg:col-start-7")}>{r.body}</p>
            </div>
          ))}
        </div>
        {stats.length > 0 && (
          <dl className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.body} className="border-l border-gold pl-6">
                <dt className="text-sm text-muted-strong">{s.body}</dt>
                <dd className="font-serif-display mt-2 text-[3.5rem] leading-none text-navy">
                  <Counter value={s.title} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
