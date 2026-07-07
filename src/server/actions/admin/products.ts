"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminSession } from "@/server/auth/session";
import {
  attachProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAdminProductById,
  productSlugExists,
  reorderProductImages,
  toggleProductFeatured,
  toggleProductPublished,
  updateProduct,
  updateProductDisplayOrder,
  updateProductImageRole,
  type ProductGemstoneInput,
  type ProductImageRole,
  type RelatedProductInput,
} from "@/server/repositories/products.repo";
import { buildStorageKey, createUploadPresignedUrl, isR2Configured } from "@/server/storage/r2";

export type ProductFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status: "idle" | "error";
};

const imageRoles = ["primary", "gallery", "hero"] as const;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxUploadBytes = 8 * 1024 * 1024;

const productFormSchema = z.object({
  availability: z.string().optional(),
  careInstructions: z.string().optional(),
  category: z.string().min(1, "Category is required."),
  certificateDetails: z.string().optional(),
  collectionId: z.string().optional(),
  craftsmanship: z.string().optional(),
  currency: z.string().optional(),
  dimensions: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  inquirySubject: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  longDescription: z.string().optional(),
  metal: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  price: z.number().int().min(0).nullable(),
  priceLabel: z.string().optional(),
  referenceCode: z.string().optional(),
  shortDescription: z.string().min(1, "Short description is required."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  sortOrder: z.coerce.number().int().min(0, "Display order must be zero or greater."),
  totalCaratWeight: z.string().optional(),
});

const uploadRequestSchema = z.object({
  contentType: z.enum(allowedImageTypes),
  fileName: z.string().min(1),
  imageRole: z.enum(imageRoles),
  productId: z.string().min(1),
  sizeBytes: z.number().int().positive().max(maxUploadBytes),
});

const attachImageSchema = z.object({
  alt: z.string().min(1),
  contentType: z.string().optional(),
  height: z.number().int().positive().optional(),
  imageRole: z.enum(imageRoles),
  productId: z.string().min(1),
  sizeBytes: z.number().int().positive().optional(),
  sortOrder: z.number().int().min(0).optional(),
  storageKey: z.string().min(1),
  url: z.string().url(),
  width: z.number().int().positive().optional(),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue || undefined;
}

function listFromText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberFromForm(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  if (!stringValue) return null;
  const numberValue = Number(stringValue);
  return Number.isInteger(numberValue) && numberValue >= 0 ? numberValue : null;
}

function productInputFromForm(formData: FormData) {
  return {
    availability: cleanOptional(formData.get("availability")),
    careInstructions: cleanOptional(formData.get("careInstructions")),
    category: cleanOptional(formData.get("category")),
    certificateDetails: cleanOptional(formData.get("certificateDetails")),
    collectionId: cleanOptional(formData.get("collectionId")),
    craftsmanship: cleanOptional(formData.get("craftsmanship")),
    currency: cleanOptional(formData.get("currency")),
    description: cleanOptional(formData.get("longDescription")),
    dimensions: cleanOptional(formData.get("dimensions")),
    highlights: listFromText(formData.get("highlights")),
    inquirySubject: cleanOptional(formData.get("inquirySubject")),
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
    longDescription: cleanOptional(formData.get("longDescription")),
    material: cleanOptional(formData.get("metal")),
    metal: cleanOptional(formData.get("metal")),
    name: cleanOptional(formData.get("name")),
    price: numberFromForm(formData.get("price")),
    priceLabel: cleanOptional(formData.get("priceLabel")),
    referenceCode: cleanOptional(formData.get("referenceCode")),
    shortDescription: cleanOptional(formData.get("shortDescription")),
    slug: cleanOptional(formData.get("slug"))?.toLowerCase(),
    sortOrder: formData.get("sortOrder") ?? 0,
    summary: cleanOptional(formData.get("shortDescription")),
    totalCaratWeight: cleanOptional(formData.get("totalCaratWeight")),
  };
}

function productGemstonesFromForm(formData: FormData): ProductGemstoneInput[] {
  return formData
    .getAll("gemstoneRowIndexes")
    .map((value) => String(value))
    .map((index, fallbackOrder): ProductGemstoneInput | null => {
      const gemstoneName = cleanOptional(formData.get(`gemstoneName:${index}`));
      if (!gemstoneName) return null;
      const requestedOrder = Number(formData.get(`gemstoneSortOrder:${index}`) ?? fallbackOrder);
      return {
        carat: cleanOptional(formData.get(`gemstoneCarat:${index}`)),
        clarity: cleanOptional(formData.get(`gemstoneClarity:${index}`)),
        color: cleanOptional(formData.get(`gemstoneColor:${index}`)),
        cut: cleanOptional(formData.get(`gemstoneCut:${index}`)),
        gemstoneName,
        gemstoneType: cleanOptional(formData.get(`gemstoneType:${index}`)),
        origin: cleanOptional(formData.get(`gemstoneOrigin:${index}`)),
        setting: cleanOptional(formData.get(`gemstoneSetting:${index}`)),
        sortOrder: Number.isInteger(requestedOrder) && requestedOrder >= 0 ? requestedOrder : fallbackOrder,
        treatment: cleanOptional(formData.get(`gemstoneTreatment:${index}`)),
      };
    })
    .filter((gemstone): gemstone is ProductGemstoneInput => Boolean(gemstone))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function relatedProductsFromForm(formData: FormData): RelatedProductInput[] {
  return formData
    .getAll("relatedProductIds")
    .map((value) => String(value))
    .filter(Boolean)
    .map((productId, index) => {
      const requestedOrder = Number(formData.get(`relatedProductOrder:${productId}`) ?? index);
      return {
        productId,
        sortOrder: Number.isInteger(requestedOrder) && requestedOrder >= 0 ? requestedOrder : index,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized admin action.");
  }

  return session;
}

function errorState(message: string, fieldErrors?: Record<string, string[] | undefined>): ProductFormState {
  return {
    fieldErrors,
    message,
    status: "error",
  };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productFormSchema.safeParse(productInputFromForm(formData));
  if (!parsed.success) {
    return errorState("Review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (await productSlugExists(parsed.data.slug)) {
    return errorState("Slug must be unique.", { slug: ["Slug already exists."] });
  }

  await createProduct(parsed.data, productGemstonesFromForm(formData), relatedProductsFromForm(formData));
  revalidatePath("/admin/products");
  redirect("/admin/products?created=1");
}

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const id = cleanOptional(formData.get("id"));
  if (!id) {
    return errorState("Product id is missing.");
  }

  const parsed = productFormSchema.safeParse(productInputFromForm(formData));
  if (!parsed.success) {
    return errorState("Review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (await productSlugExists(parsed.data.slug, id)) {
    return errorState("Slug must be unique.", { slug: ["Slug already exists."] });
  }

  await updateProduct(id, parsed.data, productGemstonesFromForm(formData), relatedProductsFromForm(formData));
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect(`/admin/products/${id}?saved=updated`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id || formData.get("confirmDelete") !== "on") return;

  await deleteProduct(id);
  revalidatePath("/admin/products");
  redirect("/admin/products?deleted=1");
}

export async function toggleProductPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id) return;

  await toggleProductPublished(id, formData.get("next") === "true");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
}

export async function toggleProductFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id) return;

  await toggleProductFeatured(id, formData.get("next") === "true");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
}

export async function updateProductDisplayOrderAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!id || !Number.isInteger(sortOrder) || sortOrder < 0) return;

  await updateProductDisplayOrder(id, sortOrder);
  revalidatePath("/admin/products");
}

