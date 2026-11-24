import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Markdown, extractHeadings } from "@/components/sections/Markdown";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { ShareLinks } from "@/components/insights/ShareLinks";
import { CtaBand } from "@/components/sections/CtaBand";
import { SplitWords } from "@/components/animations/SplitWords";
import { JsonLd } from "@/components/seo/JsonLd";
import { resolveImage } from "@/data/images";
import { getArticle, getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({
    title: a.seoTitle || a.title,
    description: a.seoDescription || a.excerpt,
    path: `/insights/${a.slug}`,
    image: `/og/insights/${a.slug}`,
    type: "article",
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt || a.publishedAt,
  });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [article, all] = await Promise.all([getArticle(slug), getArticles()]);
  if (!article) notFound();

  const img = resolveImage(article.image);
  const headings = extractHeadings(article.body);
  const related = [...all.filter((a) => a.slug !== article.slug && a.category === article.category), ...all.filter((a) => a.slug !== article.slug && a.category !== article.category)].slice(0, 3);
  const url = absoluteUrl(`/insights/${article.slug}`);

  return (
    <>
      <JsonLd data={articleSchema(article, img.src)} />
      <article>
        <header className="on-dark relative overflow-hidden bg-navy text-ivory">
          <div className="container-x pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24 lg:pt-[calc(var(--header-h)+5rem)]">
            <Breadcrumbs
              items={[
                { name: "Insights", path: "/insights" },
                { name: article.title, path: `/insights/${article.slug}` },
              ]}
            />
            <p className="kicker enter mt-10">
              {article.category}
            </p>
            <SplitWords as="h1" entrance delay={0.1} text={article.title} className="font-serif-display mt-6 max-w-4xl text-h1 text-ivory" />
            <p className="enter mt-8 max-w-2xl text-lead text-ivory/80" style={{ "--d": "0.2s" } as React.CSSProperties}>
              {article.excerpt}
            </p>
            <p className="enter mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/70" style={{ "--d": "0.3s" } as React.CSSProperties}>
              <span>By {article.author}</span>
              <span>
                Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              {article.updatedAt && article.updatedAt.slice(0, 10) !== article.publishedAt && (
                <span>
                  Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </span>
              )}
              <span>{readingTime(article.body)} min read</span>
            </p>
          </div>
        </header>

        <div className="bg-white">
          <div className="container-x">
            <div className="relative -mt-px aspect-[21/9] overflow-hidden rounded-b-media bg-navy">
              <Image src={img.src} alt={img.alt} fill priority quality={60} sizes="(min-width: 1440px) 1300px, 100vw" className="enter-media object-cover" />
            </div>
          </div>
          <div className="container-x grid gap-14 py-16 lg:grid-cols-12 lg:py-24">
            <aside className="lg:col-span-3">
              <div className="space-y-10 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                {headings.length > 0 && (
                  <nav aria-label="In this article">
                    <p className="text-sm font-semibold text-navy">In this article</p>
                    <ol className="mt-4 space-y-3 border-l border-line pl-4 text-[0.9375rem] text-muted-strong">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a href={`#${h.id}`} className="link-arc hover:text-navy">
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <ShareLinks url={url} title={article.title} />
              </div>
            </aside>
            <div className="lg:col-span-8 lg:col-start-5">
              <Markdown source={article.body} className="[&>h2]:scroll-mt-28" />
              <div className="mt-16 max-w-[42rem] rounded-card border border-line bg-ivory p-8">
                <p className="text-sm font-semibold text-navy">About the author</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-strong">
                  {article.author === "Sourcing Eleven"
                    ? "Written by the Sourcing Eleven team, a textile buying and sourcing agency in Pakistan that coordinates garments, fabrics and home textiles for international buyers."
                    : `${article.author}, Sourcing Eleven.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-y bg-ivory" aria-labelledby="related-title">
          <div className="container-x">
            <h2 id="related-title" className="font-serif-display text-h2 text-navy">
              Related articles
            </h2>
            <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
