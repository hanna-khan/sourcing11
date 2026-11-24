# SEO strategy — Sourcing Eleven

## Goal

Be found by international buyers — brands, retailers, wholesalers, importers and procurement teams in the UK, US, Europe and Australia — when they look for a textile sourcing or buying agency in Pakistan, and convert those visits into quote requests.

## Positioning in search

Sourcing Eleven is a **buying and sourcing agency**, not a manufacturer. Content targets agency and service intent ("sourcing company", "buying agency", "sourcing agent", "buying house") rather than "manufacturer" or "factory" queries, which would attract the wrong expectations and misrepresent the business.

## Site architecture

```
/                         brand + head term (textile sourcing company Pakistan)
├── /services             service hub
│   └── /services/{6}     one service per page, one keyword cluster each
├── /products             category hub
│   └── /products/{3}     one category per page
├── /capabilities         supporting / long-tail
├── /our-process          process + HowTo schema
├── /sustainability       responsible-sourcing queries
├── /insights             knowledge hub
│   └── /insights/{7}     informational long-tail feeding commercial pages
├── /about, /contact, /request-a-quote
```

Every commercial page is at most two clicks from the homepage, reachable from crawlable server-rendered HTML links (header, mega menus, footer, breadcrumbs, related-content blocks). Articles link to the matching service and category pages.

## On-page implementation

- Unique `<title>` (≤ 65 characters plus brand) and meta description (≤ 160 characters) for every indexable page, validated by automated tests.
- One H1 per page; logical H2/H3 hierarchy.
- Canonical, Open Graph and X cards on every page through `lib/seo/metadata.ts`; branded OG images (`/opengraph-image`, `/og/insights/[slug]`).
- Descriptive URLs, breadcrumbs with `BreadcrumbList` schema, descriptive image alt text from `data/images.ts`.
- Editors can override any page's title, description or indexing in `/admin/seo`; services, categories and articles have their own SEO fields with a live search-snippet preview.

## Technical SEO

| Item | Implementation |
| --- | --- |
| Sitemap | `app/sitemap.ts`, dynamic, includes CMS content, excludes noindexed pages |
| Robots | `app/robots.ts`; disallows `/admin`, `/api/`, `/thank-you`; blocks everything when `NEXT_PUBLIC_SITE_ENV=preview` |
| Structured data | Organization, WebSite, WebPage / AboutPage / ContactPage / CollectionPage, Service, Article, BreadcrumbList, HowTo, FAQPage, ItemList |
| No fake signals | No reviews, ratings or invented business details in schema; address only when verified |
| Status codes | Custom 404 with real 404 status; permanent (308) redirects for common legacy paths |
| Rendering | All content server-rendered; animation never hides content from crawlers |
| Performance | See SEO_AUDIT.md — desktop Lighthouse 99–100 |
| HTTPS / security | HSTS and security headers in `next.config.ts` |

## International SEO

- English (`en-GB`) only. International business English; metric units; currency labels on price inputs (USD, GBP, EUR, AUD, CAD, PKR).
- **No hreflang** — there are no translated or regional equivalents. Add it only if real localised versions are created.
- **No duplicated country pages.** Market relevance is shown through content (the map, shipping and compliance guidance) rather than thin per-country pages.

## Content plan

Seven launch articles target informational queries that buyers research before choosing an agency. Next topics to consider (write only when there is genuine, accurate material):

1. Incoterms for textile buyers sourcing from Pakistan (FOB vs CIF vs EXW)
2. How to prepare a size chart and tolerance table
3. Understanding AQL inspection results
4. Denim sourcing: what to specify for washes and stretch
5. Sourcing bed linen: percale vs sateen explained
6. Planning a textile sourcing calendar for a seasonal range

## Measurement

Connect Google Search Console and Bing Webmaster Tools (verification meta via env), submit `/sitemap.xml`, and add GA4 or GTM (consent-gated). Tracked events: `quote_submit`, `quote_step`, `contact_submit`, `whatsapp_click`, `email_click`, `phone_click`, `cta_click`. Mark `quote_submit` and `contact_submit` as conversions.
