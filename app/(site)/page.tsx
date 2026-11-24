import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { CategoriesShowcase } from "@/components/home/CategoriesShowcase";
import { Journey } from "@/components/home/Journey";
import { WhyUs } from "@/components/home/WhyUs";
import { PartnerNetwork } from "@/components/home/PartnerNetwork";
import { WorldMap } from "@/components/home/WorldMap";
import { InsightsPreview } from "@/components/home/InsightsPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { TextLink } from "@/components/ui/Button";
import { getArticles, getCategories, getServices, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const TITLE = "Textile Sourcing Company in Pakistan | Sourcing Eleven";
const DESCRIPTION =
  "Sourcing Eleven is a textile buying and sourcing agency in Pakistan for international brands — garments, fabrics and home textiles, coordinated from concept to shipment.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/", absoluteTitle: true });
}

export default async function HomePage() {
  const [services, categories, articles, settings] = await Promise.all([getServices(), getCategories(), getArticles(), getSettings()]);

  return (
    <>
      <JsonLd data={webPageSchema({ path: "/", title: TITLE, description: DESCRIPTION })} />
      <Hero />
      <Introduction />
      <ServicesShowcase services={services} />
      <CategoriesShowcase categories={categories} />

      <section className="on-dark section-y relative bg-navy text-ivory" aria-labelledby="journey-title">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading id="journey-title" kicker="The sourcing journey" title="From the First Idea to the Final Shipment." intro="Six stages, one connected process. Scroll through how a project moves from your brief to goods on their way." />
            <div data-reveal>
              <TextLink href="/our-process" tone="light">
                See our full process
              </TextLink>
            </div>
          </div>
          <div className="mt-16 lg:mt-8">
            <Journey />
          </div>
        </div>
      </section>

      <WhyUs stats={settings.stats} />
      <PartnerNetwork />
      <WorldMap markets={settings.markets} />
      <InsightsPreview articles={articles} />
      <CtaBand title="Have a Product in Mind? Let's Bring It to Life." />
    </>
  );
}
