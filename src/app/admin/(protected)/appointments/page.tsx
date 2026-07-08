import { AdminInlineForm, AdminSelect, AdminSubmitButton } from "@/components/admin/AdminControls";
import { updateAppointmentRequestStatusAction } from "@/server/actions/admin/submissions";
import {
  listAdminAppointmentRequests,
  type AppointmentStatus,
} from "@/server/repositories/submissions.repo";

const appointmentStatuses: AppointmentStatus[] = ["new", "confirmed", "completed", "cancelled", "archived"];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatPreferredDate(value: Date | null) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [requests, query] = await Promise.all([listAdminAppointmentRequests(), searchParams]);

  return (
    <div>
      <header>
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Client Services</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Appointments</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
          Triage private appointment requests from the public appointment form. Calendar scheduling
          and client replies remain outside the CMS for this phase.
        </p>
      </header>

      {query.status === "updated" ? (
        <p className="mt-6 border border-champagne/24 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Appointment status saved.
        </p>
      ) : null}
      {query.status === "error" ? (
        <p className="mt-6 border border-ruby/20 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Appointment status could not be saved. Check the selected status and try again.
        </p>
      ) : null}

      <section className="mt-9 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="hidden grid-cols-[1fr_0.9fr_0.9fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-charcoal/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-charcoal/45 xl:grid">
          <span>Client</span>
          <span>Interest</span>
          <span>Visit</span>
          <span>Message</span>
          <span>Status</span>
          <span>Received</span>
        </div>
        <div className="divide-y divide-charcoal/10">
          {requests.length ? (
            requests.map((request) => (
              <article className="grid gap-4 px-4 py-5 xl:grid-cols-[1fr_0.9fr_0.9fr_0.8fr_0.9fr_0.8fr]" key={request.id}>
                <div>
                  <p className="font-serif text-xl">{request.name}</p>
                  <p className="mt-1 text-sm text-charcoal/56">{request.email}</p>
                  {request.phone ? <p className="mt-1 text-sm text-charcoal/48">{request.phone}</p> : null}
                </div>
                <p className="text-sm leading-6 text-charcoal/64">{request.interest ?? "Not specified"}</p>
                <div className="text-sm leading-6 text-charcoal/64">
                  <p>{request.location ?? "No location"}</p>
                  <p>{formatPreferredDate(request.preferredDate)}</p>
                  {request.preferredTime ? <p>{request.preferredTime}</p> : null}
                </div>
                <p className="text-sm leading-6 text-charcoal/64">{request.message ?? "No message"}</p>
                <AdminInlineForm action={updateAppointmentRequestStatusAction}>
                  <input name="id" type="hidden" value={request.id} />
                  <AdminSelect defaultValue={request.status} name="status">
                    {appointmentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </AdminSelect>
                  <AdminSubmitButton>Save</AdminSubmitButton>
                </AdminInlineForm>
                <p className="text-sm text-charcoal/54">{formatDate(request.createdAt)}</p>
              </article>
            ))
          ) : (
            <p className="p-5 text-sm text-charcoal/58">No appointment requests yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
