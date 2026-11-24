import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

async function logo() {
  const png = await readFile(path.join(process.cwd(), "public", "logo", "sourcing11-logo-light.png"));
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function fonts() {
  const dir = path.join(process.cwd(), "app", "fonts");
  const [serif, sans, sansBold] = await Promise.all([
    readFile(path.join(dir, "cormorant-garamond-latin-500-normal.woff")),
    readFile(path.join(dir, "manrope-latin-500-normal.woff")),
    readFile(path.join(dir, "manrope-latin-700-normal.woff")),
  ]);
  return [
    { name: "Cormorant", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "Manrope", data: sans, weight: 500 as const, style: "normal" as const },
    { name: "Manrope", data: sansBold, weight: 700 as const, style: "normal" as const },
  ];
}

/** Branded social card: navy field, gold arc, wordmark and page title. */
export async function renderOg({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const logoSrc = await logo();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07172B", padding: "64px 72px", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M-40 640 C 220 60, 980 60, 1240 640" fill="none" stroke="#C7A365" strokeOpacity="0.55" strokeWidth="2" />
          <path d="M140 640 C 360 240, 840 240, 1060 640" fill="none" stroke="#D8BC8C" strokeOpacity="0.18" strokeWidth="1.5" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={300} height={63} alt="" style={{ width: 300, height: 63 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow && <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 24, color: "#D8BC8C", marginBottom: 20 }}>{eyebrow}</div>}
          <div style={{ fontFamily: "Cormorant", fontWeight: 500, fontSize: title.length > 60 ? 64 : 78, lineHeight: 1.05, color: "#F7F5F0", maxWidth: 980 }}>{title}</div>
        </div>
        <div style={{ fontFamily: "Manrope", fontWeight: 500, fontSize: 22, color: "rgba(247,245,240,0.7)" }}>Textile buying and sourcing agency in Pakistan</div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
