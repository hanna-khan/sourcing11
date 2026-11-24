"use client";

export type AnalyticsEvent =
  | "quote_submit"
  | "contact_submit"
  | "whatsapp_click"
  | "email_click"
  | "phone_click"
  | "cta_click"
  | "quote_step";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "s11_consent";
export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* storage unavailable — consent applies to this page view only */
  }
  window.gtag?.("consent", "update", { analytics_storage: v, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.dispatchEvent(new CustomEvent("s11:consent", { detail: v }));
}

/** Pushes to the GTM/GA4 dataLayer. A no-op until analytics has loaded with consent. */
export function track(event: AnalyticsEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  if (readConsent() !== "granted") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, params);
}
