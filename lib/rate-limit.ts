import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const STORE_PATH = join(process.cwd(), "storage", "rate-limit.json");

let store: Record<string, RateLimitEntry> = {};
let storeLoaded = false;
let writePending = false;

async function loadStore() {
  if (storeLoaded) return;
  try {
    if (!existsSync(STORE_PATH)) {
      await mkdir(join(process.cwd(), "storage"), { recursive: true });
      await writeFile(STORE_PATH, "{}");
      storeLoaded = true;
      return;
    }
    const content = await readFile(STORE_PATH, "utf-8");
    store = JSON.parse(content);
    storeLoaded = true;
  } catch {
    store = {};
    storeLoaded = true;
  }
}

async function flushStore() {
  if (writePending) return;
  writePending = true;
  try {
    await writeFile(STORE_PATH, JSON.stringify(store));
  } catch {
    // Silently fail — rate limiting is best-effort
  } finally {
    writePending = false;
  }
}

setInterval(async () => {
  await loadStore();
  const now = Date.now();
  let changed = false;
  for (const key of Object.keys(store)) {
    if (now > store[key].resetAt) {
      delete store[key];
      changed = true;
    }
  }
  if (changed) {
    await flushStore();
  }
}, 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 10,
};

const authConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 5,
};

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig,
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  await loadStore();
  const now = Date.now();
  const entry = store[identifier];

  if (!entry || now > entry.resetAt) {
    store[identifier] = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    flushStore();
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count++;
  flushStore();
  return { allowed: true, remaining: config.maxRequests - entry.count };
}

export async function rateLimitAuth(identifier: string) {
  return checkRateLimit(`auth:${identifier}`, authConfig);
}

export async function rateLimitDefault(identifier: string) {
  return checkRateLimit(identifier, defaultConfig);
}
