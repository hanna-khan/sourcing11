"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { readConsent, track, writeConsent, type AnalyticsEvent, type Consent } from "@/lib/analytics/track";

const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
export const analyticsConfigured = Boolean(GTM || GA4);

/**
 * Loads GTM or GA4 only after explicit consent (Consent Mode v2 defaults to
 * denied). With no analytics IDs configured, nothing loads and no banner shows.
 */
function subscribeConsent(cb: () => void) {
  window.addEventListener("s11:consent", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("s11:consent", cb);
    window.removeEventListener("storage", cb);
  };
}

export function Analytics() {
  const consent = useSyncExternalStore<Consent | null | "unknown">(subscribeConsent, readConsent, () => "unknown");
  const [reopened, setReopened] = useState(false);
  const showBanner = analyticsConfigured && (consent === null || reopened);

  useEffect(() => {
    const onOpen = () => setReopened(true);
    window.addEventListener("s11:open-consent", onOpen);
    return () => window.removeEventListener("s11:open-consent", onOpen);
  }, []);

  // Delegated click tracking for CTAs and contact links.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!el) return;
      const explicit = el.getAttribute("data-track") as AnalyticsEvent | null;
      const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") ?? "" : "";
      const event: AnalyticsEvent | null =
        explicit ??
        (href.startsWith("mailto:") ? "email_click" : href.startsWith("tel:") ? "phone_click" : /wa\.me|whatsapp/.test(href) ? "whatsapp_click" : href === "/request-a-quote" || href === "/contact" ? "cta_click" : null);
      if (!event) return;
      track(event, { label: el.getAttribute("data-track-label") || el.textContent?.trim().slice(0, 60), href, page: location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  const decide = (v: Consent) => {
    writeConsent(v);
    setReopened(false);
  };

  return (
    <>
      {analyticsConfigured && (
        <Script id="consent-defaults" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`}
        </Script>
      )}
      {consent === "granted" && GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`gtag('consent','update',{analytics_storage:'granted'});(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {consent === "granted" && !GTM && GA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`gtag('consent','update',{analytics_storage:'granted'});gtag('js',new Date());gtag('config','${GA4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {showBanner && (
        <div role="region" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl rounded-card border border-line bg-white p-6 text-ink shadow-panel sm:inset-x-6 sm:bottom-6">
          <p className="text-[0.9375rem] leading-relaxed">
            We use analytics cookies to understand how buyers use this site, only if you allow them.{" "}
            <Link href="/privacy-policy" className="font-semibold text-gold-ink underline underline-offset-2">
              Privacy policy
            </Link>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => decide("granted")} className="min-h-11 rounded-pill bg-navy px-6 text-sm font-semibold text-ivory">
              Allow analytics
            </button>
            <button type="button" onClick={() => decide("denied")} className="min-h-11 rounded-pill border border-navy/25 px-6 text-sm font-semibold text-navy">
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
