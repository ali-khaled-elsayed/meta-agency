import { PostCard } from "@/components/cards/PostCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/lib/animations/TiltCard";
import type { BlogPost, HomeSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref, routes } from "@/lib/routes";
import { BlogSlider } from "./BlogSlider";

type Props = { section: HomeSection; posts: BlogPost[]; locale: Locale; dict: Dictionary };

export function BlogSection({ section, posts, locale, dict }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="section-y relative overflow-hidden">
      <p
        aria-hidden
        className="drift-x pointer-events-none absolute inset-x-0 top-10 select-none whitespace-nowrap font-display text-[14vw] font-extrabold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(187_169_255/0.12)]"
      >
        {section.eyebrow ?? section.title} · {section.eyebrow ?? section.title}
      </p>
      <div className="container-site relative">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          action={
            <Button href={localizeHref(locale, section.cta?.url ?? routes.blog)} variant="outline">
              {section.cta?.label ?? dict.common.viewAll}
            </Button>
          }
          className="mb-16 md:mb-24"
        />
      </div>
      <div className="fade-in relative">
        <BlogSlider
          labels={{ previous: dict.common.previous, next: dict.common.next }}
          slides={posts.map((post) => ({
            key: post.id,
            node: (
              <TiltCard>
                <PostCard post={post} href={localizeHref(locale, routes.post(post.slug))} locale={locale} minRead={dict.common.minRead} />
              </TiltCard>
            ),
          }))}
        />
      </div>
    </section>
  );
}
