import { Counter } from "@/lib/animations/Counter";
import type { Statistic } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { StatOrb } from "./StatOrb";

/** Statistics as scroll-driven circles, the middle one set lower so they swell and shrink in a wave. */
export function StatsGrid({ stats, locale, className }: { stats: Statistic[]; locale: Locale; className?: string }) {
  if (stats.length === 0) return null;
  return (
    <section className={cn("grid justify-items-center gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-12", className)}>
      {stats.map((stat, i) => (
        <StatOrb key={stat.id} className={cn("w-full max-w-[20rem] sm:max-w-none", i % 2 === 1 && "sm:mt-24")}>
          <Counter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            locale={locale}
            className="font-display text-5xl font-bold tracking-tight text-lavender transition-colors duration-500 group-hover:text-ink md:text-6xl lg:text-7xl"
          />
          <p className="mt-3 text-sm text-paper/60 transition-colors duration-500 group-hover:text-ink/70 md:text-base">{stat.label}</p>
        </StatOrb>
      ))}
    </section>
  );
}
