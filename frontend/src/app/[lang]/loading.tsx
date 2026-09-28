import { LogoMark } from "@/components/ui/LogoMark";

export default function Loading() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center" role="status" aria-live="polite">
      <span className="logo-loop text-paper">
        <LogoMark className="h-16 w-auto md:h-20" />
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
