import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { TRPCError } from '@trpc/server';
import { ENV } from './_core/env';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const adminRouter = router({
  // Login procedure
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, 'اسم المستخدم مطلوب'),
        password: z.string().min(1, 'كلمة المرور مطلوبة'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;

      // Verify credentials
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        });
      }

      // Set session cookie
      if (ctx.res) {
        // Simple session: just set a cookie with admin flag
        ctx.res.cookie('admin_session', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
      }

      return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
      };
    }),

  // Logout procedure
  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie('admin_session');
    }

    return {
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    };
  }),

  // Check if user is logged in
  checkAuth: publicProcedure.query(async ({ ctx }) => {
    const isAuthenticated = ctx.req?.cookies?.admin_session === 'true';

    return {
      isAuthenticated,
    };
  }),
});
