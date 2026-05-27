import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const user = process.env.DB_USER || process.env.POSTGRES_USER || "postgres";
  const pass = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "postgres";
  const host = process.env.DB_HOST || process.env.POSTGRES_HOST || "localhost";
  const port = process.env.DB_PORT || process.env.POSTGRES_PORT || "5432";
  const name = process.env.DB_NAME || process.env.POSTGRES_DB || "edchami_dev";
  return `postgresql://${user}:${pass}@${host}:${port}/${name}`;
}

const client = postgres(getDbUrl(), {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
