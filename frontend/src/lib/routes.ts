import { isLocale, type Locale } from "@/lib/i18n/config";

export const routes = {
  home: "/",
  about: "/about",
  services: "/our-services",
  service: (slug: string) => `/services/${slug}`,
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}`,
  clients: "/our-clients",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  career: "/career",
  job: (slug: string) => `/career/${slug}`,
  jobApply: (slug?: string) => (slug ? `/job-apply?job=${encodeURIComponent(slug)}` : "/job-apply"),
  contact: "/contact",
  privacy: "/privacy-policy",
} as const;

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export const isExternal = (href: string) => /^(?:https?:)?\/\//i.test(href);

/**
 * Prefixes an internal path with the locale. CMS-provided URLs such as "/contact" become "/en/contact";
 * absolute URLs, mailto:, tel: and anchors are returned untouched.
 */
export function localizeHref(locale: Locale, href: string): string {
  if (!href || EXTERNAL.test(href)) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  const first = path.split(/[/?#]/)[1];
  if (isLocale(first)) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Swaps the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter((s, i) => i === 0 || s !== "");
  if (isLocale(segments[1])) segments[1] = target;
  else segments.splice(1, 0, target);
  return segments.join("/");
}
