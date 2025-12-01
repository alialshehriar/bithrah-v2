import 'dotenv/config';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as db from '../../server/db';
import { sdk } from '../../server/_core/sdk';
import { COOKIE_NAME, ONE_YEAR_MS } from '../../server/_core/cookies';

function getQueryParam(req: NextApiRequest, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === 'string' ? value : undefined;
}

function getSessionCookieOptions(req: NextApiRequest) {
  const isSecure = req.headers['x-forwarded-proto'] === 'https' || 
                   req.headers.host?.includes('localhost');
  
  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
    path: '/',
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const code = getQueryParam(req, 'code');
  const state = getQueryParam(req, 'state');

  if (!code || !state) {
    res.status(400).json({ error: 'code and state are required' });
    return;
  }

  try {
    const tokenResponse = await sdk.exchangeCodeForToken(code, state);
    const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

    if (!userInfo.openId) {
      res.status(400).json({ error: 'openId missing from user info' });
      return;
    }

    const now = new Date();
    await db.upsertUser({
      openId: userInfo.openId,
      name: userInfo.name || null,
      email: userInfo.email ?? null,
      loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    });

    const sessionToken = await sdk.createSessionToken(userInfo.openId, {
      name: userInfo.name || '',
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${sessionToken}; Path=${cookieOptions.path}; HttpOnly; ${
        cookieOptions.secure ? 'Secure;' : ''
      } SameSite=${cookieOptions.sameSite}; Max-Age=${ONE_YEAR_MS / 1000}`
    );

    res.redirect(302, '/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
