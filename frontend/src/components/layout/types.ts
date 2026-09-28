import type { Locale } from "@/lib/i18n/config";
import type { SocialLink } from "@/lib/api/types";

export type NavItem = { label: string; href: string };

export type HeaderProps = {
  locale: Locale;
  siteName: string;
  logo: string | null;
  homeHref: string;
  nav: NavItem[];
  cta: NavItem;
  email: string | null;
  phone: string | null;
  socials: SocialLink[];
  labels: { menu: string; close: string; switchLanguage: string; primary: string };
};
