"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_EXTENSIONS = ["pdf", "doc", "docx"];

type Props = {
  label: string;
  hint: string;
  chooseLabel: string;
  replaceLabel: string;
  error?: string;
  onValidate: (message: string | null) => void;
  messages: { type: string; size: string };
};

/** File input with drag-and-drop. Client checks are a courtesy; the API re-validates type, content and size. */
export function CvDropzone({ label, hint, chooseLabel, replaceLabel, error, onValidate, messages }: Props) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const check = (f: File | undefined | null) => {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!CV_EXTENSIONS.includes(ext)) return onValidate(messages.type);
    if (f.size > CV_MAX_BYTES) return onValidate(messages.size);
    onValidate(null);
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && input.current) {
      const dt = new DataTransfer();
      dt.items.add(f);
      input.current.files = dt.files;
      check(f);
    }
  };

  return (
    <div>
      <p className="text-eyebrow flex items-center gap-2 text-paper/60">
        {label} <span aria-hidden className="text-lavender">*</span>
      </p>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-lavender bg-lavender/10" : "border-line hover:border-lavender/60",
          error && "border-red-400",
        )}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-lavender" fill="none" aria-hidden>
          <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-semibold">{file ? file.name : chooseLabel}</span>
        <span className="text-sm text-paper/50">{file ? replaceLabel : hint}</span>
        <input
          ref={input}
          id={id}
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => check(e.target.files?.[0])}
        />
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
