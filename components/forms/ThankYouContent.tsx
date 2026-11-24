"use client";

import { useSyncExternalStore } from "react";
import { LinkButton, TextLink } from "@/components/ui/Button";

/** Reads the reference from the URL on the client so the page itself stays static. */
export function ThankYouContent() {
  const ref = useSyncExternalStore(
    () => () => undefined,
    () => {
      const r = new URLSearchParams(window.location.search).get("ref");
      return r && /^S11-[\w-]{4,20}$/.test(r) ? r : null;
    },
    () => null,
  );

  return (
    <div className="max-w-3xl">
      <p className="kicker">Request received</p>
      <h1 className="font-serif-display mt-6 text-h1 text-ivory">Thank you. Your brief is on its way to our team.</h1>
      {ref && (
        <p className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-pill border border-gold/40 px-5 py-2.5 text-[0.9375rem]">
          Your reference <strong className="font-semibold tracking-wide text-gold-soft">{ref}</strong>
        </p>
      )}
      <p className="mt-8 max-w-xl text-lead text-ivory/80">
        We&apos;ll review your product details and reply to the email address you provided. Keep your reference handy if you need to follow up.
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <LinkButton href="/our-process" variant="gold">
          See how we work
        </LinkButton>
        <TextLink href="/insights" tone="light">
          Read our sourcing guides
        </TextLink>
        <TextLink href="/" tone="light">
          Back to home
        </TextLink>
      </div>
    </div>
  );
}
