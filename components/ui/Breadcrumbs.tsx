import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils/cn";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "light", className }: { items: Crumb[]; tone?: "light" | "dark"; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", tone === "light" ? "text-ivory/70" : "text-muted-strong")}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-3">
                {last ? (
                  <span aria-current="page" className={tone === "light" ? "text-ivory" : "text-navy"}>
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="link-arc">
                      {c.name}
                    </Link>
                    <svg viewBox="0 0 12 6" aria-hidden="true" className="h-1.5 w-3 text-gold">
                      <path d="M1 5 C 3 0.5, 9 0.5, 11 5" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
