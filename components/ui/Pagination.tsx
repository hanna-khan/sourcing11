"use client";

import { cn } from "@/lib/utils/cn";

export function Pagination({ page, pages, onChange, label = "Pagination" }: { page: number; pages: number; onChange: (p: number) => void; label?: string }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  const btn = "flex h-11 min-w-11 items-center justify-center rounded-pill px-3 text-sm font-semibold transition-colors";
  return (
    <nav aria-label={label} className="flex items-center justify-center gap-2">
      <button type="button" className={cn(btn, "border border-line text-navy disabled:opacity-40")} disabled={page === 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === page ? "page" : undefined}
          onClick={() => onChange(n)}
          className={cn(btn, n === page ? "bg-navy text-ivory" : "text-navy hover:bg-ivory")}
        >
          <span className="sr-only">Page </span>
          {n}
        </button>
      ))}
      <button type="button" className={cn(btn, "border border-line text-navy disabled:opacity-40")} disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
