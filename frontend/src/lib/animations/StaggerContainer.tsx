"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { fadeUp, staggerParent, viewportOnce } from "./presets";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
};

export function StaggerContainer({ children, className, stagger = 0.08, delay = 0, as = "div" }: ContainerProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag className={className} initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerParent(stagger, delay)}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
