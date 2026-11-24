import { PageHero } from "@/components/sections/PageHero";
import { CategoriesShowcase } from "@/components/home/CategoriesShowcase";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const TITLE = "Garment, Fabric & Home Textile Sourcing";
const DESCRIPTION =
  "Source garments and apparel, fabrics and materials, and home textiles from Pakistan, with each product matched to a manufacturing partner suited to it.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/products" });
}

const faqs = [
  {
    q: "Do you manufacture the products yourselves?",
    a: "No. Sourcing Eleven is a buying and sourcing agency. We identify independent manufacturing partners suited to your product and coordinate the work with them on your behalf.",
  },
  {
    q: "What information do you need to start?",
    a: "A product description or tech pack, an estimated quantity per style and colour, an indicative target price if you have one, and your required delivery window. Reference images or samples help.",
  },
  {
    q: "Can you source products outside these three categories?",
    a: "Our focus is garments and apparel, fabrics and materials, and home textiles. If your product sits close to these, send us the details through the quote form and we will tell you honestly whether we are the right fit.",
  },
  {
    q: "Do you work to minimum order quantities?",
    a: "Minimums are set by each manufacturing partner and depend on the product, fabric and colours. We look for partners whose minimums suit your quantities and explain them clearly before you commit.",
  },
];

export default async function ProductsPage() {
  const categories = await getCategories();
  return (
    <>
      <JsonLd data={[webPageSchema({ path: "/products", title: TITLE, description: DESCRIPTION, type: "CollectionPage" }), faqSchema(faqs)]} />
      <PageHero
        crumbs={[{ name: "Products", path: "/products" }]}
        kicker="Products"
        title="Three textile categories, sourced with the right partners."
        intro="From knitwear and denim to fabrics by the metre and retail-ready bed linen, we match each product to manufacturing partners whose existing work is closest to what you need."
        visual={{ type: "triptych", items: categories.map((c) => ({ title: c.title, href: `/products/${c.slug}`, image: c.image })) }}
      />
      <CategoriesShowcase categories={categories} />
      <section className="section-y bg-white" aria-labelledby="products-faq">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="products-faq" kicker="Questions" title="Before you send a brief." />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Accordion items={faqs.map((f) => ({ title: f.q, body: f.a }))} />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
