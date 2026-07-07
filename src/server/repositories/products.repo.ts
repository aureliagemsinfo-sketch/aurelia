import { randomUUID } from "node:crypto";

import { asc, eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import {
  collections,
  jewelleryProducts,
  productGemstones,
  productImages,
  relatedProducts,
} from "@/server/db/schema";

export type ProductImageRole = "primary" | "gallery" | "hero";

export type ProductImageInput = {
  alt: string;
  contentType?: string | null;
  height?: number | null;
  imageRole: ProductImageRole;
  sizeBytes?: number | null;
  sortOrder?: number;
  storageKey?: string | null;
  url: string;
  width?: number | null;
};

export type ProductGemstoneInput = {
  carat?: string | null;
  clarity?: string | null;
  color?: string | null;
  cut?: string | null;
  gemstoneId?: string | null;
  gemstoneName: string;
  gemstoneType?: string | null;
  origin?: string | null;
  setting?: string | null;
  sortOrder: number;
  treatment?: string | null;
};

export type RelatedProductInput = {
  productId: string;
  sortOrder: number;
};

export type ProductWriteInput = {
  availability?: string | null;
  careInstructions?: string | null;
  category?: string | null;
  certificateDetails?: string | null;
  collectionId?: string | null;
  craftsmanship?: string | null;
  currency?: string | null;
  description?: string | null;
  dimensions?: string | null;
  highlights?: string[];
  inquirySubject?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  longDescription?: string | null;
  material?: string | null;
  metal?: string | null;
  name: string;
  price?: number | null;
  priceLabel?: string | null;
  referenceCode?: string | null;
  shortDescription?: string | null;
  slug: string;
  sortOrder?: number;
  specifications?: Record<string, unknown> | null;
  summary?: string | null;
  totalCaratWeight?: string | null;
};

export type AdminProduct = typeof jewelleryProducts.$inferSelect & {
  collection: { id: string; name: string; slug: string } | null;
  gemstones: Array<typeof productGemstones.$inferSelect>;
  images: Array<typeof productImages.$inferSelect>;
  relatedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
  }>;
};

export type CollectionOption = {
  id: string;
  name: string;
  slug: string;
};

export type ProductOption = {
  id: string;
  name: string;
  slug: string;
};

function productSet(input: ProductWriteInput) {
  return {
    availability: input.availability ?? null,
    careInstructions: input.careInstructions ?? null,
    category: input.category ?? null,
    certificateDetails: input.certificateDetails ?? null,
    collectionId: input.collectionId ?? null,
    craftsmanship: input.craftsmanship ?? null,
    currency: input.currency ?? null,
    description: input.description ?? input.longDescription ?? null,
    dimensions: input.dimensions ?? null,
    highlights: input.highlights ?? [],
    inquirySubject: input.inquirySubject ?? null,
    isFeatured: input.isFeatured ?? false,
    isPublished: input.isPublished ?? false,
    longDescription: input.longDescription ?? input.description ?? null,
    material: input.material ?? input.metal ?? null,
    metal: input.metal ?? input.material ?? null,
    name: input.name,
    price: input.price ?? null,
    priceLabel: input.priceLabel ?? null,
    referenceCode: input.referenceCode ?? null,
    shortDescription: input.shortDescription ?? input.summary ?? null,
    slug: input.slug,
    sortOrder: input.sortOrder ?? 0,
    specifications: input.specifications ?? null,
    summary: input.summary ?? input.shortDescription ?? null,
    totalCaratWeight: input.totalCaratWeight ?? null,
    updatedAt: new Date(),
  };
}

