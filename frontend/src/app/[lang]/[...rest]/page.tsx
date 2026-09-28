import { notFound } from "next/navigation";

/** Renders the localized 404 (inside the site layout) for any unmatched path under a locale. */
export default function CatchAll() {
  notFound();
}
