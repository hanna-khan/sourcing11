import { absoluteUrl, site } from "@/lib/site";
import type { Article, ProductCategory, Service, SiteSettings } from "@/lib/types";

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

/** Organization data uses only confirmed settings; empty fields are omitted. */
export function organizationSchema(s: SiteSettings) {
  const sameAs = [s.linkedin, s.instagram, s.facebook, s.x].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo/sourcing11-logo.png"),
    slogan: site.tagline,
    description: site.description,
    areaServed: ["United Kingdom", "United States", "Europe", "Australia"].map((name) => ({ "@type": "Place", name })),
    knowsAbout: ["Textile sourcing", "Garment sourcing", "Fabric sourcing", "Home textile sourcing", "Product development", "Quality assurance"],
    ...(s.foundingYear ? { foundingDate: s.foundingYear } : {}),
    ...(s.email ? { email: s.email } : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.addressVerified && s.address
      ? { address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "PK" } }
      : { address: { "@type": "PostalAddress", addressCountry: "PK" } }),
    ...(s.email || s.phone
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              ...(s.email ? { email: s.email } : {}),
              ...(s.phone ? { telephone: s.phone } : {}),
              availableLanguage: ["English"],
            },
          ],
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function webPageSchema(opts: { path: string; title: string; description: string; type?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": absoluteUrl(`${opts.path}#webpage`),
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`/services/${s.slug}#service`),
    name: s.title,
    serviceType: s.title,
    description: s.seoDescription || s.excerpt,
    url: absoluteUrl(`/services/${s.slug}`),
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
      { "@type": "Place", name: "Europe" },
      { "@type": "Country", name: "Australia" },
    ],
  };
}

export function categorySchema(c: ProductCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`/products/${c.slug}#service`),
    name: `${c.title} sourcing`,
    serviceType: "Textile sourcing",
    description: c.seoDescription || c.excerpt,
    url: absoluteUrl(`/products/${c.slug}`),
    provider: { "@id": ORG_ID },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: c.title,
      itemListElement: c.productTypes.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${p} sourcing` } })),
    },
  };
}

export function articleSchema(a: Article, image: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`/insights/${a.slug}#article`),
    headline: a.title,
    description: a.seoDescription || a.excerpt,
    image: [absoluteUrl(image)],
    datePublished: a.publishedAt,
    dateModified: a.updatedAt || a.publishedAt,
    author: { "@type": "Organization", name: a.author || site.name, url: absoluteUrl("/about") },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: absoluteUrl(`/insights/${a.slug}`),
    articleSection: a.category,
    inLanguage: "en",
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}
