"use server";

import { cookies } from "next/headers";
import { signToken, signRefreshToken, verifyToken } from "@/lib/jwt";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "@/lib/settings";
import { getDB } from "@/lib/db";
import { User } from "@/entities/User";
import { hashPassword, verifyPassword, sanitizeString, checkRateLimit } from "@/lib/security";
import {
  UserLoginRes,
  UserLoginReq,
  UserRegisterReq,
  UserRegisterRes,
  User as UserType,
} from "@/types/user";

function toPublicUser(user: User): UserType {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    profilePicture: user.profilePicture || undefined,
  };
}

export async function hasAnyUsers(): Promise<boolean> {
  try {
    const db = await getDB();
    const count = await db.getRepository(User).count();
    return count > 0;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return false;
  if (!verifyToken(token)) return false;
  return true;
}

export async function getUser(): Promise<UserType | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = verifyToken<UserType>(token);
  return payload;
}

export async function registerService({
  email,
  password,
  username,
}: UserRegisterReq): Promise<UserRegisterRes> {
  if (!checkRateLimit(`register:${email}`, 3, 60 * 1000)) {
    return {
      error: "Too many registration attempts. Please try again later.",
      message: null,
      user: null,
    };
  }

  try {
    const db = await getDB();
    const existingUser = await db.getRepository(User).findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      return {
        error: "Email or username already exists",
        message: null,
        user: null,
      };
    }

    const passwordHash = hashPassword(password);

    const userCount = await db.getRepository(User).count();
    const isFirstUser = userCount === 0;

    const newUser = db.getRepository(User).create({
      email: sanitizeString(email).toLowerCase(),
      username: sanitizeString(username).toLowerCase(),
      passwordHash,
      role: isFirstUser ? "admin" : "reader",
      isActive: true,
    });

    const saved = await db.getRepository(User).save(newUser);

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

    return {
      error: null,
      message: "User registered successfully",
      user: toPublicUser(saved),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "Failed to register user",
      message: null,
      user: null,
    };
  }
}

export async function loginService({
  email,
  password,
  remember,
}: UserLoginReq): Promise<UserLoginRes> {
  if (!checkRateLimit(`login:${email}`, 5, 60 * 1000)) {
    return {
      error: "Too many login attempts. Please try again later.",
      message: null,
      user: null,
    };
  }

  try {
    const db = await getDB();
    const user = await db.getRepository(User).findOneBy({
      email: email.toLowerCase(),
    });

    if (!user) {
      return {
        error: "Invalid email or password",
        message: null,
        user: null,
      };
    }

    if (!user.isActive) {
      return {
        error: "Account is disabled",
        message: null,
        user: null,
      };
    }

    const isValidPassword = verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        error: "Invalid email or password",
        message: null,
        user: null,
      };
    }

    const publicUser = toPublicUser(user);
    const token = signToken(publicUser);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, accessTokenCookieOptions);

    if (remember) {
      const refreshToken = signRefreshToken(publicUser);
      cookieStore.set("refresh_token", refreshToken, refreshTokenCookieOptions);
    }

    user.lastLoginAt = new Date();
    await db.getRepository(User).save(user);

    return {
      error: null,
      message: "Login successful",
      user: { ...publicUser, token },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "Failed to login",
      message: null,
      user: null,
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "auth_token", path: "/" });
  cookieStore.delete({ name: "refresh_token", path: "/" });
}
