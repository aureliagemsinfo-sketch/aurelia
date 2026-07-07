"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { LuxurySelect } from "@/components/shared/LuxurySelect";
import { submitContactForm, type PublicFormState } from "@/server/actions/public/forms";

const fieldClass = "form-control text-[0.95rem]";
const initialState: PublicFormState = { status: "idle" };
const subjectOptions = [
  "Collection Enquiry",
  "Gemstone Consultation",
  "Bespoke Commission",
  "Jewellery Care",
  "General Enquiry",
].map((label) => ({ label, value: label }));

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="form-action min-h-12 w-full border border-charcoal px-8 text-[0.72rem] uppercase tracking-[0.24em] transition-colors hover:bg-charcoal hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? "Sending" : "Send Message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const [subject, setSubject] = useState("");

  if (state.status === "success") {
    return <p className="border border-champagne/55 bg-soft-cream px-6 py-10 text-center font-serif text-2xl" role="status">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-7 border border-soft-border bg-porcelain/72 p-5 shadow-[0_24px_70px_rgb(23_20_17_/_0.045)] sm:p-7 lg:p-9">
      <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
      <label className="block text-xs uppercase tracking-[0.16em]">Name<input autoComplete="name" className={fieldClass} name="name" required type="text" /></label>
      {state.fieldErrors?.name ? <p className="-mt-5 text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.name[0]}</p> : null}
      <label className="block text-xs uppercase tracking-[0.16em]">Email<input autoComplete="email" className={fieldClass} name="email" required type="email" /></label>
      {state.fieldErrors?.email ? <p className="-mt-5 text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.email[0]}</p> : null}
      <div className="block text-xs uppercase tracking-[0.16em]">
        <span>Subject</span>
        <LuxurySelect
          ariaLabel="Subject"
          error={state.fieldErrors?.subject?.[0]}
          name="subject"
          onChange={setSubject}
          options={subjectOptions}
          placeholder="Select a subject"
          required
          value={subject}
        />
      </div>
      <label className="block text-xs uppercase tracking-[0.16em]">Message<textarea autoComplete="off" className={`${fieldClass} min-h-36`} name="message" required /></label>
      {state.fieldErrors?.message ? <p className="-mt-5 text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.message[0]}</p> : null}
      <SubmitButton />
      {state.status === "error" ? <p className="text-sm leading-6 text-ruby" role="alert">{state.message}</p> : null}
    </form>
  );
}
