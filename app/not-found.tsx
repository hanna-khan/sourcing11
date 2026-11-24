import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { LinkButton, TextLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found | Sourcing Eleven",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/our-process", label: "Our Process" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-deep text-ivory">
      <div className="container-x pt-8">
        <Link href="/" className="inline-block w-44" aria-label="SOURCING11, Sourcing Eleven home">
          <Logo tone="light" className="w-full" decorative />
        </Link>
      </div>
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
        {/* An unfinished bridge: the arc stops short */}
        <path d="M-80 900 C 260 160, 900 140, 1100 380" fill="none" stroke="var(--color-gold)" strokeOpacity="0.55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container-x flex flex-1 flex-col justify-center py-20">
        <p className="kicker">Error 404</p>
        <h1 className="font-serif-display mt-6 max-w-3xl text-h1">This page doesn&apos;t connect to anything.</h1>
        <p className="mt-6 max-w-xl text-lead text-ivory/75">The link may be out of date, or the page may have moved. These pages are a good place to pick the thread back up.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <LinkButton href="/" variant="gold">
            Go to the homepage
          </LinkButton>
          <TextLink href="/request-a-quote" tone="light">
            Request a Quote
          </TextLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] text-ivory/75">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-arc">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
