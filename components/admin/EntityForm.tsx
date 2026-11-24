"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import type { FieldDef } from "@/lib/admin/collections";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "./ConfirmButton";
import { useToast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Values = Record<string, string | boolean | string[]>;
type Option = { value: string; label: string };

const input = "block w-full rounded-field border border-line bg-white px-4 py-3 text-[0.9375rem] focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/40";

export function EntityForm({
  fields,
  values,
  options,
  imageChoices,
  action,
  deleteAction,
  singular,
  isNew,
}: {
  fields: FieldDef[];
  values: Values;
  options: Record<string, Option[]>;
  imageChoices: (Option & { src: string })[];
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  deleteAction?: () => Promise<void>;
  singular: string;
  isNew: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const toast = useToast();
  const [dirty, setDirty] = useState(false);
  const [title, setTitle] = useState(String(values.title ?? values.name ?? ""));
  const [slug, setSlug] = useState(String(values.slug ?? ""));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [seo, setSeo] = useState({ t: String(values.seoTitle ?? ""), d: String(values.seoDescription ?? ""), excerpt: String(values.excerpt ?? "") });
  const errorRef = useRef<HTMLDivElement>(null);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setDirty(false);
  }

  useEffect(() => {
    if (state.ok && state.message) toast(state.message, "success");
    if (state.error) errorRef.current?.focus();
  }, [state, toast]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const groups = {
    content: fields.filter((f) => !f.group || f.group === "content"),
    settings: fields.filter((f) => f.group === "settings"),
    seo: fields.filter((f) => f.group === "seo"),
  };

  const render = (f: FieldDef) => (
    <FieldControl
      key={f.name}
      f={f}
      value={values[f.name]}
      error={state.fields?.[f.name]}
      options={f.optionsFrom ? options[f.optionsFrom] : f.options}
      imageChoices={imageChoices}
      onTitle={(v) => {
        setTitle(v);
        if (!slugTouched) setSlug(slugify(v));
      }}
      slug={slug}
      onSlug={(v) => {
        setSlugTouched(true);
        setSlug(v);
      }}
      onSeo={(k, v) => setSeo((s) => ({ ...s, [k]: v }))}
    />
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
      onChange={() => setDirty(true)} className="grid gap-8 xl:grid-cols-[1fr_22rem]" noValidate>
      <div className="space-y-8">
        {state.error && (
          <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-field border border-danger/30 bg-danger/5 px-5 py-4 text-sm font-medium text-danger outline-none">
            {state.error}
            {state.fields && (
              <ul className="mt-2 list-disc pl-5 font-normal">
                {Object.entries(state.fields).map(([k, v]) => (
                  <li key={k}>
                    {fields.find((f) => f.name === k)?.label ?? k}: {v}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <section className="space-y-6 rounded-card border border-line bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-navy">Content</h2>
          {groups.content.map(render)}
        </section>
        {groups.seo.length > 0 && (
          <section className="space-y-6 rounded-card border border-line bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-navy">Search appearance</h2>
            <div className="rounded-field border border-line bg-ivory/50 p-5" aria-label="Search result preview">
              <p className="text-xs text-muted-strong">Preview</p>
              <p className="mt-2 truncate text-[1.125rem] text-[#1a0dab]">{(seo.t || title || "Page title") + (seo.t ? "" : " | Sourcing Eleven")}</p>
              <p className="truncate text-sm text-success">sourcing11 › {slug || "page"}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-strong">{seo.d || seo.excerpt || "Meta description will appear here."}</p>
            </div>
            {groups.seo.map(render)}
          </section>
        )}
      </div>

      <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
        <section className="space-y-5 rounded-card border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Publishing</h2>
          {groups.settings.map(render)}
          <Button type="submit" variant="dark" className="w-full" loading={pending}>
            {pending ? "Saving…" : isNew ? `Create ${singular}` : "Save changes"}
          </Button>
          {dirty && !pending && <p className="text-center text-sm text-gold-ink">You have unsaved changes.</p>}
        </section>
        {deleteAction && (
          <section className="rounded-card border border-danger/20 bg-white p-6">
            <h2 className="text-sm font-semibold text-danger">Delete {singular}</h2>
            <p className="mt-2 text-sm text-muted-strong">This removes it from the website permanently.</p>
            <div className="mt-4">
              <ConfirmButton action={deleteAction} label={`Delete ${singular}`} />
            </div>
          </section>
        )}
      </aside>
    </form>
  );
}

function FieldControl({
  f,
  value,
  error,
  options = [],
  imageChoices,
  onTitle,
  slug,
  onSlug,
  onSeo,
}: {
  f: FieldDef;
  value: Values[string] | undefined;
  error?: string;
  options?: Option[];
  imageChoices: (Option & { src: string })[];
  onTitle: (v: string) => void;
  slug: string;
  onSlug: (v: string) => void;
  onSeo: (k: "t" | "d" | "excerpt", v: string) => void;
}) {
  const id = useId();
  const [len, setLen] = useState(String(value ?? "").length);
  const [img, setImg] = useState(String(value ?? ""));
  const describedBy = [f.hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const common = { id, name: f.name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy } as const;

  const label = (
    <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-navy">
      <span>
        {f.label}
        {f.required && <span className="ml-1 text-gold-ink">*</span>}
      </span>
      {f.max && (
        <span className={cn("text-xs font-normal", len > f.max ? "text-danger" : "text-muted-strong")}>
          {len}/{f.max}
        </span>
      )}
    </label>
  );
  const foot = (
    <>
      {f.hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-strong">
          {f.hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </>
  );

  const onText = (v: string) => {
    setLen(v.length);
    if (f.name === "title" || f.name === "name") onTitle(v);
    if (f.name === "seoTitle") onSeo("t", v);
    if (f.name === "seoDescription") onSeo("d", v);
    if (f.name === "excerpt") onSeo("excerpt", v);
  };

  switch (f.type) {
    case "checkbox":
      return (
        <div className="flex items-center gap-3">
          <input {...common} type="checkbox" defaultChecked={Boolean(value)} className="h-5 w-5 accent-[var(--color-navy)]" />
          <label htmlFor={id} className="text-sm font-semibold text-navy">
            {f.label}
          </label>
        </div>
      );
    case "textarea":
    case "markdown":
    case "list":
    case "pairs":
      return (
        <div>
          {label}
          <textarea
            {...common}
            defaultValue={String(value ?? "")}
            rows={f.type === "markdown" ? 18 : f.type === "textarea" ? 3 : 6}
            onChange={(e) => onText(e.target.value)}
            className={cn(input, f.type !== "textarea" && "font-mono text-[0.8125rem] leading-relaxed", error && "border-danger")}
          />
          {foot}
        </div>
      );
    case "slug":
      return (
        <div>
          {label}
          <div className="flex items-stretch overflow-hidden rounded-field border border-line focus-within:border-navy">
            <span className="flex items-center bg-ivory px-3 text-sm text-muted-strong">/…/</span>
            <input {...common} value={slug} onChange={(e) => onSlug(e.target.value.toLowerCase())} className="min-w-0 flex-1 px-3 py-3 text-[0.9375rem] focus:outline-none" />
          </div>
          {foot}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select {...common} defaultValue={String(value ?? "")} className={cn(input, error && "border-danger")}>
            <option value="">Choose…</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {foot}
        </div>
      );
    case "multi":
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-navy">{f.label}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o) => (
              <label key={o.value} className="flex items-center gap-3 rounded-field border border-line px-3 py-2.5 text-sm">
                <input type="checkbox" name={f.name} value={o.value} defaultChecked={(value as string[] | undefined)?.includes(o.value)} className="h-4 w-4 accent-[var(--color-navy)]" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      );
    case "image": {
      const current = imageChoices.find((c) => c.value === img);
      return (
        <div>
          {label}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="relative h-24 w-32 flex-none overflow-hidden rounded-media bg-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {current && <img src={current.src} alt="" className="h-full w-full object-cover" />}
            </span>
            <div className="flex-1">
              <select {...common} value={img} onChange={(e) => setImg(e.target.value)} className={cn(input, error && "border-danger")}>
                <option value="">Choose an image…</option>
                {imageChoices.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted-strong">Upload new images in the Media library, then choose them here.</p>
            </div>
          </div>
          {foot}
        </div>
      );
    }
    default:
      return (
        <div>
          {label}
          <input {...common} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} defaultValue={String(value ?? "")} onChange={(e) => onText(e.target.value)} className={cn(input, error && "border-danger")} />
          {foot}
        </div>
      );
  }
}
