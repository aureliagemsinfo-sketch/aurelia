"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await authClient.signIn.email({
      email,
      password,
    });

    setIsPending(false);

    if (result.error) {
      setError("Unable to sign in with those credentials.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="mx-auto flex w-full max-w-md flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-charcoal/60" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="form-control"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-charcoal/60" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="form-control"
          id="password"
          minLength={12}
          name="password"
          required
          type="password"
        />
      </div>
      {error ? <p className="text-sm text-ruby">{error}</p> : null}
      <button
        className="border border-charcoal px-5 py-3 text-[0.72rem] uppercase tracking-[0.24em] text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing In" : "Sign In"}
      </button>
      <Link className="text-center text-[0.72rem] uppercase tracking-[0.2em] text-charcoal/55" href="/admin/forgot-password">
        Forgot Password
      </Link>
    </form>
  );
}
