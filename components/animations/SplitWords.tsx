import { createElement, Fragment, type ElementType } from "react";

/**
 * Server-rendered word split for the word-by-word heading reveal. The full
 * sentence stays in the DOM as real text, so it is crawlable and read normally
 * by assistive technology; without JS or with reduced motion nothing is hidden.
 */
export function SplitWords({
  as = "h2",
  text,
  className,
  delay,
  id,
  entrance,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  id?: string;
  /** Above the fold: animate with CSS immediately instead of on scroll */
  entrance?: boolean;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return createElement(
    as,
    entrance
      ? { className: `${className ?? ""} enter-words`, id, style: delay ? { "--d": `${delay}s` } : undefined }
      : { className, "data-split": "", "data-delay": delay, id },
    words.map((w, i) => (
      <Fragment key={i}>
        <span className="word">
          <span className="word-inner" style={entrance ? ({ "--i": i } as React.CSSProperties) : undefined}>
            {w}
          </span>
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
