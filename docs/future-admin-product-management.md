# Future Admin Product Management

Phase 6.13 kept Aurelia Gems product content as static frontend data. Phase 7.6 introduces database-backed admin jewellery/product management, while the public frontend still intentionally reads from `src/data/jewellery.ts` until a later public-read migration phase.

## Current Static Frontend Sources

- Product records: `src/data/jewellery.ts`
- Collection records: `src/data/collections.ts`
- Public jewellery listing route: `src/app/(site)/jewellery/page.tsx`
- Public jewellery detail route: `src/app/(site)/jewellery/[slug]/page.tsx`
- Product-to-collection relationships use `collectionSlug`.
- Related products use `relatedProductSlugs`.
- Pricing supports both exact prices and luxury "Price on request" presentation.

## Phase 7.6 Product Admin Status

Implemented admin routes:

- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`

Implemented backend pieces:

- Drizzle product, product image, product gemstone detail, and related product schema fields that mirror the current static jewellery model.
- Migration file `drizzle/0003_condemned_ultimates.sql`.
- Repository helpers in `src/server/repositories/products.repo.ts`.
- Protected server actions in `src/server/actions/admin/products.ts`.
- Seed script `scripts/seed-products.ts`, exposed as `pnpm db:seed:products`.
- R2 signed-upload flow for new admin product images.

The admin panel now allows authorised users to:

- Create, edit, delete, publish, unpublish, feature, unfeature, and reorder jewellery products.
- Assign products to seeded/admin collections.
- Update product name, slug, category, descriptions, price, currency, price label, availability, reference code, metal, total carat weight, dimensions, craftsmanship, certificate details, care instructions, highlights, inquiry subject, and display order.
- Add, edit, reorder, and remove product gemstone detail rows by clearing the gemstone name before save.
- Select and order related products through the `related_products` join table.
- Upload, role, reorder, and delete product images for `primary`, `hero`, and `gallery` usage.

The seed script copies current static jewellery records into database records, inserts image records for existing public assets when a product has no image records yet, replaces product gemstone detail rows from static data, and links related products after all product slugs exist. It does not upload public assets to R2.

## Public Read Migration Notes

The static helpers in `src/data/jewellery.ts` can later be replaced by server-side fetching while keeping public route structure and component contracts mostly intact. That migration should happen only after gemstone, collection, and product admin CRUD are stable.

Before switching public reads to the database:

- Confirm all static products have been seeded with `pnpm db:seed:products`.
- Confirm published/draft and featured states are correct in `/admin/products`.
- Confirm collection assignment, product gemstone rows, related products, and image records exist for every published product.
- Decide whether public pages should read R2 URLs, existing local public URLs, or a mixture during transition.
- Keep `/jewellery`, jewellery detail pages, collection product sections, and homepage product sections visually unchanged during the data-source swap.

Out of scope for Phase 7.6:

- No checkout, cart, payment, or inventory reservation flow.
- No public frontend database reads.
- No contact, appointment, or newsletter form backend.
