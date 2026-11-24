import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminShell";
import { EntityForm } from "@/components/admin/EntityForm";
import { Notice } from "@/components/admin/ui";
import { collections, pairsToText, type EditableCollection } from "@/lib/admin/collections";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { deleteEntityAction, saveEntityAction } from "@/app/admin/actions";
import { imageKeys, images } from "@/data/images";

export async function generateMetadata({ params }: PageProps<"/admin/[collection]/[id]">) {
  const { collection, id } = await params;
  const cfg = collections[collection as EditableCollection];
  return { title: cfg ? `${id === "new" ? "New" : "Edit"} ${cfg.singular}` : "Admin" };
}

export default async function EditEntity({ params, searchParams }: PageProps<"/admin/[collection]/[id]">) {
  await requireSession();
  const { collection, id } = await params;
  if (!(collection in collections)) notFound();
  const c = collection as EditableCollection;
  const cfg = collections[c];
  const sp = await searchParams;
  const isNew = id === "new";

  const [items, services, categories, media] = await Promise.all([store.list(c), store.list("services"), store.list("categories"), store.list("media")]);
  const item = isNew ? null : ((items as unknown as Record<string, unknown>[]).find((x) => x.id === id) ?? null);
  if (!isNew && !item) notFound();

  // Serialise values for the form (pairs → "Title :: Body" lines, lists → lines).
  const values: Record<string, string | boolean | string[]> = {};
  for (const f of cfg.fields) {
    const v = item?.[f.name];
    if (f.type === "pairs") values[f.name] = pairsToText((v as { title: string; body: string }[]) ?? []);
    else if (f.type === "list") values[f.name] = ((v as string[]) ?? []).join("\n");
    else if (f.type === "multi") values[f.name] = (v as string[]) ?? [];
    else if (f.type === "checkbox") values[f.name] = isNew ? f.name === "published" : Boolean(v);
    else if (f.type === "date") values[f.name] = String(v ?? new Date().toISOString().slice(0, 10));
    else if (f.type === "number") values[f.name] = String(v ?? (items.length + 1));
    else values[f.name] = v === undefined || v === null ? (f.name === "author" ? "Sourcing Eleven" : "") : String(v);
  }

  const options = {
    services: services.filter((s) => s.id !== id).map((s) => ({ value: s.slug, label: s.title })),
    categories: categories.filter((s) => s.id !== id).map((s) => ({ value: s.slug, label: s.title })),
  };
  const imageChoices = [
    ...imageKeys.map((k) => ({ value: k, label: `Library: ${k}`, src: images[k].src })),
    ...media.map((m) => ({ value: m.url, label: `Upload: ${m.name}`, src: m.url })),
  ];

  const title = isNew ? `New ${cfg.singular}` : String(item?.title ?? item?.name ?? cfg.singular);
  const publicHref = item && item.published ? cfg.publicPath(item as { slug?: string; categorySlug?: string }) : null;

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href={`/admin/${c}`} className="text-muted-strong underline underline-offset-4">
          ← {cfg.label}
        </Link>
      </p>
      <AdminHeader
        title={title}
        actions={
          publicHref ? (
            <Link href={publicHref} target="_blank" className="inline-flex min-h-11 items-center rounded-pill border border-navy/25 px-5 text-sm font-semibold text-navy">
              View on website
            </Link>
          ) : undefined
        }
      />
      {sp.saved && <Notice tone="success">Created and saved.</Notice>}
      <EntityForm
        fields={cfg.fields}
        values={values}
        options={options}
        imageChoices={imageChoices}
        action={saveEntityAction.bind(null, c, isNew ? null : id)}
        deleteAction={isNew ? undefined : deleteEntityAction.bind(null, c, id)}
        singular={cfg.singular}
        isNew={isNew}
      />
    </>
  );
}
