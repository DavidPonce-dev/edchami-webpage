"use server";

import { cookies } from "next/headers";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { signToken, signRefreshToken, verifyToken } from "@/lib/jwt";
import { hashPassword, verifyPassword, sanitizeString } from "@/lib/security";

export type PublicUser = {
  id: number;
  email: string;
  username: string;
  role: string;
  profilePicture?: string;
};

function toPublicUser(u: typeof userTable.$inferSelect): PublicUser {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    role: u.role,
    profilePicture: u.profilePicture || undefined,
  };
}

export async function getUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken<PublicUser>(token);
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
      email: sanitizeString(email).toLowerCase(),
      username: sanitizeString(username).toLowerCase(),
      passwordHash: hashPassword(password),
      role: isFirstUser ? "admin" : "reader",
      isActive: true,
    }).returning();

    if (isFirstUser) {
      const cookieStore = await cookies();
      cookieStore.set("setup_complete", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return { error: null, message: "User registered successfully", user: toPublicUser(newUser) };
  } catch (error) {
    console.error("Registration error:", error);
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
    const token = signToken(publicUser);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    if (remember) {
      const refreshToken = signRefreshToken(publicUser);
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
    console.error("Login error:", error);
    return { error: "Failed to login", message: null, user: null };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "auth_token", path: "/" });
  cookieStore.delete({ name: "refresh_token", path: "/" });
}
