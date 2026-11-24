import type { SiteSettings } from "@/lib/types";

/**
 * Default site settings. Contact details are intentionally empty until the
 * business confirms them in /admin/settings (or via environment overrides) —
 * empty values are hidden on the public site rather than shown as placeholders.
 */
export const defaultSettings: SiteSettings = {
  id: "site",
  companyName: "Sourcing Eleven",
  tagline: "Your Bridge from Concept to Shipment.",
  shortIntro:
    "An international textile buying and sourcing agency in Pakistan, connecting buyers with suitable manufacturing partners and coordinating every step from concept to shipment.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "",
  address: "",
  addressVerified: false,
  businessHours: "",
  linkedin: "",
  instagram: "",
  facebook: "",
  x: "",
  // Target buyer markets named in the business brief. Shown on the map as
  // markets served — not as offices, factories or named clients.
  markets: ["uk", "europe", "us", "australia"],
  stats: [],
  team: [],
  foundingYear: "",
};
