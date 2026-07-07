import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://aurelia_gems:development@localhost:5432/aurelia_gems";

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
