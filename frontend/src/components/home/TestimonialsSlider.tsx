"use client";

import Image from "next/image";
import { useState } from "react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";
import "swiper/css";
import type { Testimonial } from "@/lib/api/types";
import { cn, pad } from "@/lib/utils";

type Props = { items: Testimonial[]; labels: { previous: string; next: string } };

export function TestimonialsSlider({ items, labels }: Props) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <div>
      <Swiper
        modules={[A11y, Autoplay, Keyboard]}
        onSwiper={setSwiper}
        onSlideChange={(s) => setIndex(s.realIndex)}
        slidesPerView={1}
        spaceBetween={48}
        loop={items.length > 1}
        speed={900}
        keyboard={{ enabled: true }}
        autoplay={items.length > 1 ? { delay: 7000, disableOnInteraction: true, pauseOnMouseEnter: true } : false}
        a11y={{ prevSlideMessage: labels.previous, nextSlideMessage: labels.next }}
      >
        {items.map((t) => (
          <SwiperSlide key={t.id}>
            <figure className="max-w-5xl">
              <blockquote className="font-display text-2xl leading-snug tracking-tight md:text-4xl lg:text-5xl">
                <span aria-hidden className="text-lavender">“</span>
                {t.quote}
                <span aria-hidden className="text-lavender">”</span>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                {t.avatar && (
                  <Image src={t.avatar} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-semibold">{t.author_name}</p>
                  <p className="text-sm text-paper/60">{[t.author_position, t.company].filter(Boolean).join(", ")}</p>
                </div>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      {items.length > 1 && (
        <div className="mt-14 flex items-center justify-between gap-6 border-t border-line pt-8">
          <p className="font-display text-sm text-paper/60">
            <span className="text-lavender">{pad(index + 1)}</span> / {pad(items.length)}
          </p>
          <div className="flex gap-3">
            {(["previous", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => (dir === "next" ? swiper?.slideNext() : swiper?.slidePrev())}
                aria-label={labels[dir]}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-line transition-colors hover:border-lavender hover:bg-lavender hover:text-ink"
              >
                <svg viewBox="0 0 24 24" aria-hidden className={cn("h-5 w-5", dir === "previous" ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180")} fill="none">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
