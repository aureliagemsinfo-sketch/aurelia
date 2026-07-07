import { randomUUID } from "node:crypto";

import { eq, or, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "../db";
import { adminProfiles, user } from "../db/schema";
import { auth } from "./auth";

const bootstrapAdminSchema = z.object({
  email: z.email(),
  password: z.string().min(12),
  name: z.string().min(1),
});

function getEnvValidationReason(error: z.ZodError) {
  const issues = error.issues.map((issue) => {
    const key = issue.path[0];

    if (key === "password") {
      const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
      return `ADMIN_BOOTSTRAP_PASSWORD is invalid. Present: ${Boolean(password)}. Length: ${password?.length ?? 0}.`;
    }

    if (key === "email") {
      return "ADMIN_BOOTSTRAP_EMAIL is missing or invalid.";
    }

    if (key === "name") {
      return "ADMIN_BOOTSTRAP_NAME is missing or empty.";
    }

    return "Bootstrap admin environment is invalid.";
  });

  return `Admin bootstrap env validation failed: ${issues.join(" ")}`;
}

const adminRoleCondition = or(
  eq(user.role, "admin"),
  sql`${user.role} like 'admin,%'`,
  sql`${user.role} like '%,admin'`,
  sql`${user.role} like '%,admin,%'`,
);

function withAdminRole(role: string) {
  const roles = role
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!roles.includes("admin")) {
    roles.push("admin");
  }

  return roles.join(",");
}

async function ensureAdminProfile({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  await db
    .insert(adminProfiles)
    .values({
      id: randomUUID(),
      userId,
      role: "admin",
      name,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: adminProfiles.userId,
      set: {
        role: "admin",
        name,
        isActive: true,
        updatedAt: new Date(),
      },
    });
}

export async function bootstrapAdminFromEnv() {
  const parsed = bootstrapAdminSchema.safeParse({
    email: process.env.ADMIN_BOOTSTRAP_EMAIL,
    password: process.env.ADMIN_BOOTSTRAP_PASSWORD,
    name: process.env.ADMIN_BOOTSTRAP_NAME,
  });

  if (!parsed.success) {
    return {
      created: false,
      status: "invalid-env",
      reason: getEnvValidationReason(parsed.error),
    };
  }

  if (!process.env.DATABASE_URL) {
    return {
      created: false,
      status: "missing-database-url",
      reason: "DATABASE_URL is required before bootstrapping the first admin.",
    };
  }

  const [existingAdmin] = await db
    .select({
      email: user.email,
      id: user.id,
      name: user.name,
    })
    .from(user)
    .where(adminRoleCondition)
    .limit(1);

  const [existingUser] = await db
    .select({
      id: user.id,
      name: user.name,
      role: user.role,
    })
    .from(user)
    .where(eq(user.email, parsed.data.email))
    .limit(1);

  if (existingAdmin) {
    if (existingAdmin.email === parsed.data.email) {
      await ensureAdminProfile({
        name: existingAdmin.name || parsed.data.name,
        userId: existingAdmin.id,
      });

      return {
        created: false,
        status: "already-exists",
        reason: "Bootstrap admin already exists; password was not changed.",
        userId: existingAdmin.id,
      };
    }

    return {
      created: false,
      status: "skipped-existing-admin",
      reason: "An admin user already exists; bootstrap did not create another admin.",
      userId: existingAdmin.id,
    };
  }

  if (existingUser) {
    await db
      .update(user)
      .set({
        role: withAdminRole(existingUser.role),
        updatedAt: new Date(),
      })
      .where(eq(user.id, existingUser.id));

    await ensureAdminProfile({
      name: existingUser.name || parsed.data.name,
      userId: existingUser.id,
    });

    return {
      created: false,
      promoted: true,
      status: "promoted-existing-user",
      reason: "Existing user promoted to admin; password was not changed.",
      userId: existingUser.id,
    };
  }

  const result = await auth.api.createUser({
    body: {
      email: parsed.data.email,
      password: parsed.data.password,
      name: parsed.data.name,
      role: "admin",
    },
  });

  await ensureAdminProfile({
    name: parsed.data.name,
    userId: result.user.id,
  });

  return {
    created: true,
    status: "created",
    userId: result.user.id,
  };
}
