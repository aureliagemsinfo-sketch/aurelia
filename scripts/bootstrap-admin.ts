import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

function getBootstrapEnvProblems() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const name = process.env.ADMIN_BOOTSTRAP_NAME;
  const databaseUrl = process.env.DATABASE_URL;
  const problems: string[] = [];

  if (!email) {
    problems.push("ADMIN_BOOTSTRAP_EMAIL is missing.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    problems.push("ADMIN_BOOTSTRAP_EMAIL is invalid.");
  }

  if (!password) {
    problems.push("ADMIN_BOOTSTRAP_PASSWORD is missing. Present: false. Length: 0.");
  } else if (password.length < 12) {
    problems.push(
      `ADMIN_BOOTSTRAP_PASSWORD is invalid. Present: true. Length: ${password.length}. Minimum length: 12.`,
    );
  }

  if (!name?.trim()) {
    problems.push("ADMIN_BOOTSTRAP_NAME is missing or empty.");
  }

  if (!databaseUrl) {
    problems.push("DATABASE_URL is missing.");
  }

  return problems;
}

async function main() {
  const envProblems = getBootstrapEnvProblems();

  if (envProblems.length) {
    console.error("Admin bootstrap env validation failed:");
    for (const problem of envProblems) {
      console.error(`- ${problem}`);
    }
    process.exitCode = 1;
    return;
  }

  const { bootstrapAdminFromEnv } = await import("../src/server/auth/bootstrap-admin");

  try {
    const result = await bootstrapAdminFromEnv();

    if (result.status === "invalid-env" || result.status === "missing-database-url") {
      console.error(result.reason);
      process.exitCode = 1;
    } else {
      console.log(result.reason ?? "Bootstrap admin created.");
      if (result.userId) {
        console.log(`Admin user id: ${result.userId}`);
      }
    }
  } catch (error) {
    console.error("Admin bootstrap failed.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
}

void main();
