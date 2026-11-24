import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Tabs } from "@/components/ui/Tabs";
import { JsonLd } from "@/components/seo/JsonLd";
import { images, type ImageKey } from "@/data/images";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils/cn";

export const revalidate = 3600;

const TITLE = "Textile Sourcing Capabilities";
const DESCRIPTION =
  "What Sourcing Eleven coordinates for buyers: fabric and garment sourcing, product development, sampling, manufacturing partner coordination, production follow-up, quality and shipment.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/capabilities" });
}

const fabricTabs = [
  { label: "Woven fabrics", items: ["Poplin, twill, drill and canvas", "Oxford and chambray shirting", "Denim, rigid and stretch", "Linen and linen blends", "Yarn-dyed checks and stripes"] },
  { label: "Knitted fabrics", items: ["Single jersey and slub jersey", "Rib and interlock", "Fleece and French terry", "Pique for polo shirts", "Blends with elastane"] },
  { label: "Finishes & colour", items: ["Piece-dyed and yarn-dyed colour", "Reactive and pigment printing", "Brushing, peaching and enzyme washes", "Garment dyeing and washing", "Lab dip and strike-off development"] },
];

type Block = { id: string; title: string; body: string; points: string[]; image: ImageKey; link?: { href: string; label: string } };

const blocks: Block[] = [
  {
    id: "garment-categories",
    title: "Garment categories",
    body: "Knitted, woven and denim garments for men's, women's and children's ranges, matched to partners whose current production is closest to your product.",
    points: ["Tops, tees, polos and sweatshirts", "Shirts, trousers and outerwear", "Denim, activewear and loungewear", "Workwear and uniforms"],
    image: "denimTwill",
    link: { href: "/products/garments-apparel", label: "Garments & Apparel" },
  },
  {
    id: "product-development",
    title: "Product development",
    body: "Coordination from tech pack review to an approved pre-production sample, with every comment and decision recorded.",
    points: ["Tech pack and specification review", "Fabric, colour and trim development", "Costing input on construction choices"],
    image: "drafting",
    link: { href: "/services/product-development", label: "Product Development" },
  },
  {
    id: "sampling",
    title: "Sampling",
    body: "Sample rounds managed to keep them few and decisive: comments consolidated, checked against the next sample, and dispatched with notes.",
    points: ["Proto and fit samples", "Size sets and grading checks", "Pre-production and shipment samples"],
    image: "labDips",
  },
  {
    id: "partner-coordination",
    title: "Manufacturing partner coordination",
    body: "We work with independent manufacturers. Our role is to brief them clearly, keep communication flowing and represent your interests throughout.",
    points: ["Structured enquiries and quotations", "Single point of contact", "Clear escalation of decisions"],
    image: "swatchFan",
  },
  {
    id: "production-follow-up",
    title: "Production follow-up",
    body: "Bulk orders followed from materials in-house to packed cartons, with progress shared on an agreed rhythm.",
    points: ["Time and action plans", "Materials and trims readiness", "Progress and issue reporting"],
    image: "warp",
    link: { href: "/services/production-management", label: "Production Management" },
  },
  {
    id: "quality-processes",
    title: "Quality processes",
    body: "Checks against your approved standard at the points you choose, coordinated with your nominated inspectors and laboratories.",
    points: ["Fabric and materials checks", "In-line and final random inspection", "Laboratory test coordination"],
    image: "loupe",
    link: { href: "/services/quality-assurance", label: "Quality Assurance" },
  },
  {
    id: "packaging-shipment",
    title: "Packaging and shipment coordination",
    body: "Retail packaging, carton marks and documentation checked before goods are handed to your freight forwarder.",
    points: ["Packaging and labelling checks", "Packing list and invoice review", "Forwarder handover"],
    image: "stacks",
    link: { href: "/services/shipment-coordination", label: "Shipment Coordination" },
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/capabilities", title: TITLE, description: DESCRIPTION })} />
      <PageHero
        crumbs={[{ name: "Capabilities", path: "/capabilities" }]}
        kicker="Capabilities"
        title="What we can coordinate for you."
        intro="Our capabilities are the sourcing and coordination work we carry out with independent manufacturing partners. Specific production capacities and certifications belong to each partner and are confirmed per project."
        visual={{ type: "mosaic", images: ["bolts", "denimTwill", "undyedCotton", "jerseyKnit", "labDips", "warp", "terry", "champagneSilk", "loupe"] }}
      />

      <nav aria-label="On this page" className="sticky-under-header sticky z-30 border-b border-line bg-white/95 backdrop-blur">
        <ul className="container-x flex gap-6 overflow-x-auto py-4 text-sm font-medium text-muted-strong [scrollbar-width:none]">
          {[{ id: "fabric-capabilities", title: "Fabrics" }, ...blocks].map((b) => (
            <li key={b.id} className="flex-none">
              <a href={`#${b.id}`} className="link-arc hover:text-navy">
                {b.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="fabric-capabilities" className="section-y bg-white" aria-labelledby="fabric-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="fabric-title" kicker="Fabric capabilities" title="Fabrics we source and develop." intro="Fabric sourcing works from a written specification — composition, construction, weight, width, finish and colour." />
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-media" data-mask>
              <Image src={images.undyedCotton.src} alt={images.undyedCotton.alt} fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Tabs
              tabs={fabricTabs.map((t) => ({
                label: t.label,
                content: (
                  <ul className="grid gap-x-8 sm:grid-cols-2">
                    {t.items.map((i) => (
                      <li key={i} className="flex items-center gap-4 border-b border-line py-5 text-[1.0625rem] text-navy">
                        <span aria-hidden="true" className="h-px w-6 flex-none bg-gold" />
                        {i}
                      </li>
                    ))}
                  </ul>
                ),
              }))}
            />
            <p className="mt-8 text-[0.9375rem] text-muted-strong">
              Need fabric by the metre rather than finished products? See{" "}
              <Link href="/products/fabrics-materials" className="font-semibold text-gold-ink underline underline-offset-2">
                Fabrics &amp; Materials
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {blocks.map((b, i) => {
        const img = images[b.image];
        const dark = i % 3 === 1;
        return (
          <section key={b.id} id={b.id} className={cn("section-y scroll-mt-32", dark ? "on-dark bg-navy text-ivory" : i % 3 === 2 ? "bg-ivory" : "bg-white")} aria-labelledby={`${b.id}-title`}>
            <div className="container-x grid items-center gap-12 lg:grid-cols-12">
              <div className={cn("relative aspect-[5/4] overflow-hidden rounded-media lg:col-span-6", i % 2 === 1 && "lg:order-2 lg:col-start-7")} data-mask>
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 46vw, 92vw" className="object-cover" />
              </div>
              <div className={cn("lg:col-span-5", i % 2 === 1 ? "lg:order-1" : "lg:col-start-8")}>
                <h2 id={`${b.id}-title`} className="font-serif-display text-h2 text-navy [.on-dark_&]:text-ivory" data-reveal>
                  {b.title}
                </h2>
                <p className="mt-6 text-lead text-muted-strong [.on-dark_&]:text-ivory/75" data-reveal data-delay="0.1">
                  {b.body}
                </p>
                <ul className="mt-8" data-reveal data-delay="0.15">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-center gap-4 border-b border-line py-4 text-navy [.on-dark_&]:border-line-dark [.on-dark_&]:text-ivory">
                      <span aria-hidden="true" className="h-px w-6 flex-none bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
                {b.link && (
                  <Link href={b.link.href} className="mt-8 inline-flex text-[0.9375rem] font-semibold text-gold-ink underline underline-offset-4 [.on-dark_&]:text-gold-soft" data-reveal>
                    More about {b.link.label}
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand title="Check whether we can coordinate your product." intro="Send us the details and we will confirm which parts of the journey we can take on, and how." />
    </>
  );
}
