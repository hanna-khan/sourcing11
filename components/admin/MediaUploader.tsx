"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { uploadMediaAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function MediaUploader() {
  const [state, dispatch, pending] = useActionState<ActionState, FormData>(uploadMediaAction, {});
  const toast = useToast();
  const form = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setPreview(null);
  }

  useEffect(() => {
    if (state.ok) {
      toast(state.message ?? "Uploaded.", "success");
      form.current?.reset();
    }
  }, [state, toast]);

  return (
    <form
      ref={form}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
      className="grid gap-5 sm:grid-cols-[8rem_1fr]"
    >
      <div className="relative h-32 w-32 overflow-hidden rounded-media border border-dashed border-navy/25 bg-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img src={preview} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="space-y-4">
        {state.error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {state.error}
          </p>
        )}
        <div>
          <label htmlFor="file" className="mb-2 block text-sm font-semibold text-navy">
            Image file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-invalid={state.fields?.file ? true : undefined}
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
            className="block w-full text-sm file:mr-4 file:rounded-pill file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ivory"
          />
          <p className="mt-1.5 text-xs text-muted-strong">JPG, PNG or WebP, up to 8 MB. Large images are optimised automatically when displayed.</p>
        </div>
        <div>
          <label htmlFor="alt" className="mb-2 block text-sm font-semibold text-navy">
            Alt text
          </label>
          <input id="alt" name="alt" aria-invalid={state.fields?.alt ? true : undefined} placeholder="Describe what the image shows" className="block w-full rounded-field border border-line bg-white px-4 py-3 text-sm" />
        </div>
        <Button type="submit" variant="dark" loading={pending}>
          {pending ? "Uploading…" : "Upload image"}
        </Button>
      </div>
    </form>
  );
}
