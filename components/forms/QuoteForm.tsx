"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Checkbox, SelectField, SpamFields, TextArea, TextField } from "./Fields";
import { FileUpload } from "./FileUpload";
import { Turnstile } from "./Turnstile";
import { Button } from "@/components/ui/Button";
import { countries, priorityCountries } from "@/data/countries";
import { currencies, fieldErrors, formToObject, productCategoryOptions, quoteSchema, quoteStepSchemas } from "@/lib/validations/forms";
import { track } from "@/lib/analytics/track";
import { formatBytes } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const steps = [
  { key: "you", title: "About you", schema: quoteStepSchemas.you },
  { key: "product", title: "Your product", schema: quoteStepSchemas.product },
  { key: "commercial", title: "Requirements", schema: quoteStepSchemas.commercial },
  { key: "review", title: "Review and send", schema: quoteStepSchemas.consent },
] as const;

export function QuoteForm() {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const mountedAt = useRef(0);
  const [review, setReview] = useState<Record<string, unknown>>({});
  const didMount = useRef(false);

  useEffect(() => {
    mountedAt.current = Date.now();
    // Preselect the category when arriving from a category page (?category=…).
    const c = new URLSearchParams(window.location.search).get("category");
    const select = form.current?.elements.namedItem("productCategory") as HTMLSelectElement | null;
    if (c && select && productCategoryOptions.some((o) => o.value === c)) select.value = c;
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const data = () => formToObject(new FormData(form.current!), ["consent"]);

  const validateStep = (i: number) => {
    const res = steps[i].schema.safeParse(data());
    if (res.success) {
      setErrors({});
      return true;
    }
    const fe = fieldErrors(res.error);
    setErrors(fe);
    const first = Object.keys(fe)[0];
    window.setTimeout(() => (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus?.(), 30);
    return false;
  };

  const next = () => {
    if (!validateStep(step)) return;
    const nextStep = Math.min(step + 1, steps.length - 1);
    if (nextStep === steps.length - 1) setReview(data());
    track("quote_step", { step: steps[nextStep].key });
    setStep(nextStep);
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) return next();
    const all = quoteSchema.safeParse(data());
    if (!all.success) {
      const fe = fieldErrors(all.error);
      setErrors(fe);
      const idx = steps.findIndex((s) => Object.keys(fe).some((k) => k in s.schema.shape));
      if (idx >= 0 && idx !== step) setStep(idx);
      return;
    }
    const fd = new FormData(form.current!);
    fd.delete("files");
    fd.set("startedAt", String(mountedAt.current));
    files.forEach((f) => fd.append("files", f));
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/quote", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; reference?: string; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setServerError(json.error || "Your request could not be sent. Try again.");
        if (json.fields) {
          setErrors(json.fields);
          const idx = json.fields.files ? 2 : steps.findIndex((s) => Object.keys(json.fields!).some((k) => k in s.schema.shape));
          if (idx >= 0) setStep(idx);
        }
        return;
      }
      track("quote_submit", { category: all.data.productCategory });
      router.push(`/thank-you?type=quote&ref=${encodeURIComponent(json.reference ?? "")}`);
    } catch {
      setStatus("error");
      setServerError("We couldn't reach the server. Check your connection and try again — your answers are still here.");
    }
  }

  const catLabel = productCategoryOptions.find((c) => c.value === review.productCategory)?.label;

  return (
    <form ref={form} noValidate onSubmit={submit} className="relative">
      {/* Progress */}
      <ol className="mb-12 grid grid-cols-4 gap-2" aria-label="Quote request progress">
        {steps.map((s, i) => (
          <li key={s.key} aria-current={i === step ? "step" : undefined}>
            <span className="relative block h-[3px] overflow-hidden rounded-full bg-line">
              <span className={cn("absolute inset-0 origin-left bg-gold transition-transform duration-700 ease-[var(--ease-silk)]", i <= step ? "scale-x-100" : "scale-x-0")} />
            </span>
            <span className={cn("mt-3 hidden text-sm sm:block", i === step ? "font-semibold text-navy" : "text-muted-strong")}>
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
              {i < step && <span className="sr-only"> (completed)</span>}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={heading} tabIndex={-1} className="font-serif-display text-[2.25rem] leading-tight text-navy outline-none">
        <span className="mr-3 text-gold-ink">{String(step + 1).padStart(2, "0")}</span>
        {steps[step].title}
      </h2>
      <p className="mt-2 text-sm text-muted-strong">
        Step {step + 1} of {steps.length}. Fields marked <span className="text-gold-ink">*</span> are required.
      </p>

      {serverError && (
        <div role="alert" className="mt-8 rounded-field border border-danger/30 bg-danger/5 px-5 py-4 text-[0.9375rem] font-medium text-danger">
          {serverError}
        </div>
      )}

      <div className="mt-10" />

      {/* All steps stay mounted so values persist; inactive steps are hidden. */}
      <fieldset hidden={step !== 0} className="quote-step grid gap-6 sm:grid-cols-2">
        <legend className="sr-only">About you</legend>
        <TextField label="Full name" name="fullName" autoComplete="name" required error={errors.fullName} />
        <TextField label="Company name" name="companyName" autoComplete="organization" required error={errors.companyName} />
        <TextField label="Business email" name="email" type="email" inputMode="email" autoComplete="email" required error={errors.email} />
        <SelectField
          label="Country"
          name="country"
          autoComplete="country-name"
          required
          placeholder="Select your country"
          options={[]}
          groups={[
            { label: "Common", options: priorityCountries },
            { label: "All countries", options: countries },
          ]}
          error={errors.country}
        />
      </fieldset>

      <fieldset hidden={step !== 1} className="quote-step grid gap-6">
        <legend className="sr-only">Your product</legend>
        <SelectField
          label="Product category"
          name="productCategory"
          required
          placeholder="Choose a category"
          options={productCategoryOptions.map((o) => ({ value: o.value, label: o.label }))}
          defaultValue=""
          error={errors.productCategory}
        />
        <TextArea label="Product description" name="productDescription" required rows={5} error={errors.productDescription} hint="Product type, construction, sizes, colours and any decoration." />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Estimated quantity" name="quantity" required error={errors.quantity} hint="For example: 3 styles × 2 colours, 1,500 pieces per colour." />
          <TextField label="Fabric or material requirements" name="materials" error={errors.materials} hint="Composition, weight (GSM), finish." />
        </div>
      </fieldset>

      <fieldset hidden={step !== 2} className="quote-step grid gap-6">
        <legend className="sr-only">Requirements</legend>
        <div className="grid gap-6 sm:grid-cols-[1fr_10rem]">
          <TextField label="Target price" name="targetPrice" inputMode="decimal" error={errors.targetPrice} hint="Per unit, if you have one in mind." />
          <SelectField label="Currency" name="targetCurrency" optionalLabel={false} options={currencies.map((c) => ({ value: c, label: c }))} defaultValue="USD" />
        </div>
        <TextArea label="Delivery requirements" name="delivery" required rows={3} error={errors.delivery} hint="Target date in your warehouse, destination and preferred Incoterms if known." />
        <FileUpload files={files} onChange={setFiles} error={errors.files} />
        <TextArea label="Additional message" name="message" rows={4} error={errors.message} />
      </fieldset>

      <fieldset hidden={step !== 3} className="quote-step grid gap-8">
        <legend className="sr-only">Review and send</legend>
        <dl className="grid gap-x-8 gap-y-5 rounded-card border border-line bg-ivory/60 p-6 sm:grid-cols-2 sm:p-8">
          {[
            ["Name", review.fullName],
            ["Company", review.companyName],
            ["Email", review.email],
            ["Country", review.country],
            ["Category", catLabel],
            ["Quantity", review.quantity],
            ["Materials", review.materials],
            ["Target price", review.targetPrice ? `${review.targetPrice} ${review.targetCurrency ?? ""}` : undefined],
            ["Delivery", review.delivery],
            ["Files", files.length ? files.map((f) => `${f.name} (${formatBytes(f.size)})`).join(", ") : "None attached"],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={String(k)}>
                <dt className="text-sm text-muted-strong">{String(k)}</dt>
                <dd className="mt-1 break-words text-[0.9375rem] text-navy">{String(v)}</dd>
              </div>
            ))}
          {Boolean(review.productDescription) && (
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-strong">Product description</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[0.9375rem] text-navy">{String(review.productDescription)}</dd>
            </div>
          )}
        </dl>
        <Checkbox
          name="consent"
          error={errors.consent}
          label={
            <>
              I agree that Sourcing Eleven may store these details and files to prepare a response, as described in the{" "}
              <Link href="/privacy-policy" className="font-semibold text-gold-ink underline underline-offset-2">
                privacy policy
              </Link>
              .
            </>
          }
        />
        <Turnstile />
      </fieldset>

      <SpamFields />

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        {step > 0 ? (
          <Button type="button" variant="outline-dark" onClick={back}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <Button type="button" variant="dark" arrow onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="submit" variant="gold" arrow loading={status === "sending"}>
            {status === "sending" ? "Sending request…" : "Send quote request"}
          </Button>
        )}
      </div>
    </form>
  );
}
