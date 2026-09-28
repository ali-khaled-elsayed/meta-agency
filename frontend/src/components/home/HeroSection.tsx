import type { CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";
import type { HomeSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/routes";
import { cn, isVideoFile } from "@/lib/utils";
import { HeroBackdrop } from "./HeroBackdrop";
import { ScrollBadge } from "./ScrollBadge";

/** Side-view leg: thigh swings at the hip, shin bends at the knee, foot rolls heel to toe (walking toward the mark). */
function Leg({ className }: { className?: string }) {
  return (
    <span className={cn("hero-thigh absolute left-0 top-0 block h-6 w-full rounded-full bg-lavender md:h-9", className)}>
      <span className="hero-shin absolute left-0 top-[calc(100%-0.3rem)] block h-6 w-full rounded-full bg-lavender md:h-9">
        <span className="hero-foot absolute bottom-0 right-0 block h-2 w-5 rounded-full bg-lavender md:h-2.5 md:w-7" />
      </span>
    </span>
  );
}

type Props = { section: HomeSection; locale: Locale; dict: Dictionary; videoUrl?: string | null; siteName?: string };

export function HeroSection({ section, locale, dict, videoUrl, siteName = "" }: Props) {
  const [firstName, ...restName] = siteName.split(/\s+/).filter(Boolean);
  const title = section.title ?? "";
  const words = title.split(/\s+/).filter(Boolean);
  const video = section.video_url ?? videoUrl;
  const wordsDelay = words.length * 70;

  return (
    <section className="hero-intro hero-timeline grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-[var(--header-h)]">
      {!section.image && (
        <div className="hero-media-in absolute inset-0">
          <HeroBackdrop />
        </div>
      )}
      {(section.image || isVideoFile(video)) && (
        <div aria-hidden className="hero-zoom absolute inset-0">
          <div className="hero-media-in absolute inset-0">
            {isVideoFile(video) ? (
              <video
                className="h-full w-full object-cover opacity-80"
                src={video ?? undefined}
                poster={section.image ?? undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image src={section.image!} alt="" fill preload sizes="100vw" className="object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
          </div>
        </div>
      )}

      <div aria-hidden className="hero-logo pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div dir="ltr" className="flex items-center gap-5 md:gap-8">
          <div className="logo-anim logo-loader relative text-paper">
            <span className="hero-logo-glow absolute -inset-[35%] rounded-full bg-lavender/25 blur-3xl" />
            <LogoMark className="relative h-24 w-auto sm:h-32 md:h-48" />
          </div>
          {firstName && (
            <div className="hero-walk font-display uppercase leading-[0.95] text-paper">
              <div className="hero-sit relative [--thigh:1.25rem] md:[--thigh:1.9rem]">
              <span className="block text-4xl font-extrabold tracking-wide sm:text-5xl md:text-7xl">
                <span className="hero-step inline-block">{firstName}</span>
              </span>
              {restName.length > 0 && (
                <span className="mt-1 flex gap-[0.4em] text-sm font-medium tracking-[0.08em] text-paper/85 sm:text-lg md:text-2xl">
                  {restName.map((word, i) => (
                    <span key={`${word}-${i}`} className="hero-step inline-block" style={{ "--step": i + 1 } as CSSProperties}>
                      {word}
                    </span>
                  ))}
                </span>
              )}
              <span className="hero-legs absolute left-1/2 top-full mt-1 block w-2 -translate-x-1/2 md:w-2.5">
                <Leg className="hero-leg-back opacity-60" />
                <Leg />
                <span className="absolute left-1/2 top-0 block h-3 w-3 -translate-x-1/2 -translate-y-1/3 rounded-full bg-lavender md:h-3.5 md:w-3.5" />
              </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hero-copy hero-lift container-site relative z-10">
        {section.eyebrow && (
          <p className="intro-fade text-eyebrow mb-8 flex items-center gap-3 text-lavender">
            <span aria-hidden className="h-px w-8 bg-current" />
            {section.eyebrow}
          </p>
        )}
        <div className="relative">
          <h1 dir="auto" className="text-display-2xl max-w-[12ch]" aria-label={title}>
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden className="inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <span className="intro-rise" style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>
          <div
            className="intro-fade absolute bottom-2 end-0 hidden lg:block"
            style={{ "--d": `${500 + wordsDelay}ms` } as CSSProperties}
          >
            <ScrollBadge label={dict.home.scrollToExplore} />
          </div>
        </div>

        <div
          className="intro-fade relative mt-12 grid gap-10 pt-8 md:grid-cols-12 md:items-end"
          style={{ "--d": `${300 + wordsDelay}ms` } as CSSProperties}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line">
            <span className="intro-line block h-full w-full bg-lavender/60" />
          </span>
          {section.description && (
            <p className="max-w-xl text-lg leading-relaxed text-paper/70 md:col-span-6 md:text-xl">{section.description}</p>
          )}
          <div className="flex flex-wrap gap-4 md:col-span-6 md:justify-end">
            {section.cta && <Button href={localizeHref(locale, section.cta.url)}>{section.cta.label}</Button>}
            {section.secondary_cta && (
              <Button href={localizeHref(locale, section.secondary_cta.url)} variant="outline">
                {section.secondary_cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
