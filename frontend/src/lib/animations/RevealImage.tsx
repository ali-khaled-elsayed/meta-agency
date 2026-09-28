import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "side";
};

/**
 * Uncovers media with a clip-path wipe while it settles from a slight zoom, driven by scroll position in CSS.
 * Media already on screen paints immediately; browsers without `animation-timeline` show it statically.
 */
export function RevealImage({ children, className, direction = "up" }: Props) {
  return (
    <div className={cn("reveal-image relative overflow-hidden", direction === "side" && "reveal-image-side", className)}>
      <div className="reveal-image-inner absolute inset-0">{children}</div>
    </div>
  );
}
