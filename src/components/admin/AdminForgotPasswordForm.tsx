"use client";

import { useState } from "react";

const neutralMessage = "If an account exists, a reset email has been sent.";

export function AdminForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        redirectTo: `${window.location.origin}/admin/reset-password`,
      }),
    }).catch(() => undefined);

    setIsPending(false);
    setMessage(neutralMessage);
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
      {message ? <p className="text-sm text-charcoal/65">{message}</p> : null}
      <button
        className="border border-charcoal px-5 py-3 text-[0.72rem] uppercase tracking-[0.24em] text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Sending" : "Send Reset Link"}
      </button>
    </form>
  );
}
