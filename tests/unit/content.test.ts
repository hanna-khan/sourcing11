import { describe, expect, it } from "vitest";
import { services } from "@/data/services";
import { categories, products } from "@/data/products";
import { articles } from "@/data/articles";
import { images } from "@/data/images";
import { collections, entitySchemas, formToEntity, parsePairs, pairsToText } from "@/lib/admin/collections";
import { extractHeadings } from "@/components/sections/Markdown";
import { readingTime, slugify, whatsappHref } from "@/lib/utils/format";

describe("seed content integrity", () => {
  it("has the six finalised services and three categories", () => {
    expect(services.map((s) => s.slug)).toEqual(["textile-sourcing", "product-development", "merchandising", "production-management", "quality-assurance", "shipment-coordination"]);
    expect(categories.map((c) => c.slug)).toEqual(["garments-apparel", "fabrics-materials", "home-textiles"]);
  });

  it("every seed record passes its admin schema", () => {
    for (const s of services) expect(entitySchemas.services.safeParse(s).success).toBe(true);
    for (const c of categories) expect(entitySchemas.categories.safeParse(c).success).toBe(true);
    for (const p of products) expect(entitySchemas.products.safeParse(p).success).toBe(true);
    for (const a of articles) expect(entitySchemas.articles.safeParse(a).success).toBe(true);
  });

  it("uses unique, length-appropriate SEO titles and descriptions", () => {
    const all = [...services, ...categories, ...articles];
    const titles = all.map((x) => x.seoTitle);
    expect(new Set(titles).size).toBe(titles.length);
    for (const x of all) {
      expect(x.seoTitle!.length).toBeLessThanOrEqual(65);
      expect(x.seoDescription!.length).toBeGreaterThan(100);
      expect(x.seoDescription!.length).toBeLessThanOrEqual(160);
    }
  });

  it("references only existing images and related items", () => {
    const keys = Object.keys(images);
    for (const s of services) {
      expect(keys).toContain(s.image);
      for (const r of s.related) expect(services.some((x) => x.slug === r)).toBe(true);
    }
    for (const c of categories) for (const g of [c.image, ...c.gallery]) expect(keys).toContain(g);
    for (const p of products) expect(categories.some((c) => c.slug === p.categorySlug)).toBe(true);
  });

  it("makes no unverifiable claims in seed copy", () => {
    const text = JSON.stringify([services, categories, products, articles]).toLowerCase();
    for (const banned of ["our factory", "our factories", "we manufacture", "iso certified", "years of experience", "trusted by", "our clients include"]) {
      expect(text).not.toContain(banned);
    }
  });
});

describe("admin form parsing", () => {
  it("round-trips pairs", () => {
    const p = [{ title: "Brief", body: "We capture :: details" }];
    expect(parsePairs(pairsToText(p))).toEqual(p);
  });

  it("parses a service form into a valid record", () => {
    const fd = new FormData();
    const s = services[0];
    for (const f of collections.services.fields) {
      const v = (s as unknown as Record<string, unknown>)[f.name];
      if (f.type === "pairs") fd.set(f.name, pairsToText(v as never));
      else if (f.type === "list") fd.set(f.name, ((v as string[]) ?? []).join("\n"));
      else if (f.type === "multi") (v as string[]).forEach((x) => fd.append(f.name, x));
      else if (f.type === "checkbox") {
        if (v) fd.set(f.name, "on");
      }
      else if (v !== undefined) fd.set(f.name, String(v));
    }
    const parsed = entitySchemas.services.parse(formToEntity("services", fd));
    expect(parsed.process).toEqual(s.process);
    expect(parsed.related).toEqual(s.related);
    expect(parsed.published).toBe(true);
  });

  it("rejects an invalid slug", () => {
    const r = entitySchemas.products.safeParse({});
    expect(r.success).toBe(false);
    expect(entitySchemas.services.shape.slug.safeParse("Bad Slug!").success).toBe(false);
  });
});

describe("utilities", () => {
  it("slugifies", () => expect(slugify("Garments & Apparel — 2026")).toBe("garments-and-apparel-2026"));
  it("builds WhatsApp links", () => expect(whatsappHref("+92 300 123-4567", "Hi")).toBe("https://wa.me/923001234567?text=Hi"));
  it("estimates reading time", () => expect(readingTime("word ".repeat(660))).toBe(3));
  it("extracts article headings for the table of contents", () => {
    expect(extractHeadings("Intro\n\n## First part\ntext\n### Sub\n## Second")).toEqual([
      { id: "first-part", text: "First part" },
      { id: "second", text: "Second" },
    ]);
  });
});
