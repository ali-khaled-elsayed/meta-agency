"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = { src: string; className?: string; revealOnPlay?: boolean };

/**
 * Muted looping background video that only loads near the viewport and pauses while off-screen.
 * With `revealOnPlay` it stays transparent until frames are playing, so a poster/image underneath shows.
 */
export function LazyVideo({ src, className, revealOnPlay }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={cn(revealOnPlay && "transition-opacity duration-1000", revealOnPlay && !playing && "opacity-0", className)}
      onPlaying={() => setPlaying(true)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}
