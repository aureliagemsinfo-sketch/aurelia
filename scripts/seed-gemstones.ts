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

function uniqueImages(images: Array<{ alt: string; image: StaticImage | null; role: "primary" | "gallery" | "hero" }>) {
  const seen = new Set<string>();
  return images.filter(({ image }) => {
    if (!image?.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Gemstone seed was not run.");
    process.exitCode = 1;
    return;
  }

  const [{ gemstones: staticGemstones }, repo] = await Promise.all([
    import("../src/data/gemstones"),
    import("../src/server/repositories/gemstones.repo"),
  ]);

  let insertedOrUpdated = 0;
  let imageRecordsInserted = 0;
  let imageRecordsSkipped = 0;

  for (const gemstone of staticGemstones) {
    const row = await repo.upsertSeedGemstone(gemstone.id, {
      careNotes: gemstone.careNotes,
      caratRange: gemstone.caratRange,
      certification: gemstone.certification,
      clarity: gemstone.clarity,
      color: gemstone.color,
      cutOptions: [...gemstone.cutOptions],
      description: gemstone.shortDescription,
      family: gemstone.family,
      highlights: [...gemstone.highlights],
      inquirySubject: gemstone.inquirySubject,
      isFeatured: gemstone.isFeatured,
      isPublished: true,
      longDescription: gemstone.longDescription,
      name: gemstone.name,
      origin: gemstone.origin,
      originCountry: gemstone.originCountry,
      originDisplay: gemstone.originDisplay,
      originRegion: gemstone.originRegion,
      priceLabel: gemstone.priceLabel,
      priceNote: gemstone.priceNote,
      rarity: gemstone.rarity,
      relatedCollectionSlugs: [...gemstone.relatedCollectionSlugs],
      relatedGemSlugs: [...gemstone.relatedGemSlugs],
      relatedJewellerySlugs: [...gemstone.relatedJewellerySlugs],
      shortDescription: gemstone.shortDescription,
      slug: gemstone.slug,
      sortOrder: gemstone.displayOrder,
      treatment: gemstone.treatment,
      type: gemstone.type,
    });

    insertedOrUpdated += 1;

    const existingImages = await repo.listImagesForGemstone(row.id);
    if (existingImages.length) {
      imageRecordsSkipped += existingImages.length;
      continue;
    }

    const staticImages = uniqueImages([
      {
        alt: `${gemstone.name} primary image`,
        image: asImage(gemstone.primaryImage),
        role: "primary",
      },
      {
        alt: `${gemstone.name} hero image`,
        image: asImage(gemstone.heroImage),
        role: "hero",
      },
      ...gemstone.galleryImages.map((image, index) => ({
        alt: `${gemstone.name} gallery image ${index + 1}`,
        image: asImage(image),
        role: "gallery" as const,
      })),
    ]);

    for (const [index, item] of staticImages.entries()) {
      if (!item.image?.available) continue;
      await repo.attachGemstoneImage(row.id, {
        alt: item.alt,
        imageRole: item.role,
        sortOrder: index,
        url: item.image.src,
      });
      imageRecordsInserted += 1;
    }
  }

  console.log(`Gemstones upserted: ${insertedOrUpdated}`);
  console.log(`Image records inserted: ${imageRecordsInserted}`);
  console.log(`Existing image records skipped: ${imageRecordsSkipped}`);
}

main().catch((error) => {
  console.error("Gemstone seed failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exitCode = 1;
});