export async function createProductImageUploadAction(input: unknown) {
  await requireAdmin();

  if (!isR2Configured()) {
    return {
      error: "Cloudflare R2 uploads are not configured for this environment.",
      ok: false as const,
    };
  }

  const parsed = uploadRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Choose a JPG, PNG, or WebP image under 8 MB.",
      ok: false as const,
    };
  }

  const product = await getAdminProductById(parsed.data.productId);
  if (!product) {
    return {
      error: "Product was not found.",
      ok: false as const,
    };
  }

  const extension = parsed.data.fileName.split(".").pop()?.toLowerCase() || "webp";
  const key = buildStorageKey(
    "products",
    product.slug,
    parsed.data.imageRole,
    `${Date.now()}-${randomUUID()}.${extension}`,
  );

  let upload;
  try {
    upload = await createUploadPresignedUrl({
      contentType: parsed.data.contentType,
      key,
    });
  } catch {
    return {
      error: "Cloudflare R2 upload signing is unavailable.",
      ok: false as const,
    };
  }

  return {
    ...upload,
    contentType: parsed.data.contentType,
    imageRole: parsed.data.imageRole,
    ok: true as const,
    sizeBytes: parsed.data.sizeBytes,
  };
}

export async function attachProductImageAction(input: unknown) {
  await requireAdmin();

  const parsed = attachImageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Image metadata is invalid.",
      ok: false as const,
    };
  }

  await attachProductImage(parsed.data.productId, parsed.data);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${parsed.data.productId}`);

  return {
    ok: true as const,
  };
}

export async function deleteProductImageAction(formData: FormData) {
  await requireAdmin();
  const productId = cleanOptional(formData.get("productId"));
  const imageId = cleanOptional(formData.get("imageId"));
  if (!productId || !imageId) return;

  await deleteProductImage(imageId);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
}

export async function setProductImageRoleAction(formData: FormData) {
  await requireAdmin();
  const productId = cleanOptional(formData.get("productId"));
  const imageId = cleanOptional(formData.get("imageId"));
  const imageRole = cleanOptional(formData.get("imageRole")) as ProductImageRole | undefined;
  if (!productId || !imageId || !imageRole || !imageRoles.includes(imageRole)) return;

  await updateProductImageRole(imageId, imageRole);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
}

export async function reorderProductImagesAction(formData: FormData) {
  await requireAdmin();
  const productId = cleanOptional(formData.get("productId"));
  const imageId = cleanOptional(formData.get("imageId"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!productId || !imageId || !Number.isInteger(sortOrder) || sortOrder < 0) return;

  await reorderProductImages(imageId, sortOrder);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
}
