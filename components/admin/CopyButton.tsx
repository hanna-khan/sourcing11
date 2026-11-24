"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy URL" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 2000);
        } catch {
          setDone(false);
        }
      }}
      className="text-sm font-semibold text-navy underline underline-offset-4"
    >
      {done ? "Copied" : label}
    </button>
  );
}
