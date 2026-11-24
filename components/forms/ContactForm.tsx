"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Checkbox, SelectField, SpamFields, TextArea, TextField } from "./Fields";
import { Turnstile } from "./Turnstile";
import { Button } from "@/components/ui/Button";
import { contactSchema, contactSubjects, fieldErrors, formToObject } from "@/lib/validations/forms";
import { countries, priorityCountries } from "@/data/countries";
import { track } from "@/lib/analytics/track";

type State = { status: "idle" | "sending" | "sent" | "error"; error?: string; fields: Record<string, string> };

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle", fields: {} });
  const mountedAt = useRef(0);
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const formLevelError = state.status === "error" && Object.keys(state.fields).length === 0;
  useEffect(() => {
    if (state.status === "sent") success.current?.focus();
    // Field errors move focus to the first invalid field; only form-level errors focus the summary.
    if (formLevelError) summary.current?.focus();
  }, [state.status, formLevelError]);

  const focusFirstError = (fields: Record<string, string>) => {
    const first = Object.keys(fields)[0];
    if (first) (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus?.();
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("startedAt", String(mountedAt.current));
    const parsed = contactSchema.safeParse(formToObject(fd, ["consent"]));
    if (!parsed.success) {
      const fields = fieldErrors(parsed.error);
      setState({ status: "error", error: "Check the highlighted fields.", fields });
      focusFirstError(fields);
      return;
    }
    setState({ status: "sending", fields: {} });
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setState({ status: "error", error: json.error || "Your message could not be sent. Try again.", fields: json.fields || {} });
        if (json.fields) focusFirstError(json.fields);
        return;
      }
      track("contact_submit", { subject: parsed.data.subject });
      setState({ status: "sent", fields: {} });
    } catch {
      setState({ status: "error", error: "We couldn't reach the server. Check your connection and try again.", fields: {} });
    }
  }

  if (state.status === "sent") {
    return (
      <div ref={success} tabIndex={-1} className="rounded-card border border-gold/40 bg-ivory p-10 outline-none" role="status">
        <svg viewBox="0 0 80 30" aria-hidden="true" className="h-8 w-20 text-gold-ink">
          <path d="M2 28 C 18 2, 62 2, 78 28" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <h2 className="font-serif-display mt-6 text-[2.25rem] leading-tight text-navy">Message received.</h2>
        <p className="mt-4 max-w-md text-muted-strong">Thank you for getting in touch. We will reply to the email address you gave us.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/request-a-quote" className="font-semibold text-gold-ink underline underline-offset-4">
            Request a detailed quote
          </Link>
          <button type="button" onClick={() => setState({ status: "idle", fields: {} })} className="font-semibold text-navy underline underline-offset-4">
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const err = state.fields;
  return (
    <form ref={form} noValidate onSubmit={onSubmit} className="relative space-y-6" aria-describedby={state.status === "error" ? "contact-error" : undefined}>
      {state.status === "error" && (
        <div ref={summary} id="contact-error" tabIndex={-1} role="alert" className="rounded-field border border-danger/30 bg-danger/5 px-5 py-4 text-[0.9375rem] font-medium text-danger outline-none">
          {state.error}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Full name" name="name" autoComplete="name" required error={err.name} />
        <TextField label="Company" name="company" autoComplete="organization" error={err.company} />
        <TextField label="Business email" name="email" type="email" autoComplete="email" inputMode="email" required error={err.email} />
        <TextField label="Phone or WhatsApp" name="phone" type="tel" autoComplete="tel" error={err.phone} hint="Include your country code." />
        <SelectField
          label="Country"
          name="country"
          autoComplete="country-name"
          placeholder="Select your country"
          options={[]}
          groups={[
            { label: "Common", options: priorityCountries },
            { label: "All countries", options: countries },
          ]}
          error={err.country}
        />
        <SelectField label="What is this about?" name="subject" required placeholder="Choose a topic" options={contactSubjects.map((s) => ({ value: s, label: s }))} error={err.subject} />
      </div>
      <TextArea label="Message" name="message" required rows={6} error={err.message} hint="Tell us about your product, quantities or question." />
      <Checkbox
        name="consent"
        error={err.consent}
        label={
          <>
            I agree that Sourcing Eleven may store these details to respond to my enquiry, as described in the{" "}
            <Link href="/privacy-policy" className="font-semibold text-gold-ink underline underline-offset-2">
              privacy policy
            </Link>
            .
          </>
        }
      />
      <SpamFields />
      <input type="hidden" name="source" value="/contact" />
      <Turnstile />
      <Button type="submit" variant="dark" arrow loading={state.status === "sending"}>
        {state.status === "sending" ? "Sending…" : "Send message"}
      </Button>
      <noscript>
        <p className="text-sm text-danger">This form needs JavaScript. Please enable it, or contact us by email.</p>
      </noscript>
    </form>
  );
}
