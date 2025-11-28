import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { verifyToken, extractTokenFromHeader } from "./jwt";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(opts.req.headers.authorization);
    
    if (token) {
      // Verify JWT token
      const payload = verifyToken(token);
      
      if (payload) {
        // Get user from database
        const db = await getDb();
        if (db) {
          const userResult = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);
          
          if (userResult.length > 0) {
            user = userResult[0];
          }
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Auth] Error in createContext:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
