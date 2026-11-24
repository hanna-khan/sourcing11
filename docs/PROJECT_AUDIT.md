# Project audit — Sourcing Eleven

_Audit date: 24 November 2026_

## Starting point

The `sourcing_11` folder was **empty** at the start of the project: no repository, framework, components, logo files, fonts, photography, video, backend integrations, styling or SEO configuration existed. There was therefore no working functionality to preserve, and a new production architecture was established.

| Area | Found | Action |
| --- | --- | --- |
| Framework / package.json | None | Next.js 16.4 (App Router) + TypeScript + Tailwind CSS 4 scaffolded |
| Routes / components | None | Full public site, admin and API routes built |
| Logo / brand assets | None supplied | Arc Over (Concept 07) rebuilt as SVG from the brief; PNG exports generated. **Replace with the official vector file when available** (`components/layout/Logo.tsx`, `public/logo/*`) |
| Fonts | None | Manrope (variable) and Cormorant Garamond 500 self-hosted via `next/font/local` (Google Fonts is unreachable from the build environment, and self-hosting is faster and privacy-friendlier anyway) |
| Images / video | None; stock image CDNs blocked from the build environment | Procedural textile material studies generated (`scripts/generate-images.py`). No people, facilities or products are depicted, so nothing misrepresents the business. All replaceable via `data/images.ts` |
| Backend | None | JSON-file store + Supabase driver, enquiry APIs, file storage, Resend email, admin CMS |
| SEO configuration | None | Metadata API, JSON-LD, sitemap, robots, OG images, redirects |

## Architecture decisions

- **Next.js 16.4 App Router.** The scaffold enables Cache Components by default. It was **turned off** in favour of the established static + ISR model: every public page prerenders at build (`revalidate = 3600`) and admin saves call `revalidatePath("/", "layout")`, so edits appear immediately. This avoids Suspense requirements on every dynamic route for no benefit on a content site.
- **`proxy.ts`** (Next 16's replacement for `middleware.ts`) gates `/admin` and `/api/admin`. Every admin page and server action re-checks the session server-side.
- **Storage abstraction** (`lib/database/store.ts`): one API over two drivers. Content collections are seeded from `/data` on first read; after that, the admin owns the content.
- **No unnecessary dependencies.** Markdown, auth, rate limiting and the Resend client are small in-house modules. Runtime deps: `next`, `react`, `gsap`, `motion`, `three`, `@react-three/fiber`, `zod`, `@supabase/supabase-js`, `server-only`.
- **Lenis was not added.** Native scrolling works with GSAP ScrollTrigger, keeps browser accessibility behaviours (keyboard, find-in-page, scroll restoration) and avoids extra main-thread work.

## Business facts treated as unverified

Not invented and therefore hidden until set in `/admin/settings`: email, phone, WhatsApp, address (and the map link, shown only when marked verified), social profiles, founding year, statistics, team members, office/factory locations, certifications, clients, capacities.

The homepage map shows Pakistan as the sourcing base and the UK, Europe, US and Australia as **target buyer markets named in the brief**, labelled as markets — not offices, factories or clients. Editable in settings.
