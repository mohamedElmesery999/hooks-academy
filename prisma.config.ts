import "dotenv/config";
import { defineConfig } from "prisma/config";

// prisma generate loads this file but does not connect.
// Vercel builds fail if DATABASE_URL is read with env() before it is set.
const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});