import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

type StaticImage = {
  available?: boolean;
  src: string;
};

function asImage(value: unknown): StaticImage | null {
  if (!value || typeof value !== "object") return null;
  const src = "src" in value ? String(value.src) : "";
  if (!src) return null;
  return {
    available: "available" in value ? Boolean(value.available) : true,
    src,
  };
}

function uniqueImages(
  images: Array<{ alt: string; image: StaticImage | null; role: "primary" | "gallery" | "hero" }>,
) {
  const seen = new Set<string>();
  return images.filter(({ image }) => {
    if (!image?.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Product seed was not run.");
    process.exitCode = 1;
    return;
  }

  const [{ jewellery }, repo] = await Promise.all([
    import("../src/data/jewellery"),
    import("../src/server/repositories/products.repo"),
  ]);

  const collectionSlugs = [...new Set(jewellery.map((piece) => piece.collectionSlug))];
  const collectionIdsBySlug = await repo.getCollectionIdsBySlug(collectionSlugs);

  let productsUpserted = 0;
  let imageRecordsInserted = 0;
  let imageRecordsSkipped = 0;
  let gemstoneRowsInserted = 0;
  let relatedProductLinksInserted = 0;
  let relatedProductLinksSkipped = 0;
  let collectionLinksSkipped = 0;

  for (const [productIndex, piece] of jewellery.entries()) {
    const collectionId = collectionIdsBySlug.get(piece.collectionSlug) ?? null;
    if (!collectionId) collectionLinksSkipped += 1;

    const row = await repo.upsertSeedProduct(piece.id, {
      availability: piece.availability,
      careInstructions: piece.careInstructions,
      category: piece.category,
      certificateDetails: piece.certificateDetails,
      collectionId,
      craftsmanship: piece.craftsmanship,
      currency: piece.currency,
      description: piece.longDescription,
      dimensions: piece.dimensions,
      highlights: [...piece.highlights],
      inquirySubject: piece.inquirySubject,
      isFeatured: false,
      isPublished: true,
      longDescription: piece.longDescription,
      material: piece.metal,
      metal: piece.metal,
      name: piece.name,
      price: piece.price,
      priceLabel: piece.priceLabel,
      referenceCode: piece.referenceCode,
      shortDescription: piece.shortDescription,
      slug: piece.slug,
      sortOrder: productIndex,
      specifications: {
        collectionName: piece.collectionName,
        craftDetails: [...piece.craftDetails],
        legacyDescription: piece.description,
        legacyGemstone: piece.gemstone,
      },
      summary: piece.shortDescription,
      totalCaratWeight: piece.totalCaratWeight,
    });

    productsUpserted += 1;

    await repo.updateProductGemstones(
      row.id,
      piece.gemstones.map((gemstone, index) => ({
        carat: gemstone.carat,
        clarity: gemstone.clarity,
        color: gemstone.color,
        cut: gemstone.cut,
        gemstoneName: gemstone.name,
        gemstoneType: gemstone.type,
        origin: gemstone.origin,
        setting: gemstone.setting,
        sortOrder: index,
        treatment: gemstone.treatment,
      })),
    );
    gemstoneRowsInserted += piece.gemstones.length;

    const existingImages = await repo.listImagesForProduct(row.id);
    if (existingImages.length) {
      imageRecordsSkipped += existingImages.length;
      continue;
    }

    const staticImages = uniqueImages([
      {
        alt: piece.imagesAlt[0] ?? `${piece.name} primary image`,
        image: asImage(piece.primaryImage),
        role: "primary",
      },
      {
        alt: piece.hero.heroAlt,
        image: asImage(piece.heroImage),
        role: "hero",
      },
      ...piece.galleryImages.map((image, index) => ({
        alt: piece.imagesAlt[index] ?? `${piece.name} gallery image ${index + 1}`,
        image: asImage(image),
        role: "gallery" as const,
      })),
    ]);

    for (const [index, item] of staticImages.entries()) {
      if (!item.image?.available) continue;
      await repo.attachProductImage(row.id, {
        alt: item.alt,
        imageRole: item.role,
        sortOrder: index,
        url: item.image.src,
      });
      imageRecordsInserted += 1;
    }
  }

  const productIdsBySlug = await repo.getProductIdsBySlug(jewellery.map((piece) => piece.slug));

  for (const piece of jewellery) {
    const productId = productIdsBySlug.get(piece.slug);
    if (!productId) continue;

    const related = piece.relatedProductSlugs
      .map((slug, index) => {
        const relatedProductId = productIdsBySlug.get(slug);
        if (!relatedProductId) {
          relatedProductLinksSkipped += 1;
          return null;
        }
        return {
          productId: relatedProductId,
          sortOrder: index,
        };
      })
      .filter((item): item is { productId: string; sortOrder: number } => Boolean(item));

    await repo.updateRelatedProducts(productId, related);
    relatedProductLinksInserted += related.length;
  }

  console.log(`Products upserted: ${productsUpserted}`);
  console.log(`Image records inserted: ${imageRecordsInserted}`);
  console.log(`Existing image records skipped: ${imageRecordsSkipped}`);
  console.log(`Product gemstone rows inserted: ${gemstoneRowsInserted}`);
  console.log(`Related product links inserted: ${relatedProductLinksInserted}`);
  console.log(`Related product links skipped: ${relatedProductLinksSkipped}`);
  console.log(`Collection links skipped: ${collectionLinksSkipped}`);
}

main().catch((error) => {
  console.error("Product seed failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exitCode = 1;
});
