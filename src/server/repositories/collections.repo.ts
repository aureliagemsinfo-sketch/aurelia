import { randomUUID } from "node:crypto";

import { asc, eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import { collectionGems, collectionImages, collections, gemstones } from "@/server/db/schema";

export type CollectionImageRole = "primary" | "gallery" | "hero";

export type CollectionImageInput = {
  alt: string;
  contentType?: string | null;
  height?: number | null;
  imageRole: CollectionImageRole;
  sizeBytes?: number | null;
  sortOrder?: number;
  storageKey?: string | null;
  url: string;
  width?: number | null;
};

export type RelatedGemInput = {
  gemstoneId: string;
  sortOrder: number;
};

export type CollectionWriteInput = {
  description?: string | null;
  eyebrow?: string | null;
  heroAlt?: string | null;
  heroImageUrl?: string | null;
  heroObjectPositionDesktop?: string | null;
  heroObjectPositionMobile?: string | null;
  heroOverlayStyle?: string | null;
  heroTheme?: string | null;
  highlights?: string[];
  imagePosition?: string | null;
  isPublished?: boolean;
  longDescription?: string | null;
  name: string;
  relatedJewellerySlugs?: string[];
  shortDescription?: string | null;
  slug: string;
  sortOrder?: number;
  summary?: string | null;
};

export type AdminCollection = typeof collections.$inferSelect & {
  images: Array<typeof collectionImages.$inferSelect>;
  relatedGems: Array<{
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
  }>;
};

export type GemstoneOption = {
  id: string;
  name: string;
  slug: string;
};

function collectionSet(input: CollectionWriteInput) {
  return {
    description: input.description ?? input.longDescription ?? null,
    eyebrow: input.eyebrow ?? null,
    heroAlt: input.heroAlt ?? null,
    heroImageUrl: input.heroImageUrl ?? null,
    heroObjectPositionDesktop: input.heroObjectPositionDesktop ?? null,
    heroObjectPositionMobile: input.heroObjectPositionMobile ?? null,
    heroOverlayStyle: input.heroOverlayStyle ?? null,
    heroTheme: input.heroTheme ?? null,
    highlights: input.highlights ?? [],
    imagePosition: input.imagePosition ?? null,
    isPublished: input.isPublished ?? false,
    longDescription: input.longDescription ?? input.description ?? null,
    name: input.name,
    relatedJewellerySlugs: input.relatedJewellerySlugs ?? [],
    shortDescription: input.shortDescription ?? input.summary ?? null,
    slug: input.slug,
    sortOrder: input.sortOrder ?? 0,
    summary: input.summary ?? input.shortDescription ?? null,
    updatedAt: new Date(),
  };
}

async function attachCollectionRelations<T extends typeof collections.$inferSelect>(rows: T[]) {
  if (!rows.length) {
    return [] as Array<T & Pick<AdminCollection, "images" | "relatedGems">>;
  }

  const collectionIds = rows.map((collection) => collection.id);
  const [images, links] = await Promise.all([
    db
      .select()
      .from(collectionImages)
      .where(inArray(collectionImages.collectionId, collectionIds))
      .orderBy(asc(collectionImages.sortOrder), asc(collectionImages.createdAt)),
    db
      .select()
      .from(collectionGems)
      .where(inArray(collectionGems.collectionId, collectionIds))
      .orderBy(asc(collectionGems.sortOrder)),
  ]);

  const gemIds = [...new Set(links.map((link) => link.gemstoneId))];
  const gemRows = gemIds.length
    ? await db
        .select({ id: gemstones.id, name: gemstones.name, slug: gemstones.slug })
        .from(gemstones)
        .where(inArray(gemstones.id, gemIds))
    : [];

  const gemsById = new Map(gemRows.map((gemstone) => [gemstone.id, gemstone]));
  const imagesByCollection = new Map<string, Array<typeof collectionImages.$inferSelect>>();
  const gemsByCollection = new Map<string, AdminCollection["relatedGems"]>();

  for (const image of images) {
    imagesByCollection.set(image.collectionId, [
      ...(imagesByCollection.get(image.collectionId) ?? []),
      image,
    ]);
  }

  for (const link of links) {
    const gemstone = gemsById.get(link.gemstoneId);
    if (!gemstone) continue;
    gemsByCollection.set(link.collectionId, [
      ...(gemsByCollection.get(link.collectionId) ?? []),
      {
        id: gemstone.id,
        name: gemstone.name,
        slug: gemstone.slug,
        sortOrder: link.sortOrder,
      },
    ]);
  }

  return rows.map((collection) => ({
    ...collection,
    images: imagesByCollection.get(collection.id) ?? [],
    relatedGems: gemsByCollection.get(collection.id) ?? [],
  }));
}

export async function listAdminCollections() {
  const rows = await db
    .select()
    .from(collections)
    .orderBy(asc(collections.sortOrder), asc(collections.name));

  return attachCollectionRelations(rows);
}

export async function getAdminCollectionById(id: string) {
  const [row] = await db.select().from(collections).where(eq(collections.id, id)).limit(1);
  if (!row) return null;
  const [withRelations] = await attachCollectionRelations([row]);
  return withRelations;
}

export async function createCollection(input: CollectionWriteInput, relatedGems: RelatedGemInput[]) {
  const id = randomUUID();
  await db.insert(collections).values({
    id,
    ...collectionSet(input),
    createdAt: new Date(),
  });
  await updateCollectionRelatedGems(id, relatedGems);
  return id;
}

export async function updateCollection(
  id: string,
  input: CollectionWriteInput,
  relatedGems: RelatedGemInput[],
) {
  await db.update(collections).set(collectionSet(input)).where(eq(collections.id, id));
  await updateCollectionRelatedGems(id, relatedGems);
}

export async function deleteCollection(id: string) {
  await db.delete(collections).where(eq(collections.id, id));
}

export async function toggleCollectionPublished(id: string, isPublished: boolean) {
  await db
    .update(collections)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(collections.id, id));
}

