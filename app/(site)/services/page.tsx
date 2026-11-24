import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceCard } from "@/components/home/ServicesShowcase";
import { Journey } from "@/components/home/Journey";
import { JsonLd } from "@/components/seo/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const TITLE = "Textile & Garment Sourcing Services";
const DESCRIPTION =
  "Textile sourcing services from Pakistan: supplier identification, fabric sourcing, product development, merchandising, production management, quality assurance and shipment coordination.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/services" });
}

const scope = [
  "Textile and garment sourcing",
  "Supplier identification and coordination",
  "Fabric sourcing",
  "Product development",
  "Sampling and approvals",
  "Merchandising",
  "Production management and follow-up",
  "Quality assurance and inspection coordination",
  "Shipment coordination",
];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/services", title: TITLE, description: DESCRIPTION, type: "CollectionPage" })} />
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        kicker="Services"
        title="One sourcing partner. Every step connected."
        intro="Use a single service or let us coordinate the whole journey. Either way, you get one team that knows your product in detail, from the first brief to the final shipment."
        visual={{ type: "fan", items: services.map((s) => ({ title: s.cardTitle, href: `/services/${s.slug}`, image: s.image })) }}
      >
        <LinkButton href="/request-a-quote">Start Your Project</LinkButton>
      </PageHero>

      <section className="section-y bg-white" aria-labelledby="all-services">
        <div className="container-x">
          <h2 id="all-services" className="sr-only">
            All services
          </h2>
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {services.map((s) => (
              <li key={s.slug} data-stagger-item>
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="scope-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="scope-title" kicker="Scope" title="What our services include." intro="Our six services cover the full scope of a sourcing project. Supplier identification and fabric sourcing sit within Textile Sourcing; sampling and approvals within Product Development." />
          </div>
          <ul className="grid content-start gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7" data-stagger>
            {scope.map((s) => (
              <li key={s} className="flex items-center gap-4 border-b border-line py-5 text-[1.0625rem] text-navy" data-stagger-item>
                <span aria-hidden="true" className="h-px w-6 flex-none bg-gold" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-dark section-y bg-navy text-ivory" aria-labelledby="services-journey">
        <div className="container-x">
          <SectionHeading id="services-journey" kicker="How the services connect" title="Each stage hands over cleanly to the next." />
          <div className="mt-16">
            <Journey />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
