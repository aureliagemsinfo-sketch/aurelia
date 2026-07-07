ALTER TABLE "collection_images" ADD COLUMN "image_role" text DEFAULT 'gallery' NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_images" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "collection_images" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "collection_images" ADD COLUMN "size_bytes" integer;--> statement-breakpoint
ALTER TABLE "collection_images" ADD COLUMN "content_type" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "eyebrow" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "short_description" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "long_description" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "highlights" jsonb;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "related_jewellery_slugs" jsonb;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "image_position" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "hero_image_url" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "hero_alt" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "hero_object_position_desktop" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "hero_object_position_mobile" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "hero_overlay_style" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "hero_theme" text;