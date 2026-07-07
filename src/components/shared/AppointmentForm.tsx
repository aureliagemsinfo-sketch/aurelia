"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { LuxuryDatePicker } from "@/components/shared/LuxuryDatePicker";
import { LuxurySelect } from "@/components/shared/LuxurySelect";
import { submitAppointmentRequest, type PublicFormState } from "@/server/actions/public/forms";

const fieldClass = "form-control text-[0.95rem]";
const initialState: PublicFormState = { status: "idle" };
const locationOptions = ["Dubai", "Geneva, Switzerland"].map((label) => ({ label, value: label }));
const interestOptions = ["High Jewellery", "Fine Jewellery", "Bridal", "Rare Gemstones", "Bespoke Design", "Jewellery Care"].map((label) => ({ label, value: label }));
const timeOptions = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((label) => ({ label, value: label }));

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="form-action min-h-12 w-full border border-charcoal px-8 text-[0.72rem] uppercase tracking-[0.24em] transition-colors hover:bg-charcoal hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? "Requesting" : "Request Appointment"}
    </button>
  );
}

export function AppointmentForm() {
  const [state, formAction] = useActionState(submitAppointmentRequest, initialState);
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  if (state.status === "success") {
    return (
      <div className="border border-champagne/55 bg-soft-cream px-6 py-12 text-center" role="status">
        <p className="text-[0.62rem] uppercase tracking-[0.28em] text-charcoal/48">Request Received</p>
        <p className="mt-4 font-serif text-3xl">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-x-8 gap-y-7 border border-soft-border bg-porcelain/72 p-5 shadow-[0_24px_70px_rgb(23_20_17_/_0.045)] sm:grid-cols-2 sm:p-7 lg:p-9">
      <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
      <label className="text-xs uppercase tracking-[0.16em]">Name<input autoComplete="name" className={fieldClass} name="name" required type="text" /></label>
      {state.fieldErrors?.name ? <p className="-mt-5 text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.name[0]}</p> : null}
      <label className="text-xs uppercase tracking-[0.16em]">Email<input autoComplete="email" className={fieldClass} name="email" required type="email" /></label>
      {state.fieldErrors?.email ? <p className="-mt-5 text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.email[0]}</p> : null}
      <label className="text-xs uppercase tracking-[0.16em]">Phone<input autoComplete="tel" className={fieldClass} name="phone" type="tel" /></label>
      <div className="text-xs uppercase tracking-[0.16em]">
        <span>Preferred Location</span>
        <LuxurySelect
          ariaLabel="Preferred Location"
          error={state.fieldErrors?.location?.[0]}
          name="location"
          onChange={setLocation}
          options={locationOptions}
          placeholder="Select a salon"
          required
          value={location}
        />
      </div>
      <div className="text-xs uppercase tracking-[0.16em]">
        <span>Preferred Date</span>
        <LuxuryDatePicker
          ariaLabel="Preferred Date"
          error={state.fieldErrors?.preferredDate?.[0]}
          name="preferredDate"
          onChange={setPreferredDate}
          placeholder="Select a date"
          value={preferredDate}
        />
      </div>
      <div className="text-xs uppercase tracking-[0.16em]">
        <span>Preferred Time</span>
        <LuxurySelect
          ariaLabel="Preferred Time"
          error={state.fieldErrors?.preferredTime?.[0]}
          name="preferredTime"
          onChange={setPreferredTime}
          options={timeOptions}
          placeholder="Select a time"
          value={preferredTime}
        />
      </div>
      <div className="text-xs uppercase tracking-[0.16em] sm:col-span-2">
        <span>Interest</span>
        <LuxurySelect
          ariaLabel="Interest"
          error={state.fieldErrors?.interest?.[0]}
          name="interest"
          onChange={setInterest}
          options={interestOptions}
          placeholder="Select your interest"
          required
          value={interest}
        />
      </div>
      <label className="text-xs uppercase tracking-[0.16em] sm:col-span-2">Message<textarea autoComplete="off" className={`${fieldClass} min-h-32`} name="message" /></label>
      <div className="sm:col-span-2">
        <SubmitButton />
        {state.status === "error" ? <p className="mt-4 text-sm leading-6 text-ruby" role="alert">{state.message}</p> : null}
      </div>
    </form>
  );
}
