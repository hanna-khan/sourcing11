"use client";

import { startTransition, useActionState, useEffect } from "react";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { statusLabels } from "./ui";
import type { EnquiryStatus } from "@/lib/types";

export function StatusForm({ action, status, notes }: { action: (p: ActionState, fd: FormData) => Promise<ActionState>; status: EnquiryStatus; notes?: string }) {
  const [state, dispatch, pending] = useActionState(action, {});
  const toast = useToast();
  useEffect(() => {
    if (state.ok && state.message) toast(state.message, "success");
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
      className="space-y-5"
    >
      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-semibold text-navy">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className="block w-full rounded-field border border-line bg-white px-4 py-3 text-sm">
          {(Object.keys(statusLabels) as EnquiryStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-navy">
          Internal notes
        </label>
        <textarea id="notes" name="notes" defaultValue={notes} rows={6} className="block w-full rounded-field border border-line bg-white px-4 py-3 text-sm" placeholder="Visible to admin users only." />
      </div>
      <Button type="submit" variant="dark" className="w-full" loading={pending}>
        {pending ? "Updating…" : "Update enquiry"}
      </Button>
    </form>
  );
}
