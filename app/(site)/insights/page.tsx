import { PageHero } from "@/components/sections/PageHero";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { InsightsBrowser } from "@/components/insights/InsightsBrowser";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Insights — Textile Sourcing Guides for Buyers";
const DESCRIPTION =
  "Practical guides on sourcing garments, fabrics and home textiles from Pakistan: working with buying agencies, product development, fabric quality and supplier selection.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/insights" });
}

export default async function InsightsPage() {
  const articles = await getArticles();
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured?.slug);
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/insights", title: TITLE, description: DESCRIPTION, type: "CollectionPage" }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: articles.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/insights/${a.slug}`), name: a.title })),
          },
        ]}
      />
      <PageHero
        crumbs={[{ name: "Insights", path: "/insights" }]}
        kicker="Insights"
        title="Guidance for buyers sourcing textiles from Pakistan."
        intro="Clear, practical articles on how sourcing works — from preparing a tech pack to choosing a manufacturing partner and checking fabric quality."
        visual={{ type: "stack", items: articles.slice(0, 3).map((a) => ({ title: a.title, href: `/insights/${a.slug}`, image: a.image })) }}
      />

      {featured && (
        <section className="bg-white pt-[var(--section-y)]" aria-labelledby="featured-title">
          <div className="container-x">
            <h2 id="featured-title" className="kicker">
              Featured
            </h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-8">
                <ArticleCard article={featured} large headingLevel="h3" />
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="all-articles" className="section-y scroll-mt-24 bg-white" aria-labelledby="all-title">
        <div className="container-x">
          <h2 id="all-title" className="font-serif-display text-h2 text-navy">
            All articles
          </h2>
          <div className="mt-10">
            {rest.length ? (
              <InsightsBrowser categories={categories} items={rest.map((a) => ({ key: a.slug, category: a.category, node: <ArticleCard article={a} /> }))} />
            ) : (
              <p className="text-muted-strong">New articles are on their way. In the meantime, ask us anything about sourcing on the contact page.</p>
            )}
          </div>
        </div>
      </section>

      <CtaBand title="Have a question these articles don't answer?" primary={{ label: "Ask us directly", href: "/contact" }} secondary={{ label: "Request a Quote", href: "/request-a-quote" }} />
    </>
  );
}
