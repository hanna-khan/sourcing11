import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Markdown } from "@/components/sections/Markdown";
import { BenefitList, ProcessSteps, RelatedCards } from "@/components/sections/ContentBlocks";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { getService, getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { serviceSchema, webPageSchema } from "@/lib/seo/schema";
import { resolveImage } from "@/data/images";

export const revalidate = 3600;

/** Which stage of the six-stage journey each service leads (see data/journey.ts). */
const stageFor: Record<string, { number: string; label: string }> = {
  "textile-sourcing": { number: "02", label: "Source" },
  "product-development": { number: "03", label: "Develop" },
  merchandising: { number: "04", label: "Coordinate" },
  "production-management": { number: "04", label: "Coordinate" },
  "quality-assurance": { number: "05", label: "Inspect" },
  "shipment-coordination": { number: "06", label: "Deliver" },
};

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: s.seoTitle || `${s.title} Services`,
    description: s.seoDescription || s.excerpt,
    path: `/services/${s.slug}`,
    absoluteTitle: Boolean(s.seoTitle),
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, all] = await Promise.all([getService(slug), getServices()]);
  if (!service) notFound();

  const related = service.related
    .map((r) => all.find((s) => s.slug === r))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ title: s.title, href: `/services/${s.slug}`, excerpt: s.excerpt, image: s.image }));

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: `/services/${service.slug}`, title: service.seoTitle || service.title, description: service.seoDescription || service.excerpt }),
          serviceSchema(service),
        ]}
      />
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
        kicker={service.title}
        title={service.heroTitle}
        intro={service.heroIntro}
        visual={{
          type: "arch",
          image: service.image,
          alt: resolveImage(service.image).alt,
          secondary: related[0]?.image,
          badge: stageFor[service.slug],
        }}
      >
        <LinkButton href="/request-a-quote">Request a Quote</LinkButton>
        <LinkButton href="/contact" variant="outline-light" arrow={false}>
          Talk to us
        </LinkButton>
      </PageHero>

      <section className="section-y bg-white" aria-label={`About ${service.title}`}>
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-serif-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.2] text-navy lg:sticky lg:top-[calc(var(--header-h)+2rem)]" data-reveal>
              {service.intro}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal data-delay="0.1">
            <Markdown source={service.body} className="[&>h2:first-child]:mt-0" />
          </div>
        </div>
      </section>

      {service.process.length > 0 && <ProcessSteps title={`How ${service.title.toLowerCase()} works`} steps={service.process} />}
      {service.benefits.length > 0 && <BenefitList title="What this means for buyers." items={service.benefits} kicker="Buyer benefits" />}
      <RelatedCards title="Related services" items={related} kicker="Keep exploring" />
      <CtaBand title={`Discuss ${service.title.toLowerCase()} for your next order.`} />
    </>
  );
}
