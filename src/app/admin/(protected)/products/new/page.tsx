import Link from "next/link";

import { ProductForm } from "@/components/admin/products/ProductForm";
import { createProductAction } from "@/server/actions/admin/products";
import { listCollectionOptions, listProductOptions } from "@/server/repositories/products.repo";

export default async function NewProductPage() {
  const [collections, products] = await Promise.all([listCollectionOptions(), listProductOptions()]);

  return (
    <div>
      <Link className="luxury-link text-[0.68rem] uppercase tracking-[0.2em]" href="/admin/products">
        Back to jewellery
      </Link>
      <header className="mt-7 max-w-3xl">
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">New Product</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Create jewellery product</h1>
        <p className="mt-4 text-sm leading-7 text-charcoal/64">
          Create a database product record, assign a collection, and curate product gemstone and
          related-product data. Public jewellery pages will still use static data until the DB-read
          migration phase.
        </p>
      </header>
      <div className="mt-9">
        <ProductForm action={createProductAction} collections={collections} mode="create" products={products} />
      </div>
    </div>
  );
}
