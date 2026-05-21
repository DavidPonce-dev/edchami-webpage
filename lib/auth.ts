"use server";
import { cookies } from "next/headers";
import { signToken, signRefreshToken, verifyToken } from "@/lib/jwt";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "@/lib/settings";
import {
  UserLoginRes,
  UserLoginReq,
  UserRegisterReq,
  UserRegisterRes,
  User,
} from "@/types/user";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return false;
  if (!verifyToken(token)) return false;
  return true;
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const user = verifyToken<User>(token);
  return user;
}

export async function registerService({
  email,
}: UserRegisterReq): Promise<UserRegisterRes> {
  return {
    error: null,
    message: "User registered successfully",
    user: {
      id: 1,
      email,
    },
  };
}

export async function loginService({
  email,
  password,
  remember,
}: UserLoginReq): Promise<UserLoginRes> {
  const cookieStore = await cookies();

  const user = { id: 1, email, isAdmin: true };

  const token = signToken(user);

  cookieStore.set("auth_token", token, accessTokenCookieOptions);

  if (remember) {
    const refreshToken = signRefreshToken(user);
    cookieStore.set("refresh_token", refreshToken, refreshTokenCookieOptions);
  }
  return {
    error: null,
    message: "Login successful",
    user: { ...user, token },
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "auth_token", path: "/" });
  cookieStore.delete({ name: "refresh_token", path: "/" });
}
