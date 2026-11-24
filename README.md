# Sourcing Eleven

Website and admin application for **Sourcing Eleven**, an international textile buying and sourcing agency in Pakistan. *Your Bridge from Concept to Shipment.*

Next.js 16.4 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger · Motion · React Three Fiber · Zod · Supabase (optional) · Resend (optional)

## Quick start

```bash
npm ci
cp .env.example .env.local
npm run admin:hash -- "a long passphrase"   # put the hash in ADMIN_PASSWORD_HASH (escape $ as \$)
npm run dev
```

Open http://localhost:3000 — admin at http://localhost:3000/admin.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Develop, build, serve |
| `npm run typecheck` · `lint` · `test` · `test:e2e` · `test:all` | Quality checks |
| `npm run images:generate` | Re-render the textile image library |
| `npm run map:build` | Rebuild the world map data |
| `npm run admin:hash -- "…"` | Hash an admin password |

## Structure

```
app/(site)/        public pages        app/admin/        admin (login + panel)
app/api/           contact, quote, admin attachment download
components/        layout · home · sections · forms · ui · animations · admin · seo · analytics · insights
data/              seed content: services, products, articles, navigation, images, journey, map
lib/               database · auth · validations · seo · analytics · storage · email · utils
docs/              audit, design system, SEO strategy/mapping/audit, deployment, testing
supabase/          schema.sql
tests/             unit (Vitest) · e2e (Playwright)
```

Start with **IMPLEMENTATION_REPORT.md**, then **docs/DEPLOYMENT.md**.
