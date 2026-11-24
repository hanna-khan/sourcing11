export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "Sourcing Eleven",
  legalName: "Sourcing Eleven",
  wordmark: "SOURCING11",
  tagline: "Your Bridge from Concept to Shipment.",
  description:
    "Sourcing Eleven is an international textile buying and sourcing agency in Pakistan, connecting brands, retailers and importers with suitable garment, fabric and home textile manufacturing partners.",
  locale: "en_GB",
  language: "en",
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
