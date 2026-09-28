import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";

/** Resolves and validates the `[lang]` segment, 404-ing on anything unsupported. */
export async function resolveLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export async function resolveParams<T extends { lang: string }>(params: Promise<T>): Promise<Omit<T, "lang"> & { locale: Locale }> {
  const { lang, ...rest } = await params;
  if (!isLocale(lang)) notFound();
  return { ...rest, locale: lang };
}
