"use client";

import { useState } from "react";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div>
      <p className="text-sm font-semibold text-navy">Share this article</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-pill border border-navy/15 px-4 text-sm text-navy transition-colors hover:border-navy"
            >
              {l.label}
              {l.label !== "Email" && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} className="inline-flex min-h-10 items-center rounded-pill border border-navy/15 px-4 text-sm text-navy transition-colors hover:border-navy">
            {copied ? "Link copied" : "Copy link"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Link copied to clipboard" : ""}
          </span>
        </li>
      </ul>
    </div>
  );
}
