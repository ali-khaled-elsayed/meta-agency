"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ElementType } from "react";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.42, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrubText({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={`${word}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </Tag>
  );
}
