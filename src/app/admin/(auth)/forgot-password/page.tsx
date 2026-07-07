import Link from "next/link";

import { AdminForgotPasswordForm } from "@/components/admin/AdminForgotPasswordForm";

export default function AdminForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-ivory px-6 py-16">
      <section className="w-full text-center">
        <p className="mb-4 text-[0.68rem] uppercase tracking-[0.28em] text-charcoal/50">Admin</p>
        <h1 className="mb-5 font-serif text-[clamp(2rem,5vw,3.25rem)] font-normal">Reset Access</h1>
        <p className="mx-auto mb-10 max-w-md text-sm leading-7 text-charcoal/60">
          Enter your admin email and we will send a secure reset link when an account exists.
        </p>
        <AdminForgotPasswordForm />
        <Link className="mt-8 inline-block text-[0.72rem] uppercase tracking-[0.2em] text-charcoal/55" href="/admin/login">
          Return to Login
        </Link>
      </section>
    </main>
  );
}
