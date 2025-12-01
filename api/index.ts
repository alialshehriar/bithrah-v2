// Vercel Serverless Function - Main entry point
import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';
import { registerOAuthRoutes } from '../server/_core/oauth';

let app: express.Application | null = null;

function getApp() {
  if (!app) {
    app = express();
    
    // Configure body parser
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    
    // OAuth routes
    registerOAuthRoutes(app);
    
    // tRPC middleware
    app.use(
      '/api/trpc',
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
  }
  
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = getApp();
    return app(req as any, res as any);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
