// Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';
import { registerOAuthRoutes } from '../server/_core/oauth';

// Create Express app once
const app = express();

// Configure middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// OAuth routes
registerOAuthRoutes(app);

// tRPC routes
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
