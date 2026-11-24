# Testing and QA

```bash
npm run typecheck      # next typegen + tsc --noEmit
npm run lint           # ESLint (Next core-web-vitals + TypeScript rules)
npm test               # Vitest unit tests
npm run build
E2E_ADMIN_PASSWORD="…" npm run test:e2e   # Playwright against the production build
npm run test:all       # everything, in order
```

The Playwright server uses an isolated `DATA_DIR=.data-e2e`, so tests never touch real enquiries or content. Set `PLAYWRIGHT_CHROME_PATH` if Chrome isn't in the default location. Admin tests are skipped when `E2E_ADMIN_PASSWORD` isn't set.

## Results — 24 November 2026

| Check | Result |
| --- | --- |
| TypeScript | Pass, 0 errors |
| ESLint | Pass, 0 errors, 0 warnings |
| Production build | Pass: 45 routes, all public pages statically prerendered |
| Unit tests (Vitest) | **26 / 26 passed** |
| End-to-end (Playwright, Chrome) | **91 passed, 5 skipped** (skips are desktop-only and mobile-only tests on the other viewport, by design) — latest run after the design refinement round |
| axe WCAG 2.2 AA (11 page types × desktop + mobile) | No serious or critical violations |

### Unit coverage

Form schemas and plain-language errors; FormData parsing; session signing (tamper and expiry rejection); scrypt password hashing; rate limiter; upload signature sniffing (disguised files rejected); seed content integrity (six services, three categories, all records valid, unique and length-checked SEO fields, valid image and relation references, a banned-claims check against invented statistics and certifications); admin form round-trips; utilities.

### End-to-end coverage

- **SEO**: metadata, canonical, H1 and uniqueness on all 28 pages; JSON-LD; sitemap; robots; OG images; 404s; noindex; redirects; security headers; logo, icon and manifest assets.
- **Links**: crawl of every internal link and image across the site.
- **Navigation**: mega menu (hover, toggle, Escape, link), mobile dialog (open, expand, navigate, Escape), hero CTAs, service cards, breadcrumbs, skip link, insights category filter, article TOC and share links.
- **Forms**: contact validation, focus and submission; four-step quote with category preselection, disguised-file rejection, real PDF upload, review step, consent and thank-you reference; API rejection of bots, too-fast submissions, invalid payloads and disguised uploads.
- **Admin**: route and API protection, failed sign-in, quote review, attachment download, status and notes update, article create/publish/edit/delete reflected publicly, service edit, settings (email/WhatsApp appear on the contact page), SEO override (title changes), media upload.
- **Brand & heroes** (`35-brand-hero.spec.ts`): navbar hides immediately on scroll down, stays hidden (no delayed reappearance), ignores jitter, reveals on scroll up, always visible at the top, stays visible for keyboard focus; "Scroll to explore" absent on every hero; official logo files in header, footer and admin, decoding correctly; a page-specific hero visual on 11 pages; heroes render without console errors and headlines end fully visible.
- **Responsive**: no horizontal overflow at 360, 390, 430, 768, 1024, 1440 and 1920 px across five page types; reduced motion shows all content with no WebGL; mobile menu touch targets ≥ 44 px.

## Not tested here

- **Firefox, Safari and Edge** were not available in the build environment. Only Chrome was tested. Run `npx playwright install` and add Firefox/WebKit projects to `playwright.config.ts` on a machine with network access.
- **Real email delivery, Supabase and Turnstile** need credentials. Their code paths are implemented but have not been exercised against the live services.
- **The 3D hero on a real GPU.** The test environment only has a software renderer, on which the site deliberately falls back to the static image. The shader was visually reviewed in software rendering only; check it on a few real devices (and tune `FabricCanvas.tsx` uniforms if needed).
