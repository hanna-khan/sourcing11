import type { Product, ProductCategory } from "@/lib/types";

export const categories: ProductCategory[] = [
  {
    id: "cat-garments-apparel",
    slug: "garments-apparel",
    title: "Garments & Apparel",
    excerpt: "Knitwear, wovens and denim for fashion brands, retailers and wholesalers.",
    heroTitle: "Garments and apparel, sourced for your range.",
    intro:
      "We source knitted, woven and denim garments for international brands, retailers and wholesalers, matching each style to a manufacturing partner whose product focus and order profile suit it.",
    body: `## Matching styles to the right partner

Garment manufacturers tend to specialise — in knit or woven constructions, in particular product types, or in certain order sizes. A partner who excels at heavyweight fleece may not be the best fit for tailored shirting. We look at each style in your range and match it to partners whose existing work is closest to what you need.

## What we need from you

The most useful starting information is a tech pack or a reference garment, a target quantity per style and colour, an indicative price position and your required delivery window. If you are earlier in the process, we can help you work out what a manufacturer will ask for.`,
    productTypes: [
      "T-shirts and polo shirts",
      "Sweatshirts, hoodies and fleece",
      "Denim jeans, jackets and skirts",
      "Woven shirts and blouses",
      "Trousers, chinos and shorts",
      "Activewear and athleisure",
      "Loungewear and sleepwear",
      "Workwear and uniforms",
      "Childrenswear",
    ],
    capabilities: [
      { title: "Knit and woven", body: "Sourcing across jersey, fleece, rib and interlock knits as well as woven cottons, blends and denim." },
      { title: "Development to bulk", body: "Coordination from proto sampling and fit approvals through to bulk production." },
      { title: "Trims and labelling", body: "Main labels, care labels, hang tags and packaging coordinated alongside the garment." },
      { title: "Decoration", body: "Printing, embroidery and garment washes coordinated where they are part of the approved design." },
    ],
    process: [
      { title: "Range review", body: "We review styles, quantities and target prices to group them sensibly by supplier fit." },
      { title: "Sampling", body: "Proto and fit samples are coordinated and comments tracked to approval." },
      { title: "Bulk follow-up", body: "Production is followed and inspected against the approved sample." },
    ],
    image: "denimTwill",
    gallery: ["denimTwill", "jerseyKnit", "drafting", "navyTwill"],
    related: ["fabrics-materials", "home-textiles"],
    order: 1,
    published: true,
    seoTitle: "Garment & Apparel Sourcing from Pakistan | Sourcing Eleven",
    seoDescription:
      "Source knitwear, wovens and denim from Pakistan through a buying agency that matches each style to a suitable manufacturing partner and follows it to shipment.",
    keywords: ["garment buying agency Pakistan", "apparel sourcing company", "clothing sourcing agent Pakistan"],
  },
  {
    id: "cat-fabrics-materials",
    slug: "fabrics-materials",
    title: "Fabrics & Materials",
    excerpt: "Woven and knitted fabrics, blends and finishes for product developers and manufacturers.",
    heroTitle: "Fabrics and materials, specified precisely.",
    intro:
      "We source woven and knitted fabrics for brands, product developers and manufacturers — from cotton basics to blends and finished fabrics — working from a clear specification.",
    body: `## Specify, then source

Fabric sourcing goes faster when the specification is precise. Composition, construction, weight (GSM), width, finish and colour requirements all change which mills are suitable and what the fabric will cost. We help you capture that specification and then request swatches, hangers or yardage for evaluation.

## Testing and approval

Fabric approvals often depend on test results such as shrinkage, colour fastness or pilling performance. We coordinate sample submission to the laboratory you nominate and keep results attached to the approval record.`,
    productTypes: [
      "Cotton poplin, twill and canvas",
      "Denim fabrics",
      "Single jersey, rib and interlock knits",
      "Fleece and French terry",
      "Polyester and cotton blends",
      "Linen and linen blends",
      "Yarn-dyed and printed fabrics",
      "Greige and undyed fabrics",
    ],
    capabilities: [
      { title: "Specification support", body: "Help defining composition, construction, GSM, width and finish requirements." },
      { title: "Swatches and hangers", body: "Requesting and consolidating fabric samples so options can be compared." },
      { title: "Colour development", body: "Lab dip and strike-off coordination against your colour standards." },
      { title: "Test coordination", body: "Sample submission to your nominated laboratory for the tests you require." },
    ],
    process: [
      { title: "Specify", body: "We agree a written fabric specification and target price per metre or kilo." },
      { title: "Sample", body: "Swatches and hangers are requested and presented for comparison." },
      { title: "Approve", body: "Colour, hand-feel and test results are approved before bulk is ordered." },
    ],
    image: "bolts",
    gallery: ["bolts", "undyedCotton", "warp", "labDips"],
    related: ["garments-apparel", "home-textiles"],
    order: 2,
    published: true,
    seoTitle: "Fabric Sourcing Company in Pakistan | Woven & Knit Fabrics",
    seoDescription:
      "Fabric sourcing from Pakistan: woven and knitted fabrics, blends and finishes, with specification support, swatches and test coordination for brands.",
    keywords: ["fabric sourcing company", "fabric sourcing Pakistan", "textile materials sourcing"],
  },
  {
    id: "cat-home-textiles",
    slug: "home-textiles",
    title: "Home Textiles",
    excerpt: "Bed linen, towels, kitchen and table textiles for homeware brands and retailers.",
    heroTitle: "Home textiles, sourced with care for detail.",
    intro:
      "We source bed linen, towels, kitchen and table textiles for homeware brands and retailers, coordinating construction, finishing and retail-ready packaging.",
    body: `## Details that matter in home textiles

Home textile buyers often specify thread count, GSM, pile height, construction and finishing in detail, alongside packaging that is ready for retail. We make sure those details are captured in the brief, checked on samples and held consistent through bulk.

## Retail-ready packaging

Bed linen and towels are frequently sold in their packaging. We coordinate inserts, bands, bags and labelling with the product so the finished pack matches your retail standards.`,
    productTypes: [
      "Bed sheets, duvet covers and pillowcases",
      "Towels and bathrobes",
      "Kitchen towels and aprons",
      "Table linen and napkins",
      "Cushion covers and throws",
      "Curtains and soft furnishings",
    ],
    capabilities: [
      { title: "Construction detail", body: "Thread count, GSM, weave and pile requirements captured and checked on samples." },
      { title: "Finishing", body: "Hemming, piping, embroidery and other finishes coordinated to specification." },
      { title: "Retail packaging", body: "Inserts, bands, bags and barcoded labels coordinated with the product." },
      { title: "Set coordination", body: "Matching components of a set kept consistent in shade and size." },
    ],
    process: [
      { title: "Specify", body: "Construction, sizes, finishes and packaging are defined per item." },
      { title: "Sample", body: "Samples are checked for construction, shade and finishing before approval." },
      { title: "Pack and ship", body: "Retail packaging and cartons are checked before handover to your forwarder." },
    ],
    image: "waffleCotton",
    gallery: ["waffleCotton", "terry", "linenIvory", "stacks"],
    related: ["fabrics-materials", "garments-apparel"],
    order: 3,
    published: true,
    seoTitle: "Home Textile Sourcing from Pakistan | Bed Linen & Towels",
    seoDescription:
      "Home textile sourcing from Pakistan: bed linen, towels, kitchen and table textiles, coordinated from specification and sampling to retail-ready packaging.",
    keywords: ["home textile sourcing", "home textile sourcing Pakistan", "bed linen and towel sourcing"],
  },
];

