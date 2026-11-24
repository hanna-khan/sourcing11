import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Panel, StatusBadge } from "@/components/admin/ui";
import { StatusForm } from "@/components/admin/StatusForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteEnquiryAction, updateEnquiryAction } from "@/app/admin/actions";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { productCategoryOptions } from "@/lib/validations/forms";
import { formatBytes, formatDate } from "@/lib/utils/format";

export const metadata = { title: "Quote request" };

export default async function QuoteDetail({ params }: PageProps<"/admin/quotes/[id]">) {
  const session = await requireSession();
  const { id } = await params;
  const q = await store.get("quotes", id);
  if (!q) notFound();

  const details: [string, string | undefined][] = [
    ["Reference", q.reference],
    ["Contact", q.fullName],
    ["Email", q.email],
    ["Country", q.country],
    ["Category", productCategoryOptions.find((c) => c.value === q.productCategory)?.label ?? q.productCategory],
    ["Estimated quantity", q.quantity],
    ["Materials", q.materials],
    ["Target price", q.targetPrice ? `${q.targetPrice} ${q.targetCurrency ?? ""}` : undefined],
    ["Received", formatDate(q.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })],
    ["Notification email", q.emailStatus === "sent" ? "Sent" : q.emailStatus === "failed" ? "Failed to send" : "Not configured"],
  ];

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href="/admin/quotes" className="text-muted-strong underline underline-offset-4">
          ← Quote requests
        </Link>
      </p>
      <AdminHeader
        title={q.companyName}
        intro={`${q.reference} · ${q.fullName}`}
        actions={
          <>
            <StatusBadge status={q.status} />
            <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Your quote request ${q.reference}`)}`} className="inline-flex min-h-11 items-center rounded-pill bg-navy px-5 text-sm font-semibold text-ivory">
              Reply by email
            </a>
          </>
        }
      />
      <div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <Panel title="Product">
            <p className="whitespace-pre-wrap leading-relaxed text-ink">{q.productDescription}</p>
            <h3 className="mt-8 text-sm font-semibold text-navy">Delivery requirements</h3>
            <p className="mt-2 whitespace-pre-wrap text-ink">{q.delivery}</p>
            {q.message && (
              <>
                <h3 className="mt-8 text-sm font-semibold text-navy">Additional message</h3>
                <p className="mt-2 whitespace-pre-wrap text-ink">{q.message}</p>
              </>
            )}
          </Panel>
          <Panel title={`Attachments (${q.attachments.length})`}>
            {q.attachments.length === 0 ? (
              <p className="text-muted-strong">No files were attached.</p>
            ) : (
              <ul className="divide-y divide-line">
                {q.attachments.map((a) => (
                  <li key={a.key} className="flex items-center justify-between gap-4 py-3">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-navy">{a.name}</span>
                      <span className="text-sm text-muted-strong">
                        {formatBytes(a.size)} · {a.type.split("/").pop()}
                      </span>
                    </span>
                    <a href={`/api/admin/attachments/${a.key.split("/").map(encodeURIComponent).join("/")}`} className="flex-none rounded-pill border border-navy/25 px-4 py-2 text-sm font-semibold text-navy">
                      Download<span className="sr-only"> {a.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Details">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {details
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-sm text-muted-strong">{k}</dt>
                    <dd className="mt-1 break-words text-navy">{v}</dd>
                  </div>
                ))}
            </dl>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Manage">
            <StatusForm action={updateEnquiryAction.bind(null, "quotes", q.id)} status={q.status} notes={q.notes} />
          </Panel>
          {session.role === "admin" && (
            <Panel>
              <p className="mb-4 text-sm text-muted-strong">Permanently delete this request and its attachments.</p>
              <ConfirmButton action={deleteEnquiryAction.bind(null, "quotes", q.id)} label="Delete request" />
            </Panel>
          )}
        </aside>
      </div>
    </>
  );
}
