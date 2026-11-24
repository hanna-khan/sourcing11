import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Block indexing entirely on preview/staging deployments.
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV ? process.env.NEXT_PUBLIC_SITE_ENV === "production" : true;
  if (!isProduction) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/thank-you"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
