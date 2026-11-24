import { worldMap } from "@/data/world-map";
import { MapMarkers, type MapMarker } from "./MapMarkers";
import { SectionHeading } from "@/components/sections/SectionHeading";

type MarketId = keyof typeof worldMap.markets;

const notes: Record<string, string> = {
  pakistan: "Our sourcing base, where we work with independent manufacturing partners.",
  uk: "Buyers in the United Kingdom.",
  europe: "Buyers across European markets.",
  us: "Buyers in the United States.",
  canada: "Buyers in Canada.",
  australia: "Buyers in Australia.",
  newzealand: "Buyers in New Zealand.",
  gulf: "Buyers in the Gulf region.",
};

function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mx = (from.x + to.x) / 2;
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const my = Math.min(from.y, to.y) - dist * 0.32;
  return `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`;
}

export function WorldMap({ markets }: { markets: string[] }) {
  const base = worldMap.markets.pakistan;
  const shown = markets.filter((m): m is MarketId => m in worldMap.markets && m !== "pakistan");
  const countryToMarket = new Map<string, string>();
  for (const id of ["pakistan", ...shown] as MarketId[]) for (const c of worldMap.markets[id].countries) countryToMarket.set(c, id);

  const markers: MapMarker[] = [
    { id: "pakistan", label: "Pakistan", note: notes.pakistan, x: base.x, y: base.y, base: true },
    ...shown.map((id) => ({ id, label: worldMap.markets[id].label, note: notes[id] ?? "", x: worldMap.markets[id].x, y: worldMap.markets[id].y })),
  ];

  const activeCss = markers
    .map((m) => `[data-map][data-active="${m.id}"] [data-market="${m.id}"]{fill:var(--color-gold);fill-opacity:.55}[data-map][data-active="${m.id}"] [data-arc="${m.id}"]{stroke-opacity:1;stroke-width:2}`)
    .join("");

  return (
    <section className="on-dark section-y relative overflow-hidden bg-navy-deep text-ivory" aria-labelledby="map-title">
      <style>{activeCss}</style>
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeading
            id="map-title"
            className="lg:col-span-7"
            kicker="Global sourcing connections"
            title="Sourcing from Pakistan for buyers around the world."
          />
          <p className="text-[1.0625rem] leading-relaxed text-ivory/75 lg:col-span-4 lg:col-start-9 lg:self-end" data-reveal>
            We coordinate production in Pakistan for buyers in the markets highlighted here. Select a marker to see the connection.
          </p>
        </div>

        <div data-map className="relative mt-14 lg:mt-20">
          <svg viewBox={`0 0 ${worldMap.width} ${worldMap.height}`} className="block h-auto w-full" role="img" aria-labelledby="map-desc">
            <desc id="map-desc">
              World map highlighting Pakistan as the sourcing base, connected to {markers.slice(1).map((m) => m.label).join(", ")}.
            </desc>
            <defs>
              <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C7A365" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C7A365" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d={worldMap.sphere} fill="rgb(255 255 255 / 0.015)" stroke="rgb(216 188 140 / 0.12)" strokeWidth="0.6" />
            <g>
              {worldMap.countries.map((c) => {
                const m = countryToMarket.get(c.name);
                return (
                  <path
                    key={c.id + c.name}
                    d={c.d}
                    data-market={m}
                    fill={m === "pakistan" ? "#C7A365" : m ? "#C7A365" : "#16304f"}
                    fillOpacity={m === "pakistan" ? 0.95 : m ? 0.38 : 0.9}
                    stroke="#07172B"
                    strokeWidth="0.4"
                    style={{ transition: "fill .5s, fill-opacity .5s" }}
                  />
                );
              })}
            </g>
            <circle cx={base.x} cy={base.y} r="60" fill="url(#map-glow)" />
            <g fill="none">
              {shown.map((id) => {
                const d = arcPath(base, worldMap.markets[id]);
                return (
                  <g key={id}>
                    <path d={d} data-arc={id} stroke="#C7A365" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" pathLength={1} data-draw style={{ transition: "stroke-opacity .4s, stroke-width .4s" }} />
                    <circle r="2.4" fill="#F7F5F0" className="map-traveller" style={{ offsetPath: `path("${d}")` }} />
                  </g>
                );
              })}
            </g>
          </svg>
          <MapMarkers markers={markers} width={worldMap.width} height={worldMap.height} />
        </div>

        <dl className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 md:hidden">
          {markers.map((m) => (
            <div key={m.id} className="border-l border-gold/40 pl-4">
              <dt className="text-sm font-semibold text-gold-soft">{m.label}</dt>
              <dd className="mt-1 text-sm text-ivory/75">{m.note}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ivory/70">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gold" /> Sourcing base
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gold/50" /> Buyer markets we serve
          </li>
          <li className="text-ivory/55">Markers show markets, not office or factory locations.</li>
        </ul>
      </div>
    </section>
  );
}
