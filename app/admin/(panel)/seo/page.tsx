import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Panel } from "@/components/admin/ui";
import { SimpleActionForm } from "@/components/admin/SimpleActionForm";
import { saveSeoAction } from "@/app/admin/actions";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";

export const metadata = { title: "SEO metadata" };

const staticPages = ["/", "/about", "/services", "/products", "/capabilities", "/our-process", "/sustainability", "/insights", "/contact", "/request-a-quote", "/privacy-policy", "/terms"];

export default async function SeoPage({ searchParams }: PageProps<"/admin/seo">) {
  await requireSession();
  const sp = await searchParams;
  const [overrides, services, categories, articles] = await Promise.all([store.list("seo"), store.list("services"), store.list("categories"), store.list("articles")]);
  const pages = [...staticPages, ...services.map((s) => `/services/${s.slug}`), ...categories.map((c) => `/products/${c.slug}`), ...articles.map((a) => `/insights/${a.slug}`)];
  const selected = typeof sp.path === "string" && pages.includes(sp.path) ? sp.path : null;
  const current = selected ? overrides.find((o) => o.id === selected) : undefined;
  const input = "block w-full rounded-field border border-line bg-white px-4 py-3 text-[0.9375rem]";

  return (
    <>
      <AdminHeader title="SEO metadata" intro="Override the title and meta description of any public page, or remove it from search results. Services, categories and articles can also be edited in their own forms." />
      <div className="grid gap-8 xl:grid-cols-[1fr_26rem]">
        <Panel title="Pages">
          <ul className="divide-y divide-line text-sm">
            {pages.map((p) => {
              const o = overrides.find((x) => x.id === p);
              return (
                <li key={p} className="flex items-center justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-navy">{p}</span>
                    {o && <span className="block truncate text-muted-strong">{o.noindex ? "Hidden from search · " : ""}{o.title ?? "Default title"}</span>}
                  </span>
                  <Link href={`/admin/seo?path=${encodeURIComponent(p)}`} className="flex-none font-semibold text-navy underline underline-offset-4" aria-current={selected === p ? "page" : undefined}>
                    {o ? "Edit override" : "Override"}
                    <span className="sr-only"> for {p}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
        <div className="xl:sticky xl:top-8 xl:self-start">
          {selected ? (
            <Panel title={`Override ${selected}`}>
              <SimpleActionForm action={saveSeoAction} submitLabel="Save override" key={selected}>
                <input type="hidden" name="path" value={selected} />
                <div className="space-y-5">
                  <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-semibold text-navy">
                      SEO title
                    </label>
                    <input id="title" name="title" defaultValue={current?.title} maxLength={80} className={input} />
                    <p className="mt-1.5 text-xs text-muted-strong">Leave empty to keep the default. Brand name is appended unless already included.</p>
                  </div>
                  <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-semibold text-navy">
                      Meta description
                    </label>
                    <textarea id="description" name="description" defaultValue={current?.description} maxLength={200} rows={4} className={input} />
                  </div>
                  <label className="flex items-center gap-3 text-sm font-semibold text-navy">
                    <input type="checkbox" name="noindex" defaultChecked={current?.noindex} className="h-5 w-5 accent-[var(--color-navy)]" />
                    Hide this page from search engines (noindex)
                  </label>
                  <p className="text-xs text-muted-strong">Clearing every field removes the override.</p>
                </div>
              </SimpleActionForm>
            </Panel>
          ) : (
            <Panel title="Choose a page">
              <p className="text-sm text-muted-strong">Select “Override” next to a page to edit its search appearance.</p>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
