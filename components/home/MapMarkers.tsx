"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type MapMarker = { id: string; label: string; note: string; x: number; y: number; base?: boolean };

export function MapMarkers({ markers, width, height }: { markers: MapMarker[]; width: number; height: number }) {
  const [active, setActive] = useState<string | null>(null);
  const layer = useRef<HTMLDivElement>(null);

  const activate = (id: string | null) => {
    setActive(id);
    const map = layer.current?.closest("[data-map]");
    if (!map) return;
    if (id) map.setAttribute("data-active", id);
    else map.removeAttribute("data-active");
  };

  return (
    <div ref={layer} className="absolute inset-0">
      {markers.map((m) => {
        const left = (m.x / width) * 100;
        const top = (m.y / height) * 100;
        const isActive = active === m.id;
        const tooltipBelow = top < 30;
        return (
          <div key={m.id} className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
            <button
              type="button"
              aria-describedby={`marker-${m.id}`}
              aria-pressed={isActive}
              onPointerEnter={() => activate(m.id)}
              onPointerLeave={() => activate(null)}
              onFocus={() => activate(m.id)}
              onBlur={() => activate(null)}
              onClick={() => activate(isActive ? null : m.id)}
              className="group absolute -left-5 -top-5 hidden h-10 w-10 items-center justify-center rounded-full md:flex"
            >
              <span className="sr-only">{m.label}</span>
              <span aria-hidden="true" className={cn("absolute inset-2 rounded-full border border-gold/60 motion-safe:animate-ping", !m.base && "[animation-duration:2.6s]", m.base && "[animation-duration:1.8s]")} />
              <span aria-hidden="true" className={cn("relative block rounded-full ring-4 ring-navy-deep transition-transform duration-300 group-hover:scale-125", m.base ? "h-3.5 w-3.5 bg-gold" : "h-2.5 w-2.5 bg-ivory", isActive && "scale-125")} />
            </button>
            {/* Small screens: markers are too close to tap separately, so they are visual only
                and the markets are listed as text below the map. */}
            <span aria-hidden="true" className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-navy-deep md:hidden", m.base ? "h-2.5 w-2.5 bg-gold" : "h-2 w-2 bg-ivory")} />
            <div
              id={`marker-${m.id}`}
              role="tooltip"
              className={cn(
                "pointer-events-none absolute left-1/2 z-10 w-56 -translate-x-1/2 rounded-card border border-gold/30 bg-navy/95 p-4 text-left shadow-panel backdrop-blur transition-all duration-300",
                tooltipBelow ? "top-6" : "bottom-6",
                isActive ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0",
              )}
            >
              <p className="text-sm font-semibold text-gold-soft">{m.label}</p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-ivory/80">{m.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
