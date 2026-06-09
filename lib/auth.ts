"use server";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { signToken, signRefreshToken, verifyToken } from "@/lib/jwt";
import { hashPassword, verifyPassword } from "@/lib/security";
import { logger } from "@/lib/logger";

export type PublicUser = {
  id: number;
  email: string;
  username: string;
  role: string;
  profilePicture?: string;
  tokenVersion: number;
};

function toPublicUser(u: typeof userTable.$inferSelect): PublicUser {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    role: u.role,
    profilePicture: u.profilePicture || undefined,
    tokenVersion: u.tokenVersion,
  };
}

// Read-only — safe for Server Components (never writes cookies)
async function _getSession(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token) {
    const verified = verifyToken<PublicUser>(token);
    if (verified) return verified;
  }

  // auth_token expired or invalid — try refresh_token
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return null;

  const payload = verifyToken<PublicUser>(refreshToken);
  if (!payload) return null;

  const dbUser = await db.query.user.findFirst({ where: eq(userTable.id, payload.id) });
  if (!dbUser || !dbUser.isActive) return null;

  if (dbUser.tokenVersion !== payload.tokenVersion) return null;

  return toPublicUser(dbUser);
}

// Cached per-request — avoids N+1 queries
export const getSession = cache(_getSession);

// Server Action — renews cookies when called from client
export async function refreshTokens(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return null;

  const payload = verifyToken<PublicUser>(refreshToken);
  if (!payload) return null;

  const dbUser = await db.query.user.findFirst({ where: eq(userTable.id, payload.id) });
  if (!dbUser || !dbUser.isActive) return null;

  if (dbUser.tokenVersion !== payload.tokenVersion) return null;

  const publicUser = toPublicUser(dbUser);
  const newToken = signToken({ id: publicUser.id, email: publicUser.email, role: publicUser.role, tokenVersion: publicUser.tokenVersion });
  const newRefreshToken = signRefreshToken({ id: publicUser.id, email: publicUser.email, role: publicUser.role, tokenVersion: publicUser.tokenVersion });

  cookieStore.set("auth_token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  cookieStore.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 15,
  });

  return publicUser;
}

export async function registerService({
  email,
  password,
  username,
}: { email: string; password: string; username: string }): Promise<{
  error: string | null;
  message: string | null;
  user: PublicUser | null;
}> {
  try {
    const existing = await db.query.user.findFirst({
      where: eq(userTable.email, email.toLowerCase()),
    });
    if (existing) {
      return { error: "Email or username already exists", message: null, user: null };
    }

    const existingUsername = await db.query.user.findFirst({
      where: eq(userTable.username, username.toLowerCase()),
    });
    if (existingUsername) {
      return { error: "Email or username already exists", message: null, user: null };
    }

    const count = await db.$count(userTable);
    const isFirstUser = count === 0;

    const [newUser] = await db.insert(userTable).values({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      passwordHash: hashPassword(password),
      role: isFirstUser ? "admin" : "reader",
      isActive: true,
      tokenVersion: 0,
    }).returning();

    return { error: null, message: "User registered successfully", user: toPublicUser(newUser) };
  } catch (error) {
    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      return { error: "Email or username already exists", message: null, user: null };
    }
    logger.error("Registration error:", error);
    return { error: "Failed to register user", message: null, user: null };
  }
}

export async function loginService({
  email,
  password,
  remember,
}: { email: string; password: string; remember: boolean }): Promise<{
  error: string | null;
  message: string | null;
  user: (PublicUser & { token: string }) | null;
}> {
  try {
    const found = await db.query.user.findFirst({
      where: eq(userTable.email, email.toLowerCase()),
    });

    if (!found) {
      return { error: "Invalid email or password", message: null, user: null };
    }

    if (!found.isActive) {
      return { error: "Account is disabled", message: null, user: null };
    }

    if (!verifyPassword(password, found.passwordHash)) {
      return { error: "Invalid email or password", message: null, user: null };
    }

    const publicUser = toPublicUser(found);
    const token = signToken({ id: publicUser.id, email: publicUser.email, role: publicUser.role, tokenVersion: publicUser.tokenVersion });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    if (remember) {
      const refreshToken = signRefreshToken({ id: publicUser.id, email: publicUser.email, role: publicUser.role, tokenVersion: publicUser.tokenVersion });
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 15,
      });
    }

    await db.update(userTable).set({ lastLoginAt: new Date() }).where(eq(userTable.id, found.id));

    return { error: null, message: "Login successful", user: { ...publicUser, token } };
  } catch (error) {
    logger.error("Login error:", error);
    return { error: "Failed to login", message: null, user: null };
  }
}

export async function logout(): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getSession();
    if (user) {
      await db.update(userTable).set({ tokenVersion: user.tokenVersion + 1 }).where(eq(userTable.id, user.id));
    }
    const cookieStore = await cookies();
    cookieStore.delete({ name: "auth_token", path: "/" });
    cookieStore.delete({ name: "refresh_token", path: "/" });
    return { success: true, error: null };
  } catch (error) {
    logger.error("Logout error:", error);
    return { success: false, error: "Failed to logout" };
  }
}
