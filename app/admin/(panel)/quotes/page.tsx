import { AdminHeader } from "@/components/admin/AdminShell";
import { Notice } from "@/components/admin/ui";
import { SubmissionList } from "@/components/admin/SubmissionList";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { productCategoryOptions } from "@/lib/validations/forms";

export const metadata = { title: "Quote requests" };

export default async function QuotesPage({ searchParams }: PageProps<"/admin/quotes">) {
  await requireSession();
  const sp = await searchParams;
  const rows = (await store.list("quotes")).map((q) => ({
    id: q.id,
    primary: `${q.companyName}`,
    secondary: `${q.fullName} · ${q.reference}`,
    meta: `${productCategoryOptions.find((c) => c.value === q.productCategory)?.label ?? q.productCategory} · ${q.quantity}${q.attachments.length ? ` · ${q.attachments.length} file${q.attachments.length > 1 ? "s" : ""}` : ""}`,
    status: q.status,
    createdAt: q.createdAt,
    extra: `${q.email} ${q.country} ${q.reference}`,
  }));
  return (
    <>
      <AdminHeader title="Quote requests" intro="Requests from the multi-step quote form, including attached tech packs." />
      {sp.deleted && <Notice tone="success">Quote request deleted.</Notice>}
      <SubmissionList base="/admin/quotes" rows={rows} status={typeof sp.status === "string" ? sp.status : undefined} page={Number(sp.page) || 1} q={typeof sp.q === "string" ? sp.q : undefined} />
    </>
  );
}
