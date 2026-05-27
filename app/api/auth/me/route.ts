import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { rateLimitDefault } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = rateLimitDefault(`me:${ip}`);

  const response = NextResponse.json({ user: await getUser() });
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  return response;
}
