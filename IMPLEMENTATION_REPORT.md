# Sourcing Eleven — implementation report

_24 November 2026 · Next.js 16.4 · React 19 · TypeScript · Tailwind CSS 4_

**Status key:** ✅ Completed and tested · 🟢 Completed (manually reviewed, no automated test) · 🟡 Partially completed · 🔒 Blocked on credentials or business information

---

## 0. Design refinement round — 24 November 2026 (latest)

| Request | Status | What was done |
| --- | --- | --- |
| Official logo everywhere | ✅ | Supplied files kept unaltered in `public/logo/source/`. Variants are exact crops: the mark (arc + wordmark) and the full lockup with tagline. The light-on-transparent version takes its colours pixel-for-pixel from the supplied on-navy file (alpha recovered from the transparent file). Used in the header (crossfades ivory → navy as the bar turns white), mobile menu, homepage hero, footer (full lockup), admin sidebar and login, 404, OG share images and Organization schema. Favicon and apple icon use the gold "11" from the logo on navy. The old SVG recreation is removed. |
| Navbar hide/show | ✅ | Root cause: the old handler un-hid the bar on any scroll event with a delta of 4 px or less, so it reappeared during slow or trackpad scrolling. New handler runs once per animation frame, needs 8 px of continuous travel to change state, hides immediately (280 ms slide), reveals smoothly on scroll up (450 ms), is always visible within 12 px of the top, stays visible while a menu is open or keyboard focus is inside, and sticky sub-navs follow it. Covered by tests on desktop and mobile, run three times in a row with no flakes. |
| Remove "Scroll to explore" | ✅ | Markup, CSS animation and decorative line removed. A test asserts it is absent on every hero. |
| Hero treatment per page | ✅ | Home: 3D satin, official logo wipe reveal, new quick links to the three categories. About: two arches joined by a drawn gold bridge. Services: the six services fanned along an arc (each a link, name on hover/focus). Service pages: arch image, floating swatch and a slowly turning "Stage 0X of 06" ring. Products: three rising arched category columns. Category pages: arch with **live 3D fabric in the category's material** (denim, champagne silk, ivory linen). Capabilities: parallax swatch mosaic. Our Process: the six stages drawn along the bridge arc (numbered list on phones). Sustainability: flowing thread lines over undyed cotton. Insights: fanned stack of the latest article covers. Contact: signal arcs from the Pakistan base to buyer markets. |
| Animation technique | ✅ | Entrances are CSS, starting at first paint so LCP is unaffected. GSAP adds pointer drift (fine pointers only, via `quickTo`, no RAF loop) and scroll-out depth (ScrollTrigger scrub), set up when the browser is idle. Layered backgrounds: gold glow plus two arcs drawn on load. |
| Homepage refinement | ✅ | Category quick-route strip in the hero; journey stage spacing tightened (72vh → 54vh); active journey stage marked by a gold title instead of dimming (which failed contrast); warmer map market tint; softer "Why us" rhythm; CTA band fades into the footer; footer uses the full lockup instead of a duplicated serif tagline. |
| Reduced motion / fallbacks | ✅ | Reduced motion now also cancels animation *delays* (previously late headline words briefly sat at 25% opacity). 3D layers never run on mobile, data saver, low-power or software-GPU devices, or without WebGL; static images sit underneath. |

**Verification for this round (all executed):** TypeScript 0 errors · ESLint 0 errors / 0 warnings · Vitest 26/26 · Playwright **91 passed, 5 skipped by design** (new: navbar behaviour ×2 viewports, keyboard pin, Scroll-to-explore absence, official logo in header/footer/admin, a hero visual on 11 pages, error-free hero rendering on 11 pages × 2 viewports) · production build passes.

**Lighthouse after this round.** Desktop, all 11 main pages: performance 99–100, accessibility 100, best practices 100, SEO 100, LCP 0.7–0.9 s, CLS 0, TBT 0–50 ms. Mobile (simulated slow 4G, 4× CPU; noisy on this shared machine, so ranges are shown): performance 79–98, accessibility, best practices and SEO 100 on every page, CLS 0, LCP 1.8–4.2 s. The mobile LCP element is the page headline and its render time varies with CPU load; it is often above the 2.5 s target in these lab runs. Measure on production hosting.

**Not verified:** the 3D layers on a real GPU (the test machine only has a software renderer, where they correctly stay off); Firefox, Safari and Edge.

---

## 1. Pages implemented

