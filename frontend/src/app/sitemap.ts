import type { MetadataRoute } from "next";
import { getBlogPosts, getJobs, getProjects, getServices, getSettings } from "@/lib/api/endpoints";
import { locales } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

type Entry = { path: string; lastModified?: string | null; priority?: number };

async function safe<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch {
    return fallback;
  }
}

async function allBlogPosts() {
  const first = await getBlogPosts("en", { per_page: 24 });
  const pages = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.last_page - 1) }, (_, i) => getBlogPosts("en", { per_page: 24, page: i + 2 })),
  );
  return [first, ...pages].flatMap((p) => p.data);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, services, projects, posts, jobs] = await Promise.all([
    safe(() => getSettings("en"), null),
    safe(() => getServices("en"), []),
    safe(() => getProjects("en"), []),
    safe(allBlogPosts, []),
    safe(() => getJobs("en"), []),
  ]);

  const entries: Entry[] = [
    { path: routes.home, priority: 1 },
    { path: routes.about, priority: 0.8 },
    { path: routes.services, priority: 0.9 },
    { path: routes.clients, priority: 0.6 },
    { path: routes.career, priority: 0.6 },
    { path: routes.jobApply(), priority: 0.4 },
    { path: routes.contact, priority: 0.8 },
    { path: routes.privacy, priority: 0.2 },
    ...(settings?.features.projects ? [{ path: routes.projects, priority: 0.8 }] : []),
    ...(settings?.features.blog ? [{ path: routes.blog, priority: 0.7 }] : []),
    ...services.map((s) => ({ path: routes.service(s.slug), priority: 0.8 })),
    ...projects.map((p) => ({ path: routes.project(p.slug), priority: 0.7 })),
    ...posts.map((p) => ({ path: routes.post(p.slug), lastModified: p.published_at, priority: 0.6 })),
    ...jobs.map((j) => ({ path: routes.job(j.slug), lastModified: j.published_at, priority: 0.5 })),
  ];

  const url = (locale: string, path: string) => absoluteUrl(`/${locale}${path === "/" ? "" : path}`);

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: url(locale, entry.path),
      lastModified: entry.lastModified ? new Date(entry.lastModified) : undefined,
      priority: entry.priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, entry.path)])) },
    })),
  );
}
