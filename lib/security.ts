import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function validateUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const allowedProtocols = ["http:", "https:"];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function sanitizeTags(tags: string[]): string[] {
  return tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0 && tag.length <= 30 && /^[a-z0-9\-_]+$/.test(tag))
    .slice(0, 10);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashString: string): boolean {
  const [salt, hash] = hashString.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, derivedKey);
}

export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

export function verifyCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  const tokenBuffer = Buffer.from(token, "hex");
  const storedBuffer = Buffer.from(storedToken, "hex");
  if (tokenBuffer.length !== storedBuffer.length) return false;
  return timingSafeEqual(tokenBuffer, storedBuffer);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000,
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

setInterval(cleanupRateLimitMap, 5 * 60 * 1000);
