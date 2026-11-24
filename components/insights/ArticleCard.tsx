import Image from "next/image";
import Link from "next/link";
import { resolveImage } from "@/data/images";
import type { Article } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function ArticleCard({ article: a, large, headingLevel = "h3" }: { article: Article; large?: boolean; headingLevel?: "h2" | "h3" }) {
  const img = resolveImage(a.image);
  const H = headingLevel;
  return (
    <article className="group relative">
      <div className={cn("relative overflow-hidden rounded-media bg-ivory", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Image src={img.src} alt="" fill sizes={large ? "(min-width: 1024px) 58vw, 92vw" : "(min-width: 768px) 30vw, 92vw"} className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.05]" />
      </div>
      <div className="mt-6">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-strong">
          <span className="font-semibold text-gold-ink">{a.category}</span>
          <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
          <span>{readingTime(a.body)} min read</span>
        </p>
        <H className={cn("mt-3 font-semibold leading-snug text-navy", large ? "font-serif-display text-[2.25rem] font-medium leading-[1.1]" : "text-[1.3125rem]")}>
          <Link href={`/insights/${a.slug}`} className="after:absolute after:inset-0">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]">{a.title}</span>
          </Link>
        </H>
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted-strong">{a.excerpt}</p>
      </div>
    </article>
  );
}
