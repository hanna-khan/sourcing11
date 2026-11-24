import Link from "next/link";
import { EmptyState, ServerPagination, StatusBadge, statusLabels } from "./ui";
import type { EnquiryStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export type SubmissionRow = { id: string; primary: string; secondary: string; meta: string; status: EnquiryStatus; createdAt: string; extra?: string };

const PAGE = 20;

export function SubmissionList({ base, rows, status, page, q }: { base: string; rows: SubmissionRow[]; status?: string; page: number; q?: string }) {
  const filtered = rows
    .filter((r) => !status || r.status === status)
    .filter((r) => !q || `${r.primary} ${r.secondary} ${r.meta} ${r.extra ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(Math.max(1, page), pages);
  const shown = filtered.slice((current - 1) * PAGE, current * PAGE);
  const counts = Object.fromEntries((Object.keys(statusLabels) as EnquiryStatus[]).map((s) => [s, rows.filter((r) => r.status === s).length]));

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {[undefined, ...(Object.keys(statusLabels) as EnquiryStatus[])].map((s) => (
            <Link
              key={s ?? "all"}
              href={s ? `${base}?status=${s}` : base}
              aria-current={status === s || (!status && !s) ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-pill border px-4 text-sm font-semibold",
                status === s || (!status && !s) ? "border-navy bg-navy text-ivory" : "border-line bg-white text-navy hover:border-navy/40",
              )}
            >
              {s ? statusLabels[s] : "All"}
              <span className="text-xs opacity-70">{s ? counts[s] : rows.length}</span>
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="q" className="sr-only">
            Search submissions
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Search name, company, email" className="min-h-10 w-64 rounded-field border border-line bg-white px-4 text-sm" />
          <button type="submit" className="min-h-10 rounded-pill border border-navy/25 px-4 text-sm font-semibold text-navy">
            Search
          </button>
        </form>
      </div>

      {shown.length === 0 ? (
        <EmptyState title={rows.length ? "No submissions match this view" : "No submissions yet"} body={rows.length ? "Choose another status or clear the search." : "Submissions from the website forms will appear here as they arrive."} />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line bg-ivory/60 text-muted-strong">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  From
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Details
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Received
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((r) => (
                <tr key={r.id} className={cn("hover:bg-ivory/40", r.status === "new" && "font-medium")}>
                  <td className="px-5 py-3">
                    <Link href={`${base}/${r.id}`} className="block font-semibold text-navy hover:underline">
                      {r.primary}
                    </Link>
                    <span className="text-muted-strong">{r.secondary}</span>
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-muted-strong">{r.meta}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-strong">{formatDate(r.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ServerPagination page={current} pages={pages} base={base} query={{ status, q }} />
    </>
  );
}
