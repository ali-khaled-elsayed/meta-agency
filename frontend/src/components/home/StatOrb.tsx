"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";
const LAVENDER = "#bba9ff";
const INK_2 = "#111116";

/**
 * Circle tied to scroll: a lavender point that swells into the full circle as it crosses the middle of the
 * viewport, then shrinks back to a point as it leaves. Hovering grows it further and floods it with lavender.
 */
export function StatOrb({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.12, 0.36, 0.64, 0.88, 1], [0.05, 0.1, 1, 1, 0.1, 0.05]);
  const backgroundColor = useTransform(scrollYProgress, [0.12, 0.2, 0.8, 0.88], [LAVENDER, INK_2, INK_2, LAVENDER]);
  const borderColor = useTransform(scrollYProgress, [0.2, 0.36, 0.64, 0.8], [LAVENDER, "rgba(187,169,255,0.3)", "rgba(187,169,255,0.3)", LAVENDER]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.36, 0.64, 0.8], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={className}>
      <div className="transition-transform duration-500 ease-out has-[.stat-orb:hover]:scale-115">
        <motion.div
          style={{ scale, backgroundColor, borderColor }}
          className="stat-orb group relative flex aspect-square w-full items-center justify-center rounded-full border"
        >
          <span
            aria-hidden
            className="absolute inset-0 scale-0 rounded-full bg-lavender opacity-0 transition-[scale,opacity] duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
          <span
            aria-hidden
            className="absolute inset-3 rounded-full border border-dashed border-line transition-colors duration-500 group-hover:border-ink/30"
          />
          <motion.div style={{ opacity }} className="relative px-6 text-center">
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
