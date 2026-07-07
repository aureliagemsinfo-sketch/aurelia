"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminSession } from "@/server/auth/session";
import {
  attachCollectionImage,
  collectionSlugExists,
  createCollection,
  deleteCollection,
  deleteCollectionImage,
  getAdminCollectionById,
  reorderCollectionImages,
  toggleCollectionPublished,
  updateCollection,
  updateCollectionDisplayOrder,
  updateCollectionImageRole,
  type CollectionImageRole,
  type RelatedGemInput,
} from "@/server/repositories/collections.repo";
import { buildStorageKey, createUploadPresignedUrl, isR2Configured } from "@/server/storage/r2";

export type CollectionFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status: "idle" | "error";
};

const imageRoles = ["primary", "gallery", "hero"] as const;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxUploadBytes = 8 * 1024 * 1024;

const collectionFormSchema = z.object({
  description: z.string().optional(),
  eyebrow: z.string().optional(),
  heroAlt: z.string().optional(),
  heroImageUrl: z.string().optional(),
  heroObjectPositionDesktop: z.string().optional(),
  heroObjectPositionMobile: z.string().optional(),
  heroOverlayStyle: z.string().optional(),
  heroTheme: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  imagePosition: z.string().optional(),
  isPublished: z.boolean().default(false),
  longDescription: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  relatedJewellerySlugs: z.array(z.string()).default([]),
  shortDescription: z.string().min(1, "Short description is required."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  sortOrder: z.coerce.number().int().min(0, "Display order must be zero or greater."),
  summary: z.string().optional(),
});

const uploadRequestSchema = z.object({
  collectionId: z.string().min(1),
  contentType: z.enum(allowedImageTypes),
  fileName: z.string().min(1),
  imageRole: z.enum(imageRoles),
  sizeBytes: z.number().int().positive().max(maxUploadBytes),
});

const attachImageSchema = z.object({
  alt: z.string().min(1),
  collectionId: z.string().min(1),
  contentType: z.string().optional(),
  height: z.number().int().positive().optional(),
  imageRole: z.enum(imageRoles),
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

function collectionInputFromForm(formData: FormData) {
  return {
    description: cleanOptional(formData.get("longDescription")),
    eyebrow: cleanOptional(formData.get("eyebrow")),
    heroAlt: cleanOptional(formData.get("heroAlt")),
    heroImageUrl: cleanOptional(formData.get("heroImageUrl")),
    heroObjectPositionDesktop: cleanOptional(formData.get("heroObjectPositionDesktop")),
    heroObjectPositionMobile: cleanOptional(formData.get("heroObjectPositionMobile")),
    heroOverlayStyle: cleanOptional(formData.get("heroOverlayStyle")),
    heroTheme: cleanOptional(formData.get("heroTheme")),
    highlights: listFromText(formData.get("highlights")),
    imagePosition: cleanOptional(formData.get("imagePosition")),
    isPublished: formData.get("isPublished") === "on",
    longDescription: cleanOptional(formData.get("longDescription")),
    name: cleanOptional(formData.get("name")),
    relatedJewellerySlugs: listFromText(formData.get("relatedJewellerySlugs")),
    shortDescription: cleanOptional(formData.get("shortDescription")),
    slug: cleanOptional(formData.get("slug"))?.toLowerCase(),
    sortOrder: formData.get("sortOrder") ?? 0,
    summary: cleanOptional(formData.get("shortDescription")),
  };
}

function relatedGemsFromForm(formData: FormData): RelatedGemInput[] {
  return formData
    .getAll("relatedGemIds")
    .map((value) => String(value))
    .filter(Boolean)
    .map((gemstoneId, index) => {
      const requestedOrder = Number(formData.get(`relatedGemOrder:${gemstoneId}`) ?? index);
      return {
        gemstoneId,
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

function errorState(message: string, fieldErrors?: Record<string, string[] | undefined>): CollectionFormState {
  return {
    fieldErrors,
    message,
    status: "error",
  };
}

export async function createCollectionAction(
  _prevState: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  await requireAdmin();

  const parsed = collectionFormSchema.safeParse(collectionInputFromForm(formData));
  if (!parsed.success) {
    return errorState("Review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (await collectionSlugExists(parsed.data.slug)) {
    return errorState("Slug must be unique.", { slug: ["Slug already exists."] });
  }

  await createCollection(parsed.data, relatedGemsFromForm(formData));
  revalidatePath("/admin/collections");
  redirect("/admin/collections?created=1");
}

export async function updateCollectionAction(
  _prevState: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  await requireAdmin();

  const id = cleanOptional(formData.get("id"));
  if (!id) {
    return errorState("Collection id is missing.");
  }

  const parsed = collectionFormSchema.safeParse(collectionInputFromForm(formData));
  if (!parsed.success) {
    return errorState("Review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (await collectionSlugExists(parsed.data.slug, id)) {
    return errorState("Slug must be unique.", { slug: ["Slug already exists."] });
  }

  await updateCollection(id, parsed.data, relatedGemsFromForm(formData));
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${id}`);
  redirect(`/admin/collections/${id}?saved=updated`);
}

export async function deleteCollectionAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id || formData.get("confirmDelete") !== "on") return;

  await deleteCollection(id);
  revalidatePath("/admin/collections");
  redirect("/admin/collections?deleted=1");
}

export async function toggleCollectionPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id) return;

  await toggleCollectionPublished(id, formData.get("next") === "true");
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${id}`);
}

export async function updateCollectionDisplayOrderAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!id || !Number.isInteger(sortOrder) || sortOrder < 0) return;

  await updateCollectionDisplayOrder(id, sortOrder);
  revalidatePath("/admin/collections");
}

export async function createCollectionImageUploadAction(input: unknown) {
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

  const collection = await getAdminCollectionById(parsed.data.collectionId);
  if (!collection) {
    return {
      error: "Collection was not found.",
      ok: false as const,
    };
  }

  const extension = parsed.data.fileName.split(".").pop()?.toLowerCase() || "webp";
  const key = buildStorageKey(
    "collections",
    collection.slug,
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

export async function attachCollectionImageAction(input: unknown) {
  await requireAdmin();

  const parsed = attachImageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Image metadata is invalid.",
      ok: false as const,
    };
  }

  await attachCollectionImage(parsed.data.collectionId, parsed.data);
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${parsed.data.collectionId}`);

  return {
    ok: true as const,
  };
}

export async function deleteCollectionImageAction(formData: FormData) {
  await requireAdmin();
  const collectionId = cleanOptional(formData.get("collectionId"));
  const imageId = cleanOptional(formData.get("imageId"));
  if (!collectionId || !imageId) return;

  await deleteCollectionImage(imageId);
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}`);
}

export async function setCollectionImageRoleAction(formData: FormData) {
  await requireAdmin();
  const collectionId = cleanOptional(formData.get("collectionId"));
  const imageId = cleanOptional(formData.get("imageId"));
  const imageRole = cleanOptional(formData.get("imageRole")) as CollectionImageRole | undefined;
  if (!collectionId || !imageId || !imageRole || !imageRoles.includes(imageRole)) return;

  await updateCollectionImageRole(imageId, imageRole);
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}`);
}

export async function reorderCollectionImagesAction(formData: FormData) {
  await requireAdmin();
  const collectionId = cleanOptional(formData.get("collectionId"));
  const imageId = cleanOptional(formData.get("imageId"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!collectionId || !imageId || !Number.isInteger(sortOrder) || sortOrder < 0) return;

  await reorderCollectionImages(imageId, sortOrder);
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}`);
}
