"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import type { Highlight } from "@/lib/api/types";
import { pad } from "@/lib/utils";

/**
 * Desktop: the section pins and the cards travel horizontally with scroll (GSAP ScrollTrigger scrub),
 * each card tilting into place, an outlined backdrop word drifting the other way and a progress counter.
 * Mobile and reduced motion: a regular vertical grid with scroll-driven fade-ins.
 */
export function HighlightsRail({ items, backdrop }: { items: Highlight[]; backdrop?: string | null }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduce || !section.current || !track.current) return;

    let cancelled = false;
    let revert: (() => void) | undefined;
    import("@/lib/animations/gsap").then(({ getGsap }) => {
      if (cancelled || !section.current || !track.current) return;
      const { gsap } = getGsap();
      const rtl = document.documentElement.dir === "rtl";
      const ctx = gsap.context(() => {
        const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
        const travel = gsap.to(track.current, {
          x: () => (rtl ? distance() : -distance()),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
              if (counter.current) counter.current.textContent = pad(Math.min(items.length, Math.floor(progress * items.length) + 1));
            },
          },
        });

        if (word.current) {
          gsap.fromTo(
            word.current,
            { xPercent: rtl ? -8 : 8 },
            {
              xPercent: rtl ? 22 : -22,
              ease: "none",
              scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: 1.2 },
            },
          );
        }

        gsap.utils.toArray<HTMLElement>("[data-rail-card]").forEach((card) => {
          gsap.from(card, {
            rotate: rtl ? -5 : 5,
            yPercent: 14,
            scale: 0.9,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: travel,
              start: rtl ? "right -5%" : "left 105%",
              end: rtl ? "right 30%" : "left 70%",
              scrub: true,
            },
          });
        });
      }, section);
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [items.length]);

  return (
    <div ref={section} className="relative lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
      {backdrop && (
        <p
          ref={word}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 select-none whitespace-nowrap font-display text-[16vw] font-extrabold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(187_169_255/0.22)] lg:block"
        >
          {backdrop} · {backdrop}
        </p>
      )}
      <div ref={track} className="container-site relative grid gap-6 sm:grid-cols-2 lg:flex lg:w-max lg:max-w-none lg:gap-8">
        {items.map((item, i) => (
          <div key={item.id} className="fade-in" style={{ "--fade-shift": `${(i % 2) * 12}%` } as CSSProperties}>
            <article
              data-rail-card
              className="group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-ink-2/90 p-8 backdrop-blur-sm transition-colors duration-500 hover:border-lavender/60 lg:h-[60vh] lg:w-[34vw] lg:p-12"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-lavender transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100"
              />
              <span
                aria-hidden
                className="absolute -end-16 -top-16 h-48 w-48 rounded-full border border-lavender/20 transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[2.5] group-hover:border-ink/20"
              />
              <div className="relative flex items-start justify-between">
                <span className="font-display text-7xl font-bold text-lavender transition-all duration-500 group-hover:-translate-y-1 group-hover:text-ink lg:text-9xl">
                  {pad(i + 1)}
                </span>
                <span
                  aria-hidden
                  className="mt-3 flex h-12 w-12 items-center justify-center rounded-full border border-line text-paper/60 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <span
                  aria-hidden
                  className="mb-6 block h-px w-12 bg-lavender transition-all duration-700 ease-[var(--ease-expo)] group-hover:w-full group-hover:bg-ink/30"
                />
                <h3 className="font-display text-3xl font-bold tracking-tight transition-colors duration-500 group-hover:text-ink lg:text-4xl">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-4 text-paper/60 transition-colors duration-500 group-hover:text-ink/80">{item.description}</p>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
      <div className="container-site relative mt-10 hidden items-center gap-6 lg:flex" aria-hidden>
        <span className="font-display text-sm tabular-nums text-paper/70">
          <span ref={counter}>01</span> / {pad(items.length)}
        </span>
        <div className="h-px flex-1 bg-line">
          <div ref={bar} className="h-px w-full origin-left scale-x-0 bg-lavender rtl:origin-right" />
        </div>
      </div>
    </div>
  );
}
