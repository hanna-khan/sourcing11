import { z } from "zod";
import type { Article, Pair, Product, ProductCategory, Service } from "@/lib/types";

export type FieldType = "text" | "textarea" | "markdown" | "slug" | "number" | "checkbox" | "list" | "pairs" | "image" | "select" | "date" | "multi";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  /** For "multi"/"select" fields whose options come from another collection */
  optionsFrom?: "services" | "categories";
  max?: number;
  group?: "content" | "seo" | "settings";
};

export type EditableCollection = "services" | "categories" | "products" | "articles";

const seoFields: FieldDef[] = [
  { name: "seoTitle", label: "SEO title", type: "text", group: "seo", max: 70, hint: "50–60 characters is ideal. Leave empty to use the page title." },
  { name: "seoDescription", label: "Meta description", type: "textarea", group: "seo", max: 170, hint: "Around 150 characters, written for searchers." },
  { name: "keywords", label: "Keyword cluster", type: "list", group: "seo", hint: "One per line. Used for internal keyword mapping, not output as meta keywords." },
];

export const collections: Record<EditableCollection, { label: string; singular: string; fields: FieldDef[]; publicPath: (item: { slug?: string; categorySlug?: string }) => string }> = {
  services: {
    label: "Services",
    singular: "service",
    publicPath: (i) => `/services/${i.slug}`,
    fields: [
      { name: "title", label: "Service name", type: "text", required: true, max: 80 },
      { name: "slug", label: "URL slug", type: "slug", required: true, hint: "Lowercase words separated by hyphens. Changing it changes the page URL." },
      { name: "cardTitle", label: "Card title", type: "text", required: true, max: 60 },
      { name: "excerpt", label: "Card summary", type: "textarea", required: true, max: 220 },
      { name: "heroTitle", label: "Page headline (H1)", type: "text", required: true, max: 120 },
      { name: "heroIntro", label: "Headline introduction", type: "textarea", required: true, max: 400 },
      { name: "intro", label: "Opening statement", type: "textarea", required: true, max: 600 },
      { name: "body", label: "Detailed description", type: "markdown", required: true },
      { name: "process", label: "Process steps", type: "pairs", hint: "One per line: Step title :: Description" },
      { name: "benefits", label: "Buyer benefits", type: "pairs", hint: "One per line: Benefit :: Description" },
      { name: "image", label: "Image", type: "image", required: true },
      { name: "related", label: "Related services", type: "multi", optionsFrom: "services" },
      { name: "order", label: "Display order", type: "number", group: "settings" },
      { name: "published", label: "Published", type: "checkbox", group: "settings" },
      ...seoFields,
    ],
  },
  categories: {
    label: "Product categories",
    singular: "category",
    publicPath: (i) => `/products/${i.slug}`,
    fields: [
      { name: "title", label: "Category name", type: "text", required: true, max: 80 },
      { name: "slug", label: "URL slug", type: "slug", required: true },
      { name: "excerpt", label: "Summary", type: "textarea", required: true, max: 220 },
      { name: "heroTitle", label: "Page headline (H1)", type: "text", required: true, max: 120 },
      { name: "intro", label: "Introduction", type: "textarea", required: true, max: 600 },
      { name: "body", label: "Detailed description", type: "markdown", required: true },
      { name: "productTypes", label: "Product types", type: "list", hint: "One per line." },
      { name: "capabilities", label: "Sourcing capabilities", type: "pairs", hint: "One per line: Capability :: Description" },
      { name: "process", label: "Process steps", type: "pairs", hint: "One per line: Step :: Description" },
      { name: "image", label: "Hero image", type: "image", required: true },
      { name: "gallery", label: "Gallery images", type: "list", hint: "One image key or /media/… URL per line (see Media library)." },
      { name: "related", label: "Related categories", type: "multi", optionsFrom: "categories" },
      { name: "order", label: "Display order", type: "number", group: "settings" },
      { name: "published", label: "Published", type: "checkbox", group: "settings" },
      ...seoFields,
    ],
  },
  products: {
    label: "Products",
    singular: "product",
    publicPath: (i) => `/products/${i.categorySlug}`,
    fields: [
      { name: "name", label: "Product name", type: "text", required: true, max: 80 },
      { name: "categorySlug", label: "Category", type: "select", required: true, optionsFrom: "categories" },
      { name: "description", label: "Description", type: "textarea", required: true, max: 400 },
      { name: "materials", label: "Materials", type: "text", max: 160 },
      { name: "image", label: "Image", type: "image", required: true },
      { name: "order", label: "Display order", type: "number", group: "settings" },
      { name: "published", label: "Published", type: "checkbox", group: "settings" },
    ],
  },
  articles: {
    label: "Insights articles",
    singular: "article",
    publicPath: (i) => `/insights/${i.slug}`,
    fields: [
      { name: "title", label: "Title (H1)", type: "text", required: true, max: 140 },
      { name: "slug", label: "URL slug", type: "slug", required: true },
      { name: "excerpt", label: "Summary", type: "textarea", required: true, max: 300 },
      { name: "category", label: "Category", type: "text", required: true, max: 60, hint: "Existing categories: Sourcing guides, Product development, Quality, Working with suppliers." },
      { name: "author", label: "Author", type: "text", required: true, max: 80 },
      { name: "publishedAt", label: "Publish date", type: "date", required: true },
      { name: "body", label: "Article body", type: "markdown", required: true, hint: "Use ## for section headings, - for lists, **bold**, [link text](/path)." },
      { name: "image", label: "Cover image", type: "image", required: true },
      { name: "featured", label: "Featured on Insights", type: "checkbox", group: "settings" },
      { name: "published", label: "Published", type: "checkbox", group: "settings" },
      ...seoFields,
    ],
  },
};