export async function updateCollectionDisplayOrder(id: string, sortOrder: number) {
  await db
    .update(collections)
    .set({ sortOrder, updatedAt: new Date() })
    .where(eq(collections.id, id));
}

export async function attachCollectionImage(collectionId: string, input: CollectionImageInput) {
  const id = randomUUID();
  await db.insert(collectionImages).values({
    alt: input.alt,
    collectionId,
    contentType: input.contentType ?? null,
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

export async function updateCollectionImageRole(imageId: string, imageRole: CollectionImageRole) {
  await db
    .update(collectionImages)
    .set({ imageRole, updatedAt: new Date() })
    .where(eq(collectionImages.id, imageId));
}

export async function deleteCollectionImage(imageId: string) {
  await db.delete(collectionImages).where(eq(collectionImages.id, imageId));
}

export async function reorderCollectionImages(imageId: string, sortOrder: number) {
  await db
    .update(collectionImages)
    .set({ sortOrder, updatedAt: new Date() })
    .where(eq(collectionImages.id, imageId));
}

export async function updateCollectionRelatedGems(
  collectionId: string,
  relatedGems: RelatedGemInput[],
) {
  await db.delete(collectionGems).where(eq(collectionGems.collectionId, collectionId));

  if (!relatedGems.length) return;

  await db.insert(collectionGems).values(
    relatedGems.map((gemstone) => ({
      collectionId,
      gemstoneId: gemstone.gemstoneId,
      sortOrder: gemstone.sortOrder,
    })),
  );
}

export async function upsertSeedCollection(id: string, input: CollectionWriteInput) {
  await db
    .insert(collections)
    .values({
      id,
      ...collectionSet(input),
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: collections.slug,
      set: collectionSet(input),
    });

  const [row] = await db.select().from(collections).where(eq(collections.slug, input.slug)).limit(1);
  return row;
}

export async function listImagesForCollection(collectionId: string) {
  return db.select().from(collectionImages).where(eq(collectionImages.collectionId, collectionId));
}

export async function listGemstoneOptions() {
  return db
    .select({ id: gemstones.id, name: gemstones.name, slug: gemstones.slug })
    .from(gemstones)
    .orderBy(asc(gemstones.sortOrder), asc(gemstones.name));
}

export async function getGemstoneIdsBySlug(slugs: string[]) {
  if (!slugs.length) return new Map<string, string>();

  const rows = await db
    .select({ id: gemstones.id, slug: gemstones.slug })
    .from(gemstones)
    .where(inArray(gemstones.slug, slugs));

  return new Map(rows.map((gemstone) => [gemstone.slug, gemstone.id]));
}

export async function collectionSlugExists(slug: string, excludeId?: string) {
  const [row] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  return Boolean(row && row.id !== excludeId);
}
