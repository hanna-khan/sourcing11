# SEO audit

_Run 24 November 2026 against a local production build (`next build` + `next start`)._

## Automated checks (Playwright, `tests/e2e/10-seo.spec.ts`, `20-links.spec.ts`) — all passing

- All 28 public URLs return 200 and are server-rendered.
- Every page: exactly one H1; unique title (≤ 75 characters including brand); unique meta description (60–160 characters); self-referencing canonical; Open Graph title and image; `summary_large_image` X card; JSON-LD present; not noindexed.
- JSON-LD parses and contains the expected types on home, service, category, article and process pages; no rating or review markup.
- `sitemap.xml` lists all 28 URLs and excludes `/admin` and `/thank-you`; `robots.txt` disallows admin and points to the sitemap.
- OG images render (`/opengraph-image`, `/og/insights/*`); logo, icons and manifest return 200.
- Unknown URLs and unknown service or article slugs return a real 404; `/thank-you` is noindex; legacy paths 308-redirect (e.g. `/blog` → `/insights`).
- Link crawl: every internal link and image source across all 28 pages resolves (< 400). No empty or `javascript:` links.

## Lighthouse (local, Lighthouse 12)

Desktop preset:

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 99 | 100 | 100 | 100 | 0.9 s | 0 | 20 ms |
| `/services/textile-sourcing` | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| `/about` | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| `/insights/understanding-fabric-quality-and-inspection` | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |

Mobile preset (simulated slow 4G + 4× CPU slowdown). Accessibility, best practices and SEO were 100 on every page tested. Performance and LCP varied noticeably between identical runs on the shared test machine, so ranges across repeated runs are shown:

| Page | Perf | LCP | TBT |
| --- | --- | --- | --- |
| `/` | 84–95 | 2.0–4.0 s | 200–430 ms |
| `/services/textile-sourcing` | 98 | 2.1 s | 100 ms |
| `/products/home-textiles` | 90–96 | 1.7–3.5 s | 110–265 ms |
| `/about` | 86–100 | 1.7–3.5 s | 60–400 ms |
| `/contact` | 92–100 | 1.9–3.4 s | 30–130 ms |
| `/insights/…fabric-quality…` | 96–99 | 1.6–2.8 s | 40–80 ms |

CLS is 0 everywhere. Mobile LCP is close to, and sometimes above, the 2.5 s target in lab conditions. Re-measure on the production host with PageSpeed Insights and watch real-user Core Web Vitals in Search Console once traffic exists.

### Performance work done during the audit

- Above-the-fold entrances moved from JavaScript to CSS (mobile LCP on the homepage went from 5.3 s to about 2–3.5 s).
- Served fonts cut from 7 files to 3.
- Motion switched to `LazyMotion` (smaller bundle).
- Scroll-animation setup deferred to browser idle time.
- The 3D hero loads only after `load` + idle, never on mobile, reduced-motion, data-saver, low-power or software-rendered GPUs (desktop TBT went from 1,030 ms to 20 ms).
- Hero images use priority loading, responsive `sizes` and AVIF/WebP.

## To do after launch (needs a live domain)

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin. Canonicals, sitemap and schema use it; it currently defaults to `http://localhost:3000`.
2. Verify Search Console and Bing (env meta tags), submit the sitemap, inspect key URLs.
3. Run PageSpeed Insights on the production URL.
4. Validate structured data with Google's Rich Results Test and the schema.org validator.
5. Replace procedural imagery with real photography as it becomes available; keep the filenames and alt text descriptive.

## Re-run after the design refinement round (24 November 2026)

All SEO end-to-end checks still pass. Desktop Lighthouse on all 11 main pages: performance 99–100, accessibility 100, best practices 100, SEO 100. Mobile: accessibility, best practices and SEO 100 everywhere; performance 79–98 with LCP 1.8–4.2 s on the noisy simulated profile. OG images and Organization schema now use the official logo (`/logo/sourcing11-logo.png`).
