import Image from "next/image";
import { RevealImage } from "@/lib/animations/RevealImage";
import { cn } from "@/lib/utils";

/** Editorial gallery: alternating full-width and paired images. */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {images.map((src, i) => {
        const wide = i % 3 === 0;
        return (
          <RevealImage key={src} className={cn("rounded-2xl bg-ink-3", wide ? "aspect-[16/9] md:col-span-2" : "aspect-[4/5]")}>
            <Image src={src} alt={`${alt} — ${i + 1}`} fill sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"} className="object-cover" />
          </RevealImage>
        );
      })}
    </div>
  );
}
