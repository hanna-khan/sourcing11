import type { ReactNode } from "react";
import { SplitWords } from "@/components/animations/SplitWords";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  kicker,
  title,
  intro,
  as = "h2",
  align = "left",
  className,
  children,
  id,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {kicker && (
        <p className={cn("kicker", align === "center" && "justify-center")} data-reveal>
          {kicker}
        </p>
      )}
      <SplitWords as={as} id={id} text={title} className="font-serif-display mt-5 text-h2 text-navy [.on-dark_&]:text-ivory" />
      {intro && (
        <p className="mt-6 text-lead text-muted-strong [.on-dark_&]:text-ivory/75" data-reveal data-delay="0.15">
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
