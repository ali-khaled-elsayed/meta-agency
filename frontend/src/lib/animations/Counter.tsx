"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = { value: number; prefix?: string | null; suffix?: string | null; className?: string; locale?: string };

/** Counts up to `value` once visible. Server HTML already contains the final number for SEO and no-JS users. */
export function Counter({ value, prefix, suffix, className, locale = "en" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = (n: number) => new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(Math.round(n));

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.19, 1, 0.22, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix ?? ""}${format(v)}${suffix ?? ""}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {`${prefix ?? ""}${format(value)}${suffix ?? ""}`}
    </span>
  );
}
