import Link from "next/link";
import { Logo } from "./Logo";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { footerNav } from "@/data/navigation";
import { getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/utils/format";
import { ConsentSettingsButton } from "@/components/analytics/ConsentSettingsButton";

export async function SiteFooter() {
  const s = await getSettings();
  const socials = [
    { label: "LinkedIn", href: s.linkedin },
    { label: "Instagram", href: s.instagram },
    { label: "Facebook", href: s.facebook },
    { label: "X", href: s.x },
  ].filter((x) => x.href);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-navy-deep text-ivory">
      <svg aria-hidden="true" viewBox="0 0 1440 260" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-[18rem] w-full opacity-60">
        <path d="M-40 250 C 360 -40, 1080 -40, 1480 250" fill="none" stroke="var(--color-gold)" strokeOpacity="0.35" strokeWidth="1" pathLength={1} data-draw />
      </svg>

      <div className="container-x relative pt-24 sm:pt-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="SOURCING11, Sourcing Eleven home. Your Bridge from Concept to Shipment." className="inline-block w-72 max-w-full">
              <Logo tone="light" variant="lockup" sizes="288px" decorative />
            </Link>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ivory/70">{s.shortIntro}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title="Company" links={footerNav.company} />
            <FooterColumn title="Services" links={footerNav.services} />
            <div>
              <FooterColumn title="Products" links={footerNav.products} />
              {(s.email || s.phone || s.whatsapp) && (
                <div className="mt-10">
                  <h2 className="text-sm font-semibold text-gold-soft">Get in touch</h2>
                  <ul className="mt-4 space-y-2 text-[0.9375rem] text-ivory/80">
                    {s.email && (
                      <li>
                        <TrackedLink event="email_click" href={`mailto:${s.email}`} className="link-arc break-all">
                          {s.email}
                        </TrackedLink>
                      </li>
                    )}
                    {s.phone && (
                      <li>
                        <TrackedLink event="phone_click" href={telHref(s.phone)} className="link-arc">
                          {s.phone}
                        </TrackedLink>
                      </li>
                    )}
                    {s.whatsapp && (
                      <li>
                        <TrackedLink event="whatsapp_click" href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="link-arc">
                          WhatsApp
                        </TrackedLink>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="hairline mt-20" />
        <div className="flex flex-col gap-6 py-8 text-sm text-ivory/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {s.companyName}. Textile buying and sourcing agency, Pakistan.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((x) => (
              <li key={x.label}>
                <a href={x.href} target="_blank" rel="noopener noreferrer" className="link-arc">
                  {x.label}
                </a>
              </li>
            ))}
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-arc">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <ConsentSettingsButton />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gold-soft">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-arc text-[0.9375rem] text-ivory/80 hover:text-ivory">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
