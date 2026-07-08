import Link from "next/link";

import { AdminInlineForm, AdminNumberInput, AdminSubmitButton } from "@/components/admin/AdminControls";
import {
  toggleProductFeaturedAction,
  toggleProductPublishedAction,
  updateProductDisplayOrderAction,
} from "@/server/actions/admin/products";
import { listAdminProducts } from "@/server/repositories/products.repo";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string }>;
}) {
  const [products, query] = await Promise.all([listAdminProducts(), searchParams]);

  return (
    <div>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Product Management</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Jewellery</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
            Manage database jewellery records, imagery, collection assignment, gemstone details,
            and related products. Public jewellery pages continue to read from static data until
            the later DB-read migration phase.
          </p>
        </div>
        <Link
          className="inline-flex justify-center border border-charcoal bg-charcoal px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal"
          href="/admin/products/new"
        >
          New Product
        </Link>
      </header>

      {query.deleted ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Product deleted.
        </p>
      ) : null}
      {query.created ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Product created.
        </p>
      ) : null}

      <section className="mt-9 overflow-hidden border border-charcoal/10 bg-porcelain/64">
        <div className="hidden grid-cols-[5rem_1.1fr_0.9fr_1fr_0.75fr_0.75fr_0.75fr_0.8fr_0.8fr] gap-4 border-b border-charcoal/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-charcoal/45 2xl:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Collection</span>
          <span>Price</span>
          <span>Featured</span>
          <span>Status</span>
          <span>Order</span>
          <span>Updated</span>
        </div>
        <div className="divide-y divide-charcoal/10">
          {products.length ? (
            products.map((product) => {
              const thumbnail =
                product.images.find((image) => image.imageRole === "primary") ??
                product.images.find((image) => image.imageRole === "hero") ??
                product.images[0];

              return (
                <article className="grid gap-4 px-4 py-5 2xl:grid-cols-[5rem_1.1fr_0.9fr_1fr_0.75fr_0.75fr_0.75fr_0.8fr_0.8fr]" key={product.id}>
                  <div className="h-20 w-20 overflow-hidden bg-ivory 2xl:h-16 2xl:w-16">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={thumbnail.alt} className="h-full w-full object-cover" src={thumbnail.url} />
                    ) : null}
                  </div>
                  <div>
                    <Link className="font-serif text-xl transition hover:text-champagne" href={`/admin/products/${product.id}`}>
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-charcoal/46">{product.slug}</p>
                    {product.availability ? <p className="mt-2 text-xs text-charcoal/54">{product.availability}</p> : null}
                  </div>
                  <p className="text-sm leading-6 text-charcoal/64">{product.category ?? "Not set"}</p>
                  <p className="text-sm leading-6 text-charcoal/64">{product.collection?.name ?? "No collection"}</p>
                  <p className="text-sm leading-6 text-charcoal/64">{product.priceLabel ?? "Not set"}</p>
                  <AdminInlineForm action={toggleProductFeaturedAction}>
                    <input name="id" type="hidden" value={product.id} />
                    <input name="next" type="hidden" value={String(!product.isFeatured)} />
                    <AdminSubmitButton>
                      {product.isFeatured ? "Featured" : "Set Featured"}
                    </AdminSubmitButton>
                  </AdminInlineForm>
                  <AdminInlineForm action={toggleProductPublishedAction}>
                    <input name="id" type="hidden" value={product.id} />
                    <input name="next" type="hidden" value={String(!product.isPublished)} />
                    <AdminSubmitButton>
                      {product.isPublished ? "Published" : "Draft"}
                    </AdminSubmitButton>
                  </AdminInlineForm>
                  <AdminInlineForm action={updateProductDisplayOrderAction}>
                    <input name="id" type="hidden" value={product.id} />
                    <AdminNumberInput min={0} name="sortOrder" defaultValue={product.sortOrder} />
                    <AdminSubmitButton>Save</AdminSubmitButton>
                  </AdminInlineForm>
                  <p className="text-sm text-charcoal/54">{formatDate(product.updatedAt)}</p>
                </article>
              );
            })
          ) : (
            <p className="p-5 text-sm text-charcoal/58">No product records yet. Run the product seed or create one manually.</p>
          )}
        </div>
      </section>
    </div>
  );
}
