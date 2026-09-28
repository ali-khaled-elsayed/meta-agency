"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Common = { label: string; error?: string; hint?: string; optionalLabel?: string; className?: string };

const control =
  "peer block w-full border-0 border-b border-line bg-transparent px-0 py-4 text-lg text-paper placeholder:text-paper/30 transition-colors focus:border-lavender focus:outline-none focus:ring-0 aria-[invalid=true]:border-red-400";

function Wrapper({
  id,
  label,
  error,
  hint,
  required,
  optionalLabel,
  className,
  children,
}: Common & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={cn("group relative", className)}>
      <label
        htmlFor={id}
        className="text-eyebrow flex items-center gap-2 text-paper/60 transition-[color,translate] duration-500 ease-[var(--ease-expo)] group-focus-within:translate-x-1 group-focus-within:text-lavender rtl:group-focus-within:-translate-x-1"
      >
        {label}
        {required ? (
          <span aria-hidden className="text-lavender">*</span>
        ) : (
          optionalLabel && <span className="normal-case tracking-normal text-paper/30">({optionalLabel})</span>
        )}
      </label>
      <div className="relative">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-lavender transition-transform duration-700 ease-[var(--ease-expo)] group-focus-within:scale-x-100 rtl:origin-right"
        />
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-paper/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function TextField({ label, error, hint, optionalLabel, className, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={props.required} optionalLabel={optionalLabel} className={className}>
      <input id={id} className={control} aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...props} />
    </Wrapper>
  );
}

export function TextAreaField({ label, error, hint, optionalLabel, className, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={props.required} optionalLabel={optionalLabel} className={className}>
      <textarea
        id={id}
        rows={5}
        className={cn(control, "resize-y")}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  optionalLabel,
  className,
  options,
  placeholder,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder: string }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={props.required} optionalLabel={optionalLabel} className={className}>
      <select
        id={id}
        className={cn(control, "cursor-pointer appearance-none bg-[length:1rem] bg-[position:right_center] bg-no-repeat rtl:bg-[position:left_center] [&>option]:bg-ink")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23bba9ff' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

/** Off-screen honeypot: bots fill it, the API rejects any submission where it is present. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
