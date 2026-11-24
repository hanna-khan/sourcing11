import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Notice, Panel, StatusBadge } from "@/components/admin/ui";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { isEmailConfigured } from "@/lib/email";
import { isTurnstileConfigured } from "@/lib/spam";
import { formatDate } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/site";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const session = await requireSession();
  const sp = await searchParams;
  const [enquiries, quotes, services, categories, products, articles, media] = await Promise.all([
    store.list("enquiries"),
    store.list("quotes"),
    store.list("services"),
    store.list("categories"),
    store.list("products"),
    store.list("articles"),
    store.list("media"),
  ]);

  const recent = [...enquiries.map((e) => ({ id: e.id, kind: "enquiries" as const, who: e.name, what: e.subject, status: e.status, at: e.createdAt })), ...quotes.map((q) => ({ id: q.id, kind: "quotes" as const, who: `${q.fullName} · ${q.companyName}`, what: `Quote ${q.reference}`, status: q.status, at: q.createdAt }))]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  const checks = [
    { label: "Data storage", ok: store.backend() === "supabase", detail: store.backend() === "supabase" ? "Supabase PostgreSQL + Storage" : "Local file store (.data/). Fine for development and single-server hosting; configure Supabase for serverless production." },
    { label: "Email notifications", ok: isEmailConfigured(), detail: isEmailConfigured() ? "Resend configured" : "Not configured — submissions are saved but no email is sent. Set RESEND_API_KEY, EMAIL_FROM and NOTIFICATION_EMAIL." },
    { label: "Spam protection", ok: isTurnstileConfigured(), detail: isTurnstileConfigured() ? "Honeypot, timing check, rate limits and Cloudflare Turnstile" : "Honeypot, timing check and rate limits active. Add Turnstile keys for a CAPTCHA layer." },
    { label: "Analytics", ok: Boolean(process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GTM_ID), detail: process.env.NEXT_PUBLIC_GTM_ID ? "Google Tag Manager (consent-gated)" : process.env.NEXT_PUBLIC_GA4_ID ? "Google Analytics 4 (consent-gated)" : "No GA4 or GTM ID set." },
    { label: "Site URL", ok: !SITE_URL.includes("localhost"), detail: SITE_URL },
  ];

  const stat = (label: string, value: number, href: string, sub?: string) => (
    <Link href={href} className="group rounded-card border border-line bg-white p-6 transition-colors hover:border-navy/30">
      <p className="text-sm text-muted-strong">{label}</p>
      <p className="font-serif-display mt-2 text-[3rem] leading-none text-navy">{value}</p>
      {sub && <p className="mt-2 text-sm text-gold-ink">{sub}</p>}
    </Link>
  );

  return (
    <>
      <AdminHeader title={`Welcome, ${session.name.split(" ")[0]}`} intro="An overview of new enquiries, content and system configuration." />
      {sp.denied && <Notice tone="warning">That area needs an administrator account.</Notice>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stat("Enquiries", enquiries.length, "/admin/enquiries", `${enquiries.filter((e) => e.status === "new").length} new`)}
        {stat("Quote requests", quotes.length, "/admin/quotes", `${quotes.filter((q) => q.status === "new").length} new`)}
        {stat("Published articles", articles.filter((a) => a.published).length, "/admin/articles")}
        {stat("Services · Categories · Products", services.length + categories.length + products.length, "/admin/services", `${media.length} media files`)}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Latest submissions">
          {recent.length === 0 ? (
            <p className="text-muted-strong">No submissions yet. New contact and quote requests will appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/${r.kind}/${r.id}`} className="flex items-center justify-between gap-4 py-4 hover:bg-ivory/60">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-navy">{r.who}</span>
                      <span className="block truncate text-sm text-muted-strong">
                        {r.what} · {formatDate(r.at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </span>
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Configuration status">
          <ul className="space-y-4">
            {checks.map((c) => (
              <li key={c.label} className="flex gap-3">
                <span aria-hidden="true" className={c.ok ? "mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-success" : "mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-gold"} />
                <span>
                  <span className="block text-sm font-semibold text-navy">
                    {c.label} <span className="sr-only">{c.ok ? "(configured)" : "(needs attention)"}</span>
                  </span>
                  <span className="block break-words text-sm text-muted-strong">{c.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
