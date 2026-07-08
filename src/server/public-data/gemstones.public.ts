import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { heroImages, type HeroImageConfig, type ProductionImage } from "@/data/assets";
import {
  gemstones as staticGemstones,
  getFeaturedGemstones,
  getGemstone as getStaticGemstone,
  type Gemstone,
} from "@/data/gemstones";
import { db } from "@/server/db";
import { gemstoneImages, gemstones } from "@/server/db/schema";

type DbGemstone = typeof gemstones.$inferSelect & {
  images: Array<typeof gemstoneImages.$inferSelect>;
};

function imageFromUrl(url: string | null | undefined): ProductionImage | null {
  if (!url) return null;
  return { available: true, src: url };
}

function heroFor(image: ProductionImage, alt: string, position = "64% center"): HeroImageConfig {
  return {
    heroAlt: alt,
    heroImage: image,
    heroObjectPositionDesktop: position,
    heroObjectPositionMobile: "56% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  };
}

async function attachImages<T extends typeof gemstones.$inferSelect>(rows: T[]) {
  if (!rows.length) return [] as Array<T & { images: Array<typeof gemstoneImages.$inferSelect> }>;

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

function mapDbImages(images: DbGemstone["images"]) {
  return images.map((image) => imageFromUrl(image.url)).filter((image): image is ProductionImage => Boolean(image));
}

function hasCuratedStaticGallery(fallback: Gemstone | undefined) {
  const [alternateImage, jewelleryImage] = fallback?.galleryImages ?? [];
  return Boolean(
    alternateImage?.src.includes("-alt.") && jewelleryImage?.src.includes("-jewellery-square-safe."),
  );
}

function hasCustomDbGalleryImage(row: DbGemstone) {
  return row.images.some((image) => {
    if (image.imageRole !== "gallery") return false;
    return Boolean(image.storageKey) || !image.url.startsWith("/images/");
  });
}

function resolveGalleryImages(row: DbGemstone, fallback: Gemstone | undefined, primaryImage: ProductionImage) {
  const dbGalleryImages = mapDbImages(row.images.filter((image) => image.imageRole === "gallery"));

  if (hasCuratedStaticGallery(fallback) && !hasCustomDbGalleryImage(row)) {
    return fallback?.galleryImages ?? [primaryImage];
  }

  if (dbGalleryImages.length) {
    return dbGalleryImages;
  }

  return row.images.length ? mapDbImages(row.images) : fallback?.galleryImages ?? [primaryImage];
}

function mapGemstone(row: DbGemstone): Gemstone {
  const fallback = getStaticGemstone(row.slug);
  const primaryImage =
    imageFromUrl(row.images.find((image) => image.imageRole === "primary")?.url) ??
    imageFromUrl(row.images[0]?.url) ??
    fallback?.primaryImage ??
    heroImages.gemstoneSapphire;
  const galleryImages = resolveGalleryImages(row, fallback, primaryImage);
  const heroImage =
    imageFromUrl(row.images.find((image) => image.imageRole === "hero")?.url) ??
    fallback?.heroImage ??
    primaryImage;
  const shortDescription = row.shortDescription ?? row.description ?? fallback?.shortDescription ?? "";
  const longDescription = row.longDescription ?? row.description ?? fallback?.longDescription ?? shortDescription;
  const originCountry = row.originCountry ?? fallback?.originCountry ?? row.origin ?? "";
  const originDisplay = row.originDisplay ?? fallback?.originDisplay ?? row.origin ?? originCountry;
  const type = row.type ?? fallback?.type ?? "Gemstone";
  const family = row.family ?? fallback?.family ?? type;

  return {
    id: row.id,
    caratRange: row.caratRange ?? fallback?.caratRange ?? "Available by private consultation",
    care: row.careNotes ?? fallback?.care ?? "",
    careNotes: row.careNotes ?? fallback?.careNotes ?? "",
    certification: row.certification ?? fallback?.certification ?? "Certificate available on request",
    clarity: row.clarity ?? fallback?.clarity ?? "Assessed individually",
    color: row.color ?? fallback?.color ?? "Selected colour",
    cutOptions: row.cutOptions?.length ? row.cutOptions : fallback?.cutOptions ?? [],
    description: shortDescription,
    displayOrder: row.sortOrder,
    family,
    galleryImages,
    hero: fallback?.hero ?? heroFor(heroImage, `${row.name} gemstone profile`),
    heroImage,
    highlights: row.highlights?.length ? row.highlights : fallback?.highlights ?? [],
    image: primaryImage,
    inquirySubject: row.inquirySubject ?? fallback?.inquirySubject ?? `${row.name} enquiry`,
    isFeatured: row.isFeatured,
    jewelleryUse: fallback?.jewelleryUse ?? "Private jewellery commissions",
    longDescription,
    meaning: fallback?.meaning ?? "Rarity and personal significance",
    name: row.name,
    origin: row.origin ?? fallback?.origin ?? originDisplay,
    originCountry,
    originDisplay,
    originRegion: row.originRegion ?? fallback?.originRegion,
    priceLabel: row.priceLabel ?? fallback?.priceLabel ?? "Price on request",
    priceNote: row.priceNote ?? fallback?.priceNote ?? "Quoted after private review.",
    primaryImage,
    rarity: row.rarity ?? fallback?.rarity ?? "Selected for rarity and character",
    relatedCollectionSlugs: row.relatedCollectionSlugs?.length
      ? row.relatedCollectionSlugs
      : fallback?.relatedCollectionSlugs ?? [],
    relatedGemSlugs: row.relatedGemSlugs?.length ? row.relatedGemSlugs : fallback?.relatedGemSlugs ?? [],
    relatedJewellerySlugs: row.relatedJewellerySlugs?.length
      ? row.relatedJewellerySlugs
      : fallback?.relatedJewellerySlugs ?? [],
    shortDescription,
    slug: row.slug,
    treatment: row.treatment ?? fallback?.treatment ?? "Treatment disclosed on request",
    type,
  };
}

async function listDbGemstones() {
  const rows = await db
    .select()
    .from(gemstones)
    .orderBy(asc(gemstones.sortOrder), asc(gemstones.name));

  return attachImages(rows);
}

function sortPublicGemstones(items: Gemstone[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

function mergeGemstonesWithStaticFallback(dbRows: DbGemstone[]) {
  const merged = new Map<string, Gemstone>();

  for (const gemstone of staticGemstones) {
    merged.set(gemstone.slug, gemstone);
  }

  for (const row of dbRows) {
    if (row.isPublished) {
      merged.set(row.slug, mapGemstone(row));
    } else {
      merged.delete(row.slug);
    }
  }

  return sortPublicGemstones([...merged.values()]);
}

export async function listPublicGemstonesWithFallback() {
  try {
    const rows = await listDbGemstones();
    return mergeGemstonesWithStaticFallback(rows);
  } catch {
    return sortPublicGemstones([...staticGemstones]);
  }
}

export async function listPublicFeaturedGemstonesWithFallback(limit = 6) {
  try {
    const rows = await listDbGemstones();
    const featured = mergeGemstonesWithStaticFallback(rows)
      .filter((gemstone) => gemstone.isFeatured)
      .slice(0, limit);
    if (featured.length) return featured;
  } catch {
    return getFeaturedGemstones(limit);
  }

  return getFeaturedGemstones(limit);
}

export async function getPublicGemstoneBySlugWithFallback(slug: string) {
  try {
    const rows = await db
      .select()
      .from(gemstones)
      .where(eq(gemstones.slug, slug))
      .limit(1);
    const [gemstone] = await attachImages(rows);
    if (gemstone) return gemstone.isPublished ? mapGemstone(gemstone) : null;
  } catch {
    return getStaticGemstone(slug) ?? null;
  }

  return getStaticGemstone(slug) ?? null;
}

export async function listPublicGemstoneSlugs() {
  try {
    const rows = await db
      .select({ isPublished: gemstones.isPublished, slug: gemstones.slug })
      .from(gemstones);
    const slugs = new Set(staticGemstones.map((gemstone) => gemstone.slug));
    for (const row of rows) {
      if (row.isPublished) {
        slugs.add(row.slug);
      } else {
        slugs.delete(row.slug);
      }
    }
    return [...slugs];
  } catch {
    return staticGemstones.map((gemstone) => gemstone.slug);
  }
}
