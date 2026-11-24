import { AdminHeader } from "@/components/admin/AdminShell";
import { Notice } from "@/components/admin/ui";
import { SubmissionList } from "@/components/admin/SubmissionList";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  await requireSession();
  const sp = await searchParams;
  const rows = (await store.list("enquiries")).map((e) => ({
    id: e.id,
    primary: e.name,
    secondary: [e.company, e.email].filter(Boolean).join(" · "),
    meta: `${e.subject}: ${e.message}`,
    status: e.status,
    createdAt: e.createdAt,
    extra: e.country,
  }));
  return (
    <>
      <AdminHeader title="Enquiries" intro="Messages sent through the contact form." />
      {sp.deleted && <Notice tone="success">Enquiry deleted.</Notice>}
      <SubmissionList base="/admin/enquiries" rows={rows} status={typeof sp.status === "string" ? sp.status : undefined} page={Number(sp.page) || 1} q={typeof sp.q === "string" ? sp.q : undefined} />
    </>
  );
}
