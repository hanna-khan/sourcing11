import type { Metadata } from "next";
import { ThankYouContent } from "@/components/forms/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <section className="on-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-deep text-ivory">
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
        <path d="M-80 900 C 260 160, 1180 160, 1520 900" fill="none" stroke="var(--color-gold)" strokeOpacity="0.5" strokeWidth="1.2" pathLength={1} data-draw vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container-x py-[calc(var(--header-h)+3rem)]">
        <ThankYouContent />
      </div>
    </section>
  );
}
