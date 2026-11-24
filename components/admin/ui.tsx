import Link from "next/link";
import type { ReactNode } from "react";
import type { EnquiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export const statusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  in_review: "In review",
  responded: "Responded",
  closed: "Closed",
  spam: "Spam",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold",
        status === "new" && "bg-gold/20 text-gold-ink",
        status === "in_review" && "bg-navy/10 text-navy",
        status === "responded" && "bg-success/10 text-success",
        status === "closed" && "bg-line text-muted-strong",
        status === "spam" && "bg-danger/10 text-danger",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function AdminLinkButton({ href, children, variant = "dark" }: { href: string; children: ReactNode; variant?: "dark" | "outline" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center rounded-pill px-5 text-sm font-semibold transition-colors",
        variant === "dark" ? "bg-navy text-ivory hover:bg-navy-soft" : "border border-navy/25 text-navy hover:border-navy",
      )}
    >
      {children}
    </Link>
  );
}

export function Panel({ title, children, className, actions }: { title?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cn("rounded-card border border-line bg-white p-6 sm:p-8", className)}>
      {(title || actions) && (
        <div className="mb-6 flex items-center justify-between gap-4">
          {title && <h2 className="text-lg font-semibold text-navy">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-navy/20 bg-white p-12 text-center">
      <svg viewBox="0 0 80 30" aria-hidden="true" className="mx-auto h-6 w-16 text-gold">
        <path d="M2 28 C 18 2, 62 2, 78 28" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <p className="mt-4 text-lg font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-muted-strong">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "warning"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={cn(
        "mb-6 rounded-field border px-4 py-3 text-sm",
        tone === "success" && "border-success/30 bg-success/5 text-success",
        tone === "warning" && "border-gold/50 bg-gold/10 text-gold-ink",
        tone === "info" && "border-navy/15 bg-white text-navy",
      )}
    >
      {children}
    </div>
  );
}

export function ServerPagination({ page, pages, base, query = {} }: { page: number; pages: number; base: string; query?: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries({ ...query, page: String(p) }).filter(([, v]) => v) as [string, string][]);
    return `${base}?${q.toString()}`;
  };
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2 text-sm">
      {page > 1 && (
        <Link href={href(page - 1)} className="rounded-pill border border-line px-4 py-2 font-semibold text-navy">
          Previous
        </Link>
      )}
      <span className="px-3 text-muted-strong">
        Page {page} of {pages}
      </span>
      {page < pages && (
        <Link href={href(page + 1)} className="rounded-pill border border-line px-4 py-2 font-semibold text-navy">
          Next
        </Link>
      )}
    </nav>
  );
}
