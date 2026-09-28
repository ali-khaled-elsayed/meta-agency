"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Percentage of travel; the image is oversized by the same amount so edges never show. */
  speed?: number;
  priority?: boolean;
  sizes?: string;
};

export function ParallaxImage({ src, alt, className, speed = 12, priority = false, sizes = "100vw" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-x-0"
        style={reduce ? { top: 0, bottom: 0 } : { y, top: `-${speed}%`, bottom: `-${speed}%` }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} preload={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}
