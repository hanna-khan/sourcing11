# Deployment guide

Requirements: Node.js ≥ 20.9 (tested on 22), npm.

## 1. Install and check locally

```bash
npm ci
cp .env.example .env.local     # fill in at least SESSION_SECRET and an admin user
npm run admin:hash -- "a long passphrase"   # paste into ADMIN_PASSWORD_HASH (escape $ as \$)
npm run dev                    # http://localhost:3000, admin at /admin
```

## 2. Choose a data backend

### Option A — Supabase (recommended; required on Vercel and other serverless hosts)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor. It creates the `records` table with RLS enabled and no policies, plus two private buckets.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the server only. The key is never sent to browsers; every database call runs in server code (`lib/database/*`, which imports `server-only`).
4. On first request, content collections seed themselves from `/data`.

### Option B — single Node server with persistent disk (VPS, Docker, Render disk, etc.)

Leave the Supabase variables unset. Data and uploads live under `DATA_DIR` (default `./.data`). Mount it on persistent storage and back it up. Run one instance only: the file store and in-memory rate limiter are per-process.

## 3. Configure services

| Variable(s) | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, schema, OG (**required**) |
| `SESSION_SECRET`, `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` or `ADMIN_USERS` | Admin sign-in (**required**) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFICATION_EMAIL` | Email notifications for new enquiries (verify the sending domain in Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional CAPTCHA layer |
| `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_ID` | Analytics (consent banner appears automatically) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Search Console / Bing Webmaster verification |
| `NEXT_PUBLIC_SITE_ENV=preview` | Staging: blocks all crawling |

Without email configured, submissions are still saved and visible in the admin. The dashboard shows which services are configured.

## 4. Build and run

```bash
npm run build
npm start            # or deploy to Vercel: framework preset "Next.js", set env vars, deploy
```

## 5. After the first deploy

1. Sign in at `/admin`, open **Website settings** and enter the verified email, phone, WhatsApp, address (tick "verified" to show the map link) and social profiles.
2. Upload real photography in **Media library** and assign it to services and categories (or replace files in `public/images` with the same names).
3. Replace `components/layout/Logo.tsx` and `public/logo/*` with the official logo file if it differs.
4. Submit `/sitemap.xml` in Search Console and Bing; run PageSpeed Insights.
5. If running more than one instance, move rate limiting to a shared store (e.g. Upstash Redis) in `lib/rate-limit.ts`.

## Updating seed content

`/data/*.ts` seeds a fresh install only. On an existing install, edit content in the admin. To reset a local file store, delete `.data/` (this also deletes local enquiries).

## Maintenance scripts

- `npm run images:generate` — re-render the procedural image library (Python 3 + numpy, scipy, Pillow)
- `npm run map:build` — regenerate the pre-projected world map
- `npm run admin:hash -- "…"` — create a password hash
