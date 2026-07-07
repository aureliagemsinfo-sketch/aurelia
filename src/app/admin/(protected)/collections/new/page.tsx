import Link from "next/link";

import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import { createCollectionAction } from "@/server/actions/admin/collections";
import { listGemstoneOptions } from "@/server/repositories/collections.repo";

export default async function NewCollectionPage() {
  const gemstones = await listGemstoneOptions();

  return (
    <div>
      <Link className="luxury-link text-[0.68rem] uppercase tracking-[0.2em]" href="/admin/collections">
        Back to collections
      </Link>
      <header className="mt-7 max-w-3xl">
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">New Collection</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Create collection</h1>
        <p className="mt-4 text-sm leading-7 text-charcoal/64">
          Create a database collection record and assign related gemstones. Public collection pages
          will still use static collection data until the DB-read migration phase.
        </p>
      </header>
      <div className="mt-9">
        <CollectionForm action={createCollectionAction} gemstones={gemstones} mode="create" />
      </div>
    </div>
  );
}
