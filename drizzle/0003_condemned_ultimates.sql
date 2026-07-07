ALTER TABLE "product_gemstones" DROP CONSTRAINT "product_gemstones_gemstone_id_gemstones_id_fk";
--> statement-breakpoint
ALTER TABLE "product_gemstones" DROP CONSTRAINT "product_gemstones_product_id_gemstone_id_pk";--> statement-breakpoint
ALTER TABLE "product_gemstones" ALTER COLUMN "gemstone_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "short_description" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "long_description" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "currency" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "price_label" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "availability" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "reference_code" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "metal" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "total_carat_weight" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "dimensions" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "craftsmanship" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "certificate_details" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "care_instructions" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "highlights" jsonb;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "inquiry_subject" text;--> statement-breakpoint
ALTER TABLE "jewellery_products" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "id" text;--> statement-breakpoint
UPDATE "product_gemstones" SET "id" = "product_id" || '-' || COALESCE("gemstone_id", 'gemstone') WHERE "id" IS NULL;--> statement-breakpoint
ALTER TABLE "product_gemstones" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "gemstone_name" text;--> statement-breakpoint
UPDATE "product_gemstones" SET "gemstone_name" = COALESCE("gemstone_id", 'Gemstone') WHERE "gemstone_name" IS NULL;--> statement-breakpoint
ALTER TABLE "product_gemstones" ALTER COLUMN "gemstone_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "gemstone_type" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "origin" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "cut" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "carat" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "treatment" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "clarity" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD COLUMN "setting" text;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "image_role" text DEFAULT 'gallery' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "size_bytes" integer;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "content_type" text;--> statement-breakpoint
ALTER TABLE "product_gemstones" ADD CONSTRAINT "product_gemstones_gemstone_id_gemstones_id_fk" FOREIGN KEY ("gemstone_id") REFERENCES "public"."gemstones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_gemstones_product_id_idx" ON "product_gemstones" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_gemstones_gemstone_id_idx" ON "product_gemstones" USING btree ("gemstone_id");
