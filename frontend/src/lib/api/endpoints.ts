import "server-only";
import { apiGet } from "./client";
import type { Locale } from "@/lib/i18n/config";
import type {
  BlogCategory,
  BlogPost,
  BlogPostDetail,
  Client,
  Faq,
  Highlight,
  HighlightGroup,
  HomeSection,
  JobPosting,
  JobPostingDetail,
  Page,
  Paginated,
  Project,
  ProjectDetail,
  RedirectRule,
  Service,
  ServiceDetail,
  ServiceMeta,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

type Data<T> = { data: T };

const ALL_TAGS = [
  "settings",
  "pages",
  "home",
  "services",
  "projects",
  "clients",
  "testimonials",
  "blog",
  "jobs",
  "team",
  "highlights",
  "faqs",
];

export async function getSettings(locale: Locale): Promise<SiteSettings> {
  // Settings also carry services, offices, statistics and content flags, so any content change refreshes them.
  const res = await apiGet<Data<SiteSettings>>("settings", { locale, tags: ALL_TAGS });
  if (!res) throw new Error("Site settings are unavailable.");
  return res.data;
}

export async function getPage(locale: Locale, slug: string): Promise<Page | null> {
  const res = await apiGet<Data<Page>>(`pages/${encodeURIComponent(slug)}`, { locale, tags: ["pages"] });
  return res?.data ?? null;
}

export async function getHomePage(locale: Locale): Promise<{ page: Page; sections: HomeSection[] } | null> {
  const res = await apiGet<Data<Page> & { sections: HomeSection[] }>("pages/home", { locale, tags: ALL_TAGS });
  return res ? { page: res.data, sections: res.sections } : null;
}

export async function getServices(locale: Locale): Promise<Service[]> {
  return (await apiGet<Data<Service[]>>("services", { locale, tags: ["services"] }))?.data ?? [];
}

export async function getService(
  locale: Locale,
  slug: string,
): Promise<{ service: ServiceDetail; meta: ServiceMeta } | null> {
  const res = await apiGet<Data<ServiceDetail> & { meta: ServiceMeta }>(`services/${encodeURIComponent(slug)}`, {
    locale,
    tags: ["services", "projects"],
  });
  return res ? { service: res.data, meta: res.meta } : null;
}

export async function getProjects(locale: Locale, query: { service?: string; featured?: boolean } = {}): Promise<Project[]> {
  const res = await apiGet<Data<Project[]>>("projects", {
    locale,
    query: { service: query.service, featured: query.featured ? 1 : undefined },
    tags: ["projects"],
  });
  return res?.data ?? [];
}

export async function getProject(
  locale: Locale,
  slug: string,
): Promise<{ project: ProjectDetail; related: Project[] } | null> {
  const res = await apiGet<Data<ProjectDetail> & { related: Project[] }>(`projects/${encodeURIComponent(slug)}`, {
    locale,
    tags: ["projects"],
  });
  return res ? { project: res.data, related: res.related } : null;
}

export async function getBlogPosts(
  locale: Locale,
  query: { category?: string; search?: string; page?: number; per_page?: number } = {},
): Promise<Paginated<BlogPost>> {
  const res = await apiGet<Paginated<BlogPost>>("blog", { locale, query, tags: ["blog"] });
  return res ?? { data: [], meta: { current_page: 1, last_page: 1, per_page: 9, total: 0 } };
}

export async function getBlogCategories(locale: Locale): Promise<BlogCategory[]> {
  return (await apiGet<Data<BlogCategory[]>>("blog/categories", { locale, tags: ["blog"] }))?.data ?? [];
}

export async function getBlogPost(
  locale: Locale,
  slug: string,
): Promise<{ post: BlogPostDetail; related: BlogPost[] } | null> {
  const res = await apiGet<Data<BlogPostDetail> & { related: BlogPost[] }>(`blog/${encodeURIComponent(slug)}`, {
    locale,
    tags: ["blog"],
  });
  return res ? { post: res.data, related: res.related } : null;
}

export async function getJobs(locale: Locale): Promise<JobPosting[]> {
  return (await apiGet<Data<JobPosting[]>>("jobs", { locale, tags: ["jobs"] }))?.data ?? [];
}

export async function getJob(locale: Locale, slug: string): Promise<JobPostingDetail | null> {
  return (await apiGet<Data<JobPostingDetail>>(`jobs/${encodeURIComponent(slug)}`, { locale, tags: ["jobs"] }))?.data ?? null;
}

export async function getClients(locale: Locale): Promise<Client[]> {
  return (await apiGet<Data<Client[]>>("clients", { locale, tags: ["clients"] }))?.data ?? [];
}

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  return (await apiGet<Data<Testimonial[]>>("testimonials", { locale, tags: ["testimonials"] }))?.data ?? [];
}

export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  return (await apiGet<Data<TeamMember[]>>("team", { locale, tags: ["team"] }))?.data ?? [];
}

export async function getHighlights(locale: Locale, group: HighlightGroup): Promise<Highlight[]> {
  return (await apiGet<Data<Highlight[]>>("highlights", { locale, query: { group }, tags: ["highlights"] }))?.data ?? [];
}

export async function getFaqs(locale: Locale, category?: string): Promise<Faq[]> {
  return (await apiGet<Data<Faq[]>>("faqs", { locale, query: { category }, tags: ["faqs"] }))?.data ?? [];
}

export async function getRedirects(): Promise<RedirectRule[]> {
  return (await apiGet<Data<RedirectRule[]>>("redirects", { locale: "en", tags: ["redirects"] }))?.data ?? [];
}
