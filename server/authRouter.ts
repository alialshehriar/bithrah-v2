import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { hashPassword, comparePassword, validatePassword, validateEmail } from "./_core/password";
import { signToken, JWTPayload } from "./_core/jwt";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const authRouter = router({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("البريد الإلكتروني غير صحيح"),
        password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
        name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
        username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل").optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Validate email
      if (!validateEmail(input.email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "البريد الإلكتروني غير صحيح",
        });
      }

      // Validate password
      const passwordValidation = validatePassword(input.password);
      if (!passwordValidation.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: passwordValidation.message || "كلمة المرور غير صحيحة",
        });
      }

      // Check if email already exists
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطأ في الاتصال بقاعدة البيانات",
        });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "البريد الإلكتروني مستخدم بالفعل",
        });
      }

      // Check if username already exists (if provided)
      if (input.username) {
        const existingUsername = await db
          .select()
          .from(users)
          .where(eq(users.username, input.username))
          .limit(1);

        if (existingUsername.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "اسم المستخدم مستخدم بالفعل",
          });
        }
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      const now = new Date();
      const newUser = await db
        .insert(users)
        .values({
          email: input.email,
          passwordHash,
          name: input.name,
          username: input.username || input.email.split("@")[0],
          openId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginMethod: "email",
          role: "user",
          isVerified: false,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          lastSignedIn: now,
        })
        .returning();

      const user = newUser[0];

      // Generate JWT token
      const token = signToken({
        userId: user.id,
        email: user.email!,
        name: user.name!,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      };
    }),

  // Login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("البريد الإلكتروني غير صحيح"),
        password: z.string().min(1, "كلمة المرور مطلوبة"),
      })
    )
    .mutation(async ({ input }) => {
      // Find user by email
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطأ في الاتصال بقاعدة البيانات",
        });
      }

      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUsers.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      }

      const user = existingUsers[0];

      // Check if user has password (not OAuth user)
      if (!user.passwordHash) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "هذا الحساب تم إنشاؤه باستخدام طريقة تسجيل دخول أخرى",
        });
      }

      // Verify password
      const isPasswordValid = await comparePassword(input.password, user.passwordHash);

      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "هذا الحساب معطّل. يرجى التواصل مع الدعم",
        });
      }

      // Update last signed in
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));

      // Generate JWT token
      const token = signToken({
        userId: user.id,
        email: user.email!,
        name: user.name!,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      };
    }),

  // Get current user
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Logout (client-side will remove token)
  logout: protectedProcedure.mutation(async () => {
    return { success: true };
  }),
});
