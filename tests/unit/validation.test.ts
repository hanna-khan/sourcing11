import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors, formToObject, quoteSchema, quoteStepSchemas } from "@/lib/validations/forms";

const validQuote = {
  fullName: "Amelia Hart",
  companyName: "Hart & Co",
  email: "Amelia@HartCo.co.uk ",
  country: "United Kingdom",
  productCategory: "garments-apparel",
  productDescription: "Heavyweight organic-look crew neck sweatshirt, 3 colours, embroidered logo.",
  quantity: "1,500 pieces per colour",
  delivery: "In our UK warehouse by August",
  consent: true,
};

describe("contact schema", () => {
  it("accepts a complete enquiry and normalises email", () => {
    const r = contactSchema.parse({ name: "Sam", email: " SAM@Brand.COM ", subject: "General question", message: "We would like to discuss a new range of towels.", consent: true });
    expect(r.email).toBe("sam@brand.com");
    expect(r.company).toBeUndefined();
  });

  it("rejects missing consent, short message and bad email with field messages", () => {
    const r = contactSchema.safeParse({ name: "S", email: "nope", subject: "General question", message: "short", consent: false });
    expect(r.success).toBe(false);
    const errs = fieldErrors(r.error!);
    expect(Object.keys(errs).sort()).toEqual(["consent", "email", "message", "name"]);
    expect(errs.email).toMatch(/valid email/);
  });

  it("uses plain-language messages for missing required fields", () => {
    const r = contactSchema.safeParse({ subject: "General question", consent: true });
    const errs = fieldErrors(r.error!);
    expect(errs.name).toBe("Enter your name.");
    expect(errs.email).toBe("Enter your email address.");
    expect(errs.message).toBe("Enter your message.");
  });

  it("rejects an unknown subject", () => {
    const r = contactSchema.safeParse({ name: "Sam", email: "a@b.com", subject: "Hack", message: "x".repeat(30), consent: true });
    expect(r.success).toBe(false);
  });
});

describe("quote schema", () => {
  it("accepts a complete request", () => {
    const r = quoteSchema.parse(validQuote);
    expect(r.email).toBe("amelia@hartco.co.uk");
  });

  it("validates each step independently", () => {
    expect(quoteStepSchemas.you.safeParse({ fullName: "A", companyName: "", email: "x", country: "" }).success).toBe(false);
    expect(quoteStepSchemas.product.safeParse({ productCategory: "other", productDescription: "Too short", quantity: "1" }).success).toBe(false);
    expect(quoteStepSchemas.commercial.safeParse({ delivery: "Asap please" }).success).toBe(true);
  });

  it("rejects an invalid category and currency", () => {
    expect(quoteSchema.safeParse({ ...validQuote, productCategory: "weapons" }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...validQuote, targetCurrency: "BTC" }).success).toBe(false);
  });
});

describe("formToObject", () => {
  it("maps checkboxes and drops empty strings", () => {
    const fd = new FormData();
    fd.set("name", "Sam");
    fd.set("company", "");
    fd.set("consent", "on");
    expect(formToObject(fd, ["consent"])).toEqual({ name: "Sam", company: undefined, consent: true });
  });
});
