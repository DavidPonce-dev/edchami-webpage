import { NextRequest, NextResponse } from "next/server";

const SETUP_COOKIE = "setup_complete";
const PUBLIC_PATHS = ["/register", "/api/setup-status", "/api/og"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const setupComplete = request.cookies.get(SETUP_COOKIE)?.value === "true";

  if (!setupComplete) {
    try {
      const baseUrl = request.nextUrl.origin;
      const response = await fetch(`${baseUrl}/api/setup-status`, {
        headers: { cookie: request.headers.get("cookie") || "" },
        cache: "force-cache",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasUsers) {
          const nextResponse = NextResponse.next();
          nextResponse.cookies.set(SETUP_COOKIE, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
          });
          return nextResponse;
        }
      }
    } catch {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
