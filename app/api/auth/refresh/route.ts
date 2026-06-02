import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifyToken, signToken, signRefreshToken } from "@/lib/jwt";
import { rateLimitAuth } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

type TokenPayload = { id: number; email: string; role: string; tokenVersion: number };

const authCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60,
};

const refreshCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 15,
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = await rateLimitAuth(`refresh:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Retry after ${rateLimit.retryAfter}s` },
      { status: 429 },
    );
  }

  const authToken = request.cookies.get("auth_token")?.value || "";
  const refreshToken = request.cookies.get("refresh_token")?.value || "";

  if (!authToken && !refreshToken) {
    const response = NextResponse.json({ error: "No auth or refresh token provided" }, { status: 401 });
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  let payload: TokenPayload | null = verifyToken<TokenPayload>(authToken);
  if (!payload && refreshToken) {
    payload = verifyToken<TokenPayload>(refreshToken);
  }

  if (!payload) {
    const response = NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  const dbUser = await db.query.user.findFirst({ where: eq(userTable.id, payload.id) });
  if (!dbUser || !dbUser.isActive) {
    const response = NextResponse.json({ error: "User not found or inactive" }, { status: 401 });
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  if (dbUser.tokenVersion !== payload.tokenVersion) {
    const response = NextResponse.json({ error: "Token revoked" }, { status: 401 });
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  const { id, email, role, tokenVersion } = payload;
  const newToken = signToken({ id, email, role, tokenVersion });

  if (!newToken) {
    const response = NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
    response.cookies.delete("auth_token");
    return response;
  }

  const response = NextResponse.json({ message: "Token refreshed" });
  response.cookies.set("auth_token", newToken, authCookieOpts);

  if (refreshToken) {
    const newRefreshToken = signRefreshToken({ id, email, role, tokenVersion });
    response.cookies.set("refresh_token", newRefreshToken, refreshCookieOpts);
  }
  return response;
}
