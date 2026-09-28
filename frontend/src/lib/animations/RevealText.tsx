"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { duration, ease, viewportOnce } from "./presets";

type Props = { children: ReactNode; className?: string; delay?: number };

/** Slides a block of text up from behind a mask as it enters the viewport. */
export function RevealText({ children, className, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: duration.slow, ease: ease.expo, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
