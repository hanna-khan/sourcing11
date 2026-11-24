import { ogSize, renderOg } from "@/lib/seo/og";

export const alt = "Sourcing Eleven — Your Bridge from Concept to Shipment.";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "Your Bridge from Concept to Shipment." });
}
