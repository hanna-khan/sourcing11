import { articles } from "@/data/articles";
import { categories, products } from "@/data/products";
import { services } from "@/data/services";
import { defaultSettings } from "@/data/settings";
import type { CollectionName } from "@/lib/types";

/** Initial content for a fresh install. Enquiry collections start empty. */
export function seedFor(c: CollectionName): unknown[] | null {
  switch (c) {
    case "services":
      return services;
    case "categories":
      return categories;
    case "products":
      return products;
    case "articles":
      return articles;
    case "settings":
      return [defaultSettings];
    default:
      return null;
  }
}
