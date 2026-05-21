import { NextRequest } from "next/server";

export function validateCSRF(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  if (origin) return origin === allowedOrigin;
  if (referer) return referer.startsWith(allowedOrigin + "/") || referer === allowedOrigin;
  return false;
}