import { Resend } from "resend";

type ResetPasswordEmailInput = {
  to: string;
  name?: string | null;
  resetUrl: string;
};

type EmailDetail = {
  label: string;
  value?: string | null;
};

type BrandedEmailInput = {
  body?: string | null;
  closing?: string;
  ctaHref?: string;
  ctaLabel?: string;
  details?: EmailDetail[];
  eyebrow: string;
  intro: string;
  preheader: string;
  title: string;
};

type ContactNotificationInput = {
  email: string;
  message: string;
  name: string;
  phone?: string | null;
  subject?: string | null;
};

type AppointmentNotificationInput = {
  email: string;
  interest?: string | null;
  location?: string | null;
  message?: string | null;
  name: string;
  phone?: string | null;
  preferredDate?: Date | null;
  preferredTime?: string | null;
};

type ItemEnquiryNotificationInput = {
  email: string;
  itemName?: string | null;
  itemSlug?: string | null;
  itemType: "product" | "gemstone" | "collection";
  message: string;
  name: string;
  phone?: string | null;
};

type NewsletterAcknowledgementInput = {
  email: string;
};

const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Aurelia Gems <no-reply@example.com>";
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

function absolutePath(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(date?: Date | null) {
  return date ? date.toISOString().slice(0, 10) : null;
}

function renderText(input: BrandedEmailInput) {
  return [
    input.title,
    "",
    input.intro,
    "",
    ...(input.details ?? [])
      .filter((detail) => detail.value)
      .map((detail) => `${detail.label}: ${detail.value}`),
    input.details?.some((detail) => detail.value) ? "" : null,
    input.body,
    input.body ? "" : null,
    input.ctaHref && input.ctaLabel ? `${input.ctaLabel}: ${input.ctaHref}` : null,
    input.closing ? "" : null,
    input.closing,
  ]
    .filter(Boolean)
    .join("\n");
}

function renderParagraphs(body?: string | null) {
  if (!body) return "";

  return body
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 14px;color:#51483e;font-size:15px;line-height:1.75;">${escapeHtml(paragraph)}</p>`)
    .join("");
}

function renderDetails(details?: EmailDetail[]) {
  const visibleDetails = details?.filter((detail) => detail.value) ?? [];
  if (!visibleDetails.length) return "";

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:26px 0;border-collapse:collapse;border-top:1px solid #e8ded0;">
      <tbody>
        ${visibleDetails
          .map(
            (detail) => `
              <tr>
                <td style="width:38%;padding:13px 0;border-bottom:1px solid #e8ded0;color:#8f7f6b;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;vertical-align:top;">${escapeHtml(detail.label)}</td>
                <td style="padding:13px 0 13px 18px;border-bottom:1px solid #e8ded0;color:#171411;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;vertical-align:top;">${escapeHtml(detail.value ?? "")}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderBrandedHtml(input: BrandedEmailInput) {
  const cta = input.ctaHref && input.ctaLabel
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:26px;">
        <tr>
          <td style="background:#171411;border:1px solid #171411;padding:13px 22px;text-align:center;">
            <a href="${escapeHtml(input.ctaHref)}" style="color:#fffdf8;display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-decoration:none;text-transform:uppercase;">${escapeHtml(input.ctaLabel)}</a>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#fbf7ef;padding:32px 16px;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(input.preheader)}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#fbf7ef;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:collapse;">
                <tr>
                  <td style="padding:0 0 18px;text-align:center;color:#8f6a2d;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;">Aurelia Gems</td>
                </tr>
                <tr>
                  <td style="background:#fffdf8;border:1px solid #e8ded0;padding:34px 30px 32px;box-shadow:0 18px 50px rgba(23,20,17,0.06);">
                    <p style="margin:0 0 14px;color:#8f6a2d;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">${escapeHtml(input.eyebrow)}</p>
                    <h1 style="margin:0;color:#171411;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.1;">${escapeHtml(input.title)}</h1>
                    <p style="margin:20px 0 0;color:#51483e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">${escapeHtml(input.intro)}</p>
                    ${renderDetails(input.details)}
                    ${renderParagraphs(input.body)}
                    ${cta}
                    ${input.closing ? `<p style="margin:28px 0 0;color:#51483e;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;">${escapeHtml(input.closing)}</p>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 8px 0;text-align:center;color:#8f7f6b;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;">Private gemstone sourcing, jewellery consultations, and maison appointments.</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function sendBrandedEmail(to: string, subject: string, template: BrandedEmailInput) {
  if (!resend || !to) return false;

  await resend.emails.send({
    from: fromEmail,
    html: renderBrandedHtml(template),
    subject,
    text: renderText(template),
    to,
  });

  return true;
}

async function sendAdminNotification(subject: string, template: BrandedEmailInput) {
  return sendBrandedEmail(process.env.ADMIN_NOTIFICATION_EMAIL ?? "", subject, template);
}

export async function sendPasswordResetEmail({ to, name, resetUrl }: ResetPasswordEmailInput) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; password reset email was not sent.");
    return;
  }

  const displayName = name?.trim() || "there";

  await sendBrandedEmail(to, "Reset your Aurelia Gems admin password", {
    closing: "If you did not request this, you can safely ignore this email.",
    ctaHref: resetUrl,
    ctaLabel: "Reset Password",
    eyebrow: "Admin Access",
    intro: `Hello ${displayName}, use the secure link below to reset your Aurelia Gems admin password. This link expires in 1 hour.`,
    preheader: "Reset your Aurelia Gems admin password.",
    title: "Password Reset",
  });
}

export async function sendContactNotification(input: ContactNotificationInput) {
  return sendAdminNotification(`New contact submission${input.subject ? `: ${input.subject}` : ""}`, {
    body: input.message,
    ctaHref: absolutePath("/admin/enquiries"),
    ctaLabel: "Review Enquiry",
    details: [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Subject", value: input.subject },
    ],
    eyebrow: "Maison Contact",
    intro: "A new contact submission was received through the Aurelia Gems website.",
    preheader: "A new contact submission is ready for review.",
    title: "New Contact Submission",
  });
}

export async function sendAppointmentNotification(input: AppointmentNotificationInput) {
  return sendAdminNotification("New appointment request", {
    body: input.message,
    ctaHref: absolutePath("/admin/appointments"),
    ctaLabel: "Review Appointment",
    details: [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Location", value: input.location },
      { label: "Interest", value: input.interest },
      { label: "Preferred Date", value: formatDate(input.preferredDate) },
      { label: "Preferred Time", value: input.preferredTime },
    ],
    eyebrow: "Private Appointment",
    intro: "A new private appointment request was received through the Aurelia Gems website.",
    preheader: "A new private appointment request is ready for review.",
    title: "New Appointment Request",
  });
}

export async function sendNewsletterNotification(email: string, source?: string | null) {
  return sendAdminNotification("New newsletter subscriber", {
    ctaHref: absolutePath("/admin/newsletter"),
    ctaLabel: "Review Subscribers",
    details: [
      { label: "Email", value: email },
      { label: "Source", value: source },
    ],
    eyebrow: "Newsletter",
    intro: "A newsletter subscription was received through the Aurelia Gems website.",
    preheader: "A new newsletter subscriber was received.",
    title: "New Subscriber",
  });
}

export async function sendProductEnquiryNotification(input: Omit<ItemEnquiryNotificationInput, "itemType">) {
  return sendItemEnquiryNotification({ ...input, itemType: "product" });
}

export async function sendGemstoneEnquiryNotification(input: Omit<ItemEnquiryNotificationInput, "itemType">) {
  return sendItemEnquiryNotification({ ...input, itemType: "gemstone" });
}

export async function sendCollectionEnquiryNotification(input: Omit<ItemEnquiryNotificationInput, "itemType">) {
  return sendItemEnquiryNotification({ ...input, itemType: "collection" });
}

async function sendItemEnquiryNotification(input: ItemEnquiryNotificationInput) {
  return sendAdminNotification(`New ${input.itemType} enquiry`, {
    body: input.message,
    ctaHref: absolutePath("/admin/enquiries"),
    ctaLabel: "Review Enquiry",
    details: [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Item Type", value: input.itemType },
      { label: "Item", value: input.itemName },
      { label: "Slug", value: input.itemSlug },
    ],
    eyebrow: "Private Enquiry",
    intro: `A new ${input.itemType} enquiry was received through the Aurelia Gems website.`,
    preheader: `A new ${input.itemType} enquiry is ready for review.`,
    title: "New Enquiry",
  });
}

export async function sendContactAcknowledgement(input: Pick<ContactNotificationInput, "email" | "name" | "subject">) {
  return sendBrandedEmail(input.email, "We received your message - Aurelia Gems", {
    closing: "With appreciation, the Aurelia Gems team",
    ctaHref: absolutePath("/"),
    ctaLabel: "Visit Aurelia Gems",
    details: [
      { label: "Name", value: input.name },
      { label: "Contact Email", value: input.email },
      { label: "Request", value: input.subject },
    ],
    eyebrow: "Message Received",
    intro: "Thank you for contacting Aurelia Gems. Our private sourcing team has received your message and will respond shortly.",
    preheader: "Thank you for contacting Aurelia Gems.",
    title: "Message Received",
  });
}

export async function sendAppointmentAcknowledgement(input: Pick<AppointmentNotificationInput, "email" | "interest" | "location" | "name" | "preferredDate" | "preferredTime">) {
  return sendBrandedEmail(input.email, "Your private appointment request has been received", {
    closing: "With appreciation, the Aurelia Gems team",
    ctaHref: absolutePath("/"),
    ctaLabel: "View Aurelia Gems",
    details: [
      { label: "Name", value: input.name },
      { label: "Contact Email", value: input.email },
      { label: "Preferred Date", value: formatDate(input.preferredDate) },
      { label: "Preferred Time", value: input.preferredTime },
      { label: "Preferred Salon", value: input.location },
      { label: "Interest", value: input.interest },
    ],
    eyebrow: "Private Viewing",
    intro: "Thank you for requesting a private viewing with Aurelia Gems. Our team will review your preferred date, time, and salon location, then confirm availability shortly.",
    preheader: "Your private viewing request has been received.",
    title: "Appointment Request Received",
  });
}

export async function sendItemEnquiryAcknowledgement(input: Pick<ItemEnquiryNotificationInput, "email" | "itemName" | "itemType" | "name">) {
  return sendBrandedEmail(input.email, "Your Aurelia Gems enquiry has been received", {
    closing: "With appreciation, the Aurelia Gems team",
    ctaHref: absolutePath("/gemstones"),
    ctaLabel: "Explore Gemstones",
    details: [
      { label: "Item", value: input.itemName },
      { label: "Item Type", value: input.itemType },
      { label: "Customer Name", value: input.name },
      { label: "Customer Email", value: input.email },
    ],
    eyebrow: "Enquiry Received",
    intro: "Thank you for your enquiry. Our team will review your request and respond with sourcing or consultation details shortly.",
    preheader: "Your Aurelia Gems enquiry has been received.",
    title: "Enquiry Received",
  });
}

export async function sendNewsletterAcknowledgement(input: NewsletterAcknowledgementInput) {
  return sendBrandedEmail(input.email, "Welcome to Aurelia Gems", {
    closing: "With appreciation, the Aurelia Gems team",
    ctaHref: absolutePath("/journal"),
    ctaLabel: "Explore the Journal",
    details: [{ label: "Subscribed Email", value: input.email }],
    eyebrow: "Newsletter",
    intro: "Thank you for subscribing to Aurelia Gems. You will receive selected updates on gemstones, jewellery, private sourcing, and maison news.",
    preheader: "Welcome to Aurelia Gems.",
    title: "Welcome to Aurelia Gems",
  });
}
