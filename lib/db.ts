import "reflect-metadata";
import { DataSource } from "typeorm";
import { Project } from "@/entities/Project";
import { User } from "@/entities/User";

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

const config = parsed
  ? {
      host: parsed.host,
      port: parsed.port,
      username: parsed.username,
      password: parsed.password,
      database: parsed.database,
    }
  : {
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || "5432"),
      username: process.env.DB_USER || process.env.POSTGRES_USER || "postgres",
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "postgres",
      database: process.env.DB_NAME || process.env.POSTGRES_DB || "edchami_dev",
    };

export const AppDataSource = new DataSource({
  type: "postgres",
  ...config,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [Project, User],
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
