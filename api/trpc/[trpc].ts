import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { appRouter } from '../../server/routers';
import { sdk } from '../../server/_core/sdk';
import type { User } from '../../drizzle/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only handle POST requests for tRPC
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get user from session
    let user: User | null = null;
    try {
      // Create minimal Express-like request for authentication
      const expressLikeReq = {
        headers: req.headers,
        cookies: req.cookies || {},
      };
      user = await sdk.authenticateRequest(expressLikeReq as any);
    } catch (error) {
      user = null;
    }

    // Create context
    const ctx = {
      req: req as any,
      res: res as any,
      user,
    };

    // Get procedure path from URL
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/api/trpc/')[1]?.split('.');
    
    if (!pathParts || pathParts.length < 2) {
      res.status(400).json({ error: 'Invalid procedure path' });
      return;
    }

    const [routerName, procedureName] = pathParts;
    
    // Get the router
    const router = (appRouter as any)._def.procedures;
    const procedureKey = `${routerName}.${procedureName}`;
    const procedure = router[procedureKey];

    if (!procedure) {
      res.status(404).json({ error: 'Procedure not found' });
      return;
    }

    // Execute procedure
    const input = req.body?.[0]?.json || req.body;
    const result = await procedure({ ctx, input, path: procedureKey, type: 'mutation' });

    res.status(200).json([{ result: { data: result } }]);
  } catch (error: any) {
    console.error('tRPC handler error:', error);
    res.status(500).json([{ 
      error: { 
        message: error.message || 'Internal server error',
        code: error.code || 'INTERNAL_SERVER_ERROR'
      } 
    }]);
  }
}
