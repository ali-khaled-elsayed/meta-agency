"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; className?: string; max?: number };

/**
 * Tilts its content toward a mouse pointer in 3D and moves a soft glare with it.
 * Touch input is ignored and reduced-motion users get a flat card (see `.tilt-card` in globals.css).
 */
export function TiltCard({ children, className, max = 6 }: Props) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <div className={cn("tilt-card relative", className)} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <span aria-hidden className="tilt-glare pointer-events-none absolute inset-0 rounded-2xl" />
    </div>
  );
}
