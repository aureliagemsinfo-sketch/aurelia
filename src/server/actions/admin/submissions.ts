"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminSession } from "@/server/auth/session";
import {
  updateAppointmentRequestStatus,
  updateContactSubmissionStatus,
  updateNewsletterSubscriberActive,
  updateProductEnquiryStatus,
  type AppointmentStatus,
  type EnquiryStatus,
} from "@/server/repositories/submissions.repo";

const enquiryStatusSchema = z.enum(["new", "read", "replied", "archived"]);
const appointmentStatusSchema = z.enum(["new", "confirmed", "completed", "cancelled", "archived"]);

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized admin action.");
  }

  return session;
}

function requiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) {
    throw new Error(`${key} is required.`);
  }
  return value;
}

export async function updateContactSubmissionStatusAction(formData: FormData) {
  await requireAdmin();

  const id = requiredString(formData, "id");
  const status = enquiryStatusSchema.parse(requiredString(formData, "status")) as EnquiryStatus;

  await updateContactSubmissionStatus(id, status);
  revalidatePath("/admin/enquiries");
}

export async function updateProductEnquiryStatusAction(formData: FormData) {
  await requireAdmin();

  const id = requiredString(formData, "id");
  const status = enquiryStatusSchema.parse(requiredString(formData, "status")) as EnquiryStatus;

  await updateProductEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
}

export async function updateAppointmentRequestStatusAction(formData: FormData) {
  await requireAdmin();

  const id = requiredString(formData, "id");
  const status = appointmentStatusSchema.parse(requiredString(formData, "status")) as AppointmentStatus;

  await updateAppointmentRequestStatus(id, status);
  revalidatePath("/admin/appointments");
}

export async function updateNewsletterSubscriberActiveAction(formData: FormData) {
  await requireAdmin();

  const id = requiredString(formData, "id");
  const isActive = requiredString(formData, "isActive") === "true";

  await updateNewsletterSubscriberActive(id, isActive);
  revalidatePath("/admin/newsletter");
}
