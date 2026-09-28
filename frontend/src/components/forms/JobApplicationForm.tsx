"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import type { JobFormField, JobFormFieldMode, JobPosting } from "@/lib/api/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CvDropzone } from "./CvDropzone";
import { Honeypot, SelectField, TextAreaField, TextField } from "./fields";
import { SubmitButton } from "./SubmitButton";
import { SuccessState } from "./SuccessState";
import { useFormSubmit } from "./useFormSubmit";

type Props = {
  locale: string;
  labels: Dictionary["form"];
  jobs: JobPosting[];
  selectedJob?: string;
  fields: Record<JobFormField, JobFormFieldMode>;
  englishLevels: string[];
  sourceOptions: string[];
  privacyHref: string;
};

export function JobApplicationForm({ locale, labels, jobs, selectedJob, fields, englishLevels, sourceOptions, privacyHref }: Props) {
  const { status, errors, formError, submit, setErrors } = useFormSubmit(
    "job-applications",
    { generic: labels.errorGeneric, rateLimit: labels.errorRateLimit },
    locale,
  );
  const [job, setJob] = useState(selectedJob && jobs.some((j) => j.slug === selectedJob) ? selectedJob : "");

  const mode = (field: JobFormField) => fields[field] ?? "optional";
  const shown = (field: JobFormField) => mode(field) !== "hidden";
  const req = (field: JobFormField) => mode(field) === "required";
  const opt = (field: JobFormField) => (req(field) ? undefined : labels.optional);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!(data.get("cv") instanceof File) || !(data.get("cv") as File).size) {
      setErrors({ cv: labels.errorRequired });
      return;
    }
    if (await submit(data)) form.reset();
  }

  const options = (values: string[]) => values.map((v) => ({ value: v, label: v }));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <SuccessState key="success" title={labels.successTitle} text={labels.successApplication} />
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          encType="multipart/form-data"
          className="relative grid gap-10 md:grid-cols-2"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Honeypot />

          {jobs.length > 0 && (
            <SelectField
              label={labels.position}
              name="job_slug"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder={labels.selectOption}
              options={jobs.map((j) => ({ value: j.slug, label: j.title ?? j.slug }))}
              className="md:col-span-2"
              optionalLabel={labels.optional}
              error={errors.job_slug}
            />
          )}
          {!job && (
            <TextField
              label={labels.position}
              name="position"
              placeholder={labels.positionPlaceholder}
              required
              maxLength={150}
              className="md:col-span-2"
              error={errors.position}
            />
          )}

          <TextField label={labels.firstName} name="first_name" autoComplete="given-name" required minLength={2} maxLength={80} error={errors.first_name} />
          <TextField label={labels.lastName} name="last_name" autoComplete="family-name" required minLength={2} maxLength={80} error={errors.last_name} />
          <TextField label={labels.email} name="email" type="email" autoComplete="email" required maxLength={190} error={errors.email} />
          <TextField label={labels.phone} name="phone" type="tel" autoComplete="tel" required maxLength={30} dir="ltr" error={errors.phone} />

          {shown("city") && (
            <TextField label={labels.city} name="city" autoComplete="address-level2" required={req("city")} optionalLabel={opt("city")} maxLength={100} error={errors.city} />
          )}
          {shown("country") && (
            <TextField label={labels.country} name="country" autoComplete="country-name" required={req("country")} optionalLabel={opt("country")} maxLength={100} error={errors.country} />
          )}
          {shown("portfolio_url") && (
            <TextField label={labels.portfolioUrl} name="portfolio_url" type="url" dir="ltr" required={req("portfolio_url")} optionalLabel={opt("portfolio_url")} maxLength={255} placeholder="https://" error={errors.portfolio_url} />
          )}
          {shown("linkedin_url") && (
            <TextField label={labels.linkedinUrl} name="linkedin_url" type="url" dir="ltr" required={req("linkedin_url")} optionalLabel={opt("linkedin_url")} maxLength={255} placeholder="https://www.linkedin.com/in/" error={errors.linkedin_url} />
          )}
          {shown("expected_salary") && (
            <TextField label={labels.expectedSalary} name="expected_salary" required={req("expected_salary")} optionalLabel={opt("expected_salary")} maxLength={60} error={errors.expected_salary} />
          )}
          {shown("available_from") && (
            <TextField label={labels.availableFrom} name="available_from" type="date" min={today} required={req("available_from")} optionalLabel={opt("available_from")} error={errors.available_from} />
          )}
          {shown("english_level") && englishLevels.length > 0 && (
            <SelectField label={labels.englishLevel} name="english_level" placeholder={labels.selectOption} options={options(englishLevels)} required={req("english_level")} optionalLabel={opt("english_level")} error={errors.english_level} />
          )}
          {shown("source") && sourceOptions.length > 0 && (
            <SelectField label={labels.source} name="source" placeholder={labels.selectOption} options={options(sourceOptions)} required={req("source")} optionalLabel={opt("source")} error={errors.source} />
          )}
          {shown("message") && (
            <TextAreaField label={labels.coverLetter} name="message" required={req("message")} optionalLabel={opt("message")} maxLength={5000} className="md:col-span-2" error={errors.message} />
          )}

          <div className="md:col-span-2">
            <CvDropzone
              label={labels.cv}
              hint={labels.cvHint}
              chooseLabel={labels.cvChoose}
              replaceLabel={labels.cvReplace}
              error={errors.cv}
              messages={{ type: labels.errorFileType, size: labels.errorFileSize }}
              onValidate={(message) => setErrors((prev) => {
                const next = { ...prev };
                if (message) next.cv = message;
                else delete next.cv;
                return next;
              })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-start gap-4 text-paper/70">
              <input type="checkbox" name="consent" value="1" required className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-lavender)]" aria-invalid={!!errors.consent} />
              <span>
                {labels.consent}{" "}
                <Link href={privacyHref} className="text-lavender underline underline-offset-4" target="_blank">
                  {labels.privacyLink}
                </Link>
              </span>
            </label>
            {errors.consent && (
              <p role="alert" className="mt-2 text-sm text-red-300">
                {errors.consent}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 md:col-span-2">
            {formError && (
              <p role="alert" className="text-sm text-red-300">
                {formError}
              </p>
            )}
            <SubmitButton label={labels.submitApplication} busyLabel={labels.sending} busy={status === "submitting"} />
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
