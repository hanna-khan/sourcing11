import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "svc-textile-sourcing",
    slug: "textile-sourcing",
    title: "Textile Sourcing",
    cardTitle: "Textile Sourcing",
    excerpt: "Finding the right manufacturing partner and the right fabric for each product, then briefing them properly.",
    heroTitle: "Textile and garment sourcing, matched to your product.",
    heroIntro:
      "We identify manufacturing partners and materials in Pakistan that fit your product, quantities, quality expectations and timeline — and we coordinate the conversation from the first brief onwards.",
    intro:
      "Good sourcing starts with the product, not the supplier list. Before we approach anyone, we make sure we understand what you are making, who it is for, the quantities you are planning and the price position you need to hit. That brief becomes the filter for every supplier conversation that follows.",
    body: `## What textile sourcing covers

Sourcing is the work of matching a product to the businesses best placed to make it. For our buyers, that typically includes:

- **Supplier identification** — shortlisting manufacturing partners whose product focus, equipment and order profile fit your brief.
- **Fabric sourcing** — locating base fabrics, blends, weights and finishes, and requesting swatches or hangers for review.
- **Trims and components** — coordinating labels, buttons, zips, packaging components and other accessories with the main order.
- **Commercial alignment** — collecting quotations on a like-for-like basis so you can compare options clearly.

## How we brief suppliers

A vague brief produces vague quotations. We translate your requirements into a clear request: product description, construction details, fabric specification, colour and size breakdowns, packaging needs, target delivery window and any compliance requirements you work to. Where you have a tech pack, we work from it; where you don't yet, we help you capture the information a manufacturer needs.

## Working with independent partners

Sourcing Eleven is a buying and sourcing agency. We do not own factories. We coordinate with independent manufacturing partners, which means the recommendation we make is based on fit for your product rather than on filling our own capacity.`,
    process: [
      { title: "Brief", body: "We capture product, quantity, price, quality and timing requirements, plus any compliance standards you work to." },
      { title: "Shortlist", body: "We identify suitable manufacturing partners and fabric options and check their fit against the brief." },
      { title: "Request", body: "Suppliers receive a structured enquiry so quotations and swatches come back comparable." },
      { title: "Recommend", body: "We present the options with their trade-offs so you can decide which partner to develop with." },
    ],
    benefits: [
      { title: "Less time spent searching", body: "You review a considered shortlist instead of filtering cold supplier responses yourself." },
      { title: "Comparable quotations", body: "Structured briefs mean prices, lead times and minimums can be compared side by side." },
      { title: "Local coordination", body: "Someone on the ground follows up, clarifies questions and keeps momentum between time zones." },
    ],
    image: "swatchFan",
    related: ["product-development", "merchandising", "quality-assurance"],
    order: 1,
    published: true,
    seoTitle: "Textile Sourcing Company in Pakistan | Garment & Fabric Sourcing",
    seoDescription:
      "Textile and garment sourcing in Pakistan for international brands: supplier identification, fabric sourcing and comparable quotations from suitable partners.",
    keywords: ["textile sourcing company Pakistan", "textile sourcing services", "garment sourcing services", "fabric sourcing company"],
  },
  {
    id: "svc-product-development",
    slug: "product-development",
    title: "Product Development",
    cardTitle: "Product Development",
    excerpt: "Turning a concept, reference or tech pack into an approved sample that is ready for production.",
    heroTitle: "From concept to an approved sample.",
    heroIntro:
      "We coordinate the development stage with your chosen manufacturing partner: specification, fabric and trim development, proto samples, fit and colour approvals.",
    intro:
      "Development is where most of a product's cost, quality and lead time is decided. A clear, well-managed sampling stage prevents surprises later, so we treat every comment, measurement and approval as part of a written record that production can follow.",
    body: `## Development support

Every brand arrives at a different point. Some have complete tech packs and graded specs; others have a mood board and a reference garment. We work from wherever you are and coordinate the steps needed to reach an approved sample:

- **Specification review** — checking tech packs for missing measurements, construction notes, fabric details and trim callouts before they reach the factory.
- **Fabric and colour development** — coordinating lab dips, strike-offs, hand-feel and weight approvals.
- **Sampling and approvals** — proto, fit, size-set and pre-production samples, with your comments recorded against each round.
- **Costing input** — highlighting construction or material choices that significantly affect price, so decisions are made deliberately.

## Keeping sample rounds efficient

Each sample round costs time. We consolidate feedback, confirm that comments have been understood correctly and check the next sample against them before it is dispatched to you. The aim is fewer rounds and a clear sign-off point that production can reference.`,
    process: [
      { title: "Review", body: "We review your tech pack or reference and identify information the manufacturer will need." },
      { title: "Develop", body: "Fabric, colour and trims are developed in parallel with the first proto sample." },
      { title: "Refine", body: "Fit and construction comments are consolidated and tracked through each sample round." },
      { title: "Approve", body: "A pre-production sample and written specification become the standard for bulk." },
    ],
    benefits: [
      { title: "Clearer specifications", body: "Gaps in a tech pack are caught before they turn into sampling delays." },
      { title: "Traceable approvals", body: "Every comment and decision is recorded, so bulk production has a single reference." },
      { title: "Fewer wasted rounds", body: "Samples are checked against your comments before they travel to you." },
    ],
    image: "drafting",
    related: ["textile-sourcing", "merchandising", "production-management"],
    order: 2,
    published: true,
    seoTitle: "Textile Product Development & Sampling | Sourcing Eleven",
    seoDescription:
      "Textile and garment product development in Pakistan: tech pack review, fabric and colour development, proto and fit sampling, and pre-production approval.",
    keywords: ["textile product development", "garment sampling", "tech pack to sample"],
  },
  {
    id: "svc-merchandising",
    slug: "merchandising",
    title: "Merchandising",
    cardTitle: "Merchandising",
    excerpt: "Day-to-day order management between you and the factory: details, timelines and decisions.",
    heroTitle: "Merchandising that keeps every detail aligned.",
    heroIntro:
      "Our merchandising support keeps purchase orders, colourways, size breakdowns, trims and timelines aligned between your team and your manufacturing partner.",
    intro:
      "Once an order is placed, hundreds of small details need to stay consistent: approved colours, trim references, labelling, carton requirements and dates. Merchandising is the discipline of keeping those details correct and visible.",
    body: `## What our merchandisers manage

- **Order confirmation** — checking purchase order details, quantities, size ratios and colourways against what the factory has confirmed.
- **Time and action plans** — agreeing key dates for materials, approvals, production and dispatch, and tracking progress against them.
- **Trims and accessories** — making sure labels, tags, packaging and components are approved and available when production needs them.
- **Communication** — one point of contact who answers factory questions quickly and escalates decisions to you clearly.

## Visibility for your team

You receive regular updates in plain language: what is on track, what has moved and what needs your decision. When a date is at risk, we tell you early and set out the options rather than waiting until it becomes a delay.`,
    process: [
      { title: "Confirm", body: "Order details are reconciled between your purchase order and the factory confirmation." },
      { title: "Plan", body: "A time and action plan sets the key milestones from materials to dispatch." },
      { title: "Track", body: "Milestones are followed up and updates shared on an agreed rhythm." },
      { title: "Escalate", body: "Risks are raised early with clear options and their consequences." },
    ],
    benefits: [
      { title: "One point of contact", body: "Questions are answered quickly without your team chasing multiple people." },
      { title: "Early warnings", body: "Potential delays are flagged while there is still time to act." },
      { title: "Accurate orders", body: "Colourways, sizes and trims are checked before production, not after." },
    ],
    image: "labDips",
    related: ["production-management", "product-development", "shipment-coordination"],
    order: 3,
    published: true,
    seoTitle: "Garment Merchandising Services in Pakistan | Sourcing Eleven",
    seoDescription:
      "Apparel merchandising from Pakistan: order confirmation, time and action plans, trims coordination and clear progress updates for international buyers.",
    keywords: ["garment merchandising services", "apparel merchandising Pakistan", "textile buying house Pakistan"],
  },
  {
    id: "svc-production-management",
    slug: "production-management",
    title: "Production Management",
    cardTitle: "Production Management",
    excerpt: "Following bulk production from fabric in-house to packed cartons, with regular progress updates.",
    heroTitle: "Production follow-up, from fabric to finished goods.",
    heroIntro:
      "We follow your order through bulk production with your manufacturing partner — tracking materials, cutting, making, finishing and packing against the agreed plan.",
    intro:
      "Bulk production is where a well-developed product either holds its standard or drifts. Regular follow-up, informed questions and early visibility of problems make the difference between a controlled order and a late one.",
    body: `## Following the order

Production management covers the stages between an approved pre-production sample and goods ready for inspection:

- **Materials readiness** — confirming fabric and trims are in-house, tested where required and matched to approvals.
- **Production start** — checking that the approved sample, specification and comments are what the production line is working to.
- **Progress tracking** — following cutting, stitching, finishing and packing quantities against the plan.
- **Issue resolution** — working with the factory on corrective actions when something does not match the approved standard.

## Honest progress reporting

We report what we see, including problems. If quantities are behind plan or a quality issue appears, you will hear about it from us with the facts, the proposed fix and the likely impact on the delivery date.`,
    process: [
      { title: "Pre-production", body: "Materials, approvals and specifications are confirmed before cutting starts." },
      { title: "In-line follow-up", body: "Progress and workmanship are checked as production moves through each stage." },
      { title: "Corrective action", body: "Deviations are documented and agreed fixes followed through." },
      { title: "Ready for inspection", body: "Finished, packed goods are prepared for final inspection and dispatch." },
    ],
    benefits: [
      { title: "Production you can see", body: "Regular updates show where your order actually is." },
      { title: "Problems caught early", body: "Issues are found during production, when they are cheaper to fix." },
      { title: "Standards held", body: "The approved sample stays the reference from first cut to final pack." },
    ],
    image: "warp",
    related: ["quality-assurance", "merchandising", "shipment-coordination"],
    order: 4,
    published: true,
    seoTitle: "Garment Production Management & Follow-up | Sourcing Eleven",
    seoDescription:
      "Production management for apparel and textile orders in Pakistan: materials readiness, in-line follow-up, corrective actions and honest progress reports.",
    keywords: ["garment production management", "production follow-up Pakistan", "apparel sourcing company"],
  },
  {
    id: "svc-quality-assurance",
    slug: "quality-assurance",
    title: "Quality Assurance",
    cardTitle: "Quality Assurance",
    excerpt: "Inspection coordination against your approved standard, before goods leave the factory.",
    heroTitle: "Quality checked against your approved standard.",
    heroIntro:
      "We coordinate quality assurance and inspections throughout the order — from fabric and in-line checks to final random inspections before shipment.",
    intro:
      "Quality is defined by what you approved: the sample, the specification and the tolerances you set. Our role is to make sure goods are checked against that standard at the right moments, and that findings lead to action.",
    body: `## Inspection points

Depending on the product and your requirements, inspections can be coordinated at several stages:

- **Fabric and materials** — checking shade, weight, width, hand-feel and visible defects against approvals.
- **Pre-production** — confirming the production line understands the approved sample and specification.
- **During production** — in-line checks to catch workmanship or measurement issues early.
- **Final random inspection** — checking packed goods against your standard, typically using an AQL sampling plan you specify.

## Independent and third-party inspection

Many buyers require inspections by an independent third-party agency or by their own QA team. We are happy to coordinate with whoever you nominate, share our own observations, and make sure findings and corrective actions are documented.

## Testing

Where products need laboratory testing — for example colour fastness, shrinkage, composition or regulatory requirements in your market — we coordinate sample submission with the laboratory you specify. We do not issue certificates ourselves.`,
    process: [
      { title: "Define", body: "We confirm your quality standard, tolerances, sampling plan and any required tests." },
      { title: "Check early", body: "Materials and early production are reviewed against the approved sample." },
      { title: "Inspect", body: "Final inspections are coordinated on packed goods before dispatch." },
      { title: "Act", body: "Findings are reported with photos, and corrective actions are followed up." },
    ],
    benefits: [
      { title: "Clear standards", body: "Inspections measure against what you approved, not a generic checklist." },
      { title: "Fewer surprises on arrival", body: "Issues are found before goods are shipped." },
      { title: "Works with your QA", body: "We coordinate with your nominated third-party inspectors and laboratories." },
    ],
    image: "loupe",
    related: ["production-management", "shipment-coordination", "product-development"],
    order: 5,
    published: true,
    seoTitle: "Textile Quality Assurance & Inspection | Sourcing Eleven",
    seoDescription:
      "Quality assurance for textiles made in Pakistan: materials checks, in-line and final random inspections, and lab test coordination with your nominated partners.",
    keywords: ["textile quality inspection Pakistan", "garment inspection coordination", "fabric quality assurance"],
  },
  {
    id: "svc-shipment-coordination",
    slug: "shipment-coordination",
    title: "Shipment Coordination",
    cardTitle: "Shipment Coordination",
    excerpt: "Packing, documentation and handover to your freight forwarder, coordinated on time.",
    heroTitle: "Shipment coordination for a clean handover.",
    heroIntro:
      "We coordinate packing, carton marking, documentation and the handover of finished goods to your nominated freight forwarder or logistics partner.",
    intro:
      "The final step of an order is often where small oversights cause the biggest delays: a missing carton mark, an incomplete packing list, a booking made too late. We coordinate the details that get goods out of the factory and on their way.",
    body: `## What we coordinate

- **Packing and carton requirements** — confirming folding, polybags, labels, carton marks, dimensions and weights match your instructions.
- **Documentation** — collecting commercial invoices, packing lists and other documents from the factory and checking them for accuracy.
- **Booking and handover** — liaising with your nominated freight forwarder on cargo readiness, booking and collection dates.
- **Shipment updates** — confirming dispatch and passing on the details your team needs to track the goods.

## Working with your logistics partners

Most buyers already work with a preferred freight forwarder, and we coordinate with them directly. We do not act as a freight forwarder or customs broker; our role is to make sure the supplier side of the handover is complete and on time.`,
    process: [
      { title: "Packing check", body: "Packing and marking instructions are confirmed against your requirements." },
      { title: "Documents", body: "Invoices and packing lists are collected and checked for accuracy." },
      { title: "Booking", body: "Cargo readiness is shared with your forwarder and collection is arranged." },
      { title: "Dispatch", body: "Shipment details are confirmed and passed to your team." },
    ],
    benefits: [
      { title: "Correct paperwork", body: "Documents are checked before they reach your forwarder or customs broker." },
      { title: "On-time handover", body: "Cargo readiness is communicated early so bookings are not missed." },
      { title: "Consistent packing", body: "Cartons arrive packed and marked the way your warehouse expects." },
    ],
    image: "stacks",
    related: ["quality-assurance", "production-management", "merchandising"],
    order: 6,
    published: true,
    seoTitle: "Textile Shipment Coordination from Pakistan | Sourcing Eleven",
    seoDescription:
      "Shipment coordination for garment and textile orders: packing and carton checks, export documentation review and handover to your nominated freight forwarder.",
    keywords: ["textile shipment coordination", "garment export coordination Pakistan"],
  },
];
