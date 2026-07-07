import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";

import { homepageImages, type HeroImageConfig, type ProductionImage } from "@/data/assets";
import {
  getJewelleryPiece as getStaticJewelleryPiece,
  jewellery as staticJewellery,
  type JewelleryGemstone,
  type JewelleryPiece,
} from "@/data/jewellery";
import { db } from "@/server/db";
import {
  collections,
  jewelleryProducts,
  productGemstones,
  productImages,
  relatedProducts,
} from "@/server/db/schema";

type DbProduct = typeof jewelleryProducts.$inferSelect & {
  collection: { name: string; slug: string } | null;
  gemstones: Array<typeof productGemstones.$inferSelect>;
  images: Array<typeof productImages.$inferSelect>;
  relatedProducts: Array<{ slug: string; sortOrder: number }>;
};

function imageFromUrl(url: string | null | undefined): ProductionImage | null {
  if (!url) return null;
  return { available: true, src: url };
}

function heroFor(image: ProductionImage, alt: string): HeroImageConfig {
  return {
    heroAlt: alt,
    heroImage: image,
    heroObjectPositionDesktop: "50% 46%",
    heroObjectPositionMobile: "50% 46%",
    heroOverlayStyle: "none",
    heroTheme: "dark-text",
  };
}

function mapGemstone(row: typeof productGemstones.$inferSelect): JewelleryGemstone {
  return {
    carat: row.carat ?? "",
    clarity: row.clarity ?? "",
    color: row.color ?? "",
    cut: row.cut ?? "",
    name: row.gemstoneName,
    origin: row.origin ?? "",
    setting: row.setting ?? "",
    treatment: row.treatment ?? "",
    type: row.gemstoneType ?? row.gemstoneName,
  };
}

async function attachRelations<T extends typeof jewelleryProducts.$inferSelect>(rows: T[]) {
  if (!rows.length) {
    return [] as Array<T & Pick<DbProduct, "collection" | "gemstones" | "images" | "relatedProducts">>;
  }

  const productIds = rows.map((product) => product.id);
  const collectionIds = rows.map((product) => product.collectionId).filter(Boolean) as string[];
  const [imageRows, gemstoneRows, relatedRows, collectionRows] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(asc(productImages.sortOrder), asc(productImages.createdAt)),
    db
      .select()
      .from(productGemstones)
      .where(inArray(productGemstones.productId, productIds))
      .orderBy(asc(productGemstones.sortOrder)),
    db
      .select({
        productId: relatedProducts.productId,
        slug: jewelleryProducts.slug,
        sortOrder: relatedProducts.sortOrder,
      })
      .from(relatedProducts)
      .innerJoin(jewelleryProducts, eq(relatedProducts.relatedProductId, jewelleryProducts.id))
      .where(and(inArray(relatedProducts.productId, productIds), eq(jewelleryProducts.isPublished, true)))
      .orderBy(asc(relatedProducts.sortOrder)),
    collectionIds.length
      ? db
          .select({ id: collections.id, name: collections.name, slug: collections.slug })
          .from(collections)
          .where(and(inArray(collections.id, collectionIds), eq(collections.isPublished, true)))
      : [],
  ]);

  const collectionsById = new Map(collectionRows.map((collection) => [collection.id, collection]));
  const imagesByProduct = new Map<string, Array<typeof productImages.$inferSelect>>();
  const gemstonesByProduct = new Map<string, Array<typeof productGemstones.$inferSelect>>();
  const relatedByProduct = new Map<string, DbProduct["relatedProducts"]>();

  for (const image of imageRows) {
    imagesByProduct.set(image.productId, [...(imagesByProduct.get(image.productId) ?? []), image]);
  }

  for (const gemstone of gemstoneRows) {
    gemstonesByProduct.set(gemstone.productId, [
      ...(gemstonesByProduct.get(gemstone.productId) ?? []),
      gemstone,
    ]);
  }

  for (const related of relatedRows) {
    relatedByProduct.set(related.productId, [
      ...(relatedByProduct.get(related.productId) ?? []),
      { slug: related.slug, sortOrder: related.sortOrder },
    ]);
  }

  return rows.map((product) => ({
    ...product,
    collection: product.collectionId ? collectionsById.get(product.collectionId) ?? null : null,
    gemstones: gemstonesByProduct.get(product.id) ?? [],
    images: imagesByProduct.get(product.id) ?? [],
    relatedProducts: relatedByProduct.get(product.id) ?? [],
  }));
}

