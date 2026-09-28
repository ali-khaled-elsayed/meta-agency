import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Button";
import { RevealImage } from "@/lib/animations/RevealImage";
import type { BlogPost } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import { cn, formatDate } from "@/lib/utils";

type Props = { post: BlogPost; href: string; locale: Locale; minRead: string; className?: string; featured?: boolean };

export function PostCard({ post, href, locale, minRead, className, featured }: Props) {
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={href} className="flex flex-1 flex-col">
        <RevealImage className={cn("rounded-2xl bg-ink-3", featured ? "aspect-[16/9]" : "aspect-[4/3]")}>
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt=""
              fill
              sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
              className="object-cover transition-[transform,filter] duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-110 group-hover:brightness-75"
            />
          )}
          {post.category?.name && (
            <span className="absolute start-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur">
              {post.category.name}
            </span>
          )}
          <span
            aria-hidden
            className="absolute bottom-4 end-4 flex h-14 w-14 scale-0 items-center justify-center rounded-full bg-lavender text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-100"
          >
            <ArrowIcon className="h-5 w-5 -rotate-45 rtl:rotate-[-135deg]" />
          </span>
        </RevealImage>
        <div className="mt-6 flex items-center gap-3 text-sm text-paper/50">
          <span aria-hidden className="h-px w-6 bg-lavender transition-all duration-700 ease-[var(--ease-expo)] group-hover:w-12" />
          {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at, locale)}</time>}
          {post.reading_minutes ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {post.reading_minutes} {minRead}
              </span>
            </>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-3 font-display font-bold tracking-tight transition-colors group-hover:text-lavender",
            featured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
          )}
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-expo)] [background-position:0_100%] group-hover:bg-[length:100%_1px] rtl:[background-position:100%_100%]">
            {post.title}
          </span>
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-paper/60">{post.excerpt}</p>}
      </Link>
    </article>
  );
}
