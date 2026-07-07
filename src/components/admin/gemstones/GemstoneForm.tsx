"use client";

import { useActionState } from "react";

import type { GemstoneFormState } from "@/server/actions/admin/gemstones";
import type { AdminGemstone } from "@/server/repositories/gemstones.repo";

type GemstoneFormProps = {
  action: (state: GemstoneFormState, formData: FormData) => Promise<GemstoneFormState>;
  gemstone?: AdminGemstone | null;
  mode: "create" | "edit";
};

const initialState: GemstoneFormState = {
  status: "idle",
};

function listValue(value?: string[] | null) {
  return value?.join("\n") ?? "";
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-2 text-[0.68rem] tracking-[0.08em] text-ruby">{errors[0]}</p>;
}

function TextField({
  errors,
  label,
  name,
  required = false,
  type = "text",
  value,
}: {
  errors?: string[];
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  value?: number | string | null;
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/55" htmlFor={name}>
        {label} {required ? <span className="text-ruby">*</span> : null}
      </label>
      <input
        className="form-control text-[0.95rem]"
        defaultValue={value ?? ""}
        id={name}
        min={type === "number" ? 0 : undefined}
        name={name}
        required={required}
        type={type}
      />
      <FieldError errors={errors} />
    </div>
  );
}

function TextAreaField({
  errors,
  label,
  name,
  required = false,
  rows = 4,
  value,
}: {
  errors?: string[];
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  value?: string | null;
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/55" htmlFor={name}>
        {label} {required ? <span className="text-ruby">*</span> : null}
      </label>
      <textarea className="form-control text-[0.95rem]" defaultValue={value ?? ""} id={name} name={name} required={required} rows={rows} />
      <FieldError errors={errors} />
    </div>
  );
}

export function GemstoneForm({ action, gemstone, mode }: GemstoneFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-9">
      {gemstone ? <input name="id" type="hidden" value={gemstone.id} /> : null}
      {state.status === "error" && state.message ? (
        <p className="border border-ruby/25 bg-ruby/5 px-4 py-3 text-sm text-ruby" role="alert">
          {state.message}
        </p>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <TextField errors={errors.name} label="Name" name="name" required value={gemstone?.name} />
        <TextField errors={errors.slug} label="Slug" name="slug" required value={gemstone?.slug} />
        <TextField errors={errors.type} label="Type" name="type" required value={gemstone?.type} />
        <TextField errors={errors.family} label="Family" name="family" required value={gemstone?.family} />
        <TextField errors={errors.originCountry} label="Origin country" name="originCountry" value={gemstone?.originCountry} />
        <TextField errors={errors.originRegion} label="Origin region" name="originRegion" value={gemstone?.originRegion} />
        <TextField errors={errors.originDisplay} label="Origin display" name="originDisplay" value={gemstone?.originDisplay} />
        <TextField errors={errors.color} label="Colour" name="color" value={gemstone?.color} />
        <TextField errors={errors.rarity} label="Rarity" name="rarity" value={gemstone?.rarity} />
        <TextField errors={errors.caratRange} label="Carat range" name="caratRange" value={gemstone?.caratRange} />
        <TextField errors={errors.priceLabel} label="Price label" name="priceLabel" value={gemstone?.priceLabel} />
        <TextField errors={errors.priceNote} label="Price note" name="priceNote" value={gemstone?.priceNote} />
        <TextField errors={errors.treatment} label="Treatment" name="treatment" value={gemstone?.treatment} />
        <TextField errors={errors.clarity} label="Clarity" name="clarity" value={gemstone?.clarity} />
        <TextField errors={errors.certification} label="Certification" name="certification" value={gemstone?.certification} />
        <TextField errors={errors.inquirySubject} label="Inquiry subject" name="inquirySubject" value={gemstone?.inquirySubject} />
        <TextField errors={errors.sortOrder} label="Display order" name="sortOrder" type="number" value={gemstone?.sortOrder ?? 0} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <TextAreaField errors={errors.shortDescription} label="Short description" name="shortDescription" required value={gemstone?.shortDescription} />
        <TextAreaField errors={errors.longDescription} label="Long description" name="longDescription" rows={6} value={gemstone?.longDescription} />
        <TextAreaField label="Cut options" name="cutOptions" value={listValue(gemstone?.cutOptions)} />
        <TextAreaField label="Highlights" name="highlights" value={listValue(gemstone?.highlights)} />
        <TextAreaField label="Care notes" name="careNotes" value={gemstone?.careNotes} />
        <TextAreaField label="Related gem slugs" name="relatedGemSlugs" value={listValue(gemstone?.relatedGemSlugs)} />
        <TextAreaField label="Related collection slugs" name="relatedCollectionSlugs" value={listValue(gemstone?.relatedCollectionSlugs)} />
        <TextAreaField label="Related jewellery slugs" name="relatedJewellerySlugs" value={listValue(gemstone?.relatedJewellerySlugs)} />
      </section>

      <section className="flex flex-wrap gap-5 border border-charcoal/10 bg-porcelain/64 p-5">
        <label className="flex items-center gap-3 text-sm text-charcoal/70">
          <input defaultChecked={gemstone?.isFeatured ?? false} name="isFeatured" type="checkbox" />
          Featured
        </label>
        <label className="flex items-center gap-3 text-sm text-charcoal/70">
          <input defaultChecked={gemstone?.isPublished ?? false} name="isPublished" type="checkbox" />
          Published
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="border border-charcoal bg-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving" : mode === "create" ? "Create Gemstone" : "Save Gemstone"}
        </button>
      </div>
    </form>
  );
}
