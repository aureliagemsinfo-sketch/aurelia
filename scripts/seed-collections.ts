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
    console.error("DATABASE_URL is missing. Collection seed was not run.");
    process.exitCode = 1;
    return;
  }

  const [{ collections: staticCollections }, repo] = await Promise.all([
    import("../src/data/collections"),
    import("../src/server/repositories/collections.repo"),
  ]);

  let collectionsUpserted = 0;
  let imageRecordsInserted = 0;
  let imageRecordsSkipped = 0;
  let relatedGemLinksInserted = 0;
  let relatedGemLinksSkipped = 0;

  for (const [collectionIndex, collection] of staticCollections.entries()) {
    const row = await repo.upsertSeedCollection(`collection-${collection.slug}`, {
      description: collection.story.join("\n\n"),
      eyebrow: collection.eyebrow,
      heroAlt: collection.hero.heroAlt,
      heroImageUrl: collection.hero.heroImage.src,
      heroObjectPositionDesktop: collection.hero.heroObjectPositionDesktop,
      heroObjectPositionMobile: collection.hero.heroObjectPositionMobile,
      heroOverlayStyle: collection.hero.heroOverlayStyle,
      heroTheme: collection.hero.heroTheme,
      highlights: [...collection.highlights],
      imagePosition: collection.imagePosition,
      isPublished: true,
      longDescription: collection.story.join("\n\n"),
      name: collection.name,
      relatedJewellerySlugs: [...collection.relatedJewellerySlugs],
      shortDescription: collection.description,
      slug: collection.slug,
      sortOrder: collectionIndex,
      summary: collection.description,
    });

    collectionsUpserted += 1;

    const gemIdsBySlug = await repo.getGemstoneIdsBySlug([...collection.relatedGemSlugs]);
    const relatedGems = collection.relatedGemSlugs
      .map((slug, index) => {
        const gemstoneId = gemIdsBySlug.get(slug);
        if (!gemstoneId) {
          relatedGemLinksSkipped += 1;
          return null;
        }
        return {
          gemstoneId,
          sortOrder: index,
        };
      })
      .filter((gemstone): gemstone is { gemstoneId: string; sortOrder: number } => Boolean(gemstone));

    await repo.updateCollectionRelatedGems(row.id, relatedGems);
    relatedGemLinksInserted += relatedGems.length;

    const existingImages = await repo.listImagesForCollection(row.id);
    if (existingImages.length) {
      imageRecordsSkipped += existingImages.length;
      continue;
    }

    const staticImages = uniqueImages([
      {
        alt: `${collection.name} primary image`,
        image: asImage(collection.image),
        role: "primary",
      },
      {
        alt: collection.hero.heroAlt,
        image: asImage(collection.hero.heroImage),
        role: "hero",
      },
      ...(collection.galleryImages ?? []).map((image, index) => ({
        alt: `${collection.name} gallery image ${index + 1}`,
        image: asImage(image),
        role: "gallery" as const,
      })),
    ]);

    for (const [index, item] of staticImages.entries()) {
      if (!item.image?.available) continue;
      await repo.attachCollectionImage(row.id, {
        alt: item.alt,
        imageRole: item.role,
        sortOrder: index,
        url: item.image.src,
      });
      imageRecordsInserted += 1;
    }
  }

  console.log(`Collections upserted: ${collectionsUpserted}`);
  console.log(`Image records inserted: ${imageRecordsInserted}`);
  console.log(`Existing image records skipped: ${imageRecordsSkipped}`);
  console.log(`Related gem links inserted: ${relatedGemLinksInserted}`);
  console.log(`Related gem links skipped: ${relatedGemLinksSkipped}`);
}

main().catch((error) => {
  console.error("Collection seed failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exitCode = 1;
});
