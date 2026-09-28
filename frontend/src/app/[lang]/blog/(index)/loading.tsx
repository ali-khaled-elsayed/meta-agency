export default function Loading() {
  return (
    <div className="container-site flex min-h-[70vh] items-center pt-[var(--header-h)]" role="status" aria-live="polite">
      <div className="w-full max-w-3xl space-y-6">
        <div className="h-3 w-32 animate-pulse rounded-full bg-ink-3" />
        <div className="h-16 w-full animate-pulse rounded-2xl bg-ink-3 md:h-24" />
        <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-ink-3 md:h-24" />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
