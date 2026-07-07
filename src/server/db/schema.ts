import { relations } from "drizzle-orm";
import {
  boolean,
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    role: text("role").notNull().default("user"),
    banned: boolean("banned").notNull().default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("user_email_unique").on(table.email)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("session_token_unique").on(table.token),
    index("session_user_id_idx").on(table.userId),
  ],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const adminProfiles = pgTable(
  "admin_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("admin"),
    name: text("name").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("admin_profiles_user_id_unique").on(table.userId),
    index("admin_profiles_role_idx").on(table.role),
  ],
);

export const gemstones = pgTable(
  "gemstones",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    type: text("type"),
    family: text("family"),
    color: text("color"),
    origin: text("origin"),
    originCountry: text("origin_country"),
    originRegion: text("origin_region"),
    originDisplay: text("origin_display"),
    rarity: text("rarity"),
    cutOptions: jsonb("cut_options").$type<string[]>(),
    caratRange: text("carat_range"),
    priceLabel: text("price_label"),
    priceNote: text("price_note"),
    treatment: text("treatment"),
    clarity: text("clarity"),
    certification: text("certification"),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    description: text("description"),
    highlights: jsonb("highlights").$type<string[]>(),
    careNotes: text("care_notes"),
    inquirySubject: text("inquiry_subject"),
    relatedGemSlugs: jsonb("related_gem_slugs").$type<string[]>(),
    relatedCollectionSlugs: jsonb("related_collection_slugs").$type<string[]>(),
    relatedJewellerySlugs: jsonb("related_jewellery_slugs").$type<string[]>(),
    properties: jsonb("properties").$type<Record<string, unknown>>(),
    sortOrder: integer("sort_order").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("gemstones_slug_unique").on(table.slug)],
);

export const gemstoneImages = pgTable(
  "gemstone_images",
  {
    id: text("id").primaryKey(),
    gemstoneId: text("gemstone_id")
      .notNull()
      .references(() => gemstones.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    storageKey: text("storage_key"),
    imageRole: text("image_role").notNull().default("gallery"),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    contentType: text("content_type"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("gemstone_images_gemstone_id_idx").on(table.gemstoneId)],
);

export const collections = pgTable(
  "collections",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    eyebrow: text("eyebrow"),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    highlights: jsonb("highlights").$type<string[]>(),
    relatedJewellerySlugs: jsonb("related_jewellery_slugs").$type<string[]>(),
    imagePosition: text("image_position"),
    heroImageUrl: text("hero_image_url"),
    heroAlt: text("hero_alt"),
    heroObjectPositionDesktop: text("hero_object_position_desktop"),
    heroObjectPositionMobile: text("hero_object_position_mobile"),
    heroOverlayStyle: text("hero_overlay_style"),
    heroTheme: text("hero_theme"),
    summary: text("summary"),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("collections_slug_unique").on(table.slug)],
);

export const collectionImages = pgTable(
  "collection_images",
  {
    id: text("id").primaryKey(),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    storageKey: text("storage_key"),
    imageRole: text("image_role").notNull().default("gallery"),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    contentType: text("content_type"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("collection_images_collection_id_idx").on(table.collectionId)],
);

export const collectionGems = pgTable(
  "collection_gems",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    gemstoneId: text("gemstone_id")
      .notNull()
      .references(() => gemstones.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.collectionId, table.gemstoneId] })],
);

export const jewelleryProducts = pgTable(
  "jewellery_products",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    collectionId: text("collection_id").references(() => collections.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    category: text("category"),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    price: integer("price"),
    currency: text("currency"),
    priceLabel: text("price_label"),
    availability: text("availability"),
    referenceCode: text("reference_code"),
    metal: text("metal"),
    totalCaratWeight: text("total_carat_weight"),
    dimensions: text("dimensions"),
    craftsmanship: text("craftsmanship"),
    certificateDetails: text("certificate_details"),
    careInstructions: text("care_instructions"),
    highlights: jsonb("highlights").$type<string[]>(),
    inquirySubject: text("inquiry_subject"),
    material: text("material"),
    summary: text("summary"),
    description: text("description"),
    specifications: jsonb("specifications").$type<Record<string, unknown>>(),
    sortOrder: integer("sort_order").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("jewellery_products_slug_unique").on(table.slug),
    index("jewellery_products_collection_id_idx").on(table.collectionId),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => jewelleryProducts.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    storageKey: text("storage_key"),
    imageRole: text("image_role").notNull().default("gallery"),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    contentType: text("content_type"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)],
);

export const productGemstones = pgTable(
  "product_gemstones",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => jewelleryProducts.id, { onDelete: "cascade" }),
    gemstoneId: text("gemstone_id").references(() => gemstones.id, { onDelete: "set null" }),
    gemstoneName: text("gemstone_name").notNull(),
    gemstoneType: text("gemstone_type"),
    color: text("color"),
    origin: text("origin"),
    cut: text("cut"),
    carat: text("carat"),
    treatment: text("treatment"),
    clarity: text("clarity"),
    setting: text("setting"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("product_gemstones_product_id_idx").on(table.productId),
    index("product_gemstones_gemstone_id_idx").on(table.gemstoneId),
  ],
);

export const relatedProducts = pgTable(
  "related_products",
  {
    productId: text("product_id")
      .notNull()
      .references(() => jewelleryProducts.id, { onDelete: "cascade" }),
    relatedProductId: text("related_product_id")
      .notNull()
      .references(() => jewelleryProducts.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.productId, table.relatedProductId] })],
);

export const contactSubmissions = pgTable("contact_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  ...timestamps,
});

export const appointmentRequests = pgTable("appointment_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  preferredDate: timestamp("preferred_date", { withTimezone: true }),
  preferredTime: text("preferred_time"),
  interest: text("interest"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  ...timestamps,
});

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status").notNull().default("subscribed"),
    source: text("source"),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("newsletter_subscribers_email_unique").on(table.email)],
);

export const productEnquiries = pgTable(
  "product_enquiries",
  {
    id: text("id").primaryKey(),
    productId: text("product_id").references(() => jewelleryProducts.id, { onDelete: "set null" }),
    gemstoneId: text("gemstone_id").references(() => gemstones.id, { onDelete: "set null" }),
    collectionId: text("collection_id").references(() => collections.id, { onDelete: "set null" }),
    itemType: text("item_type"),
    itemSlug: text("item_slug"),
    itemName: text("item_name"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ...timestamps,
  },
  (table) => [
    index("product_enquiries_product_id_idx").on(table.productId),
    index("product_enquiries_gemstone_id_idx").on(table.gemstoneId),
    index("product_enquiries_collection_id_idx").on(table.collectionId),
  ],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  adminProfile: one(adminProfiles, {
    fields: [user.id],
    references: [adminProfiles.userId],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const adminProfileRelations = relations(adminProfiles, ({ one }) => ({
  user: one(user, { fields: [adminProfiles.userId], references: [user.id] }),
}));

export const gemstoneRelations = relations(gemstones, ({ many }) => ({
  images: many(gemstoneImages),
  collectionLinks: many(collectionGems),
  productLinks: many(productGemstones),
}));

export const collectionRelations = relations(collections, ({ many }) => ({
  images: many(collectionImages),
  gemstoneLinks: many(collectionGems),
  products: many(jewelleryProducts),
}));

export const jewelleryProductRelations = relations(jewelleryProducts, ({ many, one }) => ({
  collection: one(collections, {
    fields: [jewelleryProducts.collectionId],
    references: [collections.id],
  }),
  images: many(productImages),
  gemstoneLinks: many(productGemstones),
}));
