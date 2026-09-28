import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import type { RedirectRule } from "@/lib/api/types";

export type RedirectDecision = { location: string; status: 301 | 302 | 307 } | null;

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path).toLowerCase();

export function preferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const first = acceptLanguage.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return isLocale(first) ? first : defaultLocale;
}

/**
 * Decides where a request should go:
 * - CMS-managed legacy paths (with or without a locale prefix) go to their mapped destination;
 * - the bare root goes to the visitor's preferred locale (temporary, so caches don't pin a language);
 * - any other un-prefixed path is a legacy URL and permanently moves under the default locale.
 */
export function resolveRedirect(pathname: string, rules: RedirectRule[], acceptLanguage: string | null): RedirectDecision {
  const segments = pathname.split("/");
  const hasLocale = isLocale(segments[1]);
  const locale: Locale = hasLocale ? (segments[1] as Locale) : defaultLocale;
  const rest = hasLocale ? `/${segments.slice(2).join("/")}` : pathname;

  const rule = rules.find((r) => normalize(r.from_path) === normalize(rest));
  if (rule) {
    const target = /^https?:\/\//i.test(rule.to_path)
      ? rule.to_path
      : `/${locale}${rule.to_path === "/" ? "" : rule.to_path}`;
    return { location: target, status: rule.status_code };
  }

  if (hasLocale) return null;
  if (pathname === "/") return { location: `/${preferredLocale(acceptLanguage)}`, status: 307 };
  return { location: `/${defaultLocale}${pathname}`, status: 301 };
}
