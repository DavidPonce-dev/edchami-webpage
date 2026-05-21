import jwt from "jsonwebtoken";

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required. " +
      "Add it to your .env file or set it in your deployment environment."
    );
  }
  return secret;
}

const JWT_SECRET = getJWTSecret();

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1m" });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15d" });
}

export function verifyToken<T>(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}
