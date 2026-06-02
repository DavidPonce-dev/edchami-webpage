import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { rateLimitDefault } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = await rateLimitDefault(`setup:${ip}`);

  try {
    const result = await db.select({ cnt: count() }).from(user);
    const response = NextResponse.json({ hasUsers: result[0].cnt > 0 });
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    return response;
  } catch (error) {
    logger.error("Setup status check failed:", error);
    return NextResponse.json({ hasUsers: false });
  }
}