async function attachProductRelations<T extends typeof jewelleryProducts.$inferSelect>(rows: T[]) {
  if (!rows.length) {
    return [] as Array<T & Pick<AdminProduct, "collection" | "gemstones" | "images" | "relatedProducts">>;
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
      .select()
      .from(relatedProducts)
      .where(inArray(relatedProducts.productId, productIds))
      .orderBy(asc(relatedProducts.sortOrder)),
    collectionIds.length
      ? db
          .select({ id: collections.id, name: collections.name, slug: collections.slug })
          .from(collections)
          .where(inArray(collections.id, collectionIds))
      : [],
  ]);

  const relatedIds = [...new Set(relatedRows.map((row) => row.relatedProductId))];
  const relatedProductRows = relatedIds.length
    ? await db
        .select({ id: jewelleryProducts.id, name: jewelleryProducts.name, slug: jewelleryProducts.slug })
        .from(jewelleryProducts)
        .where(inArray(jewelleryProducts.id, relatedIds))
    : [];

  const collectionsById = new Map(collectionRows.map((collection) => [collection.id, collection]));
  const relatedById = new Map(relatedProductRows.map((product) => [product.id, product]));
  const imagesByProduct = new Map<string, Array<typeof productImages.$inferSelect>>();
  const gemstonesByProduct = new Map<string, Array<typeof productGemstones.$inferSelect>>();
  const relatedByProduct = new Map<string, AdminProduct["relatedProducts"]>();

  for (const image of imageRows) {
    imagesByProduct.set(image.productId, [...(imagesByProduct.get(image.productId) ?? []), image]);
  }

  for (const gemstone of gemstoneRows) {
    gemstonesByProduct.set(gemstone.productId, [
      ...(gemstonesByProduct.get(gemstone.productId) ?? []),
      gemstone,
    ]);
  }

  for (const link of relatedRows) {
    const product = relatedById.get(link.relatedProductId);
    if (!product) continue;
    relatedByProduct.set(link.productId, [
      ...(relatedByProduct.get(link.productId) ?? []),
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sortOrder: link.sortOrder,
      },
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

export async function listAdminProducts() {
  const rows = await db
    .select()
    .from(jewelleryProducts)
    .orderBy(asc(jewelleryProducts.sortOrder), asc(jewelleryProducts.name));

  return attachProductRelations(rows);
}

export async function getAdminProductById(id: string) {
  const [row] = await db.select().from(jewelleryProducts).where(eq(jewelleryProducts.id, id)).limit(1);
  if (!row) return null;
  const [withRelations] = await attachProductRelations([row]);
  return withRelations;
}

export async function createProduct(
  input: ProductWriteInput,
  gemstones: ProductGemstoneInput[],
  related: RelatedProductInput[],
) {
  const id = randomUUID();
  await db.insert(jewelleryProducts).values({
    id,
    ...productSet(input),
    createdAt: new Date(),
  });
  await updateProductGemstones(id, gemstones);
  await updateRelatedProducts(id, related);
  return id;
}

export async function updateProduct(
  id: string,
  input: ProductWriteInput,
  gemstones: ProductGemstoneInput[],
  related: RelatedProductInput[],
) {
  await db.update(jewelleryProducts).set(productSet(input)).where(eq(jewelleryProducts.id, id));
  await updateProductGemstones(id, gemstones);
  await updateRelatedProducts(id, related);
}

export async function deleteProduct(id: string) {
  await db.delete(jewelleryProducts).where(eq(jewelleryProducts.id, id));
}

export async function toggleProductPublished(id: string, isPublished: boolean) {
  await db
    .update(jewelleryProducts)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(jewelleryProducts.id, id));
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await db
    .update(jewelleryProducts)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(jewelleryProducts.id, id));
}

export async function updateProductDisplayOrder(id: string, sortOrder: number) {
  await db
    .update(jewelleryProducts)
    .set({ sortOrder, updatedAt: new Date() })
    .where(eq(jewelleryProducts.id, id));
}

export async function attachProductImage(productId: string, input: ProductImageInput) {
  const id = randomUUID();
  await db.insert(productImages).values({
    alt: input.alt,
    contentType: input.contentType ?? null,
    height: input.height ?? null,
    id,
    imageRole: input.imageRole,
    productId,
    sizeBytes: input.sizeBytes ?? null,
    sortOrder: input.sortOrder ?? 0,
    storageKey: input.storageKey ?? null,
    url: input.url,
    width: input.width ?? null,
  });
  return id;
}

