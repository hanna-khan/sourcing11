import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroStage } from "./HeroStage";
import { Fabric3DLayer } from "./Fabric3DLayer";
import { resolveImage } from "@/data/images";
import type { palettes } from "@/lib/fabric-palettes";
import { cn } from "@/lib/utils/cn";

type Item = { title: string; href: string; image: string };

export type HeroVisual =
  | { type: "arch"; image: string; alt?: string; secondary?: string; badge?: { number: string; label: string }; fabric?: keyof typeof palettes }
  | { type: "bridge"; images: [string, string] }
  | { type: "fan"; items: Item[] }
  | { type: "triptych"; items: Item[] }
  | { type: "mosaic"; images: string[] }
  | { type: "process"; stages: { number: string; title: string }[] }
  | { type: "threads"; image: string }
  | { type: "stack"; items: Item[] }
  | { type: "signal"; markets: string[] };

/** Visuals that span the full hero width under the text rather than sitting beside it. */
export const wideVisuals: HeroVisual["type"][] = ["process"];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function HeroVisualView({ visual }: { visual: HeroVisual }) {
  switch (visual.type) {
    case "arch":
      return <ArchVisual {...visual} />;
    case "bridge":
      return <BridgeVisual images={visual.images} />;
    case "fan":
      return <FanVisual items={visual.items} />;
    case "triptych":
      return <TriptychVisual items={visual.items} />;
    case "mosaic":
      return <MosaicVisual images={visual.images} />;
    case "process":
      return <ProcessVisual stages={visual.stages} />;
    case "threads":
      return <ThreadsVisual image={visual.image} />;
    case "stack":
      return <StackVisual items={visual.items} />;
    case "signal":
      return <SignalVisual markets={visual.markets} />;
  }
}

