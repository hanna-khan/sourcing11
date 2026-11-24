"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/quotes", label: "Quote requests" },
  { section: "Content" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/categories", label: "Product categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/articles", label: "Blog articles" },
  { href: "/admin/media", label: "Media library" },
  { section: "Website" },
  { href: "/admin/seo", label: "SEO metadata" },
  { href: "/admin/settings", label: "Website settings", adminOnly: true },
] as const;

export function AdminShell({ user, children, counts }: { user: { name: string; email: string; role: string }; children: ReactNode; counts: { enquiries: number; quotes: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const badge = (href: string) => (href === "/admin/enquiries" ? counts.enquiries : href === "/admin/quotes" ? counts.quotes : 0);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#admin-main" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-pill bg-gold px-5 py-3 text-sm font-semibold text-navy-deep focus:translate-y-0">
        Skip to content
      </a>
      <header className="on-dark sticky top-0 z-40 flex h-16 items-center justify-between bg-navy-deep px-5 text-ivory lg:hidden">
        <Link href="/admin" className="w-36" aria-label="SOURCING11 admin dashboard">
          <Logo tone="light" className="w-full" decorative />
        </Link>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="admin-nav" className="min-h-11 rounded-pill border border-ivory/25 px-4 text-sm">
          {open ? "Close menu" : "Menu"}
        </button>
      </header>

      <aside id="admin-nav" className={cn("on-dark bg-navy-deep text-ivory lg:sticky lg:top-0 lg:block lg:h-screen", open ? "block" : "hidden")}>
        <div className="flex h-full flex-col overflow-y-auto px-5 py-8">
          <Link href="/admin" className="hidden w-44 px-3 lg:block" aria-label="SOURCING11 admin dashboard">
            <Logo tone="light" className="w-full" decorative />
          </Link>
          <nav aria-label="Admin" className="mt-2 lg:mt-10">
            <ul className="space-y-0.5">
              {nav.map((item, i) =>
                "section" in item ? (
                  <li key={i} className="px-3 pb-2 pt-6 text-xs font-semibold text-gold-soft/80">
                    {item.section}
                  </li>
                ) : "adminOnly" in item && item.adminOnly && user.role !== "admin" ? null : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={("exact" in item ? pathname === item.href : pathname.startsWith(item.href)) ? "page" : undefined}
                      className="flex min-h-10 items-center justify-between rounded-field px-3 text-[0.9375rem] text-ivory/80 transition-colors hover:bg-white/5 hover:text-ivory aria-[current=page]:bg-white/10 aria-[current=page]:text-ivory"
                    >
                      {item.label}
                      {badge(item.href) > 0 && (
                        <span className="rounded-pill bg-gold px-2 py-0.5 text-xs font-bold text-navy-deep">
                          {badge(item.href)}
                          <span className="sr-only"> new</span>
                        </span>
                      )}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="mt-auto border-t border-line-dark px-3 pt-6 text-sm">
            <p className="font-semibold text-ivory">{user.name}</p>
            <p className="truncate text-ivory/60">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-gold-soft">{user.role}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/" target="_blank" className="text-ivory/80 underline underline-offset-4 hover:text-ivory">
                View website
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-ivory/80 underline underline-offset-4 hover:text-ivory">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <main id="admin-main" tabIndex={-1} className="min-w-0 px-5 py-8 outline-none sm:px-8 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  );
}

export function AdminHeader({ title, intro, actions }: { title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-serif-display text-[2.5rem] leading-tight text-navy">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-muted-strong">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
