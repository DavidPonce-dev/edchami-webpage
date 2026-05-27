import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count } from "drizzle-orm";

const SETUP_COOKIE = "setup_complete";
const PUBLIC_PATHS = ["/register", "/api/setup-status", "/api/og"];

async function checkHasUsers(): Promise<boolean> {
  try {
    const result = await db.select({ cnt: count() }).from(user);
    return result[0].cnt > 0;
  } catch {
    return false;
  }
}

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
      const hasUsers = await checkHasUsers();
      if (hasUsers) {
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
