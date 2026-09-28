"use client";

import { AnimatePresence, motion } from "motion/react";
import type { FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Honeypot, SelectField, TextAreaField, TextField } from "./fields";
import { SubmitButton } from "./SubmitButton";
import { SuccessState } from "./SuccessState";
import { useFormSubmit } from "./useFormSubmit";

type Props = {
  locale: string;
  labels: Dictionary["form"];
  serviceOptions: string[];
  budgetOptions: string[];
};

export function ContactForm({ locale, labels, serviceOptions, budgetOptions }: Props) {
  const { status, errors, formError, submit, reset } = useFormSubmit(
    "contact",
    { generic: labels.errorGeneric, rateLimit: labels.errorRateLimit },
    locale,
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (await submit(new FormData(form))) form.reset();
  }

  const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <SuccessState key="success" title={labels.successTitle} text={labels.successContact} actionLabel={labels.sendAnother} onAction={reset} />
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          className="relative grid gap-10 md:grid-cols-2"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Honeypot />
          <TextField label={labels.name} name="name" autoComplete="name" required minLength={2} maxLength={120} error={errors.name} />
          <TextField label={labels.email} name="email" type="email" autoComplete="email" required maxLength={190} error={errors.email} />
          <TextField
            label={labels.phone}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            dir="ltr"
            optionalLabel={labels.optional}
            error={errors.phone}
          />
          <TextField label={labels.company} name="company" autoComplete="organization" maxLength={150} optionalLabel={labels.optional} error={errors.company} />
          {serviceOptions.length > 0 && (
            <SelectField
              label={labels.service}
              name="service"
              placeholder={labels.selectOption}
              options={toOptions(serviceOptions)}
              optionalLabel={labels.optional}
              error={errors.service}
            />
          )}
          {budgetOptions.length > 0 && (
            <SelectField
              label={labels.budget}
              name="budget"
              placeholder={labels.selectOption}
              options={toOptions(budgetOptions)}
              optionalLabel={labels.optional}
              error={errors.budget}
            />
          )}
          <TextAreaField
            label={labels.message}
            name="message"
            required
            minLength={10}
            maxLength={5000}
            className="md:col-span-2"
            error={errors.message}
          />
          <div className="flex flex-col items-start gap-4 md:col-span-2">
            {formError && (
              <p role="alert" className="text-sm text-red-300">
                {formError}
              </p>
            )}
            <SubmitButton label={labels.submit} busyLabel={labels.sending} busy={status === "submitting"} />
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
