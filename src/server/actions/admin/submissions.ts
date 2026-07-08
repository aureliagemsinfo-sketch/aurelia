"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

function optionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function updateContactSubmissionStatusAction(formData: FormData) {
  await requireAdmin();

  const id = optionalString(formData, "id");
  const parsedStatus = enquiryStatusSchema.safeParse(optionalString(formData, "status"));
  if (!id || !parsedStatus.success) redirect("/admin/enquiries?status=error");

  await updateContactSubmissionStatus(id, parsedStatus.data as EnquiryStatus);
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries?status=updated");
}

export async function updateProductEnquiryStatusAction(formData: FormData) {
  await requireAdmin();

  const id = optionalString(formData, "id");
  const parsedStatus = enquiryStatusSchema.safeParse(optionalString(formData, "status"));
  if (!id || !parsedStatus.success) redirect("/admin/enquiries?status=error");

  await updateProductEnquiryStatus(id, parsedStatus.data as EnquiryStatus);
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries?status=updated");
}

export async function updateAppointmentRequestStatusAction(formData: FormData) {
  await requireAdmin();

  const id = optionalString(formData, "id");
  const parsedStatus = appointmentStatusSchema.safeParse(optionalString(formData, "status"));
  if (!id || !parsedStatus.success) redirect("/admin/appointments?status=error");

  await updateAppointmentRequestStatus(id, parsedStatus.data as AppointmentStatus);
  revalidatePath("/admin/appointments");
  redirect("/admin/appointments?status=updated");
}

export async function updateNewsletterSubscriberActiveAction(formData: FormData) {
  await requireAdmin();

  const id = optionalString(formData, "id");
  const isActiveValue = optionalString(formData, "isActive");
  if (!id || (isActiveValue !== "true" && isActiveValue !== "false")) redirect("/admin/newsletter?status=error");

  await updateNewsletterSubscriberActive(id, isActiveValue === "true");
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter?status=updated");
}
