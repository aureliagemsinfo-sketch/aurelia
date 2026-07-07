"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  submitCollectionEnquiry,
  submitGemstoneEnquiry,
  submitProductEnquiry,
  type PublicFormState,
} from "@/server/actions/public/forms";

type ItemEnquiryFormProps = {
  itemName: string;
  itemSlug: string;
  itemType: "product" | "gemstone" | "collection";
};

const initialState: PublicFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="form-action min-h-12 w-full border border-charcoal bg-charcoal px-7 text-[0.68rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-transparent hover:text-charcoal disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? "Sending" : "Send Enquiry"}
    </button>
  );
}

function actionForType(itemType: ItemEnquiryFormProps["itemType"]) {
  if (itemType === "gemstone") return submitGemstoneEnquiry;
  if (itemType === "collection") return submitCollectionEnquiry;
  return submitProductEnquiry;
}

export function ItemEnquiryForm({ itemName, itemSlug, itemType }: ItemEnquiryFormProps) {
  const [state, formAction] = useActionState(actionForType(itemType), initialState);

  if (state.status === "success") {
    return (
      <p className="mx-auto mt-9 max-w-2xl border border-champagne/55 bg-ivory px-6 py-7 text-center font-serif text-2xl" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mx-auto mt-9 grid max-w-4xl gap-4 border border-soft-border bg-porcelain/76 p-5 text-left shadow-[0_22px_70px_rgb(23_20_17_/_0.04)] sm:grid-cols-2 sm:p-6">
      <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
      <input name="itemName" type="hidden" value={itemName} />
      <input name="itemSlug" type="hidden" value={itemSlug} />
      <label className="text-xs uppercase tracking-[0.16em]">
        Name
        <input autoComplete="name" className="form-control text-[0.95rem]" name="name" required type="text" />
        {state.fieldErrors?.name ? <span className="mt-2 block text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.name[0]}</span> : null}
      </label>
      <label className="text-xs uppercase tracking-[0.16em]">
        Email
        <input autoComplete="email" className="form-control text-[0.95rem]" name="email" required type="email" />
        {state.fieldErrors?.email ? <span className="mt-2 block text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.email[0]}</span> : null}
      </label>
      <label className="text-xs uppercase tracking-[0.16em]">
        Phone
        <input autoComplete="tel" className="form-control text-[0.95rem]" name="phone" type="tel" />
      </label>
      <label className="text-xs uppercase tracking-[0.16em] sm:col-span-2">
        Message
        <textarea autoComplete="off" className="form-control min-h-28 text-[0.95rem]" name="message" required defaultValue={`I would like to enquire about ${itemName}.`} />
        {state.fieldErrors?.message ? <span className="mt-2 block text-[0.68rem] tracking-[0.08em] text-ruby">{state.fieldErrors.message[0]}</span> : null}
      </label>
      <div className="sm:col-span-2">
        <SubmitButton />
        {state.status === "error" ? <p className="mt-4 text-sm leading-6 text-ruby" role="alert">{state.message}</p> : null}
      </div>
    </form>
  );
}
