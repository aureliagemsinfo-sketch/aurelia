import Link from "next/link";
import { notFound } from "next/navigation";

import { GemstoneForm } from "@/components/admin/gemstones/GemstoneForm";
import { GemstoneImageManager } from "@/components/admin/gemstones/GemstoneImageManager";
import { deleteGemstoneAction, updateGemstoneAction } from "@/server/actions/admin/gemstones";
import { getAdminGemstoneById } from "@/server/repositories/gemstones.repo";
import { isR2Configured } from "@/server/storage/r2";

export default async function EditGemstonePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const gemstone = await getAdminGemstoneById(id);

  if (!gemstone) {
    notFound();
  }

  return (
    <div>
      <Link className="luxury-link text-[0.68rem] uppercase tracking-[0.2em]" href="/admin/gemstones">
        Back to gemstones
      </Link>
      <header className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Edit Gemstone</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">{gemstone.name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/64">
            Update gemstone catalogue details, publishing state, and R2-backed image records.
          </p>
        </div>
        <form action={deleteGemstoneAction} className="max-w-xs border border-ruby/20 bg-ruby/5 p-4">
          <input name="id" type="hidden" value={gemstone.id} />
          <label className="flex items-start gap-3 text-xs leading-5 text-ruby">
            <input className="mt-1" name="confirmDelete" required type="checkbox" />
            I understand this permanently deletes the gemstone record.
          </label>
          <button className="mt-4 border border-ruby/25 px-5 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ruby transition hover:bg-ruby hover:text-ivory" type="submit">
            Delete
          </button>
        </form>
      </header>

      {query.saved ? (
        <p className="mt-6 border border-charcoal/10 bg-porcelain/74 px-4 py-3 text-sm text-charcoal/66">
          Gemstone saved.
        </p>
      ) : null}

      <div className="mt-9">
        <GemstoneForm action={updateGemstoneAction} gemstone={gemstone} mode="edit" />
      </div>
      <GemstoneImageManager gemstone={gemstone} isUploadConfigured={isR2Configured()} />
    </div>
  );
}
