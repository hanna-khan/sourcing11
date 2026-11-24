import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Magnetic } from "@/components/animations/Magnetic";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "gold" | "light" | "dark" | "outline-light" | "outline-dark";

const base =
  "group relative inline-flex min-h-12 items-center whitespace-nowrap justify-center gap-3 overflow-hidden rounded-pill px-7 py-3 text-[0.9375rem] font-semibold tracking-[0.01em] transition-[background-color,color,border-color,box-shadow] duration-500 ease-[var(--ease-silk)] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  gold: "bg-gold text-navy-deep hover:bg-gold-soft hover:shadow-[0_18px_40px_-18px_rgb(199_163_101/0.8)]",
  light: "bg-ivory text-navy hover:bg-white",
  dark: "bg-navy text-ivory hover:bg-navy-soft",
  "outline-light": "border border-gold-soft/45 text-ivory hover:border-gold hover:bg-white/[0.04]",
  "outline-dark": "border border-navy/25 text-navy hover:border-navy",
};

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" aria-hidden="true" className={cn("h-3 w-6 flex-none", className)} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M0 6h22M17 1l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {arrow && <ArrowIcon className="relative transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-1" />}
    </>
  );
}

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
};

export function LinkButton({ variant = "gold", arrow = true, magnetic = true, className, children, ...props }: LinkButtonProps) {
  const el = (
    <Link {...props} className={cn(base, variants[variant], className)}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; arrow?: boolean; loading?: boolean };

export function Button({ variant = "gold", arrow = false, loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button {...props} disabled={disabled || loading} aria-busy={loading || undefined} className={cn(base, variants[variant], className)}>
      {loading && <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />}
      <Inner arrow={arrow && !loading}>{children}</Inner>
    </button>
  );
}

/** Quiet text link with animated arrow, for "Discover more" style actions. */
export function TextLink({ href, children, className, tone = "dark" }: { href: string; children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 py-2 text-[0.9375rem] font-semibold",
        tone === "dark" ? "text-navy" : "text-ivory",
        className,
      )}
    >
      <span className="link-arc">{children}</span>
      <ArrowIcon className={cn("transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-1.5", tone === "dark" ? "text-gold-ink" : "text-gold")} />
    </Link>
  );
}
