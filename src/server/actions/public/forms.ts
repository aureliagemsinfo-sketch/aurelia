"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  sendAppointmentAcknowledgement,
  sendAppointmentNotification,
  sendContactAcknowledgement,
  sendCollectionEnquiryNotification,
  sendContactNotification,
  sendGemstoneEnquiryNotification,
  sendItemEnquiryAcknowledgement,
  sendNewsletterAcknowledgement,
  sendNewsletterNotification,
  sendProductEnquiryNotification,
} from "@/server/email/resend";
import {
  createAppointmentRequest,
  createContactSubmission,
  createProductEnquiry,
  upsertNewsletterSubscriber,
} from "@/server/repositories/submissions.repo";

export type PublicFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status: "idle" | "error" | "success";
};

const successState = (message: string): PublicFormState => ({ message, status: "success" });
const errorState = (
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
): PublicFormState => ({ fieldErrors, message, status: "error" });

const rateLimitWindowMs = 30_000;
const recentSubmissions = new Map<string, number>();

const contactSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email.").max(180),
  message: z.string().trim().min(10, "Please share a little more detail.").max(2_000),
  name: z.string().trim().min(2, "Name is required.").max(120),
  phone: z.string().trim().max(80).optional(),
  subject: z.string().trim().min(1, "Please select a subject.").max(160),
});

const appointmentSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email.").max(180),
  interest: z.string().trim().min(1, "Please select your interest.").max(160),
  location: z.string().trim().min(1, "Please select a salon.").max(160),
  message: z.string().trim().max(2_000).optional(),
  name: z.string().trim().min(2, "Name is required.").max(120),
  phone: z.string().trim().max(80).optional(),
  preferredDate: z.string().trim().max(40).optional(),
  preferredTime: z.string().trim().max(40).optional(),
});

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email.").max(180),
  source: z.string().trim().max(80).optional(),
});

const itemEnquirySchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email.").max(180),
  itemName: z.string().trim().max(180).optional(),
  itemSlug: z.string().trim().max(180).optional(),
  message: z.string().trim().min(10, "Please share a little more detail.").max(2_000),
  name: z.string().trim().min(2, "Name is required.").max(120),
  phone: z.string().trim().max(80).optional(),
});

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalString(formData: FormData, key: string) {
  return stringValue(formData, key) || undefined;
}

function emptyToNull(value?: string) {
  return value?.trim() || null;
}

function hasHoneypotValue(formData: FormData) {
  return Boolean(stringValue(formData, "website"));
}

function dateFromInput(value?: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function passesRateLimit(scope: string, email: string) {
  const key = `${scope}:${email}`;
  const now = Date.now();
  const lastSubmission = recentSubmissions.get(key);

  if (lastSubmission && now - lastSubmission < rateLimitWindowMs) {
    return false;
  }

  recentSubmissions.set(key, now);
  return true;
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    if (error instanceof Error && error.message.includes("static generation store missing")) {
      return;
    }

    throw error;
  }
}

async function trySendEmail(callback: () => Promise<unknown>) {
  try {
    await callback();
  } catch {
    console.warn("Email delivery failed after a form submission was saved.");
  }
}

