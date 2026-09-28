"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { duration, ease, viewportOnce } from "./presets";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Animate when scrolled into view (default) or immediately on mount. */
  trigger?: "inView" | "mount";
  delay?: number;
  stagger?: number;
};

/**
 * Splits a heading into words that rise from behind a mask. Screen readers receive the full string once.
 */
export function AnimatedText({ text, as: Tag = "h2", className, trigger = "inView", delay = 0, stagger = 0.06 }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  const animate = trigger === "mount" ? { animate: "visible" } : { whileInView: "visible", viewport: viewportOnce };

  return (
    <Tag dir="auto" className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        {...animate}
        variants={{ hidden: {}, visible: { transition: reduce ? {} : { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-flex overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span
              className={cn("inline-block will-change-transform")}
              variants={{
                hidden: { y: "110%", rotate: 4 },
                visible: { y: "0%", rotate: 0, transition: reduce ? { duration: 0 } : { duration: duration.slow, ease: ease.expo } },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
