/** Circular text badge that slowly rotates around a down arrow, pointing at the content below the hero. */
export function ScrollBadge({ label }: { label: string }) {
  const text = `${label} • ${label} • `;
  return (
    <a
      href="#main-content"
      aria-label={label}
      className="group relative flex h-28 w-28 shrink-0 items-center justify-center md:h-32 md:w-32"
    >
      <svg viewBox="0 0 120 120" className="badge-spin absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-paper/70 font-display text-[10.5px] font-semibold uppercase tracking-[0.28em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lavender text-ink transition-transform duration-500 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </span>
    </a>
  );
}
