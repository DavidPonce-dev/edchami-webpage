import "reflect-metadata";
import { DataSource } from "typeorm";
import { Project } from "@/entities/Project";

function parseDatabaseUrl(url: string) {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) return null;
  return {
    username: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

const dbUrl = process.env.DATABASE_URL;
const parsed = dbUrl ? parseDatabaseUrl(dbUrl) : null;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: parsed?.host || process.env.DB_HOST || "localhost",
  port: parsed?.port || parseInt(process.env.DB_PORT || "5432"),
  username: parsed?.username || process.env.DB_USER || "postgres",
  password: parsed?.password || process.env.DB_PASSWORD || "postgres",
  database: parsed?.database || process.env.DB_NAME || "edchami_dev",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [Project],
  migrations: ["src/migrations/**/*.ts", "dist/migrations/**/*.js"],
});

let initialized = false;

export async function getDB(): Promise<DataSource> {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return AppDataSource;
}
