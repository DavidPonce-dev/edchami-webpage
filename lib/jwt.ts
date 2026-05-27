import jwt from "jsonwebtoken";

export function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required. " +
      "Add it to your .env file or set it in your deployment environment."
    );
  }
  return secret;
}

export function signToken(payload: object) {
  return jwt.sign(payload, getJWTSecret(), { expiresIn: "1h" });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, getJWTSecret(), { expiresIn: "15d" });
}

export function verifyToken<T>(token: string) {
  try {
    return jwt.verify(token, getJWTSecret()) as T;
  } catch {
    return null;
  }
}
