"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Plays a muted preview while the closest link/card is hovered. The file is only requested on the first
 * hover, and the video stays transparent until frames are playing so the cover image shows meanwhile.
 */
export function HoverVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const host = video?.closest("a, article");
    if (!video || !host || !window.matchMedia("(hover: hover)").matches) return;

    const enter = () => {
      if (!video.src) video.src = src;
      void video.play().catch(() => {});
    };
    const leave = () => {
      video.pause();
      setPlaying(false);
    };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onPlaying={() => setPlaying(true)}
      className={cn("transition-opacity duration-700", playing ? "opacity-100" : "opacity-0", className)}
    />
  );
}
