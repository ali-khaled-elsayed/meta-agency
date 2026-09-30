"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  window.setTimeout(() => root.classList.remove("theme-switching"), 500);
}

type Props = { labels: { light: string; dark: string }; className?: string };

export function ThemeToggle({ labels, className }: Props) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={() => applyTheme(light ? "dark" : "light")}
      aria-label={light ? labels.dark : labels.light}
      title={light ? labels.dark : labels.light}
      className={cn(
        "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line text-paper transition-colors hover:border-lavender hover:text-lavender",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "absolute h-[18px] w-[18px] transition-[rotate,scale,opacity] duration-500 ease-[var(--ease-expo)]",
          light ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "absolute h-[18px] w-[18px] transition-[rotate,scale,opacity] duration-500 ease-[var(--ease-expo)]",
          light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
    </button>
  );
}
