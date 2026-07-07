"use client";

import { useActionState } from "react";

import type { ProductFormState } from "@/server/actions/admin/products";
import type { AdminProduct, CollectionOption, ProductOption } from "@/server/repositories/products.repo";

type ProductFormProps = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  collections: CollectionOption[];
  mode: "create" | "edit";
  product?: AdminProduct | null;
  products: ProductOption[];
};

const initialState: ProductFormState = {
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

export function ProductForm({ action, collections, mode, product, products }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};
  const relatedProductOrder = new Map(product?.relatedProducts.map((item) => [item.id, item.sortOrder]) ?? []);
  const gemstoneRows = [
    ...(product?.gemstones ?? []),
    ...Array.from({ length: 3 }, (_, index) => ({
      carat: null,
      clarity: null,
      color: null,
      cut: null,
      gemstoneName: "",
      gemstoneType: null,
      id: `new-${index}`,
      origin: null,
      setting: null,
      sortOrder: (product?.gemstones.length ?? 0) + index,
      treatment: null,
    })),
  ];

  return (
    <form action={formAction} className="space-y-9">
      {product ? <input name="id" type="hidden" value={product.id} /> : null}
      {state.status === "error" && state.message ? (
        <p className="border border-ruby/25 bg-ruby/5 px-4 py-3 text-sm text-ruby" role="alert">
          {state.message}
        </p>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <TextField errors={errors.name} label="Name" name="name" required value={product?.name} />
        <TextField errors={errors.slug} label="Slug" name="slug" required value={product?.slug} />
        <TextField errors={errors.category} label="Category" name="category" required value={product?.category} />
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/55" htmlFor="collectionId">
            Collection
          </label>
          <select className="form-control text-[0.95rem]" defaultValue={product?.collectionId ?? ""} id="collectionId" name="collectionId">
            <option value="">No collection</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
        <TextField errors={errors.price} label="Price" name="price" type="number" value={product?.price} />
        <TextField label="Currency" name="currency" value={product?.currency} />
        <TextField label="Price label" name="priceLabel" value={product?.priceLabel} />
        <TextField label="Availability" name="availability" value={product?.availability} />
        <TextField label="Reference code" name="referenceCode" value={product?.referenceCode} />
        <TextField label="Metal" name="metal" value={product?.metal ?? product?.material} />
        <TextField label="Total carat weight" name="totalCaratWeight" value={product?.totalCaratWeight} />
        <TextField label="Dimensions" name="dimensions" value={product?.dimensions} />
        <TextField errors={errors.sortOrder} label="Display order" name="sortOrder" type="number" value={product?.sortOrder ?? 0} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <TextAreaField errors={errors.shortDescription} label="Short description" name="shortDescription" required value={product?.shortDescription ?? product?.summary} />
        <TextAreaField label="Long description" name="longDescription" rows={7} value={product?.longDescription ?? product?.description} />
        <TextAreaField label="Craftsmanship" name="craftsmanship" value={product?.craftsmanship} />
        <TextAreaField label="Certificate details" name="certificateDetails" value={product?.certificateDetails} />
        <TextAreaField label="Care instructions" name="careInstructions" value={product?.careInstructions} />
        <TextAreaField label="Highlights" name="highlights" value={listValue(product?.highlights)} />
        <TextField label="Inquiry subject" name="inquirySubject" value={product?.inquirySubject} />
      </section>

      <section className="border border-charcoal/10 bg-porcelain/64 p-5">
        <div>
          <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Product Gemstones</p>
          <p className="mt-2 text-sm leading-6 text-charcoal/62">Fill a row to add or keep it. Clear the gemstone name to remove that row on save.</p>
        </div>
        <div className="mt-5 space-y-5">
          {gemstoneRows.map((gemstone, index) => (
            <div className="grid gap-4 border border-charcoal/10 bg-ivory/72 p-4 lg:grid-cols-4" key={`${gemstone.id}-${index}`}>
              <input name="gemstoneRowIndexes" type="hidden" value={index} />
              <TextField label="Gemstone name" name={`gemstoneName:${index}`} value={gemstone.gemstoneName} />
              <TextField label="Type" name={`gemstoneType:${index}`} value={gemstone.gemstoneType} />
              <TextField label="Colour" name={`gemstoneColor:${index}`} value={gemstone.color} />
              <TextField label="Origin" name={`gemstoneOrigin:${index}`} value={gemstone.origin} />
              <TextField label="Cut" name={`gemstoneCut:${index}`} value={gemstone.cut} />
              <TextField label="Carat" name={`gemstoneCarat:${index}`} value={gemstone.carat} />
              <TextField label="Treatment" name={`gemstoneTreatment:${index}`} value={gemstone.treatment} />
              <TextField label="Clarity" name={`gemstoneClarity:${index}`} value={gemstone.clarity} />
              <TextField label="Setting" name={`gemstoneSetting:${index}`} value={gemstone.setting} />
              <TextField label="Order" name={`gemstoneSortOrder:${index}`} type="number" value={gemstone.sortOrder} />
            </div>
          ))}
        </div>
      </section>

      <section className="border border-charcoal/10 bg-porcelain/64 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Related Products</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/62">Choose related jewellery creations and set their order.</p>
          </div>
          <p className="text-xs text-charcoal/45">{products.length} products available</p>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {products.length ? (
            products.map((item, index) => {
              const selectedOrder = relatedProductOrder.get(item.id);
              return (
                <label className="grid gap-3 border border-charcoal/10 bg-ivory/72 p-4 sm:grid-cols-[1fr_6rem]" key={item.id}>
                  <span className="flex items-start gap-3 text-sm text-charcoal/70">
                    <input
                      className="mt-1"
                      defaultChecked={selectedOrder !== undefined}
                      name="relatedProductIds"
                      type="checkbox"
                      value={item.id}
                    />
                    <span>
                      <span className="block font-serif text-lg text-charcoal">{item.name}</span>
                      <span className="mt-1 block text-xs text-charcoal/48">{item.slug}</span>
                    </span>
                  </span>
                  <input
                    aria-label={`${item.name} order`}
                    className="border border-charcoal/10 bg-white px-3 py-2 text-sm"
                    min={0}
                    name={`relatedProductOrder:${item.id}`}
                    type="number"
                    defaultValue={selectedOrder ?? index}
                  />
                </label>
              );
            })
          ) : (
            <p className="border border-charcoal/10 bg-ivory/72 p-4 text-sm text-charcoal/58">Seed or create products before assigning related products.</p>
          )}
        </div>
      </section>

      <section className="flex flex-wrap gap-5 border border-charcoal/10 bg-porcelain/64 p-5">
        <label className="flex items-center gap-3 text-sm text-charcoal/70">
          <input defaultChecked={product?.isFeatured ?? false} name="isFeatured" type="checkbox" />
          Featured
        </label>
        <label className="flex items-center gap-3 text-sm text-charcoal/70">
          <input defaultChecked={product?.isPublished ?? false} name="isPublished" type="checkbox" />
          Published
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="border border-charcoal bg-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving" : mode === "create" ? "Create Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}
