import { Suspense } from "react";

import { AdminResetPasswordForm } from "@/components/admin/AdminResetPasswordForm";

export default function AdminResetPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-ivory px-6 py-16">
      <section className="w-full text-center">
        <p className="mb-4 text-[0.68rem] uppercase tracking-[0.28em] text-charcoal/50">Admin</p>
        <h1 className="mb-10 font-serif text-[clamp(2rem,5vw,3.25rem)] font-normal">Choose New Password</h1>
        <Suspense>
          <AdminResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
