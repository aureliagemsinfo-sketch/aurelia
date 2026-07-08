import { randomUUID } from "node:crypto";

import { asc, eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import { gemstoneImages, gemstones } from "@/server/db/schema";

export type GemstoneImageRole = "primary" | "gallery" | "hero";

export type GemstoneImageInput = {
  alt: string;
  contentType?: string | null;
  height?: number | null;
  imageRole: GemstoneImageRole;
  sizeBytes?: number | null;
  sortOrder?: number;
  storageKey?: string | null;
  url: string;
  width?: number | null;
};

export type GemstoneWriteInput = {
  careNotes?: string | null;
  caratRange?: string | null;
  certification?: string | null;
  clarity?: string | null;
  color?: string | null;
  cutOptions?: string[];
  description?: string | null;
  family?: string | null;
  highlights?: string[];
  inquirySubject?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  longDescription?: string | null;
  name: string;
  origin?: string | null;
  originCountry?: string | null;
  originDisplay?: string | null;
  originRegion?: string | null;
  priceLabel?: string | null;
  priceNote?: string | null;
  rarity?: string | null;
  relatedCollectionSlugs?: string[];
  relatedGemSlugs?: string[];
  relatedJewellerySlugs?: string[];
  shortDescription?: string | null;
  slug: string;
  sortOrder?: number;
  treatment?: string | null;
  type?: string | null;
};

export type AdminGemstone = typeof gemstones.$inferSelect & {
  images: Array<typeof gemstoneImages.$inferSelect>;
};

function gemstoneSet(input: GemstoneWriteInput) {
  return {
    careNotes: input.careNotes ?? null,
    caratRange: input.caratRange ?? null,
    certification: input.certification ?? null,
    clarity: input.clarity ?? null,
    color: input.color ?? null,
    cutOptions: input.cutOptions ?? [],
    description: input.description ?? input.shortDescription ?? null,
    family: input.family ?? null,
    highlights: input.highlights ?? [],
    inquirySubject: input.inquirySubject ?? null,
    isFeatured: input.isFeatured ?? false,
    isPublished: input.isPublished ?? false,
    longDescription: input.longDescription ?? null,
    name: input.name,
    origin: input.origin ?? input.originCountry ?? null,
    originCountry: input.originCountry ?? null,
    originDisplay: input.originDisplay ?? input.origin ?? null,
    originRegion: input.originRegion ?? null,
    priceLabel: input.priceLabel ?? null,
    priceNote: input.priceNote ?? null,
    rarity: input.rarity ?? null,
    relatedCollectionSlugs: input.relatedCollectionSlugs ?? [],
    relatedGemSlugs: input.relatedGemSlugs ?? [],
    relatedJewellerySlugs: input.relatedJewellerySlugs ?? [],
    shortDescription: input.shortDescription ?? null,
    slug: input.slug,
    sortOrder: input.sortOrder ?? 0,
    treatment: input.treatment ?? null,
    type: input.type ?? null,
    updatedAt: new Date(),
  };
}

async function attachImages<T extends typeof gemstones.$inferSelect>(rows: T[]) {
  if (!rows.length) {
    return [] as Array<T & { images: Array<typeof gemstoneImages.$inferSelect> }>;
  }

  const images = await db
    .select()
    .from(gemstoneImages)
    .where(
      inArray(
        gemstoneImages.gemstoneId,
        rows.map((gemstone) => gemstone.id),
      ),
    )
    .orderBy(asc(gemstoneImages.sortOrder), asc(gemstoneImages.createdAt));

  const imagesByGemstone = new Map<string, Array<typeof gemstoneImages.$inferSelect>>();
  for (const image of images) {
    imagesByGemstone.set(image.gemstoneId, [...(imagesByGemstone.get(image.gemstoneId) ?? []), image]);
  }

  return rows.map((gemstone) => ({
    ...gemstone,
    images: imagesByGemstone.get(gemstone.id) ?? [],
  }));
}

export async function listAdminGemstones() {
  const rows = await db
    .select()
    .from(gemstones)
    .orderBy(asc(gemstones.sortOrder), asc(gemstones.name));

  return attachImages(rows);
}

export async function getAdminGemstoneById(id: string) {
  const [row] = await db.select().from(gemstones).where(eq(gemstones.id, id)).limit(1);
  if (!row) return null;
  const [withImages] = await attachImages([row]);
  return withImages;
}

export async function getGemstoneBySlug(slug: string, excludeId?: string) {
  const rows = await db.select().from(gemstones).where(eq(gemstones.slug, slug)).limit(2);
  return rows.find((gemstone) => gemstone.id !== excludeId) ?? null;
}

export async function createGemstone(input: GemstoneWriteInput) {
  const id = randomUUID();
  await db.insert(gemstones).values({
    id,
    ...gemstoneSet(input),
    createdAt: new Date(),
  });
  return id;
}

export async function updateGemstone(id: string, input: GemstoneWriteInput) {
  await db.update(gemstones).set(gemstoneSet(input)).where(eq(gemstones.id, id));
}

export async function deleteGemstone(id: string) {
  await db.delete(gemstones).where(eq(gemstones.id, id));
}

export async function toggleGemstonePublished(id: string, isPublished: boolean) {
  await db
    .update(gemstones)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(gemstones.id, id));
}

