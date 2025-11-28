import jwt from "jsonwebtoken";
import { ENV } from "./env";

const JWT_SECRET = ENV.cookieSecret || "default-secret-change-in-production";
const JWT_EXPIRES_IN = "7d"; // 7 days

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authorization?: string): string | null {
  if (!authorization) return null;
  
  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  
  return parts[1];
}