export const products: Product[] = [
  { id: "p-jersey-tee", name: "Jersey T-shirts", categorySlug: "garments-apparel", description: "Crew and V-neck tees in single jersey, from basics to premium heavyweight.", materials: "Cotton and cotton-elastane jersey", image: "jerseyKnit", order: 1, published: true },
  { id: "p-fleece", name: "Fleece and hoodies", categorySlug: "garments-apparel", description: "Brushed-back fleece and loopback French terry sweatshirts and hoodies.", materials: "Cotton and polyester-cotton fleece", image: "navyTwill", order: 2, published: true },
  { id: "p-denim", name: "Denim", categorySlug: "garments-apparel", description: "Jeans, jackets and skirts with washes coordinated to your approved standard.", materials: "Rigid and stretch denim", image: "denimTwill", order: 3, published: true },
  { id: "p-wovens", name: "Woven shirts", categorySlug: "garments-apparel", description: "Poplin, oxford and twill shirting for casual and formal ranges.", materials: "Cotton, cotton blends, linen", image: "drafting", order: 4, published: true },
  { id: "p-poplin", name: "Cotton wovens", categorySlug: "fabrics-materials", description: "Poplin, twill, drill and canvas in a range of weights and finishes.", materials: "Cotton and cotton blends", image: "undyedCotton", order: 1, published: true },
  { id: "p-knits", name: "Knitted fabrics", categorySlug: "fabrics-materials", description: "Single jersey, rib, interlock, fleece and French terry.", materials: "Cotton, polyester, blends with elastane", image: "jerseyKnit", order: 2, published: true },
  { id: "p-denim-fabric", name: "Denim fabrics", categorySlug: "fabrics-materials", description: "Indigo and coloured denims in rigid and stretch constructions.", materials: "Cotton, cotton-elastane", image: "denimTwill", order: 3, published: true },
  { id: "p-yarn-dyed", name: "Yarn-dyed fabrics", categorySlug: "fabrics-materials", description: "Checks, stripes and chambray for shirting and home textiles.", materials: "Cotton and cotton blends", image: "warp", order: 4, published: true },
  { id: "p-bedding", name: "Bed linen", categorySlug: "home-textiles", description: "Sheets, duvet covers and pillowcases in percale and sateen weaves.", materials: "Cotton, cotton-polyester, linen", image: "linenIvory", order: 1, published: true },
  { id: "p-towels", name: "Towels", categorySlug: "home-textiles", description: "Bath, hand and guest towels in terry and waffle constructions.", materials: "Cotton terry and waffle", image: "terry", order: 2, published: true },
  { id: "p-kitchen", name: "Kitchen textiles", categorySlug: "home-textiles", description: "Tea towels, aprons and oven gloves, plain or printed.", materials: "Cotton, linen-cotton", image: "waffleCotton", order: 3, published: true },
  { id: "p-table", name: "Table linen", categorySlug: "home-textiles", description: "Tablecloths, runners and napkins with hemmed or embroidered finishes.", materials: "Cotton, linen", image: "champagneSilk", order: 4, published: true },
];
