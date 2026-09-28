import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { PostCard } from "@/components/cards/PostCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealImage } from "@/lib/animations/RevealImage";
import { getBlogPost, getBlogPosts, getSettings } from "@/lib/api/endpoints";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeStaticParams } from "@/lib/page-meta";
import { resolveParams } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const posts = await getBlogPosts("en", { per_page: 24 });
    return locales.flatMap((lang) => posts.data.map((p) => ({ lang, slug: p.slug })));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params);
  const [settings, data] = await Promise.all([getSettings(locale), getBlogPost(locale, slug)]);
  if (!data) return {};
  const { post } = data;
  return buildMetadata({
    locale,
    path: routes.post(slug),
    settings,
    title: post.title,
    description: post.excerpt,
    image: post.cover_image,
    seo: post.seo,
    type: "article",
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await resolveParams(params);
  const [data, settings, dict] = await Promise.all([getBlogPost(locale, slug), getSettings(locale), getDictionary(locale)]);
  if (!data) notFound();
  const { post, related } = data;
  const title = post.title ?? post.slug;
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <article>
      <header className="container-site pt-[calc(var(--header-h)+6vh)]">
        <div className="intro-fade mb-10">
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.blog, href: localizeHref(locale, routes.blog) },
              { name: title, href: localizeHref(locale, routes.post(slug)) },
            ]}
          />
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="intro-fade flex flex-wrap items-center gap-3 text-sm text-paper/60">
            {post.category?.name && <span className="rounded-full border border-line px-3 py-1 text-lavender">{post.category.name}</span>}
            {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at, locale)}</time>}
            {post.reading_minutes ? (
              <span>
                · {post.reading_minutes} {dict.common.minRead}
              </span>
            ) : null}
          </div>
          <h1 dir="auto" className="text-display-lg mt-8" aria-label={title}>
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden className="inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <span className="intro-rise" style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>
          {post.excerpt && <p className="intro-fade mt-8 text-xl leading-relaxed text-paper/70">{post.excerpt}</p>}
          {post.author_name && (
            <p className="intro-fade mt-8 text-sm text-paper/50">
              {dict.blog.by} <span className="text-paper">{post.author_name}</span>
            </p>
          )}
        </div>
      </header>

      {post.cover_image && (
        <div className="container-site mt-16">
          <RevealImage className="aspect-[16/9] rounded-2xl bg-ink-3">
            <Image src={post.cover_image} alt="" fill preload sizes="100vw" className="object-cover" />
          </RevealImage>
        </div>
      )}

      <div className="container-site section-y">
        <RichText html={post.body} className="mx-auto max-w-3xl" />
      </div>

      {related.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <SectionHeading eyebrow={dict.blog.relatedPosts} size="md" className="mb-14" />
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} href={localizeHref(locale, routes.post(p.slug))} locale={locale} minRead={dict.common.minRead} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: post.excerpt ?? undefined,
          image: post.cover_image ?? undefined,
          datePublished: post.published_at ?? undefined,
          dateModified: post.updated_at ?? post.published_at ?? undefined,
          author: post.author_name ? { "@type": "Person", name: post.author_name } : { "@id": absoluteUrl("/#organization") },
          publisher: { "@type": "Organization", name: settings.site_name, logo: settings.logo ?? undefined },
          mainEntityOfPage: absoluteUrl(localizeHref(locale, routes.post(slug))),
          inLanguage: locale,
        }}
      />
    </article>
  );
}
