import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const user = process.env.DB_USER || "postgres";
  const pass = process.env.DB_PASSWORD || "postgres";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const name = process.env.DB_NAME || "edchami_dev";
  return `postgresql://${user}:${pass}@${host}:${port}/${name}`;
}

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  console.error("DATABASE_URL or DB_HOST is required");
  process.exit(1);
}

const client = postgres(getDbUrl(), { max: 1 });
const db = drizzle(client);

console.log("Running database migrations...");
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations complete.");

await client.end();
