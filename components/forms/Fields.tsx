"use client";

import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const control =
  "block w-full rounded-field border bg-white px-4 py-3.5 text-[1rem] text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-300 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/50";

type BaseProps = { label: string; name: string; error?: string; hint?: string; required?: boolean; className?: string; optionalLabel?: boolean };

function FieldShell({ id, label, error, hint, required, optionalLabel, className, children }: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-4 text-[0.9375rem] font-semibold text-navy">
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-gold-ink">
              *
            </span>
          )}
        </span>
        {optionalLabel && !required && <span className="text-sm font-normal text-muted-strong">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted-strong">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm font-medium text-danger">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6.25h1.5v1.5h-1.5v-1.5z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export const TextField = forwardRef<HTMLInputElement, BaseProps & Omit<ComponentProps<"input">, "name">>(function TextField(
  { label, name, error, hint, required, className, optionalLabel = true, ...props },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} name={name} error={error} hint={hint} required={required} className={className} optionalLabel={optionalLabel}>
      <input
        ref={ref}
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, error ? "border-danger" : "border-line")}
        {...props}
      />
    </FieldShell>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, BaseProps & Omit<ComponentProps<"textarea">, "name">>(function TextArea(
  { label, name, error, hint, required, className, optionalLabel = true, rows = 5, ...props },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} name={name} error={error} hint={hint} required={required} className={className} optionalLabel={optionalLabel}>
      <textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "resize-y leading-relaxed", error ? "border-danger" : "border-line")}
        {...props}
      />
    </FieldShell>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, BaseProps & Omit<ComponentProps<"select">, "name"> & { options: { value: string; label: string }[]; placeholder?: string; groups?: { label: string; options: string[] }[] }>(
  function SelectField({ label, name, error, hint, required, className, options, placeholder, groups, optionalLabel = true, ...props }, ref) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} name={name} error={error} hint={hint} required={required} className={className} optionalLabel={optionalLabel}>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            name={name}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, error, hint)}
            className={cn(control, "appearance-none pr-10", error ? "border-danger" : "border-line")}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
            {groups?.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={g.label + o} value={o}>
                    {o}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <svg viewBox="0 0 10 6" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-navy">
            <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </div>
      </FieldShell>
    );
  },
);

export function Checkbox({ name, label, error, defaultChecked, required }: { name: string; label: ReactNode; error?: string; defaultChecked?: boolean; required?: boolean }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 flex-none cursor-pointer appearance-none rounded-[4px] border border-navy/40 bg-white bg-center bg-no-repeat transition-colors checked:border-navy checked:bg-navy checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M3.5%208.5l3%203%206-7%22%20fill=%22none%22%20stroke=%22%23C7A365%22%20stroke-width=%222%22/%3E%3C/svg%3E')] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
        />
        <label htmlFor={id} className="text-[0.9375rem] leading-relaxed text-ink">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 pl-8 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hidden honeypot (bots fill it). The form start time is added to the payload at submit. */
export function SpamFields() {
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
    </>
  );
}