export async function toggleGemstoneFeatured(id: string, isFeatured: boolean) {
  await db
    .update(gemstones)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(gemstones.id, id));
}

export async function updateGemstoneDisplayOrder(id: string, sortOrder: number) {
  const rows = await db
    .select()
    .from(gemstones)
    .orderBy(asc(gemstones.sortOrder), asc(gemstones.createdAt), asc(gemstones.name), asc(gemstones.id));
  const target = rows.find((gemstone) => gemstone.id === id);
  if (!target) return;

  const reordered = rows.filter((gemstone) => gemstone.id !== id);
  const targetIndex = Math.max(0, Math.min(reordered.length, sortOrder <= 0 ? 0 : sortOrder - 1));
  reordered.splice(targetIndex, 0, target);
  await normalizeGemstoneDisplayOrders(reordered);
}

export async function normalizeGemstoneDisplayOrders(
  orderedRows?: Array<Pick<typeof gemstones.$inferSelect, "id" | "sortOrder">>,
) {
  const rows =
    orderedRows ??
    (await db
      .select()
      .from(gemstones)
      .orderBy(asc(gemstones.sortOrder), asc(gemstones.createdAt), asc(gemstones.name), asc(gemstones.id)));
  const now = new Date();

  for (const [index, gemstone] of rows.entries()) {
    const nextSortOrder = index + 1;
    if (gemstone.sortOrder === nextSortOrder) continue;
    await db
      .update(gemstones)
      .set({ sortOrder: nextSortOrder, updatedAt: now })
      .where(eq(gemstones.id, gemstone.id));
  }
}

export async function attachGemstoneImage(gemstoneId: string, input: GemstoneImageInput) {
  const id = randomUUID();
  await db.insert(gemstoneImages).values({
    alt: input.alt,
    contentType: input.contentType ?? null,
    gemstoneId,
    height: input.height ?? null,
    id,
    imageRole: input.imageRole,
    sizeBytes: input.sizeBytes ?? null,
    sortOrder: input.sortOrder ?? 0,
    storageKey: input.storageKey ?? null,
    url: input.url,
    width: input.width ?? null,
  });
  return id;
}

export async function updateGemstoneImageRole(imageId: string, imageRole: GemstoneImageRole) {
  await db
    .update(gemstoneImages)
    .set({ imageRole, updatedAt: new Date() })
    .where(eq(gemstoneImages.id, imageId));
}

export async function deleteGemstoneImage(imageId: string) {
  await db.delete(gemstoneImages).where(eq(gemstoneImages.id, imageId));
}

export async function reorderGemstoneImages(imageId: string, sortOrder: number) {
  await db
    .update(gemstoneImages)
    .set({ sortOrder, updatedAt: new Date() })
    .where(eq(gemstoneImages.id, imageId));
}

export async function upsertSeedGemstone(id: string, input: GemstoneWriteInput) {
  await db
    .insert(gemstones)
    .values({
      id,
      ...gemstoneSet(input),
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: gemstones.slug,
      set: gemstoneSet(input),
    });

  const [row] = await db.select().from(gemstones).where(eq(gemstones.slug, input.slug)).limit(1);
  return row;
}

export async function listImagesForGemstone(gemstoneId: string) {
  return db.select().from(gemstoneImages).where(eq(gemstoneImages.gemstoneId, gemstoneId));
}

export async function slugExists(slug: string, excludeId?: string) {
  if (excludeId) {
    const [row] = await db
      .select({ id: gemstones.id })
      .from(gemstones)
      .where(eq(gemstones.slug, slug))
      .limit(1);
    return Boolean(row && row.id !== excludeId);
  }

  const [row] = await db.select({ id: gemstones.id }).from(gemstones).where(eq(gemstones.slug, slug)).limit(1);
  return Boolean(row);
}
