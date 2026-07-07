"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("This reset link is invalid or expired.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }

    setIsPending(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: password,
      }),
    });
    setIsPending(false);

    if (!response.ok) {
      setError("This reset link is invalid or expired.");
      return;
    }

    setMessage("Password reset. You can now sign in.");
  }

  return (
    <form className="mx-auto flex w-full max-w-md flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-charcoal/60" htmlFor="password">
          New Password
        </label>
        <input
          autoComplete="new-password"
          className="form-control"
          id="password"
          minLength={12}
          name="password"
          required
          type="password"
        />
      </div>
      {error ? <p className="text-sm text-ruby">{error}</p> : null}
      {message ? (
        <p className="text-sm text-charcoal/65">
          {message}{" "}
          <Link className="luxury-link" href="/admin/login">
            Return to login
          </Link>
        </p>
      ) : null}
      <button
        className="border border-charcoal px-5 py-3 text-[0.72rem] uppercase tracking-[0.24em] text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:opacity-50"
        disabled={isPending || !token}
        type="submit"
      >
        {isPending ? "Resetting" : "Reset Password"}
      </button>
    </form>
  );
}
