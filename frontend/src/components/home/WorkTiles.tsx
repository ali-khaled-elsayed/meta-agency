"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { HoverVideo } from "@/components/ui/HoverVideo";
import { RevealImage } from "@/lib/animations/RevealImage";
import type { Project } from "@/lib/api/types";
import { cn, isVideoFile } from "@/lib/utils";

type Props = {
  items: { project: Project; href: string }[];
  cursorLabel: string;
  loadMoreLabel: string;
  viewAll: { label: string; href: string };
};

const PAGE = 3;

/**
 * Edge-to-edge work grid in a repeating rhythm of two square tiles and one wide banner. Tiles uncover as
 * they scroll in, preview their video on hover and reveal the title from the bottom edge.
 */
export function WorkTiles({ items, cursorLabel, loadMoreLabel, viewAll }: Props) {
  const [count, setCount] = useState(PAGE);
  const reduce = useReducedMotion();
  const visible = items.slice(0, count);

  return (
    <>
      <div className="grid gap-y-6 md:grid-cols-2 md:gap-y-10">
        <AnimatePresence initial={false}>
          {visible.map(({ project, href }, i) => {
            const wide = i % 3 === 2;
            return (
              <motion.article
                key={project.id}
                initial={reduce ? false : { opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % PAGE) * 0.08 }}
                className={cn("group relative", wide && "md:col-span-2")}
              >
                <Link href={href} data-cursor={cursorLabel} className="block">
                  <RevealImage className={cn("reveal-image-square bg-ink-3", wide ? "aspect-square md:aspect-[21/8]" : "aspect-square")}>
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title ?? ""}
                        fill
                        sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                        className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-105"
                      />
                    )}
                    {isVideoFile(project.video_url) && (
                      <HoverVideo src={project.video_url!} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
                      <div className="translate-y-6 opacity-0 transition-all duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100">
                        {project.service?.title && (
                          <p className="text-eyebrow text-lavender">{project.service.title}</p>
                        )}
                        <h3 className="mt-3 max-w-xl font-display text-2xl font-bold tracking-tight md:text-4xl">{project.title}</h3>
                      </div>
                      <span className="flex h-14 w-14 shrink-0 scale-0 items-center justify-center rounded-full bg-lavender text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-100 md:h-16 md:w-16">
                        <ArrowIcon className="h-5 w-5 -rotate-45 rtl:rotate-[-135deg]" />
                      </span>
                    </div>
                  </RevealImage>
                </Link>
                <p className="container-site mt-4 font-display text-lg font-semibold md:hidden">{project.title}</p>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="container-site mt-14 flex justify-center md:mt-20">
        {count < items.length ? (
          <button
            type="button"
            onClick={() => setCount((c) => c + PAGE)}
            className="group inline-flex items-center gap-3 rounded-full border border-current/30 px-7 py-4 text-sm font-semibold transition-colors duration-300 hover:border-lavender hover:bg-lavender hover:text-ink"
          >
            {loadMoreLabel}
            <span aria-hidden className="text-lg leading-none transition-transform duration-500 group-hover:rotate-90">+</span>
          </button>
        ) : (
          <Button href={viewAll.href} variant="outline">
            {viewAll.label}
          </Button>
        )}
      </div>
    </>
  );
}
