export default function Loading() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-14 w-14 animate-spin rounded-full border-2 border-lavender/15 border-t-lavender border-r-lavender" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
