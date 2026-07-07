import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-5 py-24 text-center">
      <div className="max-w-xl">
        <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/45">404 · The Maison</p>
        <h1 className="mt-5 font-serif text-[var(--text-fluid-hero)] font-normal leading-[1.1] tracking-[-0.015em]">This Story Could Not Be Found</h1>
        <p className="mt-5 text-[0.95rem] leading-[1.8] text-charcoal/62">The creation or page you requested may have moved. Return to the maison’s collections to continue exploring.</p>
        <Link className="luxury-link mt-7 inline-block text-[0.7rem] uppercase tracking-[0.2em]" href="/collections">Explore Collections</Link>
      </div>
    </main>
  );
}
