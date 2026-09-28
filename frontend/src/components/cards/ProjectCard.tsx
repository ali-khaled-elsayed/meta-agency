import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Button";
import { HoverVideo } from "@/components/ui/HoverVideo";
import { RevealImage } from "@/lib/animations/RevealImage";
import type { Project } from "@/lib/api/types";
import { cn, isVideoFile } from "@/lib/utils";

type Props = { project: Project; href: string; cursorLabel: string; className?: string; aspect?: string; sizes?: string };

export function ProjectCard({ project, href, cursorLabel, className, aspect = "aspect-[4/3]", sizes = "(min-width: 768px) 50vw, 100vw" }: Props) {
  return (
    <article className={cn("group", className)}>
      <Link href={href} data-cursor={cursorLabel} className="block">
        <RevealImage className={cn("rounded-2xl bg-ink-3", aspect)}>
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title ?? ""}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-paper/10">
              {project.title}
            </div>
          )}
          {isVideoFile(project.video_url) && (
            <HoverVideo
              src={project.video_url!}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105"
            />
          )}
          <span
            aria-hidden
            className="absolute bottom-5 end-5 flex h-16 w-16 scale-0 items-center justify-center rounded-full bg-lavender text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-100"
          >
            <ArrowIcon className="h-5 w-5 -rotate-45 rtl:rotate-[-135deg]" />
          </span>
        </RevealImage>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-no-repeat pb-1 transition-[background-size,color] duration-700 ease-[var(--ease-expo)] [background-position:0_100%] group-hover:bg-[length:100%_1px] group-hover:text-lavender rtl:[background-position:100%_100%]">
                {project.title}
              </span>
            </h3>
            {project.excerpt && <p className="mt-2 line-clamp-2 max-w-lg text-paper/60">{project.excerpt}</p>}
          </div>
          <div className="shrink-0 text-end text-sm text-paper/50">
            {project.service?.title && (
              <p className="rounded-full border border-line px-3 py-1 transition-colors duration-500 group-hover:border-lavender group-hover:text-lavender">
                {project.service.title}
              </p>
            )}
            {project.year && <p className="mt-2">{project.year}</p>}
          </div>
        </div>
      </Link>
    </article>
  );
}
