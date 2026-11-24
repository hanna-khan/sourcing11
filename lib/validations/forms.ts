import { z } from "zod";

const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `Enter ${label}.` })
    .trim()
    .min(min, min <= 1 ? `Enter ${label}.` : `${label[0].toUpperCase()}${label.slice(1)} needs at least ${min} characters.`)
    .max(max, `Keep ${label} under ${max} characters.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const emailField = z.string({ error: "Enter your email address." }).trim().toLowerCase().max(200).email("Enter a valid email address, like name@company.com.");

export const consentField = z.literal(true, { error: "Tick the box to confirm we can use these details to reply." });

export const currencies = ["USD", "GBP", "EUR", "AUD", "CAD", "PKR"] as const;
export const contactSubjects = ["New sourcing project", "Product development", "Partnership", "General question"] as const;
export const productCategoryOptions = [
  { value: "garments-apparel", label: "Garments & Apparel" },
  { value: "fabrics-materials", label: "Fabrics & Materials" },
  { value: "home-textiles", label: "Home Textiles" },
  { value: "other", label: "Something else" },
] as const;

export const contactSchema = z.object({
  name: text(2, 120, "your name"),
  company: optionalText(160),
  email: emailField,
  phone: optionalText(40),
  country: optionalText(80),
  subject: z.enum(contactSubjects, { error: "Choose what your message is about." }),
  message: text(20, 5000, "your message"),
  consent: consentField,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const quoteStepSchemas = {
  you: z.object({
    fullName: text(2, 120, "your full name"),
    companyName: text(2, 160, "your company name"),
    email: emailField,
    country: text(2, 80, "your country"),
  }),
  product: z.object({
    productCategory: z.enum(["garments-apparel", "fabrics-materials", "home-textiles", "other"], {
      error: "Choose a product category.",
    }),
    productDescription: text(20, 4000, "the product description"),
    quantity: text(1, 200, "an estimated quantity"),
    materials: optionalText(1000),
  }),
  commercial: z.object({
    targetPrice: optionalText(60),
    targetCurrency: z.enum(currencies).optional(),
    delivery: text(3, 600, "your delivery requirements"),
    message: optionalText(4000),
  }),
  consent: z.object({ consent: consentField }),
};

export const quoteSchema = quoteStepSchemas.you.extend({
  ...quoteStepSchemas.product.shape,
  ...quoteStepSchemas.commercial.shape,
  ...quoteStepSchemas.consent.shape,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

/** Flattens zod issues into { field: firstMessage } for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Converts FormData into a plain object, mapping checkbox "on" to true. */
export function formToObject(fd: FormData, booleans: string[] = []) {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string") obj[k] = v;
  }
  for (const b of booleans) obj[b] = fd.get(b) === "on" || fd.get(b) === "true";
  for (const k of Object.keys(obj)) if (obj[k] === "") obj[k] = undefined;
  return obj;
}
