import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Markdown } from "@/components/sections/Markdown";
import { ProcessSteps, RelatedCards } from "@/components/sections/ContentBlocks";
import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { LightboxGallery } from "@/components/sections/LightboxGallery";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { getCategories, getCategory, getProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { categorySchema, webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

/** Live 3D fabric in each category's material (desktop with a GPU only; static image otherwise). */
const fabricFor: Record<string, "denim" | "champagne" | "ivoryLinen"> = {
  "garments-apparel": "denim",
  "fabrics-materials": "champagne",
  "home-textiles": "ivoryLinen",
};

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) return {};
  return buildMetadata({ title: c.seoTitle || `${c.title} Sourcing`, description: c.seoDescription || c.excerpt, path: `/products/${c.slug}`, absoluteTitle: Boolean(c.seoTitle) });
}

export default async function CategoryPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [category, all, products] = await Promise.all([getCategory(slug), getCategories(), getProducts(slug)]);
  if (!category) notFound();

  const related = category.related
    .map((r) => all.find((c) => c.slug === r))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ title: c.title, href: `/products/${c.slug}`, excerpt: c.excerpt, image: c.image }));

  const quoteHref = `/request-a-quote?category=${category.slug}`;

  return (
    <>
      <JsonLd data={[webPageSchema({ path: `/products/${category.slug}`, title: category.seoTitle || category.title, description: category.seoDescription || category.excerpt }), categorySchema(category)]} />
      <PageHero
        crumbs={[
          { name: "Products", path: "/products" },
          { name: category.title, path: `/products/${category.slug}` },
        ]}
        kicker={category.title}
        title={category.heroTitle}
        intro={category.intro}
        visual={{ type: "arch", image: category.image, secondary: category.gallery[1], fabric: fabricFor[category.slug] }}
      >
        <LinkButton href={quoteHref}>Enquire about {category.title}</LinkButton>
      </PageHero>

      <section className="section-y bg-white" aria-labelledby="types-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="types-title" kicker="What we source" title={`${category.title} we work on.`} intro={category.excerpt} />
          </div>
          <ul className="grid content-start gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7" data-stagger>
            {category.productTypes.map((t) => (
              <li key={t} className="flex items-center gap-4 border-b border-line py-5 text-[1.0625rem] text-navy" data-stagger-item>
                <span aria-hidden="true" className="h-px w-6 flex-none bg-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {products.length > 0 && (
        <HorizontalGallery
          labelledBy="range-title"
          title={`Across the ${category.title.toLowerCase()} range`}
          intro="Examples of the products we coordinate in this category. Every order is developed to your own specification."
          items={products.map((p) => ({ title: p.name, body: p.description, meta: p.materials, image: p.image }))}
        />
      )}

      <section className="on-dark section-y bg-navy text-ivory" aria-labelledby="capabilities-title">
        <div className="container-x">
          <SectionHeading id="capabilities-title" kicker="Sourcing capabilities" title="How we support this category." />
          <dl className="mt-16 grid gap-px overflow-hidden rounded-card bg-line-dark sm:grid-cols-2" data-stagger>
            {category.capabilities.map((c) => (
              <div key={c.title} className="bg-navy p-8 lg:p-10" data-stagger-item>
                <dt className="font-serif-display text-[1.875rem] leading-tight text-ivory">{c.title}</dt>
                <dd className="mt-3 max-w-md text-ivory/75">{c.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y bg-white" aria-labelledby="category-detail">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="category-detail" className="sr-only">
              About {category.title.toLowerCase()} sourcing
            </h2>
            <LightboxGallery images={category.gallery} label={`${category.title} materials`} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <Markdown source={category.body} className="[&>h2:first-child]:mt-0" />
          </div>
        </div>
      </section>

      {category.process.length > 0 && <ProcessSteps title="How a category project runs" steps={category.process} />}
      <RelatedCards title="Related categories" items={related} kicker="Keep exploring" />
      <CtaBand title={`Tell us about your ${category.title.toLowerCase()} project.`} primary={{ label: "Request a Quote", href: quoteHref }} />
    </>
  );
}
