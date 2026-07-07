# Admin Backend Architecture

This phase adds the backend foundation for the Aurelia Gems admin panel without migrating the public frontend away from static data.

## Stack

- Next.js App Router
- Better Auth for admin authentication
- Neon PostgreSQL
- Drizzle ORM and Drizzle Kit
- Resend for transactional emails
- Cloudflare R2 for private server-side upload signing

## Environment

Required variables are documented in `.env.example`.

- `DATABASE_URL`: Neon PostgreSQL connection string. Use the pooled Neon connection string for serverless runtime access unless a migration task specifically requires the direct connection string.
- `BETTER_AUTH_SECRET`: strong secret used by Better Auth.
- `BETTER_AUTH_URL`: deployed auth origin, matching the production site origin.
- `NEXT_PUBLIC_BETTER_AUTH_URL`: public client-safe Better Auth origin used by the browser auth client.
- `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD`, `ADMIN_BOOTSTRAP_NAME`: first admin bootstrap values.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`: email sending configuration.
- `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_R2_PUBLIC_BASE_URL`: R2 upload configuration.
- `NEXT_PUBLIC_SITE_URL`: public site origin.

Do not commit real secrets. Keep `.env.local`, production env values, R2 credentials, Resend API keys, Better Auth secrets, and Neon credentials out of git.

## Better Auth

The auth config lives in `src/server/auth/auth.ts`.

- Email/password auth is enabled.
- Public email/password signup is disabled through Better Auth's `disableSignUp` option. Admin users are created by the bootstrap flow, not by public self-registration.
- Secure signed session cookies are managed by Better Auth.
- The Better Auth admin plugin adds role support. The protected admin guard accepts only users whose role includes `admin`.
- Built-in Better Auth password reset endpoints are enabled with a 1-hour expiry and session revocation after reset.
- Rate limiting is enabled with database storage and stricter rules for login and password reset endpoints.

The route handler lives at `src/app/api/auth/[...all]/route.ts` and is wired through `toNextJsHandler(auth)`.

## Admin Routes

Implemented in this phase:

- `/admin/login`
- `/admin/forgot-password`
- `/admin/reset-password`
- `/admin`
- `/admin/gemstones`
- `/admin/gemstones/new`
- `/admin/gemstones/[id]`
- `/admin/collections`
- `/admin/collections/new`
- `/admin/collections/[id]`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/enquiries`
- `/admin/appointments`
- `/admin/newsletter`
- `/admin/settings`

Gemstone, collection, and jewellery product management are the first protected CRUD foundations. Enquiries, appointments, and newsletter subscribers now have protected inbox/status-management screens. `/admin/settings` remains a protected placeholder.

Protected routes are guarded by `src/app/admin/(protected)/layout.tsx`, which calls `getAdminSession()` from `src/server/auth/session.ts`. Login, forgot password, and reset password remain public.

## Database Schema

`src/server/db/schema.ts` defines the database foundation.

Better Auth tables:

- `user`
- `session`
- `account`
- `verification`
- `rate_limit`

Admin metadata table:

- `admin_profiles`

App content and lead tables:

- `gemstones`
- `gemstone_images`
- `collections`
- `collection_images`
- `collection_gems`
- `jewellery_products`
- `product_images`
- `product_gemstones`
- `related_products`
- `contact_submissions`
- `appointment_requests`
- `newsletter_subscribers`
- `product_enquiries`

`DATABASE_URL` is read in server-side database modules and Drizzle tooling only. It must not be exposed as `NEXT_PUBLIC_*`.

## Migration Workflow

The project uses migration files for production database changes.

Current generated migration files:

- `drizzle/0000_regular_vulture.sql`
- `drizzle/0001_massive_sharon_carter.sql`
- `drizzle/0002_previous_doctor_spectrum.sql`
- `drizzle/0003_condemned_ultimates.sql`
- `drizzle/0004_conscious_prima.sql`
- `drizzle/meta/0000_snapshot.json`
- `drizzle/meta/0001_snapshot.json`
- `drizzle/meta/0002_snapshot.json`
- `drizzle/meta/0003_snapshot.json`
- `drizzle/meta/0004_snapshot.json`
- `drizzle/meta/_journal.json`

Generate migrations after schema changes:

```bash
pnpm db:generate
```

Apply committed migrations to the configured Neon database:

```bash
pnpm db:migrate
```

Open Drizzle Studio for inspection:

```bash
pnpm db:studio
```

`pnpm db:push` is available for local prototypes only. Do not use `db:push` against production because it bypasses the reviewed migration-file workflow.

Do not run `db:migrate` or `db:push` unless `DATABASE_URL` points to the intended database and the operator has explicitly confirmed the target.

## Gemstone Seed Workflow

