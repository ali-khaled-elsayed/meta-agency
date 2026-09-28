import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getBlogCategories, getBlogPosts, getPage } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const meta = await cmsPageMetadata(locale, "blog", routes.blog, dict.nav.blog);
  const query = await searchParams;
  // Filtered and searched listings are not canonical content.
  return query.search || query.category || (query.page && query.page !== "1") ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function BlogPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const search = query.search?.slice(0, 100) || undefined;
  const category = query.category?.slice(0, 100) || undefined;

  const [shell, posts, categories, dict] = await Promise.all([
    getPage(locale, "blog"),
    getBlogPosts(locale, { category, search, page, per_page: 9 }),
    getBlogCategories(locale),
    getDictionary(locale),
  ]);

  const base = localizeHref(locale, routes.blog);
  const href = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== "" && sp.set(k, String(v)));
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };
  const [featured, ...rest] = posts.data;
  const showFeatured = page === 1 && !search && !category && featured;

  return (
    <>
      <PageHero
        eyebrow={shell?.eyebrow}
        title={shell?.title ?? dict.nav.blog}
        intro={shell?.intro}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.blog, href: base },
            ]}
          />
        }
      />

      <section className="pb-24 md:pb-40">
        <div className="container-site">
          <div className="mb-14 flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between">
            {categories.length > 0 && (
              <nav aria-label={dict.blog.categories} className="flex flex-wrap gap-3">
                {[{ slug: undefined, name: dict.common.all }, ...categories].map((c) => (
                  <Link
                    key={c.slug ?? "all"}
                    href={href({ category: c.slug, search })}
                    aria-current={category === c.slug ? "page" : undefined}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                      category === c.slug ? "border-lavender bg-lavender text-ink" : "border-line text-paper/70 hover:border-paper/40 hover:text-paper",
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            )}
            <form action={base} method="get" role="search" className="flex w-full max-w-sm items-center gap-3 border-b border-line focus-within:border-lavender">
              {category && <input type="hidden" name="category" value={category} />}
              <label htmlFor="blog-search" className="sr-only">
                {dict.blog.search}
              </label>
              <input
                id="blog-search"
                type="search"
                name="search"
                defaultValue={search}
                maxLength={100}
                placeholder={dict.blog.searchPlaceholder}
                className="w-full bg-transparent py-3 text-paper placeholder:text-paper/40 focus:outline-none"
              />
              <button type="submit" className="text-sm font-semibold text-lavender">
                {dict.blog.search}
              </button>
            </form>
          </div>

          {posts.data.length === 0 ? (
            <EmptyState text={search || category ? dict.blog.noResults : dict.blog.empty} />
          ) : (
            <>
              {showFeatured && (
                <PostCard
                  post={featured}
                  href={localizeHref(locale, routes.post(featured.slug))}
                  locale={locale}
                  minRead={dict.common.minRead}
                  featured
                  className="mb-20"
                />
              )}
              <StaggerContainer className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {(showFeatured ? rest : posts.data).map((post) => (
                  <StaggerItem key={post.id}>
                    <PostCard post={post} href={localizeHref(locale, routes.post(post.slug))} locale={locale} minRead={dict.common.minRead} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </>
          )}

          {posts.meta.last_page > 1 && (
            <nav aria-label={dict.blog.page} className="mt-20 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: posts.meta.last_page }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={href({ category, search, page: n > 1 ? n : undefined })}
                  aria-current={n === posts.meta.current_page ? "page" : undefined}
                  aria-label={`${dict.blog.page} ${n}`}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    n === posts.meta.current_page ? "border-lavender bg-lavender text-ink" : "border-line hover:border-lavender",
                  )}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
