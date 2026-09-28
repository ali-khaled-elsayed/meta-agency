import { isVideoFile, youtubeEmbed } from "@/lib/utils";

export function VideoEmbed({ url, title }: { url: string | null | undefined; title: string }) {
  if (!url) return null;
  if (isVideoFile(url)) {
    return <video src={url} controls playsInline preload="metadata" className="aspect-video w-full rounded-2xl bg-ink-3" />;
  }
  const embed = youtubeEmbed(url);
  if (!embed) return null;
  return (
    <iframe
      src={embed}
      title={title}
      loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      className="aspect-video w-full rounded-2xl bg-ink-3"
    />
  );
}
