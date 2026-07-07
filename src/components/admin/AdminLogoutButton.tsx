"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      className="border border-charcoal/20 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-charcoal transition hover:border-charcoal/50 disabled:opacity-50"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      {isPending ? "Signing Out" : "Sign Out"}
    </button>
  );
}
