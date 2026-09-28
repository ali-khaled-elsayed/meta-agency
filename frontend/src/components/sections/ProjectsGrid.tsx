"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import type { Project } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Props = { projects: (Project & { href: string })[]; allLabel: string; cursorLabel: string };

/**
 * Client-side service filter so the listing itself stays statically rendered. Cards run in a rhythm of
 * two half-width cards followed by one full-width card, and re-flow with a layout animation on filter.
 */
export function ProjectsGrid({ projects, allLabel, cursorLabel }: Props) {
  const [filter, setFilter] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const services = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((p) => p.service && map.set(p.service.slug, p.service.title ?? p.service.slug));
    return [...map.entries()];
  }, [projects]);
  const visible = filter ? projects.filter((p) => p.service?.slug === filter) : projects;

  return (
    <>
      {services.length > 1 && (
        <LayoutGroup>
          <div role="group" className="mb-14 flex flex-wrap gap-3">
            {[[null, allLabel] as const, ...services].map(([slug, label], i) => (
              <button
                key={slug ?? "all"}
                type="button"
                onClick={() => setFilter(slug)}
                aria-pressed={filter === slug}
                className={cn(
                  "intro-fade relative rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                  filter === slug ? "border-lavender text-ink" : "border-line text-paper/70 hover:border-paper/40 hover:text-paper",
                )}
                style={{ "--d": `${400 + i * 60}ms` } as CSSProperties}
              >
                {filter === slug && (
                  <motion.span layoutId="project-filter" className="absolute inset-0 rounded-full bg-lavender" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      )}
      <motion.div layout={!reduce} className="grid gap-x-8 gap-y-20 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => {
            const wide = i % 3 === 2;
            return (
              <motion.div
                key={project.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn(wide && "md:col-span-2", !wide && i % 3 === 1 && "md:mt-32")}
              >
                <ProjectCard
                  project={project}
                  href={project.href}
                  cursorLabel={cursorLabel}
                  aspect={wide ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]"}
                  sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
