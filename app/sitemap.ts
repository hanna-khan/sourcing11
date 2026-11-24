import type { MetadataRoute } from "next";
import { getArticles, getCategories, getServices, getSeoOverride } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, categories, articles] = await Promise.all([getServices(), getCategories(), getArticles()]);
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    { path: "/products", priority: 0.9, freq: "monthly" },
    { path: "/capabilities", priority: 0.7, freq: "monthly" },
    { path: "/our-process", priority: 0.7, freq: "monthly" },
    { path: "/sustainability", priority: 0.5, freq: "monthly" },
    { path: "/insights", priority: 0.7, freq: "weekly" },
    { path: "/contact", priority: 0.6, freq: "yearly" },
    { path: "/request-a-quote", priority: 0.8, freq: "yearly" },
    { path: "/privacy-policy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r.path), lastModified: now, changeFrequency: r.freq, priority: r.priority })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: s.updatedAt ? new Date(s.updatedAt) : now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/products/${c.slug}`), lastModified: c.updatedAt ? new Date(c.updatedAt) : now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: new Date(a.updatedAt || a.publishedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  // Respect noindex overrides set in /admin/seo.
  const checks = await Promise.all(entries.map(async (e) => (await getSeoOverride(new URL(e.url).pathname))?.noindex));
  return entries.filter((_, i) => !checks[i]);
}