| Route | Status | Notes |
| --- | --- | --- |
| `/` | ✅ | All 11 sections in the specified order |
| `/about` | ✅ | Team section appears automatically once real team members are entered |
| `/services` + 6 service pages | ✅ | Hero, intro, Markdown detail, process, benefits, related, CTA, Service schema |
| `/products` + 3 category pages | ✅ | Hero, product types, pinned horizontal range gallery, capabilities, lightbox gallery, process, related, enquiry CTA with category preselected |
| `/capabilities` | ✅ | Sticky in-page nav, fabric tabs, 7 capability blocks |
| `/our-process` | ✅ | Detailed sticky journey, FAQ, HowTo + FAQ schema |
| `/sustainability` | ✅ | Evidence-first wording; no certifications claimed |
| `/insights` + 7 articles | ✅ | Featured, category filter, pagination, TOC, reading time, author, share, related, Article schema |
| `/contact` | ✅ | Details appear only when set in admin; map link only when address is verified |
| `/request-a-quote` | ✅ | 4-step form with all specified fields |
| `/thank-you` | ✅ | Shows the quote reference; noindex |
| `/privacy-policy`, `/terms` | 🟢 | Sensible drafts. **Have them reviewed by someone qualified before launch.** |
| 404 | ✅ | Real 404 status |
| `/admin` (12 screens) | ✅ | See section 4 |

## 2. Components implemented

Navbar (transparent → solid, hides on scroll down), desktop mega menus, full-screen mobile navigation, footer, page heroes, section headings, service cards, product cards, image cards, pinned horizontal gallery, lightbox gallery, CTA band, process steps, benefit list, interactive journey timeline, world map, breadcrumbs (+ schema), accordion, tabs, form fields, drag-and-drop file upload, toasts, loading/disabled buttons, error, empty and success states, pagination (client and server), article cards, related content, scroll progress line, back-to-top, consent banner, skip links. Documented in `docs/DESIGN_SYSTEM.md`.

## 3. Animations implemented

| Animation | Status |
| --- | --- |
| Hero: arc line drawing, logo reveal (arc draw + letter-spacing settle), staggered headline, fabric movement, mouse parallax, scroll cue | ✅ |
| 3D satin hero (React Three Fiber + custom GLSL: domain-warped folds, analytic normals, navy/champagne lighting, pointer ripple) | 🟡 Built and reviewed on a software renderer only. Falls back to a static image on mobile, reduced motion, data saver, low-power devices, software GPUs, no WebGL, render errors or lost context. **Check on real GPUs.** |
| Scroll: section reveal, word-by-word headings, image masks, image scale, parallax, SVG line drawing, staggered lists | ✅ |
| Sticky storytelling journey with progress line (desktop) and vertical timeline (mobile) | ✅ |
| Pinned horizontal-scroll product gallery | ✅ |
| Counters for verified statistics (hidden until figures are entered) | 🟢 |
| Magnetic CTAs, animated nav underline, mega-menu transitions, card zoom, gold hover lines, animated arrows, accordion, tabs, lightbox, page transitions | ✅ |
| Interactive world map: highlighted countries, drawn connection arcs, travelling lights, hover/focus tooltips (text list on mobile) | ✅ |
| Reduced motion: everything visible, no 3D, no scroll animation | ✅ |

## 4. Backend functionality

| Feature | Status |
| --- | --- |
| Contact API: Zod validation, rate limit (5 per 10 min per IP), honeypot, timing check, optional Turnstile | ✅ |
| Quote API: up to 3 files × 10 MB, file-signature verification (browser and server), private storage, reference numbers | ✅ |
| Storage: JSON file + local uploads (dev and single server) | ✅ |
| Storage: Supabase PostgreSQL + Storage (`supabase/schema.sql`, RLS on, service role server-only) | 🔒 Implemented; untested without a project |
| Email notifications via Resend | 🔒 Implemented; without keys, enquiries are saved and marked "Not configured" (never shown as sent) |
| Admin auth: scrypt hashes, HMAC-signed httpOnly cookie (8 h), proxy + server-side checks, login rate limit, admin/editor roles | ✅ |
| Admin: dashboard with configuration status | ✅ |
| Admin: enquiries and quotes (filter, search, pagination, status, notes, delete for admins, authenticated attachment download) | ✅ |
| Admin: CRUD for services, categories, products and articles (validation, slug generation, unsaved-changes warning, SEO snippet preview, two-step delete) | ✅ |
| Admin: media library (upload with alt text, edit alt, copy URL, delete) | ✅ |
| Admin: website settings (contact, social, map markets, verified stats, team) | ✅ |
| Admin: SEO overrides per page (title, description, noindex) | ✅ |
| Public pages update immediately after admin saves (on-demand revalidation) | ✅ |

