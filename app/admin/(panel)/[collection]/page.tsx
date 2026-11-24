import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminShell";
import { AdminLinkButton, EmptyState, Notice } from "@/components/admin/ui";
import { collections, type EditableCollection } from "@/lib/admin/collections";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { resolveImage } from "@/data/images";
import { formatDate } from "@/lib/utils/format";

export async function generateMetadata({ params }: PageProps<"/admin/[collection]">) {
  const { collection } = await params;
  return { title: collections[collection as EditableCollection]?.label ?? "Admin" };
}

type Row = { id: string; title: string; sub: string; image: string; published: boolean; updatedAt?: string; href: string; order?: number };

export default async function CollectionList({ params, searchParams }: PageProps<"/admin/[collection]">) {
  await requireSession();
  const { collection } = await params;
  if (!(collection in collections)) notFound();
  const c = collection as EditableCollection;
  const cfg = collections[c];
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";

  const items = (await store.list(c)) as unknown as Record<string, unknown>[];
  const rows: Row[] = items
    .map((it) => ({
      id: String(it.id),
      title: String(it.title ?? it.name ?? ""),
      sub: c === "products" ? String(it.categorySlug) : c === "articles" ? `${it.category} · ${formatDate(String(it.publishedAt))}` : `/${String(it.slug)}`,
      image: String(it.image ?? ""),
      published: Boolean(it.published),
      updatedAt: it.updatedAt as string | undefined,
      href: cfg.publicPath(it as { slug?: string; categorySlug?: string }),
      order: it.order as number | undefined,
    }))
    .filter((r) => !q || r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q))
    .sort((a, b) => (c === "articles" ? (a.sub < b.sub ? 1 : -1) : (a.order ?? 0) - (b.order ?? 0)));

  return (
    <>
      <AdminHeader title={cfg.label} intro={`Create, edit and publish ${cfg.label.toLowerCase()}. Changes appear on the website immediately after saving.`} actions={<AdminLinkButton href={`/admin/${c}/new`}>New {cfg.singular}</AdminLinkButton>} />
      {sp.deleted && <Notice tone="success">The {cfg.singular} was deleted.</Notice>}
      <form className="mb-6 flex max-w-md gap-2" role="search">
        <label htmlFor="q" className="sr-only">
          Search {cfg.label.toLowerCase()}
        </label>
        <input id="q" name="q" defaultValue={q} placeholder={`Search ${cfg.label.toLowerCase()}`} className="min-h-11 flex-1 rounded-field border border-line bg-white px-4 text-sm focus:border-navy focus:outline-none" />
        <button type="submit" className="min-h-11 rounded-pill border border-navy/25 px-4 text-sm font-semibold text-navy">
          Search
        </button>
      </form>
      {rows.length === 0 ? (
        <EmptyState title={q ? "Nothing matches that search" : `No ${cfg.label.toLowerCase()} yet`} body={q ? "Try a different word, or clear the search." : `Create the first ${cfg.singular} to publish it on the website.`} action={<AdminLinkButton href={`/admin/${c}/new`}>New {cfg.singular}</AdminLinkButton>} />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line bg-ivory/60 text-muted-strong">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  {c === "products" ? "Product" : "Title"}
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Updated
                </th>
                <th scope="col" className="px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const img = resolveImage(r.image);
                return (
                  <tr key={r.id} className="hover:bg-ivory/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        <span className="relative h-12 w-16 flex-none overflow-hidden rounded-media bg-ivory">
                          <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <Link href={`/admin/${c}/${r.id}`} className="block truncate font-semibold text-navy hover:underline">
                            {r.title}
                          </Link>
                          <span className="block truncate text-muted-strong">{r.sub}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={r.published ? "rounded-pill bg-success/10 px-2.5 py-1 text-xs font-semibold text-success" : "rounded-pill bg-line px-2.5 py-1 text-xs font-semibold text-muted-strong"}>{r.published ? "Published" : "Draft"}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-strong">{r.updatedAt ? formatDate(r.updatedAt, { day: "numeric", month: "short", year: "numeric" }) : "Initial content"}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <Link href={`/admin/${c}/${r.id}`} className="font-semibold text-navy underline underline-offset-4">
                          Edit<span className="sr-only"> {r.title}</span>
                        </Link>
                        {r.published && (
                          <Link href={r.href} target="_blank" className="text-muted-strong underline underline-offset-4">
                            View<span className="sr-only"> {r.title} on the website</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
