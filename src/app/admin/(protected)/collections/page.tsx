import Link from "next/link";

import {
  toggleCollectionPublishedAction,
  updateCollectionDisplayOrderAction,
} from "@/server/actions/admin/collections";
import { listAdminCollections } from "@/server/repositories/collections.repo";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string }>;
}) {
  const [collections, query] = await Promise.all([listAdminCollections(), searchParams]);

  return (
    <div>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Collection Management</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Collections</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
            Manage database collection stories, imagery, publishing state, and gemstone
            relationships. Public collection pages continue to read from static data until the
            later DB-read migration phase.
          </p>
        </div>
        <Link
          className="inline-flex justify-center border border-charcoal bg-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal"
          href="/admin/collections/new"
        >
          New Collection
        </Link>
      </header>

      {query.deleted ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Collection deleted.
        </p>
      ) : null}
      {query.created ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Collection created.
        </p>
      ) : null}

      <section className="mt-9 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="hidden grid-cols-[5rem_1.1fr_1.35fr_0.7fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-charcoal/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-charcoal/45 xl:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Description</span>
          <span>Status</span>
          <span>Gems</span>
          <span>Order</span>
          <span>Updated</span>
        </div>
        <div className="divide-y divide-charcoal/10">
          {collections.length ? (
            collections.map((collection) => {
              const thumbnail =
                collection.images.find((image) => image.imageRole === "primary") ??
                collection.images.find((image) => image.imageRole === "hero") ??
                collection.images[0];

              return (
                <article className="grid gap-4 px-4 py-5 xl:grid-cols-[5rem_1.1fr_1.35fr_0.7fr_0.7fr_0.8fr_0.8fr]" key={collection.id}>
                  <div className="h-20 w-20 overflow-hidden bg-ivory xl:h-16 xl:w-16">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={thumbnail.alt} className="h-full w-full object-cover" src={thumbnail.url} />
                    ) : null}
                  </div>
                  <div>
                    <Link className="font-serif text-xl transition hover:text-champagne" href={`/admin/collections/${collection.id}`}>
                      {collection.name}
                    </Link>
                    <p className="mt-1 text-xs text-charcoal/46">{collection.slug}</p>
                    {collection.eyebrow ? <p className="mt-2 text-xs text-charcoal/54">{collection.eyebrow}</p> : null}
                  </div>
                  <p className="text-sm leading-6 text-charcoal/64">{collection.shortDescription ?? collection.summary ?? "No short description set."}</p>
                  <form action={toggleCollectionPublishedAction}>
                    <input name="id" type="hidden" value={collection.id} />
                    <input name="next" type="hidden" value={String(!collection.isPublished)} />
                    <button className="border border-charcoal/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/60" type="submit">
                      {collection.isPublished ? "Published" : "Draft"}
                    </button>
                  </form>
                  <p className="text-sm text-charcoal/54">{collection.relatedGems.length}</p>
                  <form action={updateCollectionDisplayOrderAction} className="flex gap-2">
                    <input name="id" type="hidden" value={collection.id} />
                    <input className="w-20 border border-charcoal/10 bg-white px-3 py-2 text-sm" min={0} name="sortOrder" type="number" defaultValue={collection.sortOrder} />
                    <button className="border border-charcoal/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/60" type="submit">
                      Save
                    </button>
                  </form>
                  <p className="text-sm text-charcoal/54">{formatDate(collection.updatedAt)}</p>
                </article>
              );
            })
          ) : (
            <p className="p-5 text-sm text-charcoal/58">No collection records yet. Run the collection seed or create one manually.</p>
          )}
        </div>
      </section>
    </div>
  );
}
