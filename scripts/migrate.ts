import postgres from "postgres";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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

console.log("Running database migrations...");

await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "drizzle"`);
await client.unsafe(`CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
  "id" serial PRIMARY KEY,
  "hash" text NOT NULL,
  "created_at" bigint
)`);

const migrationsDir = "./drizzle";
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

for (const file of migrationFiles) {
  const content = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
  const hash = crypto.createHash("sha256").update(content).digest("hex");

  const result = await client.unsafe(
    `SELECT id FROM "drizzle"."__drizzle_migrations" WHERE hash = '${hash}'`
  );

  if (result.length === 0) {
    try {
      await client.unsafe(content);
      await client.unsafe(
        `INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ('${hash}', ${Date.now()})`
      );
      console.log(`  Applied: ${file}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists") || msg.includes("42P07")) {
        await client.unsafe(
          `INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ('${hash}', ${Date.now()})`
        );
        console.log(`  Skipped (already applied): ${file}`);
      } else {
        console.error(`  Failed: ${file}`, err);
        await client.end();
        process.exit(1);
      }
    }
  }
}

console.log("Migrations complete.");
await client.end();
