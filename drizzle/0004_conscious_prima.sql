ALTER TABLE "appointment_requests" ADD COLUMN "preferred_time" text;--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD COLUMN "interest" text;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD COLUMN "gemstone_id" text;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD COLUMN "collection_id" text;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD COLUMN "item_type" text;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD COLUMN "item_slug" text;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD COLUMN "item_name" text;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD CONSTRAINT "product_enquiries_gemstone_id_gemstones_id_fk" FOREIGN KEY ("gemstone_id") REFERENCES "public"."gemstones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_enquiries" ADD CONSTRAINT "product_enquiries_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_enquiries_gemstone_id_idx" ON "product_enquiries" USING btree ("gemstone_id");--> statement-breakpoint
CREATE INDEX "product_enquiries_collection_id_idx" ON "product_enquiries" USING btree ("collection_id");