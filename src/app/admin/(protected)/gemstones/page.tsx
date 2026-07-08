import Link from "next/link";

import { AdminInlineForm, AdminNumberInput, AdminSubmitButton } from "@/components/admin/AdminControls";
import {
  toggleGemstoneFeaturedAction,
  toggleGemstonePublishedAction,
  updateGemstoneDisplayOrderAction,
} from "@/server/actions/admin/gemstones";
import { listAdminGemstones } from "@/server/repositories/gemstones.repo";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminGemstonesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string }>;
}) {
  const [gemstones, query] = await Promise.all([listAdminGemstones(), searchParams]);

  return (
    <div>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Gemstone Management</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Gemstones</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
            Manage gemstone catalogue records for the database. Public gemstone pages continue to
            read from static data until the later DB-read migration phase.
          </p>
        </div>
        <Link
          className="inline-flex justify-center border border-charcoal bg-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal"
          href="/admin/gemstones/new"
        >
          New Gemstone
        </Link>
      </header>

      {query.deleted ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Gemstone deleted.
        </p>
      ) : null}
      {query.created ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Gemstone created.
        </p>
      ) : null}
      {query.updated && query.updated !== "error" ? (
        <p className="mt-6 border border-champagne/24 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Gemstone {query.updated === "order" ? "display order" : query.updated} saved.
        </p>
      ) : null}
      {query.updated === "error" ? (
        <p className="mt-6 border border-ruby/20 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Gemstone update could not be saved. Check the row values and try again.
        </p>
      ) : null}

      <section className="mt-9 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="hidden grid-cols-[5rem_1.1fr_1fr_0.8fr_0.7fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-charcoal/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-charcoal/45 xl:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Origin</span>
          <span>Colour</span>
          <span>Featured</span>
          <span>Published</span>
          <span>Order</span>
          <span>Updated</span>
        </div>
        <div className="divide-y divide-charcoal/10">
          {gemstones.map((gemstone) => {
            const thumbnail =
              gemstone.images.find((image) => image.imageRole === "primary") ??
              gemstone.images.find((image) => image.imageRole === "hero") ??
              gemstone.images[0];

            return (
              <article className="grid gap-4 px-4 py-5 xl:grid-cols-[5rem_1.1fr_1fr_0.8fr_0.7fr_0.7fr_0.8fr_0.8fr]" key={gemstone.id}>
                <div className="h-20 w-20 overflow-hidden bg-ivory xl:h-16 xl:w-16">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={thumbnail.alt} className="h-full w-full object-cover" src={thumbnail.url} />
                  ) : null}
                </div>
                <div>
                  <Link className="font-serif text-xl transition hover:text-champagne" href={`/admin/gemstones/${gemstone.id}`}>
                    {gemstone.name}
                  </Link>
                  <p className="mt-1 text-xs text-charcoal/46">{gemstone.slug}</p>
                  <p className="mt-2 text-xs text-charcoal/54">{gemstone.family ?? gemstone.type}</p>
                </div>
                <p className="text-sm leading-6 text-charcoal/64">{gemstone.originDisplay ?? gemstone.originCountry ?? gemstone.origin ?? "Not set"}</p>
                <p className="text-sm leading-6 text-charcoal/64">{gemstone.color ?? "Not set"}</p>
                <AdminInlineForm action={toggleGemstoneFeaturedAction}>
                  <input name="id" type="hidden" value={gemstone.id} />
                  <input name="next" type="hidden" value={String(!gemstone.isFeatured)} />
                  <AdminSubmitButton>
                    {gemstone.isFeatured ? "Featured" : "Set Featured"}
                  </AdminSubmitButton>
                </AdminInlineForm>
                <AdminInlineForm action={toggleGemstonePublishedAction}>
                  <input name="id" type="hidden" value={gemstone.id} />
                  <input name="next" type="hidden" value={String(!gemstone.isPublished)} />
                  <AdminSubmitButton>
                    {gemstone.isPublished ? "Published" : "Draft"}
                  </AdminSubmitButton>
                </AdminInlineForm>
                <AdminInlineForm action={updateGemstoneDisplayOrderAction}>
                  <input name="id" type="hidden" value={gemstone.id} />
                  <AdminNumberInput min={1} name="sortOrder" defaultValue={gemstone.sortOrder} />
                  <AdminSubmitButton>Save</AdminSubmitButton>
                </AdminInlineForm>
                <p className="text-sm text-charcoal/54">{formatDate(gemstone.updatedAt)}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
