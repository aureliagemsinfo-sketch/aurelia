"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminSession } from "@/server/auth/session";
import {
  attachGemstoneImage,
  createGemstone,
  deleteGemstone,
  deleteGemstoneImage,
  getAdminGemstoneById,
  reorderGemstoneImages,
  slugExists,
  toggleGemstoneFeatured,
  toggleGemstonePublished,
  updateGemstone,
  updateGemstoneDisplayOrder,
  updateGemstoneImageRole,
  type GemstoneImageRole,
} from "@/server/repositories/gemstones.repo";
import { buildStorageKey, createUploadPresignedUrl, isR2Configured } from "@/server/storage/r2";

export type GemstoneFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status: "idle" | "error";
};

const imageRoles = ["primary", "gallery", "hero"] as const;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxUploadBytes = 8 * 1024 * 1024;

const gemstoneFormSchema = z.object({
  careNotes: z.string().optional(),
  caratRange: z.string().optional(),
  certification: z.string().optional(),
  clarity: z.string().optional(),
  color: z.string().optional(),
  cutOptions: z.array(z.string()).default([]),
  description: z.string().optional(),
  family: z.string().min(1, "Family is required."),
  highlights: z.array(z.string()).default([]),
  inquirySubject: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  longDescription: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  origin: z.string().optional(),
  originCountry: z.string().optional(),
  originDisplay: z.string().optional(),
  originRegion: z.string().optional(),
  priceLabel: z.string().optional(),
  priceNote: z.string().optional(),
  rarity: z.string().optional(),
  relatedCollectionSlugs: z.array(z.string()).default([]),
  relatedGemSlugs: z.array(z.string()).default([]),
  relatedJewellerySlugs: z.array(z.string()).default([]),
  shortDescription: z.string().min(1, "Short description is required."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  sortOrder: z.coerce.number().int().min(0, "Display order must be zero or greater."),
  treatment: z.string().optional(),
  type: z.string().min(1, "Type is required."),
});

const uploadRequestSchema = z.object({
  contentType: z.enum(allowedImageTypes),
  fileName: z.string().min(1),
  gemstoneId: z.string().min(1),
  imageRole: z.enum(imageRoles),
  sizeBytes: z.number().int().positive().max(maxUploadBytes),
});

const attachImageSchema = z.object({
  alt: z.string().min(1),
  contentType: z.string().optional(),
  gemstoneId: z.string().min(1),
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

function gemstoneInputFromForm(formData: FormData) {
  return {
    careNotes: cleanOptional(formData.get("careNotes")),
    caratRange: cleanOptional(formData.get("caratRange")),
    certification: cleanOptional(formData.get("certification")),
    clarity: cleanOptional(formData.get("clarity")),
    color: cleanOptional(formData.get("color")),
    cutOptions: listFromText(formData.get("cutOptions")),
    description: cleanOptional(formData.get("shortDescription")),
    family: cleanOptional(formData.get("family")),
    highlights: listFromText(formData.get("highlights")),
    inquirySubject: cleanOptional(formData.get("inquirySubject")),
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
    longDescription: cleanOptional(formData.get("longDescription")),
    name: cleanOptional(formData.get("name")),
    origin: cleanOptional(formData.get("originCountry")),
    originCountry: cleanOptional(formData.get("originCountry")),
    originDisplay: cleanOptional(formData.get("originDisplay")),
    originRegion: cleanOptional(formData.get("originRegion")),
    priceLabel: cleanOptional(formData.get("priceLabel")),
    priceNote: cleanOptional(formData.get("priceNote")),
    rarity: cleanOptional(formData.get("rarity")),
    relatedCollectionSlugs: listFromText(formData.get("relatedCollectionSlugs")),
    relatedGemSlugs: listFromText(formData.get("relatedGemSlugs")),
    relatedJewellerySlugs: listFromText(formData.get("relatedJewellerySlugs")),
    shortDescription: cleanOptional(formData.get("shortDescription")),
    slug: cleanOptional(formData.get("slug"))?.toLowerCase(),
    sortOrder: formData.get("sortOrder") ?? 0,
    treatment: cleanOptional(formData.get("treatment")),
    type: cleanOptional(formData.get("type")),
  };
}

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized admin action.");
  }

  return session;
}

function errorState(message: string, fieldErrors?: Record<string, string[] | undefined>): GemstoneFormState {
  return {
    fieldErrors,
    message,
    status: "error",
  };
}

export async function createGemstoneAction(
  _prevState: GemstoneFormState,
  formData: FormData,
): Promise<GemstoneFormState> {
  await requireAdmin();

  const parsed = gemstoneFormSchema.safeParse(gemstoneInputFromForm(formData));
  if (!parsed.success) {
    return errorState("Review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (await slugExists(parsed.data.slug)) {
    return errorState("Slug must be unique.", { slug: ["Slug already exists."] });
  }

  await createGemstone(parsed.data);
  revalidatePath("/admin/gemstones");
  redirect("/admin/gemstones?created=1");
}

export async function updateGemstoneAction(
  _prevState: GemstoneFormState,
  formData: FormData,
): Promise<GemstoneFormState> {
  await requireAdmin();

  const id = cleanOptional(formData.get("id"));
  if (!id) {
    return errorState("Gemstone id is missing.");
  }

  const parsed = gemstoneFormSchema.safeParse(gemstoneInputFromForm(formData));
  if (!parsed.success) {
    return errorState("Review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (await slugExists(parsed.data.slug, id)) {
    return errorState("Slug must be unique.", { slug: ["Slug already exists."] });
  }

  await updateGemstone(id, parsed.data);
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${id}`);
  redirect(`/admin/gemstones/${id}?saved=updated`);
}

export async function deleteGemstoneAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id || formData.get("confirmDelete") !== "on") return;

  await deleteGemstone(id);
  revalidatePath("/admin/gemstones");
  redirect("/admin/gemstones?deleted=1");
}

export async function toggleGemstonePublishedAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id) redirect("/admin/gemstones?updated=error");

  await toggleGemstonePublished(id, formData.get("next") === "true");
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${id}`);
  redirect("/admin/gemstones?updated=status");
}

export async function toggleGemstoneFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  if (!id) redirect("/admin/gemstones?updated=error");

  await toggleGemstoneFeatured(id, formData.get("next") === "true");
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${id}`);
  redirect("/admin/gemstones?updated=featured");
}

export async function updateGemstoneDisplayOrderAction(formData: FormData) {
  await requireAdmin();
  const id = cleanOptional(formData.get("id"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!id || !Number.isInteger(sortOrder) || sortOrder < 0) redirect("/admin/gemstones?updated=error");

  await updateGemstoneDisplayOrder(id, sortOrder);
  revalidatePath("/admin/gemstones");
  redirect("/admin/gemstones?updated=order");
}

export async function createGemstoneImageUploadAction(input: unknown) {
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

  const gemstone = await getAdminGemstoneById(parsed.data.gemstoneId);
  if (!gemstone) {
    return {
      error: "Gemstone was not found.",
      ok: false as const,
    };
  }

  const extension = parsed.data.fileName.split(".").pop()?.toLowerCase() || "webp";
  const key = buildStorageKey(
    "gemstones",
    gemstone.slug,
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

export async function attachGemstoneImageAction(input: unknown) {
  await requireAdmin();

  const parsed = attachImageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Image metadata is invalid.",
      ok: false as const,
    };
  }

  await attachGemstoneImage(parsed.data.gemstoneId, parsed.data);
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${parsed.data.gemstoneId}`);

  return {
    ok: true as const,
  };
}

