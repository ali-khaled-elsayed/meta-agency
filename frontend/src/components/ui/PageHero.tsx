import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ParallaxImage } from "@/lib/animations/ParallaxImage";
import { cn, isVideoFile } from "@/lib/utils";

type Props = {
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  image?: string | null;
  video?: string | null;
  videoAsBackground?: boolean;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Inner-page hero. The title uses the CSS intro choreography so it paints without waiting for hydration;
 * scrolling lifts the copy away while an outlined copy of the title drifts behind it. An optional video
 * sits below as a framed reel that opens to full width as it scrolls into view.
 */
export function PageHero({ eyebrow, title, intro, image, video, videoAsBackground, breadcrumbs, children, className }: Props) {
  const words = title.split(/\s+/).filter(Boolean);
  const hasVideo = isVideoFile(video);
  const backdrop = hasVideo && videoAsBackground;

  return (
    <header
      className={cn(
        "relative overflow-hidden pt-[calc(var(--header-h)+6vh)]",
        backdrop && "flex min-h-[92svh] flex-col justify-end",
        className,
      )}
    >
      {backdrop && (
        <div aria-hidden className="intro-fade absolute inset-0" style={{ "--d": "0ms" } as CSSProperties}>
          {image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />}
          <video className="relative h-full w-full object-cover" src={video!} autoPlay muted loop playsInline preload="auto" />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
        </div>
      )}
      <p
        aria-hidden
        className="drift-x pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+2vh)] select-none whitespace-nowrap font-display text-[18vw] font-extrabold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(187_169_255/0.1)]"
      >
        {title} · {title}
      </p>
      <div className="hero-timeline">
        <div className="hero-lift container-site relative z-10 pb-[8vh]">
          {breadcrumbs && <div className="intro-fade mb-10">{breadcrumbs}</div>}
          {eyebrow && (
            <p className="intro-fade text-eyebrow mb-8 flex items-center gap-3 text-lavender" style={{ "--d": "0ms" } as CSSProperties}>
              <span aria-hidden className="h-px w-8 bg-current" />
              {eyebrow}
            </p>
          )}
          <h1 dir="auto" className="text-display-xl max-w-[16ch]" aria-label={title}>
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden className="inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <span className="intro-rise" style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>
          <span aria-hidden className="mt-10 block h-px w-full max-w-3xl bg-line">
            <span className="intro-line block h-full w-full bg-lavender/60" />
          </span>
          {intro && (
            <p
              className="intro-fade mt-8 max-w-2xl text-lg leading-relaxed text-paper/70 md:text-xl"
              style={{ "--d": `${250 + words.length * 70}ms` } as CSSProperties}
            >
              {intro}
            </p>
          )}
          {children}
        </div>
      </div>
      {backdrop ? null : hasVideo ? (
        <div className="intro-fade relative z-10 pb-10" style={{ "--d": "600ms" } as CSSProperties}>
          <div className="video-expand relative aspect-video max-h-[88vh] w-full overflow-hidden bg-ink-3">
            <video className="h-full w-full object-cover" src={video!} poster={image ?? undefined} autoPlay muted loop playsInline preload="metadata" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          </div>
        </div>
      ) : (
        image && (
          <div className="container-site relative z-10 pb-10">
            <ParallaxImage src={image} alt="" priority className="aspect-[16/8] rounded-2xl" />
          </div>
        )
      )}
      <div aria-hidden className="float-glow pointer-events-none absolute -top-40 end-[-10%] h-[60vh] w-[60vh] rounded-full bg-lavender/15 blur-[120px]" />
    </header>
  );
}
