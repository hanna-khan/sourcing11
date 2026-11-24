"use client";

const configured = Boolean(process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_GA4_ID);

export function ConsentSettingsButton() {
  if (!configured) return null;
  return (
    <button type="button" className="link-arc" onClick={() => window.dispatchEvent(new Event("s11:open-consent"))}>
      Cookie settings
    </button>
  );
}