export async function submitContactForm(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (hasHoneypotValue(formData)) {
    return successState("Thank you. Your note has been received.");
  }

  const parsed = contactSchema.safeParse({
    email: stringValue(formData, "email"),
    message: stringValue(formData, "message"),
    name: stringValue(formData, "name"),
    phone: optionalString(formData, "phone"),
    subject: stringValue(formData, "subject"),
  });

  if (!parsed.success) {
    return errorState("Please review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (!passesRateLimit("contact", parsed.data.email)) {
    return errorState("Please wait a moment before sending another message.");
  }

  const submission = await createContactSubmission({
    email: parsed.data.email,
    message: parsed.data.message,
    name: parsed.data.name,
    phone: emptyToNull(parsed.data.phone),
    subject: parsed.data.subject,
  });

  safeRevalidatePath("/admin/enquiries");

  await trySendEmail(() =>
    sendContactNotification({
      email: submission.email,
      message: submission.message,
      name: submission.name,
      phone: submission.phone,
      subject: submission.subject,
    }),
  );
  await trySendEmail(() =>
    sendContactAcknowledgement({
      email: submission.email,
      name: submission.name,
      subject: submission.subject,
    }),
  );

  return successState("Thank you. Your note has been received by our maison team.");
}

export async function submitAppointmentRequest(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (hasHoneypotValue(formData)) {
    return successState("Thank you. Your appointment request has been received.");
  }

  const parsed = appointmentSchema.safeParse({
    email: stringValue(formData, "email"),
    interest: stringValue(formData, "interest"),
    location: stringValue(formData, "location"),
    message: optionalString(formData, "message"),
    name: stringValue(formData, "name"),
    phone: optionalString(formData, "phone"),
    preferredDate: optionalString(formData, "preferredDate"),
    preferredTime: optionalString(formData, "preferredTime"),
  });

  if (!parsed.success) {
    return errorState("Please review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (!passesRateLimit("appointment", parsed.data.email)) {
    return errorState("Please wait a moment before sending another appointment request.");
  }

  const request = await createAppointmentRequest({
    email: parsed.data.email,
    interest: parsed.data.interest,
    location: parsed.data.location,
    message: emptyToNull(parsed.data.message),
    name: parsed.data.name,
    phone: emptyToNull(parsed.data.phone),
    preferredDate: dateFromInput(parsed.data.preferredDate),
    preferredTime: emptyToNull(parsed.data.preferredTime),
  });

  safeRevalidatePath("/admin/appointments");

  await trySendEmail(() =>
    sendAppointmentNotification({
      email: request.email,
      interest: request.interest,
      location: request.location,
      message: request.message,
      name: request.name,
      phone: request.phone,
      preferredDate: request.preferredDate,
      preferredTime: request.preferredTime,
    }),
  );
  await trySendEmail(() =>
    sendAppointmentAcknowledgement({
      email: request.email,
      interest: request.interest,
      location: request.location,
      name: request.name,
      preferredDate: request.preferredDate,
      preferredTime: request.preferredTime,
    }),
  );

  return successState("Thank you. Our maison team will contact you soon.");
}

export async function subscribeNewsletter(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (hasHoneypotValue(formData)) {
    return successState("Thank you for subscribing.");
  }

  const parsed = newsletterSchema.safeParse({
    email: stringValue(formData, "email"),
    source: optionalString(formData, "source"),
  });

  if (!parsed.success) {
    return errorState("Enter a valid email address.", parsed.error.flatten().fieldErrors);
  }

  const { subscriber, shouldSendWelcome } = await upsertNewsletterSubscriber(parsed.data.email, parsed.data.source);
  safeRevalidatePath("/admin/newsletter");

  await trySendEmail(() => sendNewsletterNotification(subscriber.email, subscriber.source));
  if (shouldSendWelcome) {
    await trySendEmail(() => sendNewsletterAcknowledgement({ email: subscriber.email }));
  }

  return successState("Thank you. You are on the Aurelia Gems list.");
}

export async function submitProductEnquiry(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  return submitItemEnquiry("product", formData);
}

export async function submitGemstoneEnquiry(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  return submitItemEnquiry("gemstone", formData);
}

export async function submitCollectionEnquiry(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  return submitItemEnquiry("collection", formData);
}

async function submitItemEnquiry(
  itemType: "product" | "gemstone" | "collection",
  formData: FormData,
): Promise<PublicFormState> {
  if (hasHoneypotValue(formData)) {
    return successState("Thank you. Your enquiry has been received.");
  }

  const parsed = itemEnquirySchema.safeParse({
    email: stringValue(formData, "email"),
    itemName: optionalString(formData, "itemName"),
    itemSlug: optionalString(formData, "itemSlug"),
    message: stringValue(formData, "message"),
    name: stringValue(formData, "name"),
    phone: optionalString(formData, "phone"),
  });

  if (!parsed.success) {
    return errorState("Please review the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (!passesRateLimit(`${itemType}-enquiry`, parsed.data.email)) {
    return errorState("Please wait a moment before sending another enquiry.");
  }

  const enquiry = await createProductEnquiry({
    email: parsed.data.email,
    itemName: emptyToNull(parsed.data.itemName),
    itemSlug: emptyToNull(parsed.data.itemSlug),
    itemType,
    message: parsed.data.message,
    name: parsed.data.name,
    phone: emptyToNull(parsed.data.phone),
  });

  safeRevalidatePath("/admin/enquiries");

  const notificationInput = {
    email: enquiry.email,
    itemName: enquiry.itemName,
    itemSlug: enquiry.itemSlug,
    message: enquiry.message,
    name: enquiry.name,
    phone: enquiry.phone,
  };

  if (itemType === "product") {
    await trySendEmail(() => sendProductEnquiryNotification(notificationInput));
  } else if (itemType === "gemstone") {
    await trySendEmail(() => sendGemstoneEnquiryNotification(notificationInput));
  } else {
    await trySendEmail(() => sendCollectionEnquiryNotification(notificationInput));
  }
  await trySendEmail(() =>
    sendItemEnquiryAcknowledgement({
      email: enquiry.email,
      itemName: enquiry.itemName,
      itemType,
      name: enquiry.name,
    }),
  );

  return successState("Thank you. Your enquiry has been received by our maison team.");
}
