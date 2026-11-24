"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils/cn";

const PAGE_SIZE = 6;

/**
 * Category filter + pagination over server-rendered article cards. Every card
 * is present in the HTML, so all articles stay crawlable; filtering only hides.
 */
export function InsightsBrowser({ categories, items }: { categories: string[]; items: { category: string; node: ReactNode; key: string }[] }) {
  const [cat, setCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => items.filter((i) => !cat || i.category === cat), [items, cat]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = new Set(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((i) => i.key));

  const choose = (c: string | null) => {
    setCat(c);
    setPage(1);
  };

  return (
    <div>
      <div role="group" aria-label="Filter articles by category" className="flex flex-wrap gap-2">
        {[null, ...categories].map((c) => (
          <button
            key={c ?? "all"}
            type="button"
            aria-pressed={cat === c}
            onClick={() => choose(c)}
            className={cn(
              "min-h-11 rounded-pill border px-5 text-sm font-semibold transition-colors duration-300",
              cat === c ? "border-navy bg-navy text-ivory" : "border-navy/15 text-navy hover:border-navy",
            )}
          >
            {c ?? "All articles"}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"} shown
      </p>
      {filtered.length === 0 ? (
        <div className="mt-14 rounded-card border border-dashed border-line p-12 text-center">
          <p className="text-lg font-semibold text-navy">No articles in this category yet.</p>
          <button type="button" onClick={() => choose(null)} className="mt-4 text-sm font-semibold text-gold-ink underline underline-offset-4">
            Show all articles
          </button>
        </div>
      ) : (
        <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <li key={i.key} hidden={!visible.has(i.key)}>
              {i.node}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-16">
        <Pagination
          page={page}
          pages={pages}
          onChange={(p) => {
            setPage(p);
            document.getElementById("all-articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          label="Articles pages"
        />
      </div>
    </div>
  );
}
