"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = { locale: Locale; label: string; className?: string };

function Links({ locale, label, className }: Props) {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1 text-xs font-semibold uppercase", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="opacity-30">/</span>}
          <Link
            href={`${switchLocalePath(pathname, l)}${search ? `?${search}` : ""}`}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={cn("px-1 py-1 transition-colors", l === locale ? "text-lavender" : "opacity-60 hover:opacity-100")}
            title={localeNames[l]}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export function LanguageSwitcher(props: Props) {
  return (
    <Suspense fallback={<div className={cn("h-6 w-14", props.className)} />}>
      <Links {...props} />
    </Suspense>
  );
}
