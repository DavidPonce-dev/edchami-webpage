type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

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

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig,
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count };
}

export function rateLimitAuth(identifier: string) {
  return checkRateLimit(`auth:${identifier}`, authConfig);
}

export function rateLimitDefault(identifier: string) {
  return checkRateLimit(identifier, defaultConfig);
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60 * 1000);
