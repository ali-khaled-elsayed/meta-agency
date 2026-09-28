"use client";

import { type PointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import { cn, pad } from "@/lib/utils";

type Props = { slides: { key: string | number; node: ReactNode }[]; labels: { previous: string; next: string }; interval?: number };

/**
 * Continuously gliding, endlessly looping slider. The slides are rendered twice and a rAF clock drifts the
 * track by one card every `interval` ms, wrapping back by one set's width so the loop is seamless. It holds
 * while off-screen, dragged, swiped or wheeled, and the arrows glide one card at a time.
 */
export function BlogSlider({ slides, labels, interval = 4000 }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const holdFor = useRef(0);
  const drag = useRef<{ x: number; pos: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [scrollable, setScrollable] = useState(true);
  const count = slides.length;

  const metrics = useCallback(() => {
    const el = track.current;
    if (!el) return null;
    const first = el.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = (first?.offsetWidth ?? el.clientWidth) + gap;
    return { el, step, loop: step * count, sign: getComputedStyle(el).direction === "rtl" ? -1 : 1 };
  }, [count]);

  const place = useCallback(
    (next: number) => {
      const m = metrics();
      if (!m) return;
      const { el, step, loop, sign } = m;
      pos.current = ((next % loop) + loop) % loop;
      el.scrollLeft = sign * pos.current;
      setActive(Math.round(pos.current / step) % count);
    },
    [metrics, count],
  );

  const hold = (ms: number) => {
    holdFor.current = ms;
  };

  const go = (dir: 1 | -1) => {
    const m = metrics();
    if (!m) return;
    const { el, step, loop, sign } = m;
    let target = (Math.round(pos.current / step) + dir) * step;
    if (target < 0) {
      place(pos.current + loop);
      target += loop;
    }
    hold(900);
    el.scrollTo({ left: sign * target, behavior: "smooth" });
    setActive(Math.round(target / step) % count);
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    const ro = new ResizeObserver(() => {
      const m = metrics();
      if (m) setScrollable(m.loop > el.clientWidth + 4);
    });
    io.observe(el);
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, [metrics]);

  const running = visible && !dragging && scrollable;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const m = metrics();
      if (!m) return;
      const dt = Math.min(now - last, 100);
      last = now;
      const actual = Math.abs(m.el.scrollLeft);
      if (Math.abs(actual - pos.current) > 2) pos.current = actual;
      if (holdFor.current <= 0) place(pos.current + (m.step * dt) / interval);
      else {
        holdFor.current -= dt;
        if (pos.current >= m.loop) place(pos.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, interval, metrics, place]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, pos: pos.current, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) place(d.pos - dx * (metrics()?.sign ?? 1));
  };
  const endDrag = () => {
    suppressClick.current = !!drag.current?.moved;
    drag.current = null;
    setDragging(false);
  };

  const rendered = scrollable ? [...slides, ...slides] : slides;

  return (
    <div>
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={() => hold(Infinity)}
        onTouchEnd={() => hold(1500)}
        onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && hold(1200)}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (suppressClick.current) e.preventDefault();
          suppressClick.current = false;
        }}
        className={cn(
          "flex gap-6 overflow-x-auto overscroll-x-contain px-[var(--gutter)] pb-4 [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden",
          dragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
      >
        {rendered.map((slide, i) => {
          const clone = i >= count;
          return (
            <div
              key={`${clone ? "clone" : "slide"}-${slide.key}`}
              aria-roledescription={clone ? undefined : "slide"}
              aria-label={clone ? undefined : `${i + 1} / ${count}`}
              aria-hidden={clone || undefined}
              inert={clone}
              className="slider-card w-[82%] shrink-0 sm:w-[55%] lg:w-[calc((100%-2*var(--gutter)-4rem)/3)]"
            >
              {slide.node}
            </div>
          );
        })}
      </div>

      <div className={cn("container-site mt-10 flex items-center justify-between gap-6 md:mt-14", !scrollable && "hidden")}>
        <span dir="ltr" className="font-display text-sm tabular-nums text-paper/60">
          <span className="text-paper">{pad(active + 1)}</span> / {pad(count)}
        </span>
        <div className="flex gap-3">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              aria-label={dir === 1 ? labels.next : labels.previous}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-lavender hover:bg-lavender hover:text-ink md:h-14 md:w-14"
            >
              <ArrowIcon
                className={cn(
                  "transition-transform duration-500 ease-[var(--ease-expo)]",
                  dir === -1 ? "rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" : "group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