Phase 7.4 adds a static-data seed command that copies the current public gemstone catalogue into database records without changing public reads.

```bash
pnpm db:seed:gemstones
```

The seed command:

- Loads `.env.local` before importing database modules.
- Requires `DATABASE_URL`.
- Upserts gemstone records from `src/data/gemstones.ts` by slug.
- Marks seeded gemstones published.
- Inserts primary, hero, and gallery image records only when a gemstone has no image records yet.
- Does not upload files to R2; seeded image URLs point at the existing static public assets.

Run it only after `pnpm db:migrate` has applied the gemstone schema migration to the intended Neon database.

## Collection Seed Workflow

Phase 7.5 adds a static-data seed command that copies the current public collection catalogue into database records without changing public reads.

```bash
pnpm db:seed:collections
```

The seed command:

- Loads `.env.local` before importing database modules.
- Requires `DATABASE_URL`.
- Upserts collection records from `src/data/collections.ts` by slug.
- Marks seeded collections published.
- Preserves existing uploaded collection images by inserting static image records only when the collection has no image records yet.
- Maps `relatedGemSlugs` to `collection_gems` through existing gemstone records in the database.
- Logs counts only and never logs secrets.

Run it only after `pnpm db:migrate` has applied the collection schema migration and after gemstones have been seeded when related gemstone links are needed.

## Product Seed Workflow

Phase 7.6 adds a static-data seed command that copies the current public jewellery catalogue into database records without changing public reads.

```bash
pnpm db:seed:products
```

The seed command:

- Loads `.env.local` before importing database modules.
- Requires `DATABASE_URL`.
- Upserts product records from `src/data/jewellery.ts` by slug.
- Maps `collectionSlug` to the `collections` table when the matching collection exists.
- Replaces product gemstone detail rows from the static gemstone details.
- Preserves existing uploaded product images by inserting static image records only when the product has no image records yet.
- Links `relatedProductSlugs` through the `related_products` join table after all products exist.
- Marks seeded products published.
- Logs counts only and never logs secrets.

Run it only after `pnpm db:migrate` has applied the product schema migration and after collections have been seeded when collection links are needed.

## Gemstone Admin Management

Phase 7.4 implements the first admin content-management surface:

- `/admin/gemstones`: protected gemstone list with image thumbnail, publishing controls, featured toggle, display-order update, and edit links.
- `/admin/gemstones/new`: protected create form for gemstone catalogue metadata.
- `/admin/gemstones/[id]`: protected edit/delete form plus image management.

Supported gemstone fields include name, slug, type, family, origin metadata, colour, rarity, cut options, carat range, price labels, treatment, clarity, certification, descriptions, highlights, care notes, relationship slugs, featured status, published status, and display order.

Image management uses `src/server/storage/r2.ts` to generate short-lived Cloudflare R2 signed PUT URLs. The browser uploads the selected JPG, PNG, or WebP file directly to R2, then the admin action stores the resulting image record with role, alt text, storage key, public URL, content type, file size, and display order. R2 credentials remain server-only.

Public gemstone pages still read from `src/data/gemstones.ts`. Do not migrate `/gemstones`, gemstone detail pages, or homepage gemstone sections to database reads until the later public-read migration phase.

## Collection Admin Management

Phase 7.5 implements protected collection management:

- `/admin/collections`: protected collection list with thumbnail, slug, short description, published toggle, related gem count, display-order update, and edit links.
- `/admin/collections/new`: protected create form for collection storytelling and related gemstone assignment.
- `/admin/collections/[id]`: protected edit/delete form plus image management.

Supported collection fields include name, slug, eyebrow, short description, long description/story, highlights, related jewellery slugs, hero image metadata, published status, and display order.

Related gemstones are managed through the `collection_gems` join table. The admin form shows all database gemstones, lets an admin select related stones, and stores a simple display order for each selected gemstone.

Collection image management uses the same R2 upload flow as gemstone images. Admins can upload JPG, PNG, or WebP files under 8 MB and save image records with `primary`, `hero`, or `gallery` roles. If R2 env vars are missing, the upload controls are disabled with a safe message and no server crash.

Public collection pages still read from `src/data/collections.ts`. Do not migrate `/collections`, collection detail pages, or homepage collection sections to database reads until the later public-read migration phase.

## Product Admin Management

Phase 7.6 implements protected jewellery product management:

- `/admin/products`: protected product list with thumbnail, name, slug, category, collection, price label, availability, featured toggle, published toggle, display-order update, and edit links.
- `/admin/products/new`: protected create form for product details, collection assignment, gemstone detail rows, and related product assignment.
- `/admin/products/[id]`: protected edit/delete form plus product image management.

