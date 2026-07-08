import { loadEnvConfig } from "@next/env";

import type { Gemstone } from "../src/data/gemstones";
import type { gemstones as gemstonesTable } from "../src/server/db/schema";
import type { GemstoneImageRole, GemstoneWriteInput } from "../src/server/repositories/gemstones.repo";

loadEnvConfig(process.cwd());

type ExistingGemstone = typeof gemstonesTable.$inferSelect;

type StaticImage = {
  available?: boolean;
  src: string;
};

type StaticImageRecord = {
  alt: string;
  image: StaticImage | null;
  role: GemstoneImageRole;
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

function preferText(current: string | null | undefined, fallback: string | null | undefined) {
  const currentValue = current?.trim();
  if (currentValue) return current;
  return fallback?.trim() ? fallback : null;
}

function preferList(current: string[] | null | undefined, fallback: readonly string[]) {
  return Array.isArray(current) && current.length ? [...current] : [...fallback];
}

function staticInput(gemstone: Gemstone): GemstoneWriteInput {
  return {
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
  };
}

function mergedInput(gemstone: Gemstone, existing: ExistingGemstone): GemstoneWriteInput {
  return {
    careNotes: preferText(existing.careNotes, gemstone.careNotes),
    caratRange: preferText(existing.caratRange, gemstone.caratRange),
    certification: preferText(existing.certification, gemstone.certification),
    clarity: preferText(existing.clarity, gemstone.clarity),
    color: preferText(existing.color, gemstone.color),
    cutOptions: preferList(existing.cutOptions, gemstone.cutOptions),
    description: preferText(existing.description, gemstone.shortDescription),
    family: preferText(existing.family, gemstone.family),
    highlights: preferList(existing.highlights, gemstone.highlights),
    inquirySubject: preferText(existing.inquirySubject, gemstone.inquirySubject),
    isFeatured: existing.isFeatured,
    isPublished: existing.isPublished,
    longDescription: preferText(existing.longDescription, gemstone.longDescription),
    name: preferText(existing.name, gemstone.name) ?? gemstone.name,
    origin: preferText(existing.origin, gemstone.origin),
    originCountry: preferText(existing.originCountry, gemstone.originCountry),
    originDisplay: preferText(existing.originDisplay, gemstone.originDisplay),
    originRegion: preferText(existing.originRegion, gemstone.originRegion),
    priceLabel: preferText(existing.priceLabel, gemstone.priceLabel),
    priceNote: preferText(existing.priceNote, gemstone.priceNote),
    rarity: preferText(existing.rarity, gemstone.rarity),
    relatedCollectionSlugs: preferList(existing.relatedCollectionSlugs, gemstone.relatedCollectionSlugs),
    relatedGemSlugs: preferList(existing.relatedGemSlugs, gemstone.relatedGemSlugs),
    relatedJewellerySlugs: preferList(existing.relatedJewellerySlugs, gemstone.relatedJewellerySlugs),
    shortDescription: preferText(existing.shortDescription, gemstone.shortDescription),
    slug: existing.slug || gemstone.slug,
    sortOrder: existing.sortOrder > 0 ? existing.sortOrder : gemstone.displayOrder,
    treatment: preferText(existing.treatment, gemstone.treatment),
    type: preferText(existing.type, gemstone.type),
  };
}

function staticImages(gemstone: Gemstone): StaticImageRecord[] {
  return [
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
  ];
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Gemstone sync was not run.");
    process.exitCode = 1;
    return;
  }

  const [{ gemstones: staticGemstones }, repo] = await Promise.all([
    import("../src/data/gemstones"),
    import("../src/server/repositories/gemstones.repo"),
  ]);

  const beforeRows = await repo.listAdminGemstones();
  let inserted = 0;
  let updated = 0;
  let imageRecordsInserted = 0;
  let imageRecordsSkipped = 0;

  for (const gemstone of staticGemstones) {
    const existing = await repo.getGemstoneBySlug(gemstone.slug);
    const gemstoneId = existing
      ? existing.id
      : await repo.createGemstone(staticInput(gemstone));

    if (existing) {
      await repo.updateGemstone(existing.id, mergedInput(gemstone, existing));
      updated += 1;
    } else {
      inserted += 1;
    }

    const existingImages = await repo.listImagesForGemstone(gemstoneId);
    const existingImageKeys = new Set(
      existingImages.map((image) => `${image.imageRole}:${image.url}`),
    );

    for (const [index, item] of staticImages(gemstone).entries()) {
      if (!item.image?.available) continue;

      const imageKey = `${item.role}:${item.image.src}`;
      if (existingImageKeys.has(imageKey)) {
        imageRecordsSkipped += 1;
        continue;
      }

      await repo.attachGemstoneImage(gemstoneId, {
        alt: item.alt,
        imageRole: item.role,
        sortOrder: index,
        url: item.image.src,
      });
      existingImageKeys.add(imageKey);
      imageRecordsInserted += 1;
    }
  }

  await repo.normalizeGemstoneDisplayOrders();
  const finalRows = await repo.listAdminGemstones();
  const finalSlugs = new Set(finalRows.map((gemstone) => gemstone.slug));
  const missingSlugs = staticGemstones
    .map((gemstone) => gemstone.slug)
    .filter((slug) => !finalSlugs.has(slug));

  console.log(`Admin gemstone records before sync: ${beforeRows.length}`);
  console.log(`Static gemstone records: ${staticGemstones.length}`);
  console.log(`Missing gemstones inserted: ${inserted}`);
  console.log(`Existing gemstones updated with missing static fields: ${updated}`);
  console.log(`Image records inserted: ${imageRecordsInserted}`);
  console.log(`Existing image records skipped: ${imageRecordsSkipped}`);
  console.log(`Admin gemstone records after sync: ${finalRows.length}`);
  console.log(`Missing static slugs after sync: ${missingSlugs.length ? missingSlugs.join(", ") : "none"}`);
}

main().catch((error) => {
  console.error("Gemstone sync failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exitCode = 1;
});
