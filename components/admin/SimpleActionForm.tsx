"use client";

import { startTransition, useActionState, useEffect, type ReactNode } from "react";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/** Wraps server-rendered fields with an action, toast feedback and field-error summary. */
export function SimpleActionForm({ action, children, submitLabel, className }: { action: (p: ActionState, fd: FormData) => Promise<ActionState>; children: ReactNode; submitLabel: string; className?: string }) {
  const [state, dispatch, pending] = useActionState(action, {});
  const toast = useToast();
  useEffect(() => {
    if (state.ok && state.message) toast(state.message, "success");
  }, [state, toast]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
      className={className}
    >
      {state.error && (
        <div role="alert" className="mb-6 rounded-field border border-danger/30 bg-danger/5 px-5 py-4 text-sm font-medium text-danger">
          {state.error}
          {state.fields && (
            <ul className="mt-2 list-disc pl-5 font-normal">
              {Object.entries(state.fields).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {children}
      <div className="mt-8">
        <Button type="submit" variant="dark" loading={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
