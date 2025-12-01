import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/trpc';

describe('Admin Login', () => {
  it('should successfully login with correct credentials', async () => {
    const mockRes = {
      cookie: () => {},
      clearCookie: () => {},
    };

    const mockReq = {
      cookies: {},
    };

    const ctx: TrpcContext = {
      req: mockReq as any,
      res: mockRes as any,
      user: null,
    };

    const caller = appRouter.createCaller(ctx);

    // Test login with environment variables
    const result = await caller.admin.login({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe('تم تسجيل الدخول بنجاح');
  });

  it('should fail login with incorrect credentials', async () => {
    const mockRes = {
      cookie: () => {},
      clearCookie: () => {},
    };

    const mockReq = {
      cookies: {},
    };

    const ctx: TrpcContext = {
      req: mockReq as any,
      res: mockRes as any,
      user: null,
    };

    const caller = appRouter.createCaller(ctx);

    // Test login with wrong credentials
    await expect(
      caller.admin.login({
        username: 'wrong',
        password: 'wrong',
      })
    ).rejects.toThrow('اسم المستخدم أو كلمة المرور غير صحيحة');
  });
});
