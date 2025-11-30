// Cloudflare Worker with Hono + tRPC
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

const app = new Hono();

// CORS for bithrahapp.com
app.use('/*', cors({
  origin: ['https://bithrahapp.com', 'http://localhost:5173'],
  credentials: true,
}));

// tRPC endpoint
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      // Convert Hono context to Express-like request
      const req = {
        headers: Object.fromEntries(opts.req.raw.headers),
        cookies: {}, // TODO: Parse cookies from headers
      };
      const res = {
        cookie: () => {},
        clearCookie: () => {},
      };
      return createContext({ req, res } as any);
    },
  })
);

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
