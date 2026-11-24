"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Logo } from "./Logo";
import { ArrowIcon, LinkButton } from "@/components/ui/Button";
import { isGroup, mainNav, type NavGroup } from "@/data/navigation";
import { resolveImage } from "@/data/images";
import { cn } from "@/lib/utils/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const pinned = useRef(false); // menus open or keyboard focus inside: never hide

  /**
   * Hide on scroll down, reveal on scroll up. Runs once per animation frame,
   * accumulates movement in one direction and only flips state after a small
   * travel threshold, so trackpad jitter and momentum tails can't flicker it.
   */
  useEffect(() => {
    const TOP_ZONE = 12; // always visible this close to the top
    const HIDE_AFTER = 96; // don't hide until the header has scrolled past itself
    const THRESHOLD = 8; // px of continuous travel needed to change state
    let lastY = Math.max(0, window.scrollY);
    let travel = 0;
    let isHidden = false;
    let isScrolled = false;
    let raf = 0;

    const apply = (h: boolean) => {
      if (h === isHidden) return;
      isHidden = h;
      setHidden(h);
      document.documentElement.dataset.header = h ? "hidden" : "shown";
    };

    const update = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      lastY = y;
      const s = y > 24;
      if (s !== isScrolled) {
        isScrolled = s;
        setScrolled(s);
      }
      if (y <= TOP_ZONE || pinned.current) {
        travel = 0;
        return apply(false);
      }
      if (dy === 0) return;
      // reset accumulated travel when direction changes
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      if (travel > THRESHOLD && y > HIDE_AFTER) apply(true);
      else if (travel < -THRESHOLD) apply(false);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.dataset.header = "shown";
    onScroll(); // read the initial position on the first frame
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Open menus always keep the header in view.
  const menusOpen = openMenu !== null || mobileOpen;
  const isHidden = hidden && !menusOpen;
  useEffect(() => {
    pinned.current = menusOpen;
    document.documentElement.dataset.header = isHidden ? "hidden" : "shown";
  }, [menusOpen, isHidden]);

  // Close menus on navigation.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || openMenu !== null;
  const open = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu((cur) => {
      if (cur !== label) hoverOpenedAt.current = Date.now();
      return label;
    });
  }, []);
  // A click right after hover-open (the pointer arriving) should not close the menu again.
  const toggle = useCallback((label: string) => {
    setOpenMenu((cur) => (cur === label && Date.now() - hoverOpenedAt.current > 600 ? null : label));
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header
        ref={headerRef}
        data-state={isHidden ? "hidden" : "shown"}
        className={cn(
          "fixed inset-x-0 top-0 z-50 will-change-transform [transition-property:transform,background-color,box-shadow,color]",
          // hiding is quick and starts immediately; revealing eases in smoothly
          isHidden ? "-translate-y-full duration-[280ms] ease-[cubic-bezier(0.4,0,1,1)]" : "translate-y-0 duration-[450ms] ease-[var(--ease-silk)]",
          solid ? "on-light bg-white/95 text-navy shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "on-dark bg-transparent text-ivory",
        )}
        onMouseLeave={scheduleClose}
        onFocusCapture={(e) => {
          // keyboard users must always be able to see what they're focusing
          if (!(e.target as Element).matches?.(":focus-visible")) return;
          pinned.current = true;
          setHidden(false);
          document.documentElement.dataset.header = "shown";
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pinned.current = openMenu !== null || mobileOpen;
        }}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className={cn(
              "relative z-10 -ml-1 flex min-h-11 w-[10.5rem] items-center p-1 transition-opacity duration-700 focus-visible:opacity-100 sm:w-[12rem]",
              pathname === "/" && !solid && "opacity-0",
            )}
            aria-label="SOURCING11, Sourcing Eleven home"
          >
            <span className="relative block w-full">
              <Logo tone="light" decorative eager className={cn("transition-opacity duration-500", solid && "opacity-0")} />
              <Logo tone="dark" decorative eager className={cn("absolute inset-0 transition-opacity duration-500", !solid && "opacity-0")} />
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {mainNav.map((item) =>
                isGroup(item) ? (
                  <li key={item.label} onMouseEnter={() => open(item.label)}>
                    <MegaTrigger
                      item={item}
                      expanded={openMenu === item.label}
                      active={isActive(item.href)}
                      onToggle={() => toggle(item.label)}
                    />
                  </li>
                ) : (
                  <li key={item.href} onMouseEnter={scheduleClose}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="link-arc mx-3 inline-block py-2 text-[0.9375rem] font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LinkButton href="/request-a-quote" variant={solid ? "dark" : "gold"} arrow={false} className="min-h-11 px-5 text-sm">
                Request a Quote
              </LinkButton>
            </div>
            <button
              type="button"
              className="relative z-10 -mr-2 flex h-12 w-12 items-center justify-center lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-4 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mainNav.filter(isGroup).map((item) =>
            openMenu === item.label ? <MegaPanel key={item.label} item={item} onEnter={() => open(item.label)} onLeave={scheduleClose} /> : null,
          )}
        </AnimatePresence>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} isActive={isActive} />
    </>
  );
}

