import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * Official Sourcing Eleven logo — Arc Over, Concept 07.
 *
 * Source files (supplied by the client) live in /public/logo/source. The
 * variants used here are exact crops of those files: "mark" is the arc +
 * SOURCING11 wordmark; "lockup" adds the tagline. The light variant's colours
 * are taken pixel-for-pixel from the supplied on-navy artwork.
 */
const files = {
  mark: { dark: "/logo/sourcing11-logo.png", light: "/logo/sourcing11-logo-light.png", w: 2168, h: 454 },
  lockup: { dark: "/logo/sourcing11-lockup.png", light: "/logo/sourcing11-lockup-light.png", w: 2168, h: 697 },
} as const;

export function Logo({
  tone = "light",
  variant = "mark",
  className,
  title = "Sourcing Eleven",
  decorative,
  priority,
  eager,
  sizes = "240px",
}: {
  /** "light" = ivory/gold artwork for navy backgrounds; "dark" = navy/gold for light backgrounds */
  tone?: "light" | "dark";
  variant?: "mark" | "lockup";
  className?: string;
  title?: string;
  /** Inside a link that already has an accessible name */
  decorative?: boolean;
  priority?: boolean;
  /** Load immediately without a preload hint (for always-visible chrome like the header) */
  eager?: boolean;
  sizes?: string;
}) {
  const f = files[variant];
  return (
    <Image
      src={f[tone]}
      width={f.w}
      height={f.h}
      alt={decorative ? "" : title}
      priority={priority}
      loading={eager && !priority ? "eager" : undefined}
      sizes={sizes}
      quality={90}
      draggable={false}
      className={cn("h-auto w-full select-none", className)}
    />
  );
}