function mapProduct(row: DbProduct): JewelleryPiece {
  const fallback = getStaticJewelleryPiece(row.slug);
  const collectionName = row.collection?.name ?? fallback?.collectionName ?? "Aurelia Gems";
  const collectionSlug = row.collection?.slug ?? fallback?.collectionSlug ?? "";
  const primaryImage =
    imageFromUrl(row.images.find((image) => image.imageRole === "primary")?.url) ??
    imageFromUrl(row.images[0]?.url) ??
    fallback?.primaryImage ??
    homepageImages.necklace;
  const galleryImages = row.images.length
    ? row.images.map((image) => imageFromUrl(image.url)).filter((image): image is ProductionImage => Boolean(image))
    : fallback?.galleryImages ?? [primaryImage];
  const heroImage =
    imageFromUrl(row.images.find((image) => image.imageRole === "hero")?.url) ??
    fallback?.heroImage ??
    primaryImage;
  const imagesAlt = row.images.length ? row.images.map((image) => image.alt) : fallback?.imagesAlt ?? [row.name];
  const gemstones = row.gemstones.length ? row.gemstones.map(mapGemstone) : fallback?.gemstones ?? [];
  const shortDescription = row.shortDescription ?? row.summary ?? row.description ?? fallback?.shortDescription ?? "";
  const longDescription = row.longDescription ?? row.description ?? fallback?.longDescription ?? shortDescription;
  const metal = row.metal ?? row.material ?? fallback?.metal ?? "";

  return {
    availability: row.availability ?? fallback?.availability ?? "Available for private enquiry",
    careInstructions: row.careInstructions ?? fallback?.careInstructions ?? "",
    category: row.category ?? fallback?.category ?? "Fine Jewellery",
    certificateDetails: row.certificateDetails ?? fallback?.certificateDetails ?? "",
    collection: collectionName,
    collectionName,
    collectionSlug,
    craftDetails: fallback?.craftDetails ?? [row.craftsmanship ?? ""].filter(Boolean),
    craftsmanship: row.craftsmanship ?? fallback?.craftsmanship ?? "",
    currency: row.currency === "USD" ? "USD" : fallback?.currency ?? null,
    description: shortDescription,
    dimensions: row.dimensions ?? fallback?.dimensions ?? "",
    galleryImages,
    gemstone: gemstones[0]?.name ?? fallback?.gemstone ?? "",
    gemstones,
    hero: fallback?.hero ?? heroFor(heroImage, `${row.name} jewellery creation`),
    heroImage,
    highlights: row.highlights?.length ? row.highlights : fallback?.highlights ?? [],
    id: row.id,
    image: primaryImage,
    imagesAlt,
    inquirySubject: row.inquirySubject ?? fallback?.inquirySubject ?? `${row.name} enquiry`,
    longDescription,
    metal,
    name: row.name,
    price: row.price ?? fallback?.price ?? null,
    priceLabel: row.priceLabel ?? fallback?.priceLabel ?? "Price on request",
    primaryImage,
    referenceCode: row.referenceCode ?? fallback?.referenceCode ?? row.id,
    relatedProductSlugs: row.relatedProducts.length
      ? row.relatedProducts.sort((a, b) => a.sortOrder - b.sortOrder).map((product) => product.slug)
      : fallback?.relatedProductSlugs ?? [],
    shortDescription,
    slug: row.slug,
    totalCaratWeight: row.totalCaratWeight ?? fallback?.totalCaratWeight ?? "",
  };
}

async function listPublishedDbProducts() {
  const rows = await db
    .select()
    .from(jewelleryProducts)
    .where(eq(jewelleryProducts.isPublished, true))
    .orderBy(asc(jewelleryProducts.sortOrder), asc(jewelleryProducts.name));

  return attachRelations(rows);
}

export async function listPublicProductsWithFallback() {
  try {
    const rows = await listPublishedDbProducts();
    if (rows.length) return rows.map(mapProduct);
  } catch {
    return staticJewellery;
  }

  return staticJewellery;
}

export async function getPublicProductBySlugWithFallback(slug: string) {
  try {
    const rows = await db
      .select()
      .from(jewelleryProducts)
      .where(and(eq(jewelleryProducts.slug, slug), eq(jewelleryProducts.isPublished, true)))
      .limit(1);
    const [product] = await attachRelations(rows);
    if (product) return mapProduct(product);
  } catch {
    return getStaticJewelleryPiece(slug) ?? null;
  }

  return getStaticJewelleryPiece(slug) ?? null;
}

export async function listPublicProductSlugs() {
  try {
    const rows = await db
      .select({ slug: jewelleryProducts.slug })
      .from(jewelleryProducts)
      .where(eq(jewelleryProducts.isPublished, true));
    return [...new Set([...staticJewellery.map((piece) => piece.slug), ...rows.map((row) => row.slug)])];
  } catch {
    return staticJewellery.map((piece) => piece.slug);
  }
}
