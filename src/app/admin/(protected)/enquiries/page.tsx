import {
  updateContactSubmissionStatusAction,
  updateProductEnquiryStatusAction,
} from "@/server/actions/admin/submissions";
import {
  listAdminContactSubmissions,
  listAdminProductEnquiries,
  type EnquiryStatus,
} from "@/server/repositories/submissions.repo";

const enquiryStatuses: EnquiryStatus[] = ["new", "read", "replied", "archived"];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function StatusForm({
  action,
  id,
  status,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  status: string;
}) {
  return (
    <form action={action} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <select className="border border-charcoal/10 bg-white px-3 py-2 text-sm" defaultValue={status} name="status">
        {enquiryStatuses.map((nextStatus) => (
          <option key={nextStatus} value={nextStatus}>
            {nextStatus}
          </option>
        ))}
      </select>
      <button className="border border-charcoal/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/60" type="submit">
        Save
      </button>
    </form>
  );
}

export default async function AdminEnquiriesPage() {
  const [itemEnquiries, contactSubmissions] = await Promise.all([
    listAdminProductEnquiries(),
    listAdminContactSubmissions(),
  ]);

  return (
    <div>
      <header>
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Inbox</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Enquiries</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
          Review product, gemstone, collection, and general contact enquiries. Reply work happens
          outside the CMS for now; use status to track progress.
        </p>
      </header>

      <section className="mt-9 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="border-b border-charcoal/10 px-4 py-4">
          <h2 className="font-serif text-2xl font-normal">Item Enquiries</h2>
        </div>
        <div className="divide-y divide-charcoal/10">
          {itemEnquiries.length ? (
            itemEnquiries.map((enquiry) => (
              <article className="grid gap-4 px-4 py-5 xl:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr]" key={enquiry.id}>
                <div>
                  <p className="font-serif text-xl">{enquiry.name}</p>
                  <p className="mt-1 text-sm text-charcoal/56">{enquiry.email}</p>
                  {enquiry.phone ? <p className="mt-1 text-sm text-charcoal/48">{enquiry.phone}</p> : null}
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-charcoal/42">
                    {enquiry.itemType ?? "item"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/70">{enquiry.itemName ?? enquiry.itemSlug ?? "Not specified"}</p>
                </div>
                <p className="text-sm leading-6 text-charcoal/64">{enquiry.message}</p>
                <StatusForm action={updateProductEnquiryStatusAction} id={enquiry.id} status={enquiry.status} />
                <p className="text-sm text-charcoal/54">{formatDate(enquiry.createdAt)}</p>
              </article>
            ))
          ) : (
            <p className="p-5 text-sm text-charcoal/58">No item enquiries yet.</p>
          )}
        </div>
      </section>

      <section className="mt-8 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="border-b border-charcoal/10 px-4 py-4">
          <h2 className="font-serif text-2xl font-normal">Contact Messages</h2>
        </div>
        <div className="divide-y divide-charcoal/10">
          {contactSubmissions.length ? (
            contactSubmissions.map((submission) => (
              <article className="grid gap-4 px-4 py-5 xl:grid-cols-[1fr_1fr_1.1fr_0.8fr_0.8fr]" key={submission.id}>
                <div>
                  <p className="font-serif text-xl">{submission.name}</p>
                  <p className="mt-1 text-sm text-charcoal/56">{submission.email}</p>
                  {submission.phone ? <p className="mt-1 text-sm text-charcoal/48">{submission.phone}</p> : null}
                </div>
                <p className="text-sm leading-6 text-charcoal/64">{submission.subject ?? "General enquiry"}</p>
                <p className="text-sm leading-6 text-charcoal/64">{submission.message}</p>
                <StatusForm action={updateContactSubmissionStatusAction} id={submission.id} status={submission.status} />
                <p className="text-sm text-charcoal/54">{formatDate(submission.createdAt)}</p>
              </article>
            ))
          ) : (
            <p className="p-5 text-sm text-charcoal/58">No contact messages yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