function MegaTrigger({ item, expanded, active, onToggle }: { item: NavGroup; expanded: boolean; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center">
      <Link href={item.href} aria-current={active ? "page" : undefined} className="link-arc ml-3 inline-block py-2 text-[0.9375rem] font-medium">
        {item.label}
      </Link>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`mega-${item.label}`}
        className="mr-1 flex h-9 w-7 items-center justify-center"
      >
        <span className="sr-only">{expanded ? `Close ${item.label} menu` : `Open ${item.label} menu`}</span>
        <svg viewBox="0 0 10 6" aria-hidden="true" className={cn("h-1.5 w-2.5 transition-transform duration-300", expanded && "rotate-180")}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
    </div>
  );
}

function MegaPanel({ item, onEnter, onLeave }: { item: NavGroup; onEnter: () => void; onLeave: () => void }) {
  const reduce = useReducedMotion();
  const feature = item.feature ? resolveImage(item.feature.image) : null;
  return (
    <m.div
      id={`mega-${item.label}`}
      className="absolute inset-x-0 top-full hidden border-t border-line bg-white text-ink shadow-panel lg:block"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6, transition: { duration: 0.18 } }}
      transition={{ duration: 0.45, ease }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="container-x grid grid-cols-12 gap-10 py-12">
        <div className="col-span-3">
          <p className="font-serif-display text-[2.25rem] leading-none text-navy">{item.label}</p>
          <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-muted-strong">{item.intro}</p>
          <Link href={item.href} className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-navy">
            <span className="link-arc">All {item.label.toLowerCase()}</span>
            <ArrowIcon className="text-gold-ink transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className={cn("col-span-6 grid gap-x-10", item.links.length > 3 ? "grid-cols-2" : "grid-cols-1")}>
          {item.links.map((l, i) => (
            <m.li
              key={l.href}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.04 * i }}
            >
              <Link href={l.href} className="group flex items-start justify-between gap-4 border-b border-line py-4">
                <span>
                  <span className="block font-semibold text-navy">{l.label}</span>
                  {l.description && <span className="mt-1 block text-sm text-muted-strong">{l.description}</span>}
                </span>
                <ArrowIcon className="mt-2 text-gold-ink opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100" />
              </Link>
            </m.li>
          ))}
        </ul>
        {item.feature && feature && (
          <Link href={item.feature.href} className="group relative col-span-3 block aspect-[4/5] overflow-hidden rounded-media bg-navy">
            <Image src={feature.src} alt="" fill sizes="22vw" className="object-cover opacity-80 transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
            <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-ivory">
              <span className="font-serif-display text-2xl leading-tight">{item.feature.title}</span>
              <ArrowIcon className="mb-2 text-gold transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        )}
      </div>
    </m.div>
  );
}

function MobileNav({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (href: string) => boolean }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const baseId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).filter((el) => el.offsetParent !== null);
    window.setTimeout(() => focusables()[0]?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy-deep text-ivory lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="container-x flex h-[var(--header-h)] flex-none items-center justify-between">
            <Link href="/" onClick={onClose} className="flex min-h-11 w-[10.5rem] items-center p-1" aria-label="SOURCING11, Sourcing Eleven home">
              <Logo tone="light" className="w-full" decorative />
            </Link>
            <button type="button" onClick={onClose} className="-mr-2 flex h-12 w-12 items-center justify-center">
              <span className="sr-only">Close menu</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 3l14 14M17 3L3 17" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="container-x flex-1 pb-10 pt-6">
            <ul>
              {mainNav.map((item, i) => (
                <m.li
                  key={item.label}
                  className="border-b border-line-dark"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.05 }}
                >
                  {isGroup(item) ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Link href={item.href} onClick={onClose} aria-current={isActive(item.href) ? "page" : undefined} className="font-serif-display block flex-1 py-4 text-[2rem] leading-tight">
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          className="flex h-12 w-12 items-center justify-center"
                          aria-expanded={expanded === item.label}
                          aria-controls={`${baseId}-${item.label}`}
                          onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                        >
                          <span className="sr-only">{expanded === item.label ? `Hide ${item.label} links` : `Show ${item.label} links`}</span>
                          <span aria-hidden="true" className="relative block h-4 w-4">
                            <span className="absolute left-0 top-1/2 h-px w-4 bg-gold" />
                            <span className={cn("absolute left-1/2 top-0 h-4 w-px bg-gold transition-transform duration-300", expanded === item.label && "scale-y-0")} />
                          </span>
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {expanded === item.label && (
                          <m.ul
                            id={`${baseId}-${item.label}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease }}
                            className="overflow-hidden"
                          >
                            {item.links.map((l) => (
                              <li key={l.href}>
                                <Link href={l.href} onClick={onClose} className="flex min-h-12 items-center py-2 pl-1 text-[1.0625rem] text-ivory/85">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                            <li className="pb-4" />
                          </m.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link href={item.href} onClick={onClose} aria-current={isActive(item.href) ? "page" : undefined} className="font-serif-display block py-4 text-[2rem] leading-tight">
                      {item.label}
                    </Link>
                  )}
                </m.li>
              ))}
            </ul>
            <m.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10">
              <LinkButton href="/request-a-quote" onClick={onClose} variant="gold" magnetic={false} className="w-full">
                Request a Quote
              </LinkButton>
            </m.div>
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
