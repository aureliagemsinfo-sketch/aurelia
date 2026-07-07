ALTER TABLE "gemstone_images" ADD COLUMN "image_role" text DEFAULT 'gallery' NOT NULL;--> statement-breakpoint
ALTER TABLE "gemstone_images" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "gemstone_images" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "gemstone_images" ADD COLUMN "size_bytes" integer;--> statement-breakpoint
ALTER TABLE "gemstone_images" ADD COLUMN "content_type" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "origin_country" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "origin_region" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "origin_display" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "rarity" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "cut_options" jsonb;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "carat_range" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "price_label" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "price_note" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "treatment" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "clarity" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "certification" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "short_description" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "long_description" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "highlights" jsonb;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "care_notes" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "inquiry_subject" text;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "related_gem_slugs" jsonb;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "related_collection_slugs" jsonb;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "related_jewellery_slugs" jsonb;--> statement-breakpoint
ALTER TABLE "gemstones" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;