export type Pair = { title: string; body: string };

export interface SeoFields {
  seoTitle?: string;
  seoDescription?: string;
  /** Primary keyword cluster for this page (internal, not rendered as meta keywords) */
  keywords?: string[];
}

export interface Service extends SeoFields {
  id: string;
  slug: string;
  title: string;
  /** Short label used on cards and menus */
  cardTitle: string;
  excerpt: string;
  heroTitle: string;
  heroIntro: string;
  intro: string;
  /** Markdown body */
  body: string;
  process: Pair[];
  benefits: Pair[];
  image: string;
  related: string[];
  order: number;
  published: boolean;
  updatedAt?: string;
}

export interface ProductCategory extends SeoFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroTitle: string;
  intro: string;
  body: string;
  productTypes: string[];
  capabilities: Pair[];
  process: Pair[];
  image: string;
  gallery: string[];
  related: string[];
  order: number;
  published: boolean;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  categorySlug: string;
  description: string;
  materials: string;
  image: string;
  order: number;
  published: boolean;
  updatedAt?: string;
}

export interface Article extends SeoFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  body: string;
  image: string;
  featured: boolean;
  published: boolean;
}

export type EnquiryStatus = "new" | "in_review" | "responded" | "closed" | "spam";

export interface Attachment {
  key: string;
  name: string;
  size: number;
  type: string;
}

export interface ContactEnquiry {
  id: string;
  kind: "contact";
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  emailStatus: "sent" | "skipped" | "failed";
  createdAt: string;
  updatedAt?: string;
  meta: { ip?: string; userAgent?: string; source?: string };
}

export interface QuoteRequest {
  id: string;
  kind: "quote";
  reference: string;
  fullName: string;
  companyName: string;
  email: string;
  country: string;
  productCategory: string;
  productDescription: string;
  quantity: string;
  materials?: string;
  targetPrice?: string;
  targetCurrency?: string;
  delivery: string;
  message?: string;
  attachments: Attachment[];
  status: EnquiryStatus;
  notes?: string;
  emailStatus: "sent" | "skipped" | "failed";
  createdAt: string;
  updatedAt?: string;
  meta: { ip?: string; userAgent?: string; source?: string };
}

export interface MediaItem {
  id: string;
  key: string;
  url: string;
  alt: string;
  name: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface SiteSettings {
  id: "site";
  companyName: string;
  tagline: string;
  shortIntro: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  /** Only when true is a map/address shown publicly */
  addressVerified: boolean;
  businessHours: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  x: string;
  /** Market ids from data/geo.ts shown on the map */
  markets: string[];
  /** Verified figures only — "value :: label" pairs. Empty hides the stats band */
  stats: Pair[];
  /** Genuine team members — "Name :: Role". Empty hides the team section */
  team: Pair[];
  foundingYear: string;
  updatedAt?: string;
}

export interface SeoOverride {
  id: string; // route path, e.g. "/about"
  title?: string;
  description?: string;
  noindex?: boolean;
  updatedAt?: string;
}

export type CollectionMap = {
  services: Service;
  categories: ProductCategory;
  products: Product;
  articles: Article;
  enquiries: ContactEnquiry;
  quotes: QuoteRequest;
  media: MediaItem;
  settings: SiteSettings;
  seo: SeoOverride;
};

export type CollectionName = keyof CollectionMap;
