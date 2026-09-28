import type { ReactNode } from "react";

export function EmptyState({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-8 rounded-2xl border border-dashed border-line p-10 md:p-16">
      <p className="max-w-2xl font-display text-2xl leading-snug text-paper/70 md:text-3xl">{text}</p>
      {children && <div className="flex flex-wrap gap-4">{children}</div>}
    </div>
  );
}
