import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "../../apps/api/.dev.vars" });

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  schemaFilter: ["public"],
});
