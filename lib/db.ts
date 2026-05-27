import { AppDataSource } from "@/lib/datasource";

let initializing: Promise<void> | null = null;

export async function getDB() {
  if (AppDataSource.isInitialized) return AppDataSource;

  if (!initializing) {
    initializing = AppDataSource.initialize().then(() => {});
  }

  await initializing;
  return AppDataSource;
}
