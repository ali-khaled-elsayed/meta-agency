import type { NavItem } from "@/components/layout/types";
import type { SiteSettings } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref, routes } from "@/lib/routes";

/** Primary navigation. Sections without published content are left out so no link leads to an empty page. */
export function primaryNav(locale: Locale, dict: Dictionary, settings: SiteSettings): NavItem[] {
  const items: (NavItem | false)[] = [
    { label: dict.nav.home, href: routes.home },
    { label: dict.nav.about, href: routes.about },
    settings.services.length > 0 && { label: dict.nav.services, href: routes.services },
    settings.features.projects && { label: dict.nav.work, href: routes.projects },
    settings.features.clients && { label: dict.nav.clients, href: routes.clients },
    settings.features.blog && { label: dict.nav.blog, href: routes.blog },
    { label: dict.nav.career, href: routes.career },
  ];
  return items.filter((i): i is NavItem => !!i).map((i) => ({ ...i, href: localizeHref(locale, i.href) }));
}
