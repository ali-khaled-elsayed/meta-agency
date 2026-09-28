import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds; nudges the reveal later in the scroll range so siblings cascade. */
  delay?: number;
  y?: number;
};

/**
 * Fades content up as it enters the viewport using a CSS scroll-driven animation, so it needs no JavaScript
 * and anything already on screen paints immediately. Browsers without `animation-timeline` show it statically.
 */
export function FadeIn({ children, className, delay = 0, y = 32 }: Props) {
  return (
    <div
      className={cn("fade-in", className)}
      style={{ "--fade-y": `${y}px`, "--fade-shift": `${Math.round(delay * 40)}%` } as CSSProperties}
    >
      {children}
    </div>
  );
}
