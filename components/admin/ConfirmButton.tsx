"use client";

import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils/cn";

/** Two-step destructive action: first press arms it, second press confirms. */
export function ConfirmButton({ action, label, className }: { action: () => Promise<void>; label: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 5000);
    return () => window.clearTimeout(t);
  }, [armed]);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => (armed ? start(() => action()) : setArmed(true))}
        className={cn(
          "min-h-11 rounded-pill px-5 text-sm font-semibold transition-colors disabled:opacity-60",
          armed ? "bg-danger text-white" : "border border-danger/40 text-danger hover:bg-danger/5",
          className,
        )}
      >
        {pending ? "Deleting…" : armed ? "Press again to confirm" : label}
      </button>
      <span className="sr-only" aria-live="assertive">
        {armed ? `Press the button again to confirm: ${label}` : ""}
      </span>
    </>
  );
}
