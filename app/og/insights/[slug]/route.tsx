import { getArticle, getArticles } from "@/lib/content";
import { renderOg } from "@/lib/seo/og";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

/** Branded share image for each article. */
export async function GET(_req: Request, ctx: RouteContext<"/og/insights/[slug]">) {
  const { slug } = await ctx.params;
  const a = await getArticle(slug);
  if (!a) return new Response("Not found", { status: 404 });
  return renderOg({ title: a.title, eyebrow: a.category });
}