## 5. SEO implementation

Metadata API on every page (unique titles and descriptions, canonical, OG, X), dynamic sitemap, robots (with staging lockout), JSON-LD (Organization, WebSite, WebPage variants, Service, Article, BreadcrumbList, HowTo, FAQPage, ItemList), branded OG images, custom 404, 308 redirects, server-rendered content, image alt text, internal linking, consent-gated GA4/GTM with event tracking, verification meta. ✅ Details in `docs/SEO_STRATEGY.md`, `docs/KEYWORD_MAPPING.md` and `docs/SEO_AUDIT.md`.

Not done, by design: hreflang (no translated versions), country landing pages (would be duplicates), search-volume claims (not validated).

## 6. Test results (actually executed)

| Check | Result |
| --- | --- |
| `tsc --noEmit` | ✅ 0 errors |
| ESLint | ✅ 0 errors, 0 warnings |
| Unit tests (Vitest) | ✅ 26 / 26 |
| E2E (Playwright, Chrome, desktop 1440 + mobile 390) | ✅ 60 passed, 4 skipped by design |
| axe WCAG 2.2 AA, 11 page types × 2 viewports | ✅ No serious or critical violations |
| Horizontal overflow at 360–1920 px | ✅ None |
| Broken-link crawl | ✅ None |

Issues found and fixed during QA include: hover then click closing the mega menu; raw Zod messages on empty fields; React 19 form reset wiping admin input on validation errors; disguised uploads only caught server-side; a silent fake success for fast human submissions; logo links failing label-in-name; contrast on dimmed timeline steps; overlapping map tap targets on mobile; over-long titles and descriptions; parallax gaps; the GSAP transform overriding staggered card offsets.

## 7. Build results

`next build` succeeds: 45 routes; all public pages, sitemap, robots and OG images prerendered as static or ISR; admin and APIs dynamic. Proxy active for `/admin` and `/api/admin`.

## 8. Performance findings

Desktop Lighthouse: **99–100 performance**, 100 accessibility, best practices and SEO; LCP 0.7–0.9 s; CLS 0; TBT 0–20 ms.

Mobile (simulated slow 4G, 4× CPU): performance **84–100**, accessibility, best practices and SEO **100**, CLS 0. LCP is **1.6–4.0 s** depending on page and run, so it is close to — and on the homepage often above — the 2.5 s target in lab tests. The lab numbers were noisy on the shared build machine. Next steps: measure on production hosting with a CDN (PageSpeed Insights), then consider a lighter hero image on mobile and trimming the homepage's JavaScript further.

## 9. Known limitations

- **Brand assets**: the official logo is now in place (PNG). If a vector (SVG/AI/EPS) master exists, it can replace the PNGs in `public/logo` for even sharper scaling.
- **Photography**: procedural textile studies, not real photographs. They are cohesive and honest (no people, factories or products are claimed), but genuine product, material and team photography will strengthen trust.
- **Browsers**: only Chrome was tested. Firefox, Safari and Edge are untested.
- **3D**: reviewed on a software renderer only.
- **Multi-instance hosting**: the rate limiter is in-memory per instance; the file store needs a single instance with a persistent disk.
- **Seed content**: `/data` only seeds a fresh install. After that, edit in the admin.
- **Legal pages and "Our story" copy** need business review. The story wording is deliberately general and should be replaced with the real founding story.

## 10. Missing credentials and business details

| Needed | Effect until provided |
| --- | --- |
| Production domain → `NEXT_PUBLIC_SITE_URL` | Canonicals and sitemap point at localhost |
| `SESSION_SECRET` + admin user(s) | Admin sign-in disabled in production |
| Supabase URL + service-role key | Must use a single server with a persistent disk |
| Resend key, sender domain, notification address | No email alerts (submissions still saved) |
| Turnstile keys | No CAPTCHA (honeypot, timing and rate limits still active) |
| GA4 or GTM ID | No analytics, no consent banner |
| Search Console / Bing tokens | Verify by another method |
| Verified email, phone, WhatsApp, address, social links | Hidden on the site and omitted from schema |
| Verified statistics, team, founding year | Sections hidden |

## 11. Remaining production configuration

See `docs/DEPLOYMENT.md`: set env vars → run `supabase/schema.sql` → build and deploy → enter verified business details in `/admin/settings` → upload photography → submit the sitemap → run PageSpeed Insights.
