"use client";

import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

type Props = { as?: ElementType; className?: string; children: ReactNode; threshold?: number };

/** Sets `data-inview` once the element scrolls into view so CSS can start time-based animations. */
export function InView({ as: Tag = "div", className, children, threshold = 0.4 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={className} data-inview={seen || undefined}>
      {children}
    </Tag>
  );
}