/* ---------- parsing FormData into typed records ---------- */

export const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const parsePairs = (v: FormDataEntryValue | null): Pair[] =>
  lines(v)
    .map((l) => {
      const [title, ...rest] = l.split("::");
      return { title: title.trim(), body: rest.join("::").trim() };
    })
    .filter((p) => p.title);

export const pairsToText = (p: Pair[] = []) => p.map((x) => `${x.title} :: ${x.body}`).join("\n");

const slug = z
  .string()
  .trim()
  .min(2, "Enter a URL slug.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only.");
const req = (label: string, max = 20000) => z.string().trim().min(1, `Enter ${label}.`).max(max, `Keep ${label} under ${max} characters.`);
const opt = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => v || undefined);
const pairsArr = z.array(z.object({ title: z.string(), body: z.string() }));

const seo = { seoTitle: opt(70), seoDescription: opt(170), keywords: z.array(z.string()).optional() };

export const entitySchemas = {
  services: z.object({
    title: req("a service name", 80),
    slug,
    cardTitle: req("a card title", 60),
    excerpt: req("a card summary", 220),
    heroTitle: req("a headline", 120),
    heroIntro: req("a headline introduction", 400),
    intro: req("an opening statement", 600),
    body: req("a description"),
    process: pairsArr,
    benefits: pairsArr,
    image: req("an image"),
    related: z.array(z.string()),
    order: z.coerce.number().int().min(0).max(999),
    published: z.boolean(),
    ...seo,
  }),
  categories: z.object({
    title: req("a category name", 80),
    slug,
    excerpt: req("a summary", 220),
    heroTitle: req("a headline", 120),
    intro: req("an introduction", 600),
    body: req("a description"),
    productTypes: z.array(z.string()),
    capabilities: pairsArr,
    process: pairsArr,
    image: req("an image"),
    gallery: z.array(z.string()),
    related: z.array(z.string()),
    order: z.coerce.number().int().min(0).max(999),
    published: z.boolean(),
    ...seo,
  }),
  products: z.object({
    name: req("a product name", 80),
    categorySlug: req("a category"),
    description: req("a description", 400),
    materials: z.string().trim().max(160).default(""),
    image: req("an image"),
    order: z.coerce.number().int().min(0).max(999),
    published: z.boolean(),
  }),
  articles: z.object({
    title: req("a title", 140),
    slug,
    excerpt: req("a summary", 300),
    category: req("a category", 60),
    author: req("an author", 80),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a publish date."),
    body: req("the article body", 60000),
    image: req("a cover image"),
    featured: z.boolean(),
    published: z.boolean(),
    ...seo,
  }),
} satisfies Record<EditableCollection, z.ZodType>;

export function formToEntity(collection: EditableCollection, fd: FormData) {
  const out: Record<string, unknown> = {};
  for (const f of collections[collection].fields) {
    const v = fd.get(f.name);
    switch (f.type) {
      case "checkbox":
        out[f.name] = v === "on";
        break;
      case "list":
        out[f.name] = lines(v);
        break;
      case "pairs":
        out[f.name] = parsePairs(v);
        break;
      case "multi":
        out[f.name] = fd.getAll(f.name).map(String);
        break;
      case "number":
        out[f.name] = v === null || v === "" ? 0 : v;
        break;
      default:
        out[f.name] = v === null ? undefined : String(v);
    }
  }
  return out;
}

export type EntityMap = { services: Service; categories: ProductCategory; products: Product; articles: Article };