export async function updateProductImageRole(imageId: string, imageRole: ProductImageRole) {
  await db.update(productImages).set({ imageRole, updatedAt: new Date() }).where(eq(productImages.id, imageId));
}

export async function deleteProductImage(imageId: string) {
  await db.delete(productImages).where(eq(productImages.id, imageId));
}

export async function reorderProductImages(imageId: string, sortOrder: number) {
  await db.update(productImages).set({ sortOrder, updatedAt: new Date() }).where(eq(productImages.id, imageId));
}

export async function updateProductGemstones(productId: string, gemstoneRows: ProductGemstoneInput[]) {
  await db.delete(productGemstones).where(eq(productGemstones.productId, productId));

  if (!gemstoneRows.length) return;

  await db.insert(productGemstones).values(
    gemstoneRows.map((gemstone) => ({
      carat: gemstone.carat ?? null,
      clarity: gemstone.clarity ?? null,
      color: gemstone.color ?? null,
      cut: gemstone.cut ?? null,
      gemstoneId: gemstone.gemstoneId ?? null,
      gemstoneName: gemstone.gemstoneName,
      gemstoneType: gemstone.gemstoneType ?? null,
      id: randomUUID(),
      origin: gemstone.origin ?? null,
      productId,
      setting: gemstone.setting ?? null,
      sortOrder: gemstone.sortOrder,
      treatment: gemstone.treatment ?? null,
    })),
  );
}

export async function updateRelatedProducts(productId: string, related: RelatedProductInput[]) {
  await db.delete(relatedProducts).where(eq(relatedProducts.productId, productId));

  if (!related.length) return;

  await db.insert(relatedProducts).values(
    related
      .filter((item) => item.productId !== productId)
      .map((item) => ({
        productId,
        relatedProductId: item.productId,
        sortOrder: item.sortOrder,
      })),
  );
}

export async function upsertSeedProduct(id: string, input: ProductWriteInput) {
  await db
    .insert(jewelleryProducts)
    .values({
      id,
      ...productSet(input),
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: jewelleryProducts.slug,
      set: productSet(input),
    });

  const [row] = await db
    .select()
    .from(jewelleryProducts)
    .where(eq(jewelleryProducts.slug, input.slug))
    .limit(1);
  return row;
}

export async function listImagesForProduct(productId: string) {
  return db.select().from(productImages).where(eq(productImages.productId, productId));
}

export async function listCollectionOptions() {
  return db
    .select({ id: collections.id, name: collections.name, slug: collections.slug })
    .from(collections)
    .orderBy(asc(collections.sortOrder), asc(collections.name));
}

export async function listProductOptions(excludeId?: string) {
  const rows = await db
    .select({ id: jewelleryProducts.id, name: jewelleryProducts.name, slug: jewelleryProducts.slug })
    .from(jewelleryProducts)
    .orderBy(asc(jewelleryProducts.sortOrder), asc(jewelleryProducts.name));

  return excludeId ? rows.filter((product) => product.id !== excludeId) : rows;
}

export async function getCollectionIdsBySlug(slugs: string[]) {
  if (!slugs.length) return new Map<string, string>();

  const rows = await db
    .select({ id: collections.id, slug: collections.slug })
    .from(collections)
    .where(inArray(collections.slug, slugs));

  return new Map(rows.map((collection) => [collection.slug, collection.id]));
}

export async function getProductIdsBySlug(slugs: string[]) {
  if (!slugs.length) return new Map<string, string>();

  const rows = await db
    .select({ id: jewelleryProducts.id, slug: jewelleryProducts.slug })
    .from(jewelleryProducts)
    .where(inArray(jewelleryProducts.slug, slugs));

  return new Map(rows.map((product) => [product.slug, product.id]));
}

export async function productSlugExists(slug: string, excludeId?: string) {
  const [row] = await db
    .select({ id: jewelleryProducts.id })
    .from(jewelleryProducts)
    .where(eq(jewelleryProducts.slug, slug))
    .limit(1);

  return Boolean(row && row.id !== excludeId);
}
