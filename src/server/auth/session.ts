import { headers } from "next/headers";

import { auth } from "./auth";

export function isAdminRole(role: unknown) {
  if (typeof role !== "string") {
    return false;
  }

  return role
    .split(",")
    .map((value) => value.trim())
    .includes("admin");
}

export async function getAdminSession() {
  const requestHeaders = new Headers(await headers());
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || !isAdminRole(session.user.role)) {
    return null;
  }

  return session;
}
