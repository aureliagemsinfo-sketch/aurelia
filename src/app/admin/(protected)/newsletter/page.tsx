import { updateNewsletterSubscriberActiveAction } from "@/server/actions/admin/submissions";
import { listAdminNewsletterSubscribers } from "@/server/repositories/submissions.repo";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminNewsletterPage() {
  const subscribers = await listAdminNewsletterSubscribers();

  return (
    <div>
      <header>
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Audience</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Newsletter</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
          Review newsletter subscribers and subscription state. Bulk send/export tooling is not
          part of this phase.
        </p>
      </header>

      <section className="mt-9 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="hidden grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-charcoal/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-charcoal/45 xl:grid">
          <span>Email</span>
          <span>Source</span>
          <span>Status</span>
          <span>Action</span>
          <span>Created</span>
        </div>
        <div className="divide-y divide-charcoal/10">
          {subscribers.length ? (
            subscribers.map((subscriber) => (
              <article className="grid gap-4 px-4 py-5 xl:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.8fr]" key={subscriber.id}>
                <p className="text-sm leading-6 text-charcoal/70">{subscriber.email}</p>
                <p className="text-sm leading-6 text-charcoal/64">{subscriber.source ?? "website"}</p>
                <p className="text-sm leading-6 text-charcoal/64">{subscriber.isActive ? "active" : "inactive"}</p>
                <form action={updateNewsletterSubscriberActiveAction}>
                  <input name="id" type="hidden" value={subscriber.id} />
                  <input name="isActive" type="hidden" value={String(!subscriber.isActive)} />
                  <button className="border border-charcoal/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/60" type="submit">
                    {subscriber.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <p className="text-sm text-charcoal/54">{formatDate(subscriber.createdAt)}</p>
              </article>
            ))
          ) : (
            <p className="p-5 text-sm text-charcoal/58">No newsletter subscribers yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
