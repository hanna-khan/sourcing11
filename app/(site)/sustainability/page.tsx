import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { images } from "@/data/images";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const TITLE = "Responsible Sourcing Approach";
const DESCRIPTION =
  "How Sourcing Eleven approaches responsible textile sourcing: material choices, supplier compliance, ethical manufacturing and environmental considerations, verified per project.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/sustainability" });
}

const sections = [
  {
    id: "materials",
    title: "Material considerations",
    body: "Material choices have the largest influence on a textile product's footprint. When you are developing a product, we can source and compare options such as recycled fibres, organic or other certified cotton, undyed or lower-impact dyed fabrics, and fibre blends that improve durability.",
    points: [
      "Fibre and fabric alternatives presented with their cost and lead-time implications",
      "Certification claims checked against valid certificates from the issuing body",
      "Durability and care performance considered alongside fibre content",
    ],
  },
  {
    id: "compliance",
    title: "Supplier compliance",
    body: "Many buyers require social compliance audits or specific certifications from their manufacturing partners. We ask partners for current audit reports and certificates, check their validity and scope, and make them available for your review before production is placed.",
    points: ["Audit and certificate documents requested per partner", "Validity, scope and expiry dates checked", "Your own code of conduct shared with partners"],
  },
  {
    id: "ethical",
    title: "Ethical manufacturing considerations",
    body: "We expect partners to respect workers' rights, provide safe working conditions and comply with local law. Where your requirements go further, we include them in the brief and in our follow-up, and we will tell you if we see conditions that concern us.",
    points: ["Your standards included in the supplier brief", "Observations raised with you promptly", "Subcontracting only with your knowledge and approval"],
  },
  {
    id: "environment",
    title: "Environmental considerations",
    body: "Processes such as dyeing, washing and finishing can have significant environmental impacts. We can ask partners about water treatment, chemical management and energy use, and request supporting documentation, so you can weigh these alongside price and quality.",
    points: ["Questions on wet processing and chemical management", "Documentation requested rather than assumed", "Packaging reduced or simplified where you require"],
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/sustainability", title: TITLE, description: DESCRIPTION })} />
      <PageHero
        crumbs={[{ name: "Sustainability", path: "/sustainability" }]}
        kicker="Responsible sourcing"
        title="Responsible sourcing, verified rather than assumed."
        intro="We help buyers make informed choices about materials, suppliers and processes. We don't claim certifications or environmental performance we cannot evidence — instead, we ask for proof and share it with you."
        visual={{ type: "threads", image: "undyedCotton" }}
      />

      <section className="section-y bg-white" aria-labelledby="approach-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="approach-title" kicker="Our approach" title="Evidence over claims." />
          </div>
          <div className="space-y-6 text-[1.125rem] leading-[1.8] lg:col-span-6 lg:col-start-7" data-reveal>
            <p>
              Sustainability in textiles depends on decisions made product by product: which fibres, which mills, which processes and which partners. As a sourcing agency, our contribution is to put those choices in front of you clearly, and to check the evidence behind any claim before it reaches your product or your marketing.
            </p>
            <p className="text-muted-strong">
              Sourcing Eleven does not currently hold environmental or social certifications of its own. Certifications, audits and test reports referred to on this page belong to individual manufacturing partners or laboratories and are verified per project.
            </p>
          </div>
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={i % 2 === 0 ? "section-y bg-ivory" : "section-y bg-white"} aria-labelledby={`${s.id}-title`}>
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id={`${s.id}-title`} className="font-serif-display text-h2 text-navy" data-reveal>
                {s.title}
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-lead text-ink" data-reveal>
                {s.body}
              </p>
              <ul className="mt-8" data-stagger>
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-4 border-b border-line py-4 text-navy" data-stagger-item>
                    <span aria-hidden="true" className="mt-3 h-px w-6 flex-none bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="on-dark section-y relative overflow-hidden bg-navy text-ivory" aria-labelledby="options-title">
        <div className="absolute inset-x-0 -inset-y-[15%] opacity-30" data-parallax="0.15">
          <Image src={images.undyedCotton.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="container-x relative">
          <SectionHeading id="options-title" kicker="Sustainability-related sourcing options" title="Options we can explore for your product." />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-card bg-line-dark sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {[
              "Recycled polyester and recycled cotton blends",
              "Organic or other certified cotton, with certificates verified",
              "Undyed, greige or lower-impact dyed fabrics",
              "Reduced, recyclable or plastic-free packaging",
              "Longer-lasting constructions and fabric weights",
              "Consolidated shipments to reduce transport",
            ].map((o) => (
              <li key={o} className="bg-navy/95 p-8 text-[1.0625rem] text-ivory" data-stagger-item>
                {o}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm text-ivory/65">Availability, cost and minimums vary by partner and product. We confirm what is possible for your order before you commit.</p>
        </div>
      </section>

      <CtaBand title="Discuss responsible options for your next range." />
    </>
  );
}
