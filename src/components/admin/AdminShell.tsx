import Link from "next/link";

import { AdminLogoutButton } from "./AdminLogoutButton";

const adminNavItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/gemstones", label: "Gemstones" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/products", label: "Jewellery" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
];

type AdminShellProps = {
  children: React.ReactNode;
  userEmail: string;
  userName?: string | null;
};

export function AdminShell({ children, userEmail, userName }: AdminShellProps) {
  return (
    <main className="min-h-svh bg-ivory text-charcoal">
      <div className="mx-auto flex min-h-svh w-full max-w-[118rem] flex-col lg:flex-row">
        <aside className="border-b border-charcoal/10 bg-porcelain px-5 py-5 lg:sticky lg:top-0 lg:h-svh lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between gap-5 lg:block">
            <Link className="block" href="/admin">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-charcoal/45">Aurelia Gems</p>
              <p className="mt-2 font-serif text-2xl leading-none">Admin</p>
            </Link>
            <div className="lg:hidden">
              <AdminLogoutButton />
            </div>
          </div>
          <nav aria-label="Admin navigation" className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {adminNavItems.map((item) => (
              <Link
                className="block whitespace-nowrap border border-charcoal/10 bg-ivory/55 px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/62 transition hover:border-charcoal/25 hover:text-charcoal lg:border-transparent lg:bg-transparent lg:px-3"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="hidden border-b border-charcoal/10 bg-ivory/92 px-8 py-5 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/45">Signed in</p>
              <p className="mt-1 text-sm text-charcoal/70">{userName || userEmail}</p>
            </div>
            <AdminLogoutButton />
          </header>
          <div className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
        </section>
      </div>
    </main>
  );
}
