"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = { items: string[]; baseSpeed?: number; className?: string };

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ items, outlineOffset }: { items: string[]; outlineOffset: number }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span
            className={cn(
              "px-6 md:px-10",
              (i + outlineOffset) % 2 === 1 && "text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]",
            )}
          >
            {item}
          </span>
          <span aria-hidden className="text-lavender">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * A large type band that drifts continuously and reacts to scrolling: faster with scroll speed, reversing with
 * scroll direction and leaning into the motion. Static for reduced-motion users.
 */
export function VelocityMarquee({ items, baseSpeed = 2.5, className }: Props) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const speedFactor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skewX = useTransform(velocity, [-2000, 2000], [10, -10]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseSpeed * (delta / 1000);
    const factor = speedFactor.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    move += direction.current * move * factor;
    baseX.set(baseX.get() + move);
  });

  if (items.length === 0) return null;

  const classes = "flex w-max whitespace-nowrap font-display text-display-lg font-extrabold uppercase leading-none tracking-tight";

  return (
    <section aria-label={items.join(", ")} className={cn("overflow-hidden border-y border-line py-10 md:py-14", className)}>
      <div aria-hidden dir="ltr">
        {reduce ? (
          <div className={classes}>
            <Row items={items} outlineOffset={0} />
          </div>
        ) : (
          <motion.div className={classes} style={{ x, skewX }}>
            <Row items={items} outlineOffset={0} />
            <Row items={items} outlineOffset={items.length % 2} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
