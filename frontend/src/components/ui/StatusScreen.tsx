import type { ReactNode } from "react";

type Props = { code: string; title: string; text: string; children?: ReactNode };

export function StatusScreen({ code, title, text, children }: Props) {
  return (
    <section className="container-site relative flex min-h-[80vh] flex-col justify-center pt-[var(--header-h)]">
      <p aria-hidden className="text-display-2xl text-lavender/90">
        {code}
      </p>
      <h1 className="text-display-md mt-6">{title}</h1>
      <p className="mt-4 max-w-xl text-lg text-paper/60">{text}</p>
      {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
    </section>
  );
}
