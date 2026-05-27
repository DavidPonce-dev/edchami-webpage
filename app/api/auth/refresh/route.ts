import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signToken, signRefreshToken } from "@/lib/jwt";

type User = { id: number; email: string; role: string };

const authCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24,
};

const refreshCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 15,
};

export async function POST(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value || "";
  const refreshToken = request.cookies.get("refresh_token")?.value || "";

  if (!authToken && !refreshToken) {
    const response = NextResponse.json({ error: "No auth or refresh token provided" }, { status: 401 });
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  let user: User | null = verifyToken<User>(authToken);
  if (!user && refreshToken) {
    user = verifyToken<User>(refreshToken);
  }

  if (!user) {
    const response = NextResponse.json({ error: "Invalid or expired auth token" }, { status: 401 });
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  const { id, email, role } = user;
  const newToken = signToken({ id, email, role });

  if (!newToken) {
    const response = NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
    response.cookies.delete("auth_token");
    return response;
  }

  const response = NextResponse.json({ message: "Token refreshed" });
  response.cookies.set("auth_token", newToken, authCookieOpts);

  if (refreshToken) {
    const newRefreshToken = signRefreshToken({ id, email, role });
    response.cookies.set("refresh_token", newRefreshToken, refreshCookieOpts);
  }
  return response;
}
