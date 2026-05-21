import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signToken, signRefreshToken } from "@/lib/jwt";
import { User } from "@/types/user";
import { validateCSRF } from "@/lib/csrf";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@/lib/settings";

export async function POST(request: NextRequest) {
  if (!validateCSRF(request))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const authToken = request.cookies.get("auth_token")?.value || "";
  const refreshToken = request.cookies.get("refresh_token")?.value || "";

  if (!authToken && !refreshToken) {
    const response = NextResponse.json(
      { error: "No auth or refresh token provided" },
      { status: 401 },
    );
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  let user: User | null = verifyToken<User>(authToken);

  if (!user && refreshToken) {
    user = verifyToken<User>(refreshToken);
  }

  if (!user) {
    const response = NextResponse.json(
      { error: "Invalid or expired auth token" },
      { status: 401 },
    );
    response.cookies.delete("auth_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  const { id, email, isAdmin } = user;
  const newToken = signToken({ id, email, isAdmin });

  if (!newToken) {
    const response = NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
    response.cookies.delete("auth_token");
    return response;
  }

  const response = NextResponse.json({ message: "Token refreshed" });
  response.cookies.set("auth_token", newToken, accessTokenCookieOptions);

  if (refreshToken) {
    const newRefreshToken = signRefreshToken({ id, email, isAdmin });
    response.cookies.set(
      "refresh_token",
      newRefreshToken,
      refreshTokenCookieOptions,
    );
  }
  return response;
}
