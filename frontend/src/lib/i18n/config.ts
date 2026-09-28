export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

export const directionOf = (locale: Locale): "ltr" | "rtl" => (locale === "ar" ? "rtl" : "ltr");

export const localeNames: Record<Locale, string> = { en: "English", ar: "العربية" };

export const ogLocale: Record<Locale, string> = { en: "en_US", ar: "ar_EG" };
