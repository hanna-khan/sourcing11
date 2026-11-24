import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Journey } from "@/components/home/Journey";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { journey } from "@/data/journey";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const TITLE = "Our Sourcing Process — From Concept to Shipment";
const DESCRIPTION =
  "How Sourcing Eleven runs a textile sourcing project in six stages: understand, source, develop, coordinate, inspect and deliver.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/our-process" });
}

const faqs = [
  { q: "How long does a typical project take?", a: "It depends on the product, fabric availability, the number of sample rounds and each partner's schedule. We build a timeline backwards from your delivery date once the brief is clear, and we share it before you commit." },
  { q: "Can I use only part of the process?", a: "Yes. Some buyers ask us only to source and shortlist partners; others want inspection and shipment coordination for orders they placed directly. We agree the scope at the start." },
  { q: "How will I receive updates?", a: "We agree a reporting rhythm with you — typically a written update at each milestone and whenever something changes — plus a single point of contact for questions." },
  { q: "Who approves samples and quality?", a: "You do. We coordinate samples and inspections and give our observations, but approval of samples, quality standards and orders always stays with you." },
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/our-process", title: TITLE, description: DESCRIPTION }),
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How a textile sourcing project runs with Sourcing Eleven",
            step: journey.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.detail })),
          },
          faqSchema(faqs),
        ]}
      />
      <PageHero
        crumbs={[{ name: "Our Process", path: "/our-process" }]}
        kicker="Our process"
        title="Six stages. One connected journey."
        intro="Every project follows the same disciplined path, adapted to your product. Each stage ends with a clear decision or approval, so the next one starts from solid ground."
        visual={{ type: "process", stages: journey.map((s) => ({ number: s.number, title: s.title })) }}
      >
        <LinkButton href="/request-a-quote">Request a Quote</LinkButton>
      </PageHero>

      <section className="section-y bg-white" aria-labelledby="stages-title">
        <div className="container-x">
          <SectionHeading id="stages-title" kicker="The stages" title="From the first idea to the final shipment." intro="Scroll through each stage to see what happens, what we need from you and which service leads it." />
          <div className="mt-16 lg:mt-8">
            <Journey detailed />
          </div>
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="process-faq">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="process-faq" kicker="Questions" title="Common questions about the process." />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Accordion items={faqs.map((f) => ({ title: f.q, body: f.a }))} />
          </div>
        </div>
      </section>

      <CtaBand title="Ready to start at stage one?" intro="Tell us about your product and we will begin with a proper brief." />
    </>
  );
}
