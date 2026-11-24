import "server-only";
import { randomUUID } from "node:crypto";
import { store } from "@/lib/database/store";
import { renderRows, sendEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/site";
import { productCategoryOptions, type ContactInput, type QuoteInput } from "@/lib/validations/forms";
import type { Attachment, ContactEnquiry, QuoteRequest } from "@/lib/types";

type Meta = { ip?: string; userAgent?: string; source?: string };

export function quoteReference(date = new Date()) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, "");
  return `S11-${ymd}-${randomUUID().slice(0, 4).toUpperCase()}`;
}

export async function createContactEnquiry(input: ContactInput, meta: Meta) {
  const record: ContactEnquiry = {
    id: randomUUID(),
    kind: "contact",
    name: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    country: input.country,
    subject: input.subject,
    message: input.message,
    status: "new",
    emailStatus: "skipped",
    createdAt: new Date().toISOString(),
    meta,
  };
  await store.upsert("enquiries", record);
  const mail = await sendEmail({
    subject: `New enquiry: ${input.subject} — ${input.name}`,
    replyTo: input.email,
    html: renderRows(
      "New website enquiry",
      [
        ["Name", input.name],
        ["Company", input.company],
        ["Email", input.email],
        ["Phone", input.phone],
        ["Country", input.country],
        ["Subject", input.subject],
        ["Message", input.message],
      ],
      `View in admin: ${absoluteUrl(`/admin/enquiries/${record.id}`)}`,
    ),
  });
  if (mail.status !== "skipped") {
    record.emailStatus = mail.status;
    await store.upsert("enquiries", record);
  }
  if (mail.status === "failed") console.error("[email] contact notification failed:", mail.detail);
  return record;
}

export async function createQuoteRequest(input: QuoteInput, attachments: Attachment[], meta: Meta) {
  const record: QuoteRequest = {
    id: randomUUID(),
    kind: "quote",
    reference: quoteReference(),
    fullName: input.fullName,
    companyName: input.companyName,
    email: input.email,
    country: input.country,
    productCategory: input.productCategory,
    productDescription: input.productDescription,
    quantity: input.quantity,
    materials: input.materials,
    targetPrice: input.targetPrice,
    targetCurrency: input.targetPrice ? input.targetCurrency : undefined,
    delivery: input.delivery,
    message: input.message,
    attachments,
    status: "new",
    emailStatus: "skipped",
    createdAt: new Date().toISOString(),
    meta,
  };
  await store.upsert("quotes", record);
  const category = productCategoryOptions.find((c) => c.value === input.productCategory)?.label ?? input.productCategory;
  const mail = await sendEmail({
    subject: `Quote request ${record.reference} — ${input.companyName}`,
    replyTo: input.email,
    html: renderRows(
      `Quote request ${record.reference}`,
      [
        ["Name", input.fullName],
        ["Company", input.companyName],
        ["Email", input.email],
        ["Country", input.country],
        ["Category", category],
        ["Product", input.productDescription],
        ["Quantity", input.quantity],
        ["Materials", input.materials],
        ["Target price", input.targetPrice ? `${input.targetPrice} ${input.targetCurrency ?? ""}`.trim() : undefined],
        ["Delivery", input.delivery],
        ["Message", input.message],
        ["Files", attachments.map((a) => a.name).join(", ") || undefined],
      ],
      `View and download files in admin: ${absoluteUrl(`/admin/quotes/${record.id}`)}`,
    ),
  });
  if (mail.status !== "skipped") {
    record.emailStatus = mail.status;
    await store.upsert("quotes", record);
  }
  if (mail.status === "failed") console.error("[email] quote notification failed:", mail.detail);
  return record;
}
