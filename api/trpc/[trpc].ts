import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

// Create Express app for Vercel
const app = express();

// Configure body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC middleware
app.use(
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Convert Vercel request/response to Express format
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}