Supported product fields include name, slug, category, collection, short description, long description, price, currency, price label, availability, reference code, metal, total carat weight, dimensions, craftsmanship, certificate details, care instructions, highlights, inquiry subject, featured status, published status, and display order.

Product gemstone details are managed as rows in `product_gemstones` with gemstone name, type, colour, origin, cut, carat, treatment, clarity, setting, and display order. Related products are managed through the `related_products` join table with simple ordering.

Product image management uses the same R2 upload flow as gemstone and collection images. Admins can upload JPG, PNG, or WebP files under 8 MB and save image records with `primary`, `hero`, or `gallery` roles. If R2 env vars are missing, the upload controls are disabled with a safe message and no server crash.

Public jewellery pages still read from `src/data/jewellery.ts`. Do not migrate `/jewellery`, jewellery detail pages, collection product sections, or homepage product sections to database reads until the later public-read migration phase.

## Bootstrap Admin

The secure bootstrap helper lives in `src/server/auth/bootstrap-admin.ts`; the CLI wrapper lives in `scripts/bootstrap-admin.ts`.

Run after migrations have been applied:

```bash
pnpm admin:bootstrap
```

The command loads `.env.local` through Next's env loader and reads:

- `DATABASE_URL`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `ADMIN_BOOTSTRAP_NAME`

Behavior:

- If any admin already exists, it does not create another admin.
- If the bootstrap email is already an admin, it ensures `admin_profiles` is active and does not change the password.
- If no admin exists and the bootstrap email belongs to an existing user, it promotes that user to admin and does not change the password.
- If no admin exists and the bootstrap email does not exist, it creates the first admin through Better Auth and creates an active `admin_profiles` record.
- It never logs the password and is not exposed as a public route.

Phase 7.3 bootstrap verification:

- The script loads `.env.local` before dynamically importing auth or database modules.
- Missing or invalid env diagnostics name only the failing variable, and password diagnostics show only presence and length.
- Existing admins are detected without changing passwords.

## Forgot And Reset Password Flow

1. `/admin/forgot-password` posts to Better Auth's `/api/auth/request-password-reset` endpoint.
2. The UI always shows a neutral response: "If an account exists, a reset email has been sent."
3. Better Auth generates the reset token and calls `sendResetPassword`.
4. `src/server/email/resend.ts` sends the email through Resend.
5. The generated link resolves through Better Auth and redirects to `/admin/reset-password?token=...`.
6. `/admin/reset-password` posts the new password to `/api/auth/reset-password`.
7. Better Auth consumes the token, enforces password length, updates the credential account, and revokes sessions.

Reset tokens are never logged by application code.

Phase 7.3 auth verification status:

- `/admin` is protected by the admin layout and redirects unauthenticated visitors to `/admin/login`.
- `/admin/login` renders the Better Auth email/password form and shows a generic error for invalid credentials.
- `/admin/forgot-password` remains public and always shows a neutral response after submission.
- `/admin/reset-password` remains public, requires a token, and enforces the 12-character password minimum before submitting.
- Logout is exposed in the protected admin shell.
- Non-admin users are rejected by `getAdminSession()` because the guard requires the `admin` role.

## Resend

`src/server/email/resend.ts` centralizes email sending.

- `sendPasswordResetEmail` is connected to Better Auth.
- `sendAdminNotification` sends internal admin notifications to `ADMIN_NOTIFICATION_EMAIL` when Resend is configured.
- `sendContactNotification`, `sendAppointmentNotification`, `sendNewsletterNotification`, `sendProductEnquiryNotification`, `sendGemstoneEnquiryNotification`, and `sendCollectionEnquiryNotification` wrap the admin notification helper.
- Public form actions write the database record before attempting email delivery. Missing or failed email delivery must not discard a saved submission.

Production Resend delivery requires a verified sending domain.

## Public Forms And Admin Inbox

Phase 7.7 connects public lead capture without changing catalogue reads from static data.

- `/contact` saves to `contact_submissions` and optionally sends a Resend admin notification.
- `/appointment` saves to `appointment_requests` and optionally sends a Resend admin notification.
- The homepage footer newsletter form upserts `newsletter_subscribers` by email and keeps duplicate subscriptions graceful.
- Product, gemstone, and collection detail enquiry CTAs save to `product_enquiries` with `item_type`, `item_slug`, and `item_name`.
- Public forms include a hidden honeypot field and a small server-side soft rate guard by form/email.
- `/admin/enquiries` lists item enquiries and contact messages with `new`, `read`, `replied`, and `archived` statuses.
- `/admin/appointments` lists appointment requests with `new`, `confirmed`, `completed`, `cancelled`, and `archived` statuses.
- `/admin/newsletter` lists subscribers and allows activate/deactivate status changes. It does not send bulk email.

## Cloudflare R2

