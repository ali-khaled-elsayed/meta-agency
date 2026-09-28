import "server-only";
import type { Metadata } from "next";
import { getPage, getSettings } from "@/lib/api/endpoints";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

/** Metadata for a CMS-managed static page (about, contact, ...), with a dictionary fallback title. */
export async function cmsPageMetadata(locale: Locale, slug: string, path: string, fallbackTitle: string): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(locale), getPage(locale, slug)]);
  return buildMetadata({
    locale,
    path,
    settings,
    title: page?.title ?? fallbackTitle,
    description: page?.intro,
    image: page?.hero_image,
    seo: page?.seo,
  });
}

/** Wraps generateStaticParams so a build never fails just because the API is unreachable. */
export async function safeStaticParams<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch {
    return [];
  }
}
