import { createAuthClient } from "better-auth/react";

const authBaseUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
});
