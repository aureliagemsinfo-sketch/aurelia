import { randomUUID } from "node:crypto";

import { desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import {
  appointmentRequests,
  contactSubmissions,
  newsletterSubscribers,
  productEnquiries,
} from "@/server/db/schema";

export type ContactSubmissionInput = {
  email: string;
  message: string;
  name: string;
  phone?: string | null;
  subject?: string | null;
};

export type AppointmentRequestInput = {
  email: string;
  interest?: string | null;
  location?: string | null;
  message?: string | null;
  name: string;
  phone?: string | null;
  preferredDate?: Date | null;
  preferredTime?: string | null;
};

export type ProductEnquiryInput = {
  collectionId?: string | null;
  email: string;
  gemstoneId?: string | null;
  itemName?: string | null;
  itemSlug?: string | null;
  itemType?: string | null;
  message: string;
  name: string;
  phone?: string | null;
  productId?: string | null;
};

export type EnquiryStatus = "new" | "read" | "replied" | "archived";
export type AppointmentStatus = "new" | "confirmed" | "completed" | "cancelled" | "archived";

export async function createContactSubmission(input: ContactSubmissionInput) {
  const [row] = await db
    .insert(contactSubmissions)
    .values({
      id: randomUUID(),
      ...input,
      phone: input.phone ?? null,
      subject: input.subject ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return row;
}

export async function createAppointmentRequest(input: AppointmentRequestInput) {
  const [row] = await db
    .insert(appointmentRequests)
    .values({
      id: randomUUID(),
      ...input,
      interest: input.interest ?? null,
      location: input.location ?? null,
      message: input.message ?? null,
      phone: input.phone ?? null,
      preferredDate: input.preferredDate ?? null,
      preferredTime: input.preferredTime ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return row;
}

export async function createProductEnquiry(input: ProductEnquiryInput) {
  const [row] = await db
    .insert(productEnquiries)
    .values({
      id: randomUUID(),
      collectionId: input.collectionId ?? null,
      email: input.email,
      gemstoneId: input.gemstoneId ?? null,
      itemName: input.itemName ?? null,
      itemSlug: input.itemSlug ?? null,
      itemType: input.itemType ?? null,
      message: input.message,
      name: input.name,
      phone: input.phone ?? null,
      productId: input.productId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return row;
}

export async function upsertNewsletterSubscriber(email: string, source?: string | null) {
  const now = new Date();
  const [existingSubscriber] = await db
    .select({
      isActive: newsletterSubscribers.isActive,
      status: newsletterSubscribers.status,
    })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);
  const shouldSendWelcome =
    !existingSubscriber ||
    !existingSubscriber.isActive ||
    existingSubscriber.status !== "subscribed";

  const [row] = await db
    .insert(newsletterSubscribers)
    .values({
      id: randomUUID(),
      email,
      isActive: true,
      source: source ?? "website",
      status: "subscribed",
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: {
        isActive: true,
        source: source ?? "website",
        status: "subscribed",
        updatedAt: now,
      },
    })
    .returning();

  return { subscriber: row, shouldSendWelcome };
}

export async function listAdminContactSubmissions() {
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function listAdminProductEnquiries() {
  return db.select().from(productEnquiries).orderBy(desc(productEnquiries.createdAt));
}

export async function listAdminAppointmentRequests() {
  return db.select().from(appointmentRequests).orderBy(desc(appointmentRequests.createdAt));
}

export async function listAdminNewsletterSubscribers() {
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function updateContactSubmissionStatus(id: string, status: EnquiryStatus) {
  await db
    .update(contactSubmissions)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id));
}

export async function updateProductEnquiryStatus(id: string, status: EnquiryStatus) {
  await db
    .update(productEnquiries)
    .set({ status, updatedAt: new Date() })
    .where(eq(productEnquiries.id, id));
}

export async function updateAppointmentRequestStatus(id: string, status: AppointmentStatus) {
  await db
    .update(appointmentRequests)
    .set({ status, updatedAt: new Date() })
    .where(eq(appointmentRequests.id, id));
}

export async function updateNewsletterSubscriberActive(id: string, isActive: boolean) {
  await db
    .update(newsletterSubscribers)
    .set({
      isActive,
      status: isActive ? "subscribed" : "unsubscribed",
      updatedAt: new Date(),
    })
    .where(eq(newsletterSubscribers.id, id));
}
