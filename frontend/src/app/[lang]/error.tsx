"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { StatusScreen } from "@/components/ui/StatusScreen";
import { isLocale } from "@/lib/i18n/config";
import ar from "@/lib/i18n/dictionaries/ar.json";
import en from "@/lib/i18n/dictionaries/en.json";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ lang: string }>();
  const locale = isLocale(params?.lang) ? params.lang : "en";
  const dict = locale === "ar" ? ar : en;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen code="500" title={dict.errors.errorTitle} text={dict.errors.errorText}>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-lavender px-7 py-4 text-sm font-semibold text-ink transition-colors hover:bg-paper"
      >
        {dict.errors.retry}
      </button>
      <Link
        href={`/${locale}`}
        className="rounded-full border border-line px-7 py-4 text-sm font-semibold transition-colors hover:border-lavender"
      >
        {dict.errors.backHome}
      </Link>
    </StatusScreen>
  );
}
