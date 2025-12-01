import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { TRPCError } from '@trpc/server';
import { ENV } from './_core/env';
import { getDb } from './db';
import { ideas, earlyAccessUsers, systemSettings } from '../drizzle/schema';
import { desc, eq, sql } from 'drizzle-orm';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware to check admin authentication
const requireAdmin = publicProcedure.use(async ({ ctx, next }) => {
  const isAuthenticated = ctx.req?.cookies?.admin_session === 'true';
  
  if (!isAuthenticated) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'يجب تسجيل الدخول كمسؤول',
    });
  }
  
  return next({ ctx });
});

export const adminRouter = router({
  // ═══════════════════════════════════════════════════════════════════════════════
  // AUTHENTICATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
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

  // ═══════════════════════════════════════════════════════════════════════════════
  // DASHBOARD STATS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getStats: requireAdmin.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'قاعدة البيانات غير متاحة' });
    }
    
    // Get total early access users
    const totalUsersResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(earlyAccessUsers);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get total evaluations
    const totalEvaluationsResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(ideas);
    const totalEvaluations = totalEvaluationsResult[0]?.count || 0;

    // Get completed evaluations
    const completedEvaluationsResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(ideas)
      .where(eq(ideas.evaluationStatus, 'completed'));
    const completedEvaluations = completedEvaluationsResult[0]?.count || 0;

    // Get total referrals
    const totalReferralsResult = await db
      .select({ count: sql<number>`cast(sum(referral_count) as int)` })
      .from(earlyAccessUsers);
    const totalReferrals = totalReferralsResult[0]?.count || 0;

    return {
      totalUsers,
      totalEvaluations,
      completedEvaluations,
      totalReferrals,
    };
  }),

  // ═══════════════════════════════════════════════════════════════════════════════
  // EARLY ACCESS USERS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getAllUsers: requireAdmin
    .input(
      z.object({
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
      })
    )
    .query(async ({ input }) => {
      const { limit, offset } = input;
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'قاعدة البيانات غير متاحة' });
      }

      const users = await db
        .select()
        .from(earlyAccessUsers)
        .orderBy(desc(earlyAccessUsers.createdAt))
        .limit(limit)
        .offset(offset);

      return users;
    }),

  // ═══════════════════════════════════════════════════════════════════════════════
  // EVALUATIONS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getAllEvaluations: requireAdmin
    .input(
      z.object({
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
        status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
      })
    )
    .query(async ({ input }) => {
      const { limit, offset, status } = input;
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'قاعدة البيانات غير متاحة' });
      }

      let query = db
        .select()
        .from(ideas)
        .orderBy(desc(ideas.createdAt))
        .limit(limit)
        .offset(offset);

      if (status) {
        query = query.where(eq(ideas.evaluationStatus, status)) as any;
      }

      const evaluations = await query;

      return evaluations;
    }),

  // ═══════════════════════════════════════════════════════════════════════════════
  // SYSTEM SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getMaintenanceMode: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return { enabled: false };
    }
    const setting = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'maintenance_mode'))
      .limit(1);

    return {
      enabled: setting[0]?.value === 'true',
    };
  }),

  setMaintenanceMode: requireAdmin
    .input(
      z.object({
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { enabled } = input;
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'قاعدة البيانات غير متاحة' });
      }

      await db
        .insert(systemSettings)
        .values({
          key: 'maintenance_mode',
          value: enabled ? 'true' : 'false',
          type: 'boolean',
          description: 'Enable/disable maintenance mode',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value: enabled ? 'true' : 'false',
            updatedAt: new Date(),
          },
        });

      return {
        success: true,
        enabled,
        message: enabled ? 'تم تفعيل وضع الصيانة' : 'تم إلغاء وضع الصيانة',
      };
    }),

  getAllSettings: requireAdmin.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'قاعدة البيانات غير متاحة' });
    }
    const settings = await db
      .select()
      .from(systemSettings)
      .orderBy(systemSettings.key);

    return settings;
  }),
});
