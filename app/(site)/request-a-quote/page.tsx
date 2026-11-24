import { PageHero } from "@/components/sections/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const TITLE = "Request a Quote for Textile Sourcing";
const DESCRIPTION = "Request a quote for garment, fabric or home textile sourcing from Pakistan. Share your product, quantities and timeline, and attach a tech pack.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/request-a-quote" });
}

const expectations = [
  { title: "We read every brief", body: "Your request is reviewed by the team, not an automated system." },
  { title: "We ask what's missing", body: "If we need more detail to approach suppliers properly, we'll tell you exactly what." },
  { title: "We recommend a route", body: "You'll hear how we would approach the product and which steps we'd coordinate." },
];

export default function QuotePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/request-a-quote", title: TITLE, description: DESCRIPTION })} />
      <PageHero
        crumbs={[{ name: "Request a Quote", path: "/request-a-quote" }]}
        kicker="Request a quote"
        title="Tell us about your product."
        intro="Four short steps. The more detail you share, the more useful our response will be — but a clear description and an estimated quantity are enough to start."
        compact
      />
      <section className="section-y bg-white">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <QuoteForm />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="next-title">
            <div className="rounded-card bg-ivory p-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 id="next-title" className="font-serif-display text-[1.875rem] leading-tight text-navy">
                What happens next
              </h2>
              <ol className="mt-6 space-y-6">
                {expectations.map((e, i) => (
                  <li key={e.title} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="font-serif-display text-2xl leading-none text-gold-ink">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-navy">{e.title}</p>
                      <p className="mt-1 text-[0.9375rem] text-muted-strong">{e.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-line pt-6 text-sm text-muted-strong">Files are stored privately and only accessible to the Sourcing Eleven team.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
