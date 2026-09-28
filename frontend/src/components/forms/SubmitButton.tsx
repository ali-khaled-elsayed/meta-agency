"use client";

import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SubmitButton({ label, busyLabel, busy, className }: { label: string; busyLabel: string; busy: boolean; className?: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      aria-busy={busy}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full bg-lavender px-8 py-4 text-sm font-semibold text-ink transition-colors hover:bg-paper disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {busy ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden />
          {busyLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </>
      )}
    </button>
  );
}
