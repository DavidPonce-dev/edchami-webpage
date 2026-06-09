import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rateLimitDefault } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = await rateLimitDefault(`me:${ip}`);

  const response = NextResponse.json({ user: await getSession() });
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  return response;
}