/* ---------- Arch: main arched image, floating swatch, stage badge, optional live 3D fabric ---------- */
function ArchVisual({ image, alt, secondary, badge, fabric }: Extract<HeroVisual, { type: "arch" }>) {
  const img = resolveImage(image);
  const sec = secondary ? resolveImage(secondary) : null;
  return (
    <HeroStage className="mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-[4/5]">
        <div data-depth="0.15" className="absolute -inset-4 sm:-inset-6">
          <svg viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true" className="h-full w-full text-gold">
            <path d="M2 498 V200 C2 90 90 2 200 2 C310 2 398 90 398 200 V498" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} className="hero-draw" style={v({ "--d": "0.4s" })} />
          </svg>
        </div>
        <div data-depth="0.35" className="absolute inset-0">
          <div className="relative h-full overflow-hidden rounded-t-[999px] bg-navy-deep">
            <Image src={img.src} alt={alt ?? img.alt} fill priority quality={60} sizes="(min-width: 1024px) 38vw, 90vw" className="enter-media object-cover" />
            {fabric && <Fabric3DLayer palette={fabric} />}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
          </div>
        </div>
        {sec && (
          <div data-depth="0.9" className="absolute -bottom-6 -left-6 w-[40%] sm:-left-10">
            <div className="hero-in aspect-square overflow-hidden rounded-full shadow-lift ring-[6px] ring-navy" style={v({ "--i": 3 })}>
              <Image src={sec.src} alt="" width={400} height={400} sizes="200px" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
        {badge && (
          <div data-depth="0.7" className="absolute -right-3 top-[14%] w-28 sm:-right-8 sm:w-32">
            <div className="hero-in relative aspect-square rounded-full bg-navy-deep/85 shadow-lift backdrop-blur" style={v({ "--i": 4 })}>
              <svg viewBox="0 0 120 120" aria-hidden="true" className="hero-spin absolute inset-0 h-full w-full text-gold-soft">
                <defs>
                  <path id={`badge-${badge.number}`} d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
                </defs>
                <text fontSize="9.5" letterSpacing="2.4" fill="currentColor">
                  <textPath href={`#badge-${badge.number}`}>Stage {badge.number} of 06 — {badge.label} — Concept to shipment —</textPath>
                </text>
              </svg>
              <span className="font-serif-display absolute inset-0 flex items-center justify-center text-[2.25rem] text-ivory">{badge.number}</span>
            </div>
            <span className="sr-only">
              Stage {badge.number} of 6 in our sourcing journey: {badge.label}
            </span>
          </div>
        )}
      </div>
    </HeroStage>
  );
}

/* ---------- Bridge: two arched images joined by a drawn gold arc ---------- */
function BridgeVisual({ images: [a, b] }: { images: [string, string] }) {
  const A = resolveImage(a);
  const B = resolveImage(b);
  return (
    <HeroStage className="mx-auto w-full max-w-lg lg:max-w-none">
      <div className="relative aspect-[1/1]">
        <svg viewBox="0 0 500 500" aria-hidden="true" className="absolute inset-0 z-10 h-full w-full text-gold">
          <path d="M95 170 C 150 10, 350 10, 405 120" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" pathLength={1} className="hero-draw" style={v({ "--d": "0.7s" })} />
          <circle cx="250" cy="52" r="6" fill="currentColor" className="hero-pop" style={v({ "--d": "1.6s" })} />
          <circle cx="95" cy="170" r="4" fill="currentColor" className="hero-pop" style={v({ "--d": "0.7s" })} />
          <circle cx="405" cy="120" r="4" fill="currentColor" className="hero-pop" style={v({ "--d": "2.3s" })} />
        </svg>
        <div data-depth="0.4" className="absolute bottom-0 left-0 w-[52%]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-navy-deep">
            <Image src={A.src} alt={A.alt} fill priority quality={60} sizes="(min-width: 1024px) 22vw, 50vw" className="enter-media object-cover" />
          </div>
        </div>
        <div data-depth="0.8" className="absolute right-0 top-[18%] w-[42%]">
          <div className="hero-in relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-navy-deep shadow-lift" style={v({ "--i": 3 })}>
            <Image src={B.src} alt={B.alt} fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
          </div>
        </div>
        <p className="hero-in absolute bottom-[6%] right-[4%] max-w-[40%] text-right text-sm text-ivory/70" style={v({ "--i": 6 })}>
          Your brief on one side, the right manufacturing partner on the other.
        </p>
      </div>
    </HeroStage>
  );
}

/* ---------- Fan: one tile per service, along an arc ---------- */
const fanPos = [
  { l: 9, t: 62, r: -14 },
  { l: 25.5, t: 47, r: -8 },
  { l: 42, t: 39, r: -3 },
  { l: 58, t: 39, r: 3 },
  { l: 74.5, t: 47, r: 8 },
  { l: 91, t: 62, r: 14 },
];

function FanVisual({ items }: { items: Item[] }) {
  return (
    <HeroStage className="mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative aspect-[5/4]">
        <svg viewBox="0 0 500 400" aria-hidden="true" className="absolute inset-0 h-full w-full text-gold">
          <path d="M10 300 C 110 60, 390 60, 490 300" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" pathLength={1} className="hero-draw" style={v({ "--d": "0.2s" })} />
        </svg>
        <p aria-hidden="true" className="hero-in absolute inset-x-0 bottom-[2%] text-center text-sm text-ivory/60" style={v({ "--i": 6 })}>
          Six services. Choose one to explore.
        </p>
        <ul className="absolute inset-0">
          {items.slice(0, 6).map((it, i) => {
            const p = fanPos[i];
            const img = resolveImage(it.image);
            return (
              <li key={it.href} className="absolute w-[16%]" style={{ left: `${p.l}%`, top: `${p.t}%`, transform: "translate(-50%, -50%)" }}>
                <div data-depth={String(0.3 + (i % 3) * 0.2)}>
                  <Link
                    href={it.href}
                    className="hero-fan group relative block aspect-[3/4] rounded-t-[999px] bg-navy-deep shadow-lift ring-1 ring-gold/25 transition-[box-shadow] duration-500 hover:ring-gold focus-visible:ring-gold"
                    style={v({ "--i": i, "--r": `${p.r}deg` })}
                  >
                    <span className="relative block h-full w-full overflow-hidden rounded-t-[999px]">
                      <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 8vw, 16vw" className="object-cover transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-110" />
                      <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.75rem)] z-10 -translate-x-1/2 whitespace-nowrap rounded-pill bg-ivory px-3 py-1.5 text-xs font-semibold text-navy opacity-0 shadow-lift transition-[opacity,transform] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {it.title}
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </HeroStage>
  );
}

/* ---------- Triptych: three arched category columns ---------- */
function TriptychVisual({ items }: { items: Item[] }) {
  return (
    <HeroStage className="w-full">
      <ul className="grid grid-cols-3 items-end gap-3 sm:gap-5">
        {items.slice(0, 3).map((it, i) => {
          const img = resolveImage(it.image);
          return (
            <li key={it.href} className={cn(i === 1 && "-translate-y-[12%]")}>
              <div data-depth={String(0.3 + i * 0.25)}>
                <Link href={it.href} className="hero-in group block" style={v({ "--i": i + 1 })}>
                  <span className="relative block aspect-[3/5] overflow-hidden rounded-t-[999px] bg-navy-deep ring-1 ring-gold/25 transition-[box-shadow] duration-500 group-hover:ring-gold group-focus-visible:ring-gold">
                    <Image src={img.src} alt="" fill priority={i === 1} sizes="(min-width: 1024px) 13vw, 30vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-110" />
                  </span>
                  <span className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-semibold text-ivory sm:text-sm">
                    <span className="link-arc">{it.title}</span>
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </HeroStage>
  );
}

/* ---------- Mosaic: swatch grid with arcs and circles ---------- */
function MosaicVisual({ images }: { images: string[] }) {
  const shapes = ["rounded-t-[999px]", "rounded-full", "rounded-media", "rounded-media", "rounded-t-[999px]", "rounded-full", "rounded-full", "rounded-media", "rounded-t-[999px]"];
  return (
    <HeroStage className="mx-auto w-full max-w-md lg:max-w-none">
      <ul className="grid grid-cols-3 gap-3 sm:gap-4" aria-hidden="true">
        {images.slice(0, 9).map((k, i) => {
          const img = resolveImage(k);
          return (
            <li key={k + i} className={cn(i % 2 === 1 && "translate-y-6")}>
              <div data-depth={String(0.2 + ((i * 7) % 5) * 0.15)}>
                <div className={cn("hero-in relative aspect-square overflow-hidden bg-navy-deep ring-1 ring-gold/20", shapes[i])} style={v({ "--i": (i % 3) + Math.floor(i / 3) })}>
                  <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 12vw, 30vw" className="object-cover" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </HeroStage>
  );
}

/* ---------- Process: the six stages drawn along the bridge arc ---------- */
const procPts = [
  [88, 219],
  [248, 106],
  [421, 51],
  [579, 51],
  [752, 106],
  [912, 219],
];

function ProcessVisual({ stages }: { stages: { number: string; title: string }[] }) {
  return (
    <HeroStage className="mx-auto w-full max-w-5xl">
      {/* Phones: the arc's labels would be too small, so show a numbered list */}
      <ol className="grid grid-cols-2 gap-x-6 gap-y-4 sm:hidden">
        {stages.slice(0, 6).map((s, i) => (
          <li key={s.number} className="hero-in flex items-center gap-3" style={v({ "--i": i })}>
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-gold text-sm font-semibold text-gold-soft">{s.number}</span>
            <span className="font-serif-display text-[1.375rem] text-ivory">{s.title}</span>
          </li>
        ))}
      </ol>
      <svg viewBox="0 -10 1000 300" className="hidden h-auto w-full overflow-visible sm:block" role="img" aria-label={`Six stages: ${stages.map((s) => s.title).join(", ")}`}>
        <path d="M40 270 C 300 -30, 700 -30, 960 270" fill="none" stroke="var(--color-gold)" strokeWidth="1.4" pathLength={1} className="hero-draw" style={v({ "--d": "0.3s" })} />
        {stages.slice(0, 6).map((s, i) => {
          const [x, y] = procPts[i];
          return (
            <g key={s.number} className="hero-pop" style={v({ "--d": `${0.55 + i * 0.22}s` })}>
              <circle cx={x} cy={y} r="27" fill="var(--color-navy)" stroke="var(--color-gold)" strokeWidth="1.4" />
              <text x={x} y={y + 6} textAnchor="middle" fill="var(--color-gold-soft)" fontSize="17" fontWeight="600" fontFamily="var(--font-manrope)">
                {s.number}
              </text>
              <text x={x} y={y + 58} textAnchor="middle" fill="var(--color-ivory)" fontSize="22" fontFamily="var(--font-cormorant)" fontWeight="500">
                {s.title}
              </text>
            </g>
          );
        })}
      </svg>
    </HeroStage>
  );
}

/* ---------- Threads: flowing fibre lines over an image ---------- */
const threadPaths = [
  "M-20 420 C 80 300, 160 340, 240 220 S 380 80, 460 40",
  "M-20 450 C 100 330, 180 380, 260 250 S 400 120, 470 90",
  "M-20 480 C 120 360, 200 410, 280 290 S 410 170, 480 140",
  "M-20 360 C 60 270, 150 300, 220 190 S 360 40, 440 0",
  "M-20 510 C 140 400, 220 440, 300 330 S 420 220, 490 200",
];

function ThreadsVisual({ image }: { image: string }) {
  const img = resolveImage(image);
  return (
    <HeroStage className="mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-[4/5]">
        <div data-depth="0.3" className="absolute inset-0">
          <div className="relative h-full overflow-hidden rounded-[2rem] rounded-tl-[999px] bg-navy-deep">
            <Image src={img.src} alt={img.alt} fill priority quality={60} sizes="(min-width: 1024px) 38vw, 90vw" className="enter-media object-cover" />
            <span className="absolute inset-0 bg-gradient-to-tr from-navy-deep/60 via-transparent to-transparent" />
          </div>
        </div>
        <div data-depth="0.85" className="absolute -inset-6">
          <svg viewBox="0 0 460 520" preserveAspectRatio="none" aria-hidden="true" className="h-full w-full">
            {threadPaths.map((d, i) => (
              <path key={d} d={d} fill="none" stroke={i % 2 ? "var(--color-ivory)" : "var(--color-gold)"} strokeOpacity={i % 2 ? 0.45 : 0.85} strokeWidth="1.1" pathLength={1} className="hero-draw" style={v({ "--d": `${0.4 + i * 0.18}s` })} />
            ))}
          </svg>
        </div>
      </div>
    </HeroStage>
  );
}

/* ---------- Stack: latest article covers fanned like cards ---------- */
function StackVisual({ items }: { items: Item[] }) {
  const layout = [
    { x: "-36%", r: "-9deg", z: 1 },
    { x: "36%", r: "8deg", z: 2 },
    { x: "0%", r: "-1deg", z: 3 },
  ];
  return (
    <HeroStage className="mx-auto w-full max-w-md lg:max-w-none">
      <ul className="group/stack relative mx-auto aspect-[1/1] w-[86%]">
        {items.slice(0, 3).map((it, i) => {
          const img = resolveImage(it.image);
          const l = layout[i];
          return (
            <li key={it.href} className="absolute inset-x-[22%] top-[8%]" style={{ zIndex: l.z }}>
              <div data-depth={String(0.3 + i * 0.25)}>
                <Link
                  href={it.href}
                  className="hero-fan stack-card group block overflow-hidden rounded-card bg-white shadow-panel ring-1 ring-black/5 transition-transform duration-700 ease-[var(--ease-silk)]"
                  style={v({ "--i": i, "--r": l.r, "--x": l.x })}
                >
                  <span className="relative block aspect-[4/3]">
                    <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 22vw, 60vw" className="object-cover" />
                  </span>
                  <span className="block p-4 text-sm font-semibold leading-snug text-navy">{it.title}</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </HeroStage>
  );
}

/* ---------- Signal: concentric arcs from the sourcing base ---------- */
function SignalVisual({ markets }: { markets: string[] }) {
  const radii = [70, 130, 190, 250];
  return (
    <HeroStage className="mx-auto w-full max-w-lg lg:max-w-none">
      <div className="relative">
        <svg viewBox="0 0 540 370" className="h-auto w-full overflow-visible" role="img" aria-label={`Sourcing base in Pakistan, connected to buyers in ${markets.join(", ")}`}>
          {radii.map((r, i) => (
            <path key={r} d={`M${270 - r} 300 A ${r} ${r} 0 0 1 ${270 + r} 300`} fill="none" stroke="var(--color-gold)" strokeOpacity={0.75 - i * 0.14} strokeWidth="1.2" pathLength={1} className="hero-draw" style={v({ "--d": `${0.3 + i * 0.25}s` })} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="270" cy="300" r="40" fill="none" stroke="var(--color-gold-soft)" strokeWidth="1" className="hero-pulse" style={v({ "--d": `${1.4 + i * 1.2}s` })} />
          ))}
          <circle cx="270" cy="300" r="9" fill="var(--color-gold)" className="hero-pop" style={v({ "--d": "0.3s" })} />
          {markets.slice(0, 4).map((m, i) => {
            const a = Math.PI * (0.84 - i * 0.227);
            const x = 270 + 250 * Math.cos(a);
            const y = 300 - 250 * Math.sin(a);
            return (
              <g key={m} className="hero-pop" style={v({ "--d": `${1.3 + i * 0.2}s` })}>
                <circle cx={x} cy={y} r="5" fill="var(--color-ivory)" />
                <text x={x} y={y - 16} textAnchor="middle" fill="var(--color-ivory)" fillOpacity="0.85" fontSize="19" fontFamily="var(--font-manrope)">
                  {m}
                </text>
              </g>
            );
          })}
          <text x="270" y="364" textAnchor="middle" fill="var(--color-gold-soft)" fontSize="19" fontWeight="600" fontFamily="var(--font-manrope)">
            Pakistan
          </text>
        </svg>
      </div>
    </HeroStage>
  );
}
