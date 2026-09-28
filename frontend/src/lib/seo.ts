import type { Metadata } from "next";
import { locales, ogLocale, type Locale } from "@/lib/i18n/config";
import type { Seo, SiteSettings } from "@/lib/api/types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type MetaInput = {
  locale: Locale;
  /** Path without locale, e.g. "/about". */
  path: string;
  settings: SiteSettings;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  seo?: Seo | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
};

const localized = (locale: Locale, path: string) => `/${locale}${path === "/" ? "" : path}`;

export function buildMetadata({
  locale,
  path,
  settings,
  title,
  description,
  image,
  seo,
  type = "website",
  publishedTime,
  modifiedTime,
}: MetaInput): Metadata {
  const siteName = settings.site_name ?? "Meta Egypt Agency";
  const finalTitle = seo?.title || title || null;
  const finalDescription = (seo?.description || description || settings.description || "").slice(0, 300) || undefined;
  const ogImage = seo?.image || image || settings.default_og_image || settings.logo || undefined;
  const url = localized(locale, path);

  return {
    title: finalTitle ? { absolute: finalTitle === siteName ? siteName : `${finalTitle} — ${siteName}` } : siteName,
    description: finalDescription,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localized(l, path)])),
        "x-default": localized("en", path),
      },
    },
    openGraph: {
      type,
      url,
      siteName,
      title: finalTitle ?? siteName,
      description: finalDescription,
      locale: ogLocale[locale],
      images: ogImage ? [{ url: ogImage }] : undefined,
      ...(type === "article" ? { publishedTime: publishedTime ?? undefined, modifiedTime: modifiedTime ?? undefined } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: finalTitle ?? siteName,
      description: finalDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: seo?.noindex ? { index: false, follow: true } : undefined,
  };
}

export function organizationJsonLd(settings: SiteSettings, locale: Locale) {
  const primary = settings.offices.find((o) => o.is_primary) ?? settings.offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "MarketingAgency",
    "@id": `${SITE_URL}/#organization`,
    name: settings.site_name,
    description: settings.description,
    url: absoluteUrl(`/${locale}`),
    logo: settings.logo ?? undefined,
    email: settings.contact_email ?? undefined,
    telephone: settings.contact_phone ?? undefined,
    sameAs: settings.social_links.map((s) => s.url),
    address: primary?.address ? { "@type": "PostalAddress", streetAddress: primary.address, addressCountry: "EG" } : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