export async function deleteGemstoneImageAction(formData: FormData) {
  await requireAdmin();
  const gemstoneId = cleanOptional(formData.get("gemstoneId"));
  const imageId = cleanOptional(formData.get("imageId"));
  if (!gemstoneId || !imageId) return;

  await deleteGemstoneImage(imageId);
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${gemstoneId}`);
}

export async function setGemstoneImageRoleAction(formData: FormData) {
  await requireAdmin();
  const gemstoneId = cleanOptional(formData.get("gemstoneId"));
  const imageId = cleanOptional(formData.get("imageId"));
  const imageRole = cleanOptional(formData.get("imageRole")) as GemstoneImageRole | undefined;
  if (!gemstoneId || !imageId || !imageRole || !imageRoles.includes(imageRole)) return;

  await updateGemstoneImageRole(imageId, imageRole);
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${gemstoneId}`);
}

export async function reorderGemstoneImagesAction(formData: FormData) {
  await requireAdmin();
  const gemstoneId = cleanOptional(formData.get("gemstoneId"));
  const imageId = cleanOptional(formData.get("imageId"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!gemstoneId || !imageId || !Number.isInteger(sortOrder) || sortOrder < 0) return;

  await reorderGemstoneImages(imageId, sortOrder);
  revalidatePath("/admin/gemstones");
  revalidatePath(`/admin/gemstones/${gemstoneId}`);
}
