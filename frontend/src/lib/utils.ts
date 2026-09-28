import { clsx, type ClassValue } from "clsx";
import type { Locale } from "@/lib/i18n/config";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export const pad = (n: number) => String(n).padStart(2, "0");

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsappHref = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

export function youtubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export const isVideoFile = (url: string | null | undefined) => !!url && /\.(mp4|webm|mov)(\?|$)/i.test(url);
