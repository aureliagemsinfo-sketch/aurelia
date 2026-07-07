# Future Admin Gem Management

Phase 6.14 uses static frontend data for gemstones and collection relationships. Phase 7.4 introduces database-backed admin gemstone management, and Phase 7.5 introduces database-backed admin collection management. The public frontend still intentionally reads from `src/data/gemstones.ts` and `src/data/collections.ts` until a later public-read migration phase.

## Current Static Frontend Sources

- Gemstone catalogue data: `src/data/gemstones.ts`
- Collection relationship data: `src/data/collections.ts`
- Homepage gemstone grid: `src/components/sections/CreationCategoryGrid.tsx`
- Gemstone listing route: `src/app/(site)/gemstones/page.tsx`
- Gemstone detail route: `src/app/(site)/gemstones/[slug]/page.tsx`
- Collection detail related-gem section: `src/app/(site)/collections/[slug]/page.tsx`

## Phase 7.4 Gemstone Admin Status

Implemented admin routes:

- `/admin/gemstones`
- `/admin/gemstones/new`
- `/admin/gemstones/[id]`

Implemented backend pieces:

- Drizzle gemstone and gemstone image schema fields that mirror the current static gemstone model.
- Migration file `drizzle/0001_massive_sharon_carter.sql`.
- Repository helpers in `src/server/repositories/gemstones.repo.ts`.
- Protected server actions in `src/server/actions/admin/gemstones.ts`.
- Seed script `scripts/seed-gemstones.ts`, exposed as `pnpm db:seed:gemstones`.
- R2 signed-upload flow for new admin image uploads.

The seed script copies the current static gemstones into database records and inserts image records for existing public assets when a gemstone has no image records yet. It does not upload public assets to R2.

## Gemstone Admin Capabilities

The admin panel now allows authorised users to:

- **Global Sourcing & Additions**: Create, edit, delete, publish, and unpublish gemstones from any country.
- **Origin Metadata**: Set and configure specific origin attributes:
  - `originCountry`: The country of origin (e.g. "Sri Lanka", "Myanmar", "Colombia").
  - `originRegion`: An optional region/district label (e.g. "Mogok", "Muzo").
  - `originDisplay`: The user-facing label combining these (e.g. "Mogok, Myanmar", "Ceylon, Sri Lanka").
- **Homepage Curation & Ordering**:
  - Choose featured gemstones to show in the homepage grid using the `isFeatured` flag.
  - Set display order with a `displayOrder` field to precisely arrange stones.
- **Collection Relationships**:
  - Assign related gemstones to collections (updating both `relatedCollectionSlugs` on the gemstone and `relatedGemSlugs` on the collection to link them for curated displays).
- **Images & Details**:
  - Update gemstone name, slug, type, family, colour, rarity, clarity, treatment, certification, cut options, carat range, price label, and price notes.
  - Update short and long gemstone descriptions, highlights, care notes, and inquiry email subject text.
  - Upload and replace gemstone images by role: primary/card image, gallery photos, and page hero image.
- **Publish Status**: Publish or unpublish gems to selectively hide/show them in the catalogue or on collection pages.

Cropping is not implemented yet. Uploaded images should be prepared before upload and exported as high-quality JPG, PNG, or WebP files under 8 MB.

## Phase 7.5 Collection Admin Status

Implemented admin routes:

- `/admin/collections`
- `/admin/collections/new`
- `/admin/collections/[id]`

Implemented backend pieces:

- Drizzle collection and collection image schema fields that mirror the current static collection model.
- Migration file `drizzle/0002_previous_doctor_spectrum.sql`.
- Repository helpers in `src/server/repositories/collections.repo.ts`.
- Protected server actions in `src/server/actions/admin/collections.ts`.
- Seed script `scripts/seed-collections.ts`, exposed as `pnpm db:seed:collections`.
- R2 signed-upload flow for new admin collection images.

The admin panel now allows authorised users to:

- Create, edit, delete, publish, unpublish, and reorder collections.
- Update collection name, slug, eyebrow, story, short description, highlights, hero metadata, and related jewellery slugs.
- Assign related gemstones from database gemstone records and set a simple related-gem display order.
- Upload, role, reorder, and delete collection images for `primary`, `hero`, and `gallery` usage.

The seed script copies the current static collections into database records, inserts image records for existing public assets when a collection has no image records yet, and maps `relatedGemSlugs` to database gemstone ids when those gemstone records exist. It does not upload public assets to R2.

## Image Strategy

The current implementation uses existing generated gemstone imagery where suitable. Phase 6.14.1 replaced the remaining CSS fallback gemstone artwork with real premium still-life gemstone images under `public/images/gemstones/`, so public gemstone cards and gemstone detail pages should no longer rely on mock circular fallback art.

Current generated gemstone assets include:

- `public/images/gemstones/padparadscha-sapphire.webp`
- `public/images/gemstones/star-sapphire.webp`
- `public/images/gemstones/cats-eye-chrysoberyl.webp`
- `public/images/gemstones/alexandrite.webp`
- `public/images/gemstones/garnet.webp`
- `public/images/gemstones/moonstone.webp`
- `public/images/gemstones/zircon.webp`
- `public/images/gemstones/topaz.webp`

Future admin image upload should still allow these generated assets to be replaced with client-approved photography and should store alt text, image role, display order, and availability/publish status.

Suggested art direction for replacement gemstone images:

- Use isolated or lightly editorial gemstone still life compositions, not finished jewellery product photography.
- Keep the palette ivory, champagne, warm stone, and soft shadow so cards stay consistent with the maison visual system.
- Show enough gem shape and colour to identify the stone clearly at card size.
- Avoid heavy black backgrounds, saturated ecommerce lighting, text overlays, hands, packaging, or unrelated jewellery.
- Export final assets as WebP and set `available: true` only after the file exists in `public/`.

## Backend Mapping Notes

The frontend static model currently includes fields that can map directly to future admin/database records:

- `id`
- `slug`
- `name`
- `type`
- `family`
- `origin` (legacy alias)
- `originCountry`
- `originRegion` (optional)
- `originDisplay`
- `color`
- `rarity`
- `cutOptions`
- `caratRange`
- `priceLabel`
- `priceNote`
- `treatment`
- `clarity`
- `certification`
- `shortDescription`
- `longDescription`
- `primaryImage`
- `galleryImages`
- `heroImage`
- `relatedCollectionSlugs`
- `relatedGemSlugs`
- `relatedJewellerySlugs`
- `highlights`
- `careNotes`
- `inquirySubject`
- `isFeatured`
- `displayOrder`

## Public Read Migration Notes

The static helpers in `src/data/gemstones.ts` can later be replaced by server-side fetching while keeping the public route structure and component contracts mostly intact. That migration should happen only after gemstone, collection, and product admin CRUD are stable.

Before switching public reads to the database:

- Confirm all static gemstones have been seeded with `pnpm db:seed:gemstones`.
- Confirm published/draft state is correct in `/admin/gemstones`.
- Confirm primary, hero, and gallery image records exist for every published gemstone.
- Decide whether public pages should read R2 URLs, existing local public URLs, or a mixture during transition.
- Keep `/gemstones`, gemstone detail pages, collection detail related gems, and homepage gemstone sections visually unchanged during the data-source swap.
