import type { ComponentProps } from "react";
import type { AnalyticsEvent } from "@/lib/analytics/track";

/** Plain anchor tagged for the delegated click tracker in <Analytics>. */
export function TrackedLink({ event, label, ...props }: ComponentProps<"a"> & { event: AnalyticsEvent; label?: string }) {
  return <a {...props} data-track={event} data-track-label={label} />;
}
