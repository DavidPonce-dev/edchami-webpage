import { AppDataSource } from "@/lib/datasource";

let initialized = false;

export async function getDB() {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return AppDataSource;
}
