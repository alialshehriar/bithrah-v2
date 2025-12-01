import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../server/routers';
import { createContext } from '../../server/_core/context';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Build full URL
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || req.headers['x-forwarded-host'];
  const url = `${protocol}://${host}${req.url}`;

  // Convert Vercel request to Fetch API Request
  const fetchRequest = new Request(url, {
    method: req.method,
    headers: new Headers(req.headers as HeadersInit),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });

  try {
    const fetchResponse = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: fetchRequest,
      router: appRouter,
      createContext: async () => {
        // Create Express-like request object for context
        return createContext({ 
          req: req as any, 
          res: res as any 
        });
      },
    });

    // Convert Fetch Response to Vercel Response
    res.status(fetchResponse.status);
    
    // Copy headers
    fetchResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Send body
    const body = await fetchResponse.text();
    res.send(body);
  } catch (error) {
    console.error('tRPC handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
    });
  }
}
