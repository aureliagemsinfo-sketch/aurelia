import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";

import { heroImages, homepageImages, type HeroImageConfig, type HeroOverlayStyle, type HeroTheme, type ProductionImage } from "@/data/assets";
import {
  collections as staticCollections,
  getCollection as getStaticCollection,
  type Collection,
} from "@/data/collections";
import { db } from "@/server/db";
import { collectionGems, collectionImages, collections, gemstones } from "@/server/db/schema";

type DbCollection = typeof collections.$inferSelect & {
  images: Array<typeof collectionImages.$inferSelect>;
  relatedGems: Array<{ slug: string; sortOrder: number }>;
};

function imageFromUrl(url: string | null | undefined): ProductionImage | null {
  if (!url) return null;
  return { available: true, src: url };
}

function splitStory(value: string | null | undefined) {
  return String(value ?? "")
    .split(/\r?\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function cleanOverlayStyle(value: string | null | undefined): HeroOverlayStyle {
  return value === "dark" || value === "gradient" || value === "none" ? value : "light";
}

function cleanHeroTheme(value: string | null | undefined): HeroTheme {
  return value === "light-text" ? "light-text" : "dark-text";
}

async function attachRelations<T extends typeof collections.$inferSelect>(rows: T[]) {
  if (!rows.length) return [] as Array<T & Pick<DbCollection, "images" | "relatedGems">>;

  const collectionIds = rows.map((collection) => collection.id);
  const [images, links] = await Promise.all([
    db
      .select()
      .from(collectionImages)
      .where(inArray(collectionImages.collectionId, collectionIds))
      .orderBy(asc(collectionImages.sortOrder), asc(collectionImages.createdAt)),
    db
      .select({
        collectionId: collectionGems.collectionId,
        slug: gemstones.slug,
        sortOrder: collectionGems.sortOrder,
      })
      .from(collectionGems)
      .innerJoin(gemstones, eq(collectionGems.gemstoneId, gemstones.id))
      .where(and(inArray(collectionGems.collectionId, collectionIds), eq(gemstones.isPublished, true)))
      .orderBy(asc(collectionGems.sortOrder)),
  ]);

  const imagesByCollection = new Map<string, Array<typeof collectionImages.$inferSelect>>();
  const gemsByCollection = new Map<string, DbCollection["relatedGems"]>();

  for (const image of images) {
    imagesByCollection.set(image.collectionId, [
      ...(imagesByCollection.get(image.collectionId) ?? []),
      image,
    ]);
  }

  for (const link of links) {
    gemsByCollection.set(link.collectionId, [
      ...(gemsByCollection.get(link.collectionId) ?? []),
      { slug: link.slug, sortOrder: link.sortOrder },
    ]);
  }

  return rows.map((collection) => ({
    ...collection,
    images: imagesByCollection.get(collection.id) ?? [],
    relatedGems: gemsByCollection.get(collection.id) ?? [],
  }));
}

function mapCollection(row: DbCollection): Collection {
  const fallback = getStaticCollection(row.slug);
  const image =
    imageFromUrl(row.images.find((item) => item.imageRole === "primary")?.url) ??
    imageFromUrl(row.images[0]?.url) ??
    fallback?.image ??
    homepageImages.heritage;
  const heroImage =
    imageFromUrl(row.heroImageUrl) ??
    imageFromUrl(row.images.find((item) => item.imageRole === "hero")?.url) ??
    fallback?.hero.heroImage ??
    heroImages.collectionDesertLight;
  const description = row.shortDescription ?? row.summary ?? row.description ?? fallback?.description ?? "";
  const longDescription = row.longDescription ?? row.description ?? description;
  const story = splitStory(longDescription);
  const hero: HeroImageConfig = {
    heroAlt: row.heroAlt ?? fallback?.hero.heroAlt ?? `${row.name} collection`,
    heroImage,
    heroObjectPositionDesktop:
      row.heroObjectPositionDesktop ?? fallback?.hero.heroObjectPositionDesktop ?? "62% center",
    heroObjectPositionMobile:
      row.heroObjectPositionMobile ?? fallback?.hero.heroObjectPositionMobile ?? "56% center",
    heroOverlayStyle: cleanOverlayStyle(row.heroOverlayStyle ?? fallback?.hero.heroOverlayStyle),
    heroTheme: cleanHeroTheme(row.heroTheme ?? fallback?.hero.heroTheme),
  };

  return {
    description,
    eyebrow: row.eyebrow ?? fallback?.eyebrow ?? "Aurelia Gems",
    galleryImages: row.images.length
      ? row.images.map((item) => imageFromUrl(item.url)).filter((item): item is ProductionImage => Boolean(item))
      : fallback?.galleryImages,
    hero,
    highlights: row.highlights?.length ? row.highlights : fallback?.highlights ?? [],
    image,
    imagePosition: row.imagePosition ?? fallback?.imagePosition,
    name: row.name,
    relatedGemSlugs: row.relatedGems.length
      ? row.relatedGems.sort((a, b) => a.sortOrder - b.sortOrder).map((gemstone) => gemstone.slug)
      : fallback?.relatedGemSlugs ?? [],
    relatedJewellerySlugs: row.relatedJewellerySlugs?.length
      ? row.relatedJewellerySlugs
      : fallback?.relatedJewellerySlugs ?? [],
    slug: row.slug,
    story: story.length ? story : fallback?.story ?? [description],
  };
}

async function listPublishedDbCollections() {
  const rows = await db
    .select()
    .from(collections)
    .where(eq(collections.isPublished, true))
    .orderBy(asc(collections.sortOrder), asc(collections.name));

  return attachRelations(rows);
}

export async function listPublicCollectionsWithFallback() {
  try {
    const rows = await listPublishedDbCollections();
    if (rows.length) return rows.map(mapCollection);
  } catch {
    return staticCollections;
  }

  return staticCollections;
}

export async function getPublicCollectionBySlugWithFallback(slug: string) {
  try {
    const rows = await db
      .select()
      .from(collections)
      .where(and(eq(collections.slug, slug), eq(collections.isPublished, true)))
      .limit(1);
    const [collection] = await attachRelations(rows);
    if (collection) return mapCollection(collection);
  } catch {
    return getStaticCollection(slug) ?? null;
  }

  return getStaticCollection(slug) ?? null;
}

export async function listPublicCollectionSlugs() {
  try {
    const rows = await db
      .select({ slug: collections.slug })
      .from(collections)
      .where(eq(collections.isPublished, true));
    return [...new Set([...staticCollections.map((collection) => collection.slug), ...rows.map((row) => row.slug)])];
  } catch {
    return staticCollections.map((collection) => collection.slug);
  }
}
