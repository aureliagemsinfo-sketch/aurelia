import Link from "next/link";

import { GemstoneForm } from "@/components/admin/gemstones/GemstoneForm";
import { createGemstoneAction } from "@/server/actions/admin/gemstones";

export default function NewGemstonePage() {
  return (
    <div>
      <Link className="luxury-link text-[0.68rem] uppercase tracking-[0.2em]" href="/admin/gemstones">
        Back to gemstones
      </Link>
      <header className="mt-7 max-w-3xl">
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">New Gemstone</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Create gemstone</h1>
        <p className="mt-4 text-sm leading-7 text-charcoal/64">
          Create a database gemstone record. Public pages will still use static gemstone data until
          the DB-read migration phase.
        </p>
      </header>
      <div className="mt-9">
        <GemstoneForm action={createGemstoneAction} mode="create" />
      </div>
    </div>
  );
}
