"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Client } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

function toRows<T>(items: T[], cols: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0, r = 0; i < items.length; r++) {
    const size = r % 2 === 0 ? cols : cols - 1;
    rows.push(items.slice(i, i + size));
    i += size;
  }
  return rows;
}

function Hex({ client, delay, index }: { client: Client; delay: number; index: number }) {
  const reduce = useReducedMotion();
  const content = client.logo ? (
    <Image
      src={client.logo}
      alt={client.name ?? ""}
      width={200}
      height={100}
      sizes="(min-width: 768px) 14vw, 26vw"
      className="h-auto max-h-[50%] w-auto max-w-[72%] object-contain opacity-90 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
    />
  ) : (
    <span className="px-4 text-center font-display text-sm font-extrabold md:text-lg">{client.name}</span>
  );
  const angle = index * 2.39996 + 0.6;

  return (
    <motion.li
      className="w-[var(--hex)] shrink-0"
      variants={{
        hidden: {
          opacity: 0,
          scale: 0.5,
          rotate: index % 2 === 0 ? -120 : 120,
          x: `${Math.round(Math.cos(angle) * 70)}vw`,
          y: `${Math.round(Math.sin(angle) * 80)}vh`,
        },
        shown: { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 },
      }}
      transition={reduce ? { duration: 0 } : { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="bubble-float" style={{ "--i": index % 5 } as CSSProperties}>
        <div
          className="group relative aspect-[1/1.1547] bg-lavender/45 transition-colors duration-500 hover:bg-lavender"
          style={{ clipPath: HEX }}
        >
          <div
            className="absolute inset-[3px] flex items-center justify-center bg-ink-2 transition-colors duration-500 group-hover:bg-ink-3"
            style={{ clipPath: HEX }}
          >
            {client.website_url ? (
              <a
                href={client.website_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name ?? undefined}
                className="flex h-full w-full items-center justify-center"
              >
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function Comb({ clients, cols, className }: { clients: Client[]; cols: number; className?: string }) {
  const rows = toRows(clients, cols);
  let index = 0;
  return (
    <motion.div
      className={cn("[--gap:0.75rem] md:[--gap:1.25rem]", className)}
      style={{ "--hex": `calc((100% - ${cols - 1} * var(--gap)) / ${cols})` } as CSSProperties}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {rows.map((row, r) => {
        const empty = (r % 2 === 0 ? cols : cols - 1) - row.length;
        const lead = Math.floor(empty / 2);
        const spacers = (n: number, side: string) =>
          Array.from({ length: n }, (_, k) => <li key={`${side}${k}`} aria-hidden className="w-[var(--hex)] shrink-0" />);
        return (
          <ul
            key={r}
            className="flex justify-center gap-[var(--gap)]"
            style={r > 0 ? { marginTop: `calc((100% - ${cols - 1} * var(--gap)) / ${cols} * -0.2887 + var(--gap) * 0.866)` } : undefined}
          >
            {spacers(lead, "l")}
            {row.map((client, c) => {
              const delay = 0.9 + r * 0.18 + Math.abs(c - (row.length - 1) / 2) * 0.12;
              return <Hex key={client.id} client={client} delay={delay} index={index++} />;
            })}
            {spacers(empty - lead, "r")}
          </ul>
        );
      })}
    </motion.div>
  );
}

export function ClientsHoneycomb({ clients }: { clients: Client[] }) {
  return (
    <>
      <Comb clients={clients} cols={3} className="md:hidden" />
      <Comb clients={clients} cols={5} className="mx-auto hidden max-w-5xl md:block" />
    </>
  );
}
