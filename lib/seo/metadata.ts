import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";
import { getSeoOverride } from "@/lib/content";

type BuildArgs = {
  title: string;
  description: string;
  path: string;
  /** Explicit share image; false = defer to a route-level opengraph-image file */
  image?: string | false;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Use the title verbatim instead of appending the brand */
  absoluteTitle?: boolean;
};

/**
 * Builds complete, unique page metadata (canonical, Open Graph, X) and applies
 * any override saved in /admin/seo for this path.
 */
export async function buildMetadata(args: BuildArgs): Promise<Metadata> {
  const override = await getSeoOverride(args.path);
  const title = override?.title || args.title;
  const description = override?.description || args.description;
  const noindex = override?.noindex ?? args.noindex ?? false;
  const url = absoluteUrl(args.path);
  const ogImage = args.image === false ? null : args.image ? absoluteUrl(args.image) : absoluteUrl("/opengraph-image");
  const brandTitle = args.absoluteTitle || title.includes(site.name) ? title : `${title} | ${site.name}`;

  return {
    title: { absolute: brandTitle },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: args.type ?? "website",
      url,
      siteName: site.name,
      title: brandTitle,
      description,
      locale: site.locale,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
      ...(args.type === "article" ? { publishedTime: args.publishedTime, modifiedTime: args.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: brandTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
      ...(site.twitterHandle ? { site: site.twitterHandle } : {}),
    },
  };
}
