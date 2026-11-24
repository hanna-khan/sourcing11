import "server-only";
import { cache } from "react";
import { store } from "@/lib/database/store";
import { defaultSettings } from "@/data/settings";
import type { Article, ProductCategory, Service, SiteSettings } from "@/lib/types";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const getServices = cache(async (includeDrafts = false): Promise<Service[]> => {
  const all = await store.list("services");
  return all.filter((s) => includeDrafts || s.published).sort(byOrder);
});

export const getService = cache(async (slug: string) => (await getServices()).find((s) => s.slug === slug));

export const getCategories = cache(async (includeDrafts = false): Promise<ProductCategory[]> => {
  const all = await store.list("categories");
  return all.filter((c) => includeDrafts || c.published).sort(byOrder);
});

export const getCategory = cache(async (slug: string) => (await getCategories()).find((c) => c.slug === slug));

export const getProducts = cache(async (categorySlug?: string) => {
  const all = await store.list("products");
  return all.filter((p) => p.published && (!categorySlug || p.categorySlug === categorySlug)).sort(byOrder);
});

export const getArticles = cache(async (includeDrafts = false): Promise<Article[]> => {
  const all = await store.list("articles");
  return all
    .filter((a) => includeDrafts || a.published)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
});

export const getArticle = cache(async (slug: string) => (await getArticles()).find((a) => a.slug === slug));

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const s = await store.get("settings", "site");
  return { ...defaultSettings, ...(s ?? {}) };
});

export const getSeoOverride = cache(async (route: string) => store.get("seo", route));

export { readingTime } from "@/lib/utils/format";
