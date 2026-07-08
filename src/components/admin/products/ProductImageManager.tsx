"use client";

import { useState, type FormEvent } from "react";

import { AdminDropdown } from "@/components/admin/AdminControls";
import {
  attachProductImageAction,
  createProductImageUploadAction,
  deleteProductImageAction,
  reorderProductImagesAction,
  setProductImageRoleAction,
} from "@/server/actions/admin/products";
import type { AdminProduct, ProductImageRole } from "@/server/repositories/products.repo";

const imageRoles: ProductImageRole[] = ["primary", "gallery", "hero"];
const imageRoleOptions = imageRoles.map((role) => ({ label: role, value: role }));
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 8 * 1024 * 1024;

export function ProductImageManager({
  isUploadConfigured,
  product,
}: {
  isUploadConfigured: boolean;
  product: AdminProduct;
}) {
  const [alt, setAlt] = useState(`${product.name} product image`);
  const [imageRole, setImageRole] = useState<ProductImageRole>("gallery");
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const file = form.get("image");

    if (!isUploadConfigured) {
      setMessage("Cloudflare R2 uploads are not configured for this environment.");
      return;
    }

    if (!(file instanceof File)) {
      setMessage("Choose an image to upload.");
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      setMessage("Use JPG, PNG, or WebP.");
      return;
    }

    if (file.size > maxBytes) {
      setMessage("Image must be under 8 MB.");
      return;
    }

    setIsUploading(true);
    const upload = await createProductImageUploadAction({
      contentType: file.type,
      fileName: file.name,
      imageRole,
      productId: product.id,
      sizeBytes: file.size,
    });

    if (!upload.ok) {
      setIsUploading(false);
      setMessage(upload.error);
      return;
    }

    const response = await fetch(upload.uploadUrl, {
      body: file,
      headers: {
        "Content-Type": file.type,
      },
      method: "PUT",
    });

    if (!response.ok) {
      setIsUploading(false);
      setMessage("Upload failed before the image record was saved.");
      return;
    }

    const attached = await attachProductImageAction({
      alt,
      contentType: upload.contentType,
      imageRole,
      productId: product.id,
      sizeBytes: file.size,
      sortOrder: product.images.length,
      storageKey: upload.key,
      url: upload.publicUrl,
    });

    setIsUploading(false);
    setMessage(attached.ok ? "Image uploaded." : attached.error);
  }

  return (
    <section className="mt-12 border-t border-charcoal/10 pt-10">
      <div className="max-w-3xl">
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Images</p>
        <h2 className="mt-3 font-serif text-3xl font-normal">Product media</h2>
        <p className="mt-4 text-sm leading-7 text-charcoal/62">
          Upload JPG, PNG, or WebP images under 8 MB. Files upload directly to Cloudflare R2 with
          server-generated signed URLs.
        </p>
        {!isUploadConfigured ? (
          <p className="mt-4 border border-ruby/20 bg-ruby/5 px-4 py-3 text-sm leading-6 text-ruby">
            Cloudflare R2 uploads are unavailable because the required server environment variables
            are not configured.
          </p>
        ) : null}
      </div>

      <form className="mt-7 grid gap-5 border border-charcoal/10 bg-porcelain/72 p-5 lg:grid-cols-[1fr_1fr_auto]" onSubmit={handleUpload}>
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/55" htmlFor="product-image">
            Image
          </label>
          <input accept={acceptedTypes.join(",")} className="form-control text-[0.9rem]" disabled={!isUploadConfigured} id="product-image" name="image" type="file" />
        </div>
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/55" htmlFor="product-alt">
            Alt text
          </label>
          <input className="form-control text-[0.9rem]" disabled={!isUploadConfigured} id="product-alt" name="alt" onChange={(event) => setAlt(event.target.value)} value={alt} />
        </div>
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/55" htmlFor="product-image-role">
            Role
          </label>
          <AdminDropdown
            className="min-w-40"
            defaultValue={imageRole}
            disabled={!isUploadConfigured}
            name="imageRole"
            onValueChange={(value) => setImageRole(value as ProductImageRole)}
            options={imageRoleOptions}
          />
        </div>
        <button
          className="border border-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:opacity-50 lg:self-end"
          disabled={isUploading || !isUploadConfigured}
          type="submit"
        >
          {isUploading ? "Uploading" : "Upload Image"}
        </button>
        {message ? <p className="text-sm text-charcoal/66 lg:col-span-3">{message}</p> : null}
      </form>

      <div className="mt-7 grid gap-4 xl:grid-cols-2">
        {product.images.length ? (
          product.images.map((image) => (
            <article className="grid gap-4 border border-charcoal/10 bg-porcelain/64 p-4 sm:grid-cols-[8rem_1fr]" key={image.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={image.alt} className="aspect-square w-full object-cover" src={image.url} />
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-charcoal/45">{image.imageRole}</p>
                <p className="mt-2 text-sm text-charcoal/68">{image.alt}</p>
                <p className="mt-2 break-all text-xs text-charcoal/45">{image.storageKey ?? image.url}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {imageRoles.map((role) => (
                    <form action={setProductImageRoleAction} key={role}>
                      <input name="productId" type="hidden" value={product.id} />
                      <input name="imageId" type="hidden" value={image.id} />
                      <input name="imageRole" type="hidden" value={role} />
                      <button className="border border-charcoal/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/60" type="submit">
                        Set {role}
                      </button>
                    </form>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={reorderProductImagesAction} className="flex gap-2">
                    <input name="productId" type="hidden" value={product.id} />
                    <input name="imageId" type="hidden" value={image.id} />
                    <input className="w-24 border border-charcoal/10 bg-white px-3 py-2 text-sm" min={0} name="sortOrder" type="number" defaultValue={image.sortOrder} />
                    <button className="border border-charcoal/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/60" type="submit">
                      Order
                    </button>
                  </form>
                  <form action={deleteProductImageAction}>
                    <input name="productId" type="hidden" value={product.id} />
                    <input name="imageId" type="hidden" value={image.id} />
                    <button className="border border-ruby/25 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-ruby" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="border border-charcoal/10 bg-porcelain/64 p-5 text-sm text-charcoal/58">No image records yet.</p>
        )}
      </div>
    </section>
  );
}
