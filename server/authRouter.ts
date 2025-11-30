import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from './_core/trpc';
import { hashPassword, comparePassword, validatePassword } from './_core/password';
import { generateToken, generateVerificationToken, verifyVerificationToken } from './_core/jwt';
import { sendVerificationEmail, sendWelcomeEmail } from './_core/email';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(2),
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
        referralCode: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const passwordValidation = validatePassword(input.password);
      if (!passwordValidation.valid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: passwordValidation.message,
        });
      }

      const existingEmail = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existingEmail.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'البريد الإلكتروني مستخدم بالفعل',
        });
      }

      const existingUsername = await db.select().from(users).where(eq(users.username, input.username)).limit(1);
      if (existingUsername.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'اسم المستخدم مستخدم بالفعل',
        });
      }

      const passwordHash = await hashPassword(input.password);
      const referralCode = `BITH${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const [newUser] = await db.insert(users).values({
        openId: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: input.fullName,
        username: input.username,
        email: input.email,
        passwordHash,
        loginMethod: 'email',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }).returning();

      const verificationToken = generateVerificationToken(input.email);
      const verificationLink = `${process.env.VITE_APP_URL || 'https://bithrahapp.com'}/verify-email?token=${verificationToken}`;

      await sendVerificationEmail(input.email, input.fullName, verificationLink);

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.',
        userId: newUser.id,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        });
      }

      const isValidPassword = await comparePassword(input.password, user.passwordHash);
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        });
      }

      if (!user.isVerified) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'يرجى تأكيد بريدك الإلكتروني أولاً',
        });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email!,
        username: user.username!,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          fullName: user.name || '',
          username: user.username || '',
          email: user.email || '',
          avatar: user.avatarUrl || null,
          role: user.role,
        },
      };
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const email = verifyVerificationToken(input.token);
      if (!email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'رابط التحقق غير صالح أو منتهي الصلاحية',
        });
      }

      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المستخدم غير موجود',
        });
      }

      await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));

      await sendWelcomeEmail(user.email!, user.name!);

      const token = generateToken({
        userId: user.id,
        email: user.email!,
        username: user.username!,
      });

      return {
        success: true,
        message: 'تم تأكيد البريد الإلكتروني بنجاح',
        token,
        user: {
          id: user.id,
          fullName: user.name || '',
          username: user.username || '',
          email: user.email || '',
          avatar: user.avatarUrl || null,
          role: user.role,
        },
      };
    }),

  me: publicProcedure.query(({ ctx }) => ctx.user),

  logout: publicProcedure.mutation(() => {
    return {
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    };
  }),
});
