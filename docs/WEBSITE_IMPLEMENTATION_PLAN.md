# Website implementation plan (as executed)

| Phase | Scope | Status |
| --- | --- | --- |
| 1. Audit & architecture | Empty folder audited; Next.js 16.4 + TS + Tailwind 4 scaffolded; caching model chosen | Done |
| 2. Design system & brand | Tokens, fonts, logo rebuild, procedural textile image library, world-map data | Done |
| 3. Homepage | 11 sections in the specified order, incl. 3D hero, journey, map | Done |
| 4. Inner pages | About, Services (+6), Products (+3), Capabilities, Process, Sustainability, Insights (+7), Contact, Quote, Thank you, Privacy, Terms, 404 | Done |
| 5. Animation & 3D | GSAP ScrollTrigger system, CSS entrances, R3F satin shader with fallbacks, pinned gallery, sticky storytelling, map | Done |
| 6. Backend & admin | Store (file/Supabase), contact + quote APIs, uploads, email, spam defences, admin CMS with roles | Done (external services need credentials) |
| 7. SEO | Metadata, schema, sitemap, robots, OG, redirects, admin overrides, docs | Done |
| 8. Performance, a11y, security | Lighthouse tuning, axe-clean, security headers, upload sniffing, rate limits | Done |
| 9. QA | Typecheck, lint, 26 unit + 60 e2e tests, visual review at breakpoints | Done |
| 10. Report | `IMPLEMENTATION_REPORT.md` | Done |

## Data flow

```
Visitor ─▶ /request-a-quote (QuoteForm, Zod per step)
        ─▶ POST /api/quote ─▶ rate limit ─▶ honeypot/timing/Turnstile ─▶ Zod
                           ─▶ file signature check ─▶ storage (private)
                           ─▶ store.upsert("quotes") ─▶ Resend email (if configured)
        ◀─ { reference } ─▶ /thank-you?ref=S11-…

Admin ─▶ /admin (proxy + server session check)
      ─▶ server actions (Zod) ─▶ store ─▶ revalidatePath("/") ─▶ public pages regenerate
```
