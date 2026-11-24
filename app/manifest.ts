import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sourcing Eleven",
    short_name: "Sourcing11",
    description: "Textile buying and sourcing agency in Pakistan.",
    start_url: "/",
    display: "browser",
    background_color: "#07172B",
    theme_color: "#0B1F39",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
