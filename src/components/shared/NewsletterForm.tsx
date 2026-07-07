"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { subscribeNewsletter, type PublicFormState } from "@/server/actions/public/forms";

const initialState: PublicFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="form-action min-h-12 w-full border border-charcoal px-8 text-[0.72rem] uppercase tracking-[0.24em] transition-colors hover:bg-charcoal hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? "Subscribing" : "Subscribe"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);

  return (
    <form action={formAction} className="mx-auto mt-9 max-w-2xl">
      <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
      <input name="source" type="hidden" value="homepage-footer" />
      <label className="sr-only" htmlFor="newsletter-email">
        Email Address
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <input
          autoComplete="email"
          className="form-control flex-1 text-[0.95rem]"
          id="newsletter-email"
          name="email"
          placeholder="Email Address"
          required
          type="email"
        />
        <SubmitButton />
      </div>
      {state.message ? (
        <p
          className={`mt-4 text-sm leading-6 ${state.status === "error" ? "text-ruby" : "text-charcoal/58"}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
