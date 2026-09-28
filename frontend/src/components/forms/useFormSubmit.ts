"use client";

import { useState } from "react";

export type FieldErrors = Record<string, string>;

type Status = "idle" | "submitting" | "success" | "error";

type Messages = { generic: string; rateLimit: string };

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/**
 * Posts multipart form data straight to the Laravel API (CORS + per-IP rate limiting live there)
 * and maps 422 validation errors onto field names.
 */
export function useFormSubmit(endpoint: string, messages: Messages, locale: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(data: FormData) {
    setStatus("submitting");
    setErrors({});
    setFormError(null);

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json", "Accept-Language": locale },
      });

      if (res.ok) {
        setStatus("success");
        return true;
      }

      if (res.status === 422) {
        const json = (await res.json()) as { errors?: Record<string, string[]> };
        const mapped: FieldErrors = {};
        for (const [key, value] of Object.entries(json.errors ?? {})) mapped[key] = value[0] ?? messages.generic;
        setErrors(mapped);
        setFormError(mapped.website ? messages.generic : null);
      } else {
        setFormError(res.status === 429 ? messages.rateLimit : messages.generic);
      }
    } catch {
      setFormError(messages.generic);
    }

    setStatus("error");
    return false;
  }

  const reset = () => {
    setStatus("idle");
    setErrors({});
    setFormError(null);
  };

  return { status, errors, formError, submit, reset, setErrors };
}
