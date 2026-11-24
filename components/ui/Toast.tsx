"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { cn } from "@/lib/utils/cn";

type Toast = { id: number; tone: "success" | "error" | "info"; message: string };
const Ctx = createContext<(message: string, tone?: Toast["tone"]) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-center gap-3 sm:left-auto sm:right-6 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <m.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border-l-2 bg-navy-deep px-5 py-4 text-[0.9375rem] text-ivory shadow-panel",
                t.tone === "success" && "border-gold",
                t.tone === "error" && "border-[#e07a6a]",
                t.tone === "info" && "border-ivory/40",
              )}
            >
              <span className="flex-1">{t.message}</span>
              <button type="button" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} className="-mr-1 text-ivory/70 hover:text-ivory">
                <span className="sr-only">Dismiss</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
