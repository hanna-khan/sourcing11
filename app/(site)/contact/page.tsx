import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TextLink } from "@/components/ui/Button";
import { getSettings } from "@/lib/content";
import { worldMap } from "@/data/world-map";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema } from "@/lib/seo/schema";
import { telHref, whatsappHref } from "@/lib/utils/format";

export const revalidate = 3600;

const TITLE = "Contact Sourcing Eleven";
const DESCRIPTION = "Contact Sourcing Eleven, a textile buying and sourcing agency in Pakistan, about garments, fabrics or home textiles for your brand.";

export async function generateMetadata() {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/contact", absoluteTitle: true });
}

export default async function ContactPage() {
  const s = await getSettings();
  const socials = [
    { label: "LinkedIn", href: s.linkedin },
    { label: "Instagram", href: s.instagram },
    { label: "Facebook", href: s.facebook },
    { label: "X", href: s.x },
  ].filter((x) => x.href);
  const hasDetails = Boolean(s.email || s.phone || s.whatsapp || (s.addressVerified && s.address));

  return (
    <>
      <JsonLd data={webPageSchema({ path: "/contact", title: TITLE, description: DESCRIPTION, type: "ContactPage" })} />
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        kicker="Contact"
        title="Let's talk about what you're making."
        intro="Send a message about a new project, a product you're developing or a question about sourcing from Pakistan. For pricing, the quote form collects everything we need in one go."
        visual={{ type: "signal", markets: s.markets.map((m): string | undefined => worldMap.markets[m as keyof typeof worldMap.markets]?.label).filter((l): l is string => Boolean(l)) }}
      />

      <section className="section-y bg-white">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4" aria-labelledby="details-title">
            <h2 id="details-title" className="font-serif-display text-[2.25rem] leading-tight text-navy">
              {hasDetails ? "Contact details" : "Get in touch"}
            </h2>
            {hasDetails ? (
              <dl className="mt-8 space-y-6">
                {s.email && (
                  <div>
                    <dt className="text-sm text-muted-strong">Email</dt>
                    <dd className="mt-1 text-lg font-semibold text-navy">
                      <TrackedLink event="email_click" href={`mailto:${s.email}`} className="link-arc break-all">
                        {s.email}
                      </TrackedLink>
                    </dd>
                  </div>
                )}
                {s.phone && (
                  <div>
                    <dt className="text-sm text-muted-strong">Phone</dt>
                    <dd className="mt-1 text-lg font-semibold text-navy">
                      <TrackedLink event="phone_click" href={telHref(s.phone)} className="link-arc">
                        {s.phone}
                      </TrackedLink>
                    </dd>
                  </div>
                )}
                {s.whatsapp && (
                  <div>
                    <dt className="text-sm text-muted-strong">WhatsApp</dt>
                    <dd className="mt-1 text-lg font-semibold text-navy">
                      <TrackedLink event="whatsapp_click" href={whatsappHref(s.whatsapp, "Hello Sourcing Eleven, I'd like to discuss a sourcing project.")} target="_blank" rel="noopener noreferrer" className="link-arc">
                        Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                      </TrackedLink>
                    </dd>
                  </div>
                )}
                {s.addressVerified && s.address && (
                  <div>
                    <dt className="text-sm text-muted-strong">Address</dt>
                    <dd className="mt-1 whitespace-pre-line text-navy">{s.address}</dd>
                    <dd className="mt-2">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold-ink underline underline-offset-4">
                        View on map<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                )}
                {s.businessHours && (
                  <div>
                    <dt className="text-sm text-muted-strong">Hours</dt>
                    <dd className="mt-1 text-navy">{s.businessHours}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-6 text-muted-strong">Use the form and we will reply by email. We are based in Pakistan and work with buyers across time zones.</p>
            )}
            {socials.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-3">
                {socials.map((x) => (
                  <li key={x.label}>
                    <a href={x.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-pill border border-navy/15 px-4 text-sm text-navy hover:border-navy">
                      {x.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-12 rounded-card bg-navy p-8 text-ivory">
              <p className="font-serif-display text-[1.75rem] leading-tight">Ready for pricing?</p>
              <p className="mt-3 text-[0.9375rem] text-ivory/75">The quote form takes about five minutes and lets you attach a tech pack.</p>
              <div className="mt-6">
                <TextLink href="/request-a-quote" tone="light">
                  Request a Quote
                </TextLink>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="sr-only">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