`src/server/storage/r2.ts` centralizes upload helpers.

- `buildStorageKey` normalizes storage keys.
- `createUploadPresignedUrl` creates short-lived signed PUT URLs.
- `getPublicR2Url` builds public asset URLs from `CLOUDFLARE_R2_PUBLIC_BASE_URL`.

R2 credentials are only read on the server.

## Local Setup Checklist

1. Copy `.env.example` to `.env.local`.
2. Fill in `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, and `ADMIN_BOOTSTRAP_*`.
3. Add Resend and R2 values if testing password reset emails or upload signing.
4. Run `pnpm db:generate` after schema changes.
5. Confirm the target database, then run `pnpm db:migrate`.
6. Run `pnpm admin:bootstrap`.
7. Run `pnpm db:seed:gemstones`.
8. Run `pnpm db:seed:collections` after gemstone records exist if collection related-gem links are required.
9. Run `pnpm db:seed:products` after collection records exist if product collection links are required.
10. Visit `/admin/login` and sign in with the bootstrap email/password if a new admin was created.

## Local Verification Checklist

1. Open `/admin` while signed out and confirm it redirects to `/admin/login`.
2. Submit invalid credentials on `/admin/login` and confirm the generic error appears.
3. Sign in with the bootstrapped admin and confirm `/admin` renders the dashboard shell.
4. Visit `/admin/gemstones` and confirm the protected gemstone list renders after migrations are applied.
5. Visit `/admin/gemstones/new` and confirm the create form renders.
6. Visit an existing `/admin/gemstones/[id]` record and confirm edit, delete, publish, feature, ordering, and R2 upload controls render.
7. Visit `/admin/collections` and confirm the protected collection list renders after migrations are applied.
8. Visit `/admin/collections/new` and confirm the create form renders with related gemstone options.
9. Visit an existing `/admin/collections/[id]` record and confirm edit, delete, publish, ordering, related-gem assignment, and R2 upload controls render.
10. Visit `/admin/products` and confirm the protected product list renders after migrations are applied.
11. Visit `/admin/products/new` and confirm the create form renders with collection and related-product options.
12. Visit an existing `/admin/products/[id]` record and confirm edit, delete, publish, feature, ordering, gemstone rows, related-product assignment, and R2 upload controls render.
13. Visit `/admin/enquiries` and confirm item enquiries and contact submissions render with status controls.
14. Visit `/admin/appointments` and confirm appointment requests render with status controls.
15. Visit `/admin/newsletter` and confirm subscribers render with activate/deactivate controls.
16. Visit `/admin/settings` and confirm the protected placeholder renders.
17. Submit `/contact`, `/appointment`, a detail-page item enquiry, and the homepage newsletter form against a migrated local database. Confirm the submission is saved even if Resend env is missing.
18. Visit public `/gemstones`, `/collections`, `/jewellery`, an existing jewellery detail page, an existing collection detail page, and the homepage and confirm catalogue content still uses the static public frontend.
19. Click sign out and confirm the browser returns to `/admin/login`.
20. Open `/admin/forgot-password`, submit an email, and confirm the neutral response appears without revealing account existence.
21. Open `/admin/reset-password` without a token and confirm the form is disabled with an invalid-link message path.

## Production/Vercel Checklist

1. Add all required env vars in Vercel project settings.
2. Confirm `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` match the production origin.
3. Confirm `DATABASE_URL` points to the intended Neon production database.
4. Apply reviewed migrations with `pnpm db:migrate` from a trusted environment.
5. Run `pnpm admin:bootstrap` once from a trusted environment.
6. Remove or rotate bootstrap password values after the first admin has been verified.
7. Run `pnpm db:seed:gemstones` only after migrations are applied and the target database is confirmed.
8. Run `pnpm db:seed:collections` only after gemstone seed records exist if related gemstone links should be created.
9. Run `pnpm db:seed:products` only after collection seed records exist if product collection links should be created.
10. Run `pnpm db:migrate` after reviewing `drizzle/0004_conscious_prima.sql` before testing Phase 7.7 public forms/admin inboxes.
11. Keep public frontend reads on static data until the later admin CRUD phases intentionally migrate them.

## Future Phases

- Phase 7.4: Gemstone seed, admin gemstone CRUD, and R2 image upload foundation.
- Phase 7.5: Collection seed, admin collection CRUD, related gemstone management, and collection R2 image uploads.
- Phase 7.6: Product seed, admin jewellery product CRUD, product gemstone rows, related products, and product R2 image uploads.
- Phase 7.7: Public forms, database submission storage, Resend notifications, and admin inbox/status screens.
- Later: Settings and public DB reads with static fallback.
- Migrate public frontend catalogue reads from static data to published database records only after admin CRUD is stable.
