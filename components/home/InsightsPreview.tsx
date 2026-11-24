import { ArticleCard } from "@/components/insights/ArticleCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TextLink } from "@/components/ui/Button";
import type { Article } from "@/lib/types";

export function InsightsPreview({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="section-y bg-ivory" aria-labelledby="insights-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="insights-title" kicker="Insights" title="Practical guidance for textile buyers." />
          <div data-reveal>
            <TextLink href="/insights">Read all insights</TextLink>
          </div>
        </div>
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8" data-stagger>
          {articles.slice(0, 3).map((a) => (
            <li key={a.slug} data-stagger-item>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
