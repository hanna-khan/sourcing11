// Colour sets for the 3D fabric shader (kept separate so importing them never pulls in three.js).
export type FabricPalette = { base: string; deep: string; highlight: string; sheen: string; clear: string };

export const palettes = {
  navySatin: { base: "#22426b", deep: "#06121f", highlight: "#C7A365", sheen: "#D8BC8C", clear: "#07172B" },
  denim: { base: "#35588a", deep: "#0a1626", highlight: "#b9c7dc", sheen: "#C7A365", clear: "#0B1F39" },
  champagne: { base: "#c9a86c", deep: "#3a2a14", highlight: "#f4e3bd", sheen: "#fff4dc", clear: "#0B1F39" },
  ivoryLinen: { base: "#ece6d9", deep: "#6f6a60", highlight: "#ffffff", sheen: "#D8BC8C", clear: "#0B1F39" },
} satisfies Record<string, FabricPalette>;

