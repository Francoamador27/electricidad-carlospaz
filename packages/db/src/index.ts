import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDb(databaseUrl: string) {
  return drizzle(neon(databaseUrl), { schema });
}

export { schema };
export { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
