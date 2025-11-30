// Vercel Serverless Function for tRPC
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../server/routers';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Create a simple context for Vercel serverless
async function createContext() {
  return {
    req: null,
    res: null,
    user: null,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Build full URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || req.headers['x-forwarded-host'];
    const url = `${protocol}://${host}${req.url}`;

    // Convert Vercel request to Fetch API Request
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    });

    // Handle request body
    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const fetchRequest = new Request(url, {
      method: req.method || 'GET',
      headers,
      body,
    });

    // Handle with tRPC
    const fetchResponse = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: fetchRequest,
      router: appRouter,
      createContext,
    });

    // Convert Fetch Response to Vercel Response
    res.status(fetchResponse.status);
    
    // Copy headers
    fetchResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send body
    const responseBody = await fetchResponse.text();
    res.send(responseBody);
  } catch (error) {
    console.error('[tRPC Handler Error]:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
