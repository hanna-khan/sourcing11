import type { ImageKey } from "./images";

export type JourneyStage = {
  number: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  image: ImageKey;
  service?: string;
};

export const journey: JourneyStage[] = [
  {
    number: "01",
    title: "Understand",
    summary: "We start with your product, quantities, price position, quality expectations and timeline.",
    detail:
      "Every project begins with a conversation and a written brief. We review your tech pack or references, confirm quantities by style and colour, and note the standards you work to — so every later decision has a clear reference point.",
    points: ["Product and specification review", "Quantities, target price and delivery window", "Compliance and testing requirements"],
    image: "linenIvory",
  },
  {
    number: "02",
    title: "Source",
    summary: "We identify suitable manufacturing partners and materials, and collect comparable quotations.",
    detail:
      "We shortlist manufacturing partners whose current production matches your product and order profile, source fabrics and trims, and send each a structured enquiry so the quotations you receive can be compared fairly.",
    points: ["Supplier identification and shortlisting", "Fabric and trim sourcing", "Like-for-like quotations"],
    image: "swatchFan",
    service: "textile-sourcing",
  },
  {
    number: "03",
    title: "Develop",
    summary: "Samples are developed, reviewed and refined until there is an approved standard for production.",
    detail:
      "We coordinate proto, fit and pre-production samples with your chosen partner, consolidate your comments after each round and check the next sample against them before it travels to you.",
    points: ["Lab dips and fabric approvals", "Proto, fit and size-set samples", "Pre-production sign-off"],
    image: "drafting",
    service: "product-development",
  },
  {
    number: "04",
    title: "Coordinate",
    summary: "Orders are confirmed, planned and followed through production with regular updates.",
    detail:
      "Merchandising and production follow-up keep your order details correct and visible: purchase order checks, time and action plans, trims readiness and progress against the plan — with early warning when something moves.",
    points: ["Order confirmation and time and action plan", "Trims and materials readiness", "Production progress reporting"],
    image: "warp",
    service: "production-management",
  },
  {
    number: "05",
    title: "Inspect",
    summary: "Goods are checked against your approved standard before they leave the factory.",
    detail:
      "We coordinate inspections at the points you need — materials, in-line and final random inspection — and work with your nominated third-party inspectors and laboratories where required.",
    points: ["Materials and in-line checks", "Final random inspection coordination", "Corrective action follow-up"],
    image: "loupe",
    service: "quality-assurance",
  },
  {
    number: "06",
    title: "Deliver",
    summary: "Packing, documents and handover to your freight forwarder are coordinated on time.",
    detail:
      "We confirm packing and carton marks, check export documents for accuracy and share cargo readiness with your forwarder, so the handover is complete and your team has the details it needs.",
    points: ["Packing and carton checks", "Document review", "Forwarder handover and dispatch confirmation"],
    image: "stacks",
    service: "shipment-coordination",
  },
];
