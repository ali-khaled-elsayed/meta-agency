"use client";

import "./globals.css";

/** Last-resort boundary for failures in the root layout itself (e.g. the API being unreachable). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center bg-ink text-paper">
        <main className="container-site">
          <p className="text-eyebrow text-lavender">Meta Egypt Agency</p>
          <h1 className="text-display-lg mt-6">Something went wrong.</h1>
          <p className="mt-4 max-w-xl text-lg text-paper/60">
            We&apos;re having trouble loading the site right now. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-10 rounded-full bg-lavender px-7 py-4 text-sm font-semibold text-ink"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
