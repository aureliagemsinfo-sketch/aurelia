import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/server/auth/session";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-ivory px-6 py-16">
      <section className="w-full text-center">
        <p className="mb-4 text-[0.68rem] uppercase tracking-[0.28em] text-charcoal/50">Admin</p>
        <h1 className="mb-10 font-serif text-[clamp(2rem,5vw,3.25rem)] font-normal">Aurelia Gems</h1>
        <AdminLoginForm />
      </section>
    </main>
  );
}
