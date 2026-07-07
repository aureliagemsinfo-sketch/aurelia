"use client";

import { useActionState } from "react";

import type { CollectionFormState } from "@/server/actions/admin/collections";
import type { AdminCollection, GemstoneOption } from "@/server/repositories/collections.repo";

type CollectionFormProps = {
  action: (state: CollectionFormState, formData: FormData) => Promise<CollectionFormState>;
  collection?: AdminCollection | null;
  gemstones: GemstoneOption[];
  mode: "create" | "edit";
};

const initialState: CollectionFormState = {
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

export function CollectionForm({ action, collection, gemstones, mode }: CollectionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};
  const relatedGemOrder = new Map(collection?.relatedGems.map((gemstone) => [gemstone.id, gemstone.sortOrder]) ?? []);

  return (
    <form action={formAction} className="space-y-9">
      {collection ? <input name="id" type="hidden" value={collection.id} /> : null}
      {state.status === "error" && state.message ? (
        <p className="border border-ruby/25 bg-ruby/5 px-4 py-3 text-sm text-ruby" role="alert">
          {state.message}
        </p>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <TextField errors={errors.name} label="Name" name="name" required value={collection?.name} />
        <TextField errors={errors.slug} label="Slug" name="slug" required value={collection?.slug} />
        <TextField errors={errors.eyebrow} label="Eyebrow" name="eyebrow" value={collection?.eyebrow} />
        <TextField errors={errors.sortOrder} label="Display order" name="sortOrder" type="number" value={collection?.sortOrder ?? 0} />
        <TextField label="Image position" name="imagePosition" value={collection?.imagePosition} />
        <TextField label="Hero image URL" name="heroImageUrl" value={collection?.heroImageUrl} />
        <TextField label="Hero alt" name="heroAlt" value={collection?.heroAlt} />
        <TextField label="Hero desktop crop" name="heroObjectPositionDesktop" value={collection?.heroObjectPositionDesktop} />
        <TextField label="Hero mobile crop" name="heroObjectPositionMobile" value={collection?.heroObjectPositionMobile} />
        <TextField label="Hero overlay style" name="heroOverlayStyle" value={collection?.heroOverlayStyle} />
        <TextField label="Hero theme" name="heroTheme" value={collection?.heroTheme} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <TextAreaField errors={errors.shortDescription} label="Short description" name="shortDescription" required value={collection?.shortDescription ?? collection?.summary} />
        <TextAreaField label="Long description / story" name="longDescription" rows={7} value={collection?.longDescription ?? collection?.description} />
        <TextAreaField label="Highlights" name="highlights" value={listValue(collection?.highlights)} />
        <TextAreaField label="Related jewellery slugs" name="relatedJewellerySlugs" value={listValue(collection?.relatedJewellerySlugs)} />
      </section>

      <section className="border border-charcoal/10 bg-porcelain/64 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Related Gemstones</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/62">Choose gemstones to connect with this collection and set their display order.</p>
          </div>
          <p className="text-xs text-charcoal/45">{gemstones.length} gemstones available</p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {gemstones.length ? (
            gemstones.map((gemstone, index) => {
              const selectedOrder = relatedGemOrder.get(gemstone.id);
              return (
                <label className="grid gap-3 border border-charcoal/10 bg-ivory/72 p-4 sm:grid-cols-[1fr_6rem]" key={gemstone.id}>
                  <span className="flex items-start gap-3 text-sm text-charcoal/70">
                    <input
                      className="mt-1"
                      defaultChecked={selectedOrder !== undefined}
                      name="relatedGemIds"
                      type="checkbox"
                      value={gemstone.id}
                    />
                    <span>
                      <span className="block font-serif text-lg text-charcoal">{gemstone.name}</span>
                      <span className="mt-1 block text-xs text-charcoal/48">{gemstone.slug}</span>
                    </span>
                  </span>
                  <input
                    aria-label={`${gemstone.name} order`}
                    className="border border-charcoal/10 bg-white px-3 py-2 text-sm"
                    min={0}
                    name={`relatedGemOrder:${gemstone.id}`}
                    type="number"
                    defaultValue={selectedOrder ?? index}
                  />
                </label>
              );
            })
          ) : (
            <p className="border border-charcoal/10 bg-ivory/72 p-4 text-sm text-charcoal/58">Seed gemstones before assigning related gems.</p>
          )}
        </div>
      </section>

      <section className="flex flex-wrap gap-5 border border-charcoal/10 bg-porcelain/64 p-5">
        <label className="flex items-center gap-3 text-sm text-charcoal/70">
          <input defaultChecked={collection?.isPublished ?? false} name="isPublished" type="checkbox" />
          Published
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="border border-charcoal bg-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving" : mode === "create" ? "Create Collection" : "Save Collection"}
        </button>
      </div>
    </form>
  );
}
