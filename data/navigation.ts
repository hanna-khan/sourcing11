export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; intro: string; links: NavLink[]; feature?: { title: string; href: string; image: string } };

export const serviceLinks: NavLink[] = [
  { label: "Textile Sourcing", href: "/services/textile-sourcing", description: "Supplier identification and fabric sourcing" },
  { label: "Product Development", href: "/services/product-development", description: "Specification, sampling and approvals" },
  { label: "Merchandising", href: "/services/merchandising", description: "Order details, trims and timelines" },
  { label: "Production Management", href: "/services/production-management", description: "Bulk production follow-up" },
  { label: "Quality Assurance", href: "/services/quality-assurance", description: "Inspection coordination" },
  { label: "Shipment Coordination", href: "/services/shipment-coordination", description: "Packing, documents and handover" },
];

export const productLinks: NavLink[] = [
  { label: "Garments & Apparel", href: "/products/garments-apparel", description: "Knitwear, wovens and denim" },
  { label: "Fabrics & Materials", href: "/products/fabrics-materials", description: "Woven and knitted fabrics" },
  { label: "Home Textiles", href: "/products/home-textiles", description: "Bed linen, towels, kitchen and table" },
];

export const mainNav: (NavLink | NavGroup)[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    intro: "One sourcing partner, every step connected — from the first brief to the final shipment.",
    links: serviceLinks,
    feature: { title: "See how a project runs, stage by stage", href: "/our-process", image: "warp" },
  },
  {
    label: "Products",
    href: "/products",
    intro: "Three textile categories, each matched to manufacturing partners with the right focus.",
    links: productLinks,
    feature: { title: "Explore our sourcing capabilities", href: "/capabilities", image: "bolts" },
  },
  { label: "Our Process", href: "/our-process" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  company: [
    { label: "About", href: "/about" },
    { label: "Our Process", href: "/our-process" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
    { label: "Request a Quote", href: "/request-a-quote" },
  ],
  services: serviceLinks,
  products: productLinks,
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export function isGroup(item: NavLink | NavGroup): item is NavGroup {
  return "links" in item;
}
