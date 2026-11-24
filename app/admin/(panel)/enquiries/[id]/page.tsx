import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Panel, StatusBadge } from "@/components/admin/ui";
import { StatusForm } from "@/components/admin/StatusForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteEnquiryAction, updateEnquiryAction } from "@/app/admin/actions";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Enquiry" };

export default async function EnquiryDetail({ params }: PageProps<"/admin/enquiries/[id]">) {
  const session = await requireSession();
  const { id } = await params;
  const e = await store.get("enquiries", id);
  if (!e) notFound();

  const rows: [string, string | undefined, string?][] = [
    ["Email", e.email, `mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.subject}`)}`],
    ["Company", e.company],
    ["Phone", e.phone],
    ["Country", e.country],
    ["Subject", e.subject],
    ["Received", formatDate(e.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })],
    ["Notification email", e.emailStatus === "sent" ? "Sent" : e.emailStatus === "failed" ? "Failed to send" : "Not configured"],
    ["Submitted from", e.meta?.source],
  ];

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href="/admin/enquiries" className="text-muted-strong underline underline-offset-4">
          ← Enquiries
        </Link>
      </p>
      <AdminHeader title={e.name} intro={e.company} actions={<StatusBadge status={e.status} />} />
      <div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <Panel title="Message">
            <p className="whitespace-pre-wrap leading-relaxed text-ink">{e.message}</p>
          </Panel>
          <Panel title="Details">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {rows
                .filter(([, v]) => v)
                .map(([k, v, href]) => (
                  <div key={k}>
                    <dt className="text-sm text-muted-strong">{k}</dt>
                    <dd className="mt-1 break-words text-navy">
                      {href ? (
                        <a href={href} className="underline underline-offset-4">
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
            </dl>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Manage">
            <StatusForm action={updateEnquiryAction.bind(null, "enquiries", e.id)} status={e.status} notes={e.notes} />
          </Panel>
          {session.role === "admin" && (
            <Panel>
              <p className="mb-4 text-sm text-muted-strong">Permanently delete this enquiry and its personal data.</p>
              <ConfirmButton action={deleteEnquiryAction.bind(null, "enquiries", e.id)} label="Delete enquiry" />
            </Panel>
          )}
        </aside>
      </div>
    </>
  );
}
