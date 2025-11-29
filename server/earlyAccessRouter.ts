import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { router, publicProcedure } from "./_core/trpc";
import { protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { earlyAccessUsers, earlyAccessReferrals } from "../drizzle/schema";
// import { sendEmail } from "./_core/email";

// Helper function to generate unique referral code
function generateReferralCode(username: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${username.substring(0, 4).toUpperCase()}${randomSuffix}`;
}

export const earlyAccessRouter = router({
  // Register for early access
  register: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
        email: z.string().email("البريد الإلكتروني غير صحيح"),
        phone: z.string().optional(),
        username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
        source: z.string().min(1, "يرجى تحديد كيف عرفت عن بذره"),
        referredBy: z.string().optional(), // كود الإحالة المستخدم
      })
    )
    .mutation(async ({ input }: { input: any }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Check if email or username already exists
      const existingUser = await db
        .select()
        .from(earlyAccessUsers)
        .where(
          sql`${earlyAccessUsers.email} = ${input.email} OR ${earlyAccessUsers.username} = ${input.username}`
        )
        .limit(1);

      if (existingUser.length > 0) {
        if (existingUser[0].email === input.email) {
          throw new Error("البريد الإلكتروني مسجل مسبقاً");
        }
        if (existingUser[0].username === input.username) {
          throw new Error("اسم المستخدم مستخدم مسبقاً");
        }
      }

      // Generate unique referral code
      let referralCode = generateReferralCode(input.username);
      let attempts = 0;
      while (attempts < 10) {
        const existing = await db
          .select()
          .from(earlyAccessUsers)
          .where(eq(earlyAccessUsers.referralCode, referralCode))
          .limit(1);
        
        if (existing.length === 0) break;
        referralCode = generateReferralCode(input.username + attempts);
        attempts++;
      }

      // Create early access user
      const [newUser] = await db
        .insert(earlyAccessUsers)
        .values({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          username: input.username,
          source: input.source,
          referralCode,
          referredBy: input.referredBy || null,
          referralCount: 0,
          bonusYears: 1,
        })
        .returning();

      // If referred by someone, create referral record and update referrer
      if (input.referredBy) {
        const referrer = await db
          .select()
          .from(earlyAccessUsers)
          .where(eq(earlyAccessUsers.referralCode, input.referredBy))
          .limit(1);

        if (referrer.length > 0) {
          // Create referral record
          await db.insert(earlyAccessReferrals).values({
            referrerId: referrer[0].id,
            referredId: newUser.id,
            referralCode: input.referredBy,
          });

          // Update referrer's count and bonus years
          const newReferralCount = referrer[0].referralCount + 1;
          const newBonusYears = 1 + newReferralCount;

          await db
            .update(earlyAccessUsers)
            .set({
              referralCount: newReferralCount,
              bonusYears: newBonusYears,
            })
            .where(eq(earlyAccessUsers.id, referrer[0].id));
        }
      }

      // Send welcome email (disabled for now)
      // TODO: Enable email service
      /*
      try {
        await sendEmail({
          to: input.email,
          subject: "مرحباً بك في بذره - التسجيل المبكر",
          html: `Welcome email content...`,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
      */

      return {
        success: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          username: newUser.username,
          referralCode: newUser.referralCode,
          bonusYears: newUser.bonusYears,
          referralCount: newUser.referralCount,
        },
      };
    }),

  // Get user by referral code
  getUserByReferralCode: publicProcedure
    .input(z.object({ referralCode: z.string() }))
    .query(async ({ input }: { input: any }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const [user] = await db
        .select()
        .from(earlyAccessUsers)
        .where(eq(earlyAccessUsers.referralCode, input.referralCode))
        .limit(1);

      if (!user) return null;

      return {
        fullName: user.fullName,
        username: user.username,
        referralCount: user.referralCount,
        bonusYears: user.bonusYears,
      };
    }),

  // Get stats for admin dashboard
  getStats: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    // Only allow admin users
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Total registrations
    const totalUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(earlyAccessUsers);

    // Total referrals
    const totalReferrals = await db
      .select({ count: sql<number>`count(*)` })
      .from(earlyAccessReferrals);

    // Top referrers
    const topReferrers = await db
      .select()
      .from(earlyAccessUsers)
      .orderBy(sql`${earlyAccessUsers.referralCount} DESC`)
      .limit(10);

    // Recent registrations
    const recentUsers = await db
      .select()
      .from(earlyAccessUsers)
      .orderBy(sql`${earlyAccessUsers.createdAt} DESC`)
      .limit(20);

    // Source breakdown
    const sourceBreakdown = await db
      .select({
        source: earlyAccessUsers.source,
        count: sql<number>`count(*)`,
      })
      .from(earlyAccessUsers)
      .groupBy(earlyAccessUsers.source);

    return {
      totalUsers: Number(totalUsers[0]?.count || 0),
      totalReferrals: Number(totalReferrals[0]?.count || 0),
      topReferrers: topReferrers.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        referralCount: u.referralCount,
        bonusYears: u.bonusYears,
        createdAt: u.createdAt,
      })),
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        phone: u.phone,
        source: u.source,
        referralCode: u.referralCode,
        referredBy: u.referredBy,
        referralCount: u.referralCount,
        bonusYears: u.bonusYears,
        createdAt: u.createdAt,
      })),
      sourceBreakdown: sourceBreakdown.map((s) => ({
        source: s.source,
        count: Number(s.count),
      })),
    };
  }),

  // Get all users (admin only)
  getAllUsers: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const offset = (input.page - 1) * input.limit;

      let query = db.select().from(earlyAccessUsers) as any;

      if (input.search) {
        query = query.where(
          sql`${earlyAccessUsers.fullName} ILIKE ${`%${input.search}%`} OR ${earlyAccessUsers.email} ILIKE ${`%${input.search}%`} OR ${earlyAccessUsers.username} ILIKE ${`%${input.search}%`}`
        );
      }

      const users = await query
        .orderBy(sql`${earlyAccessUsers.createdAt} DESC`)
        .limit(input.limit)
        .offset(offset);

      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(earlyAccessUsers);

      return {
        users: users.map((u: any) => ({
          id: u.id,
          fullName: u.fullName,
          username: u.username,
          email: u.email,
          phone: u.phone,
          source: u.source,
          referralCode: u.referralCode,
          referredBy: u.referredBy,
          referralCount: u.referralCount,
          bonusYears: u.bonusYears,
          createdAt: u.createdAt,
        })),
        total: Number(totalCount[0]?.count || 0),
        page: input.page,
        limit: input.limit,
      };
    }),
});
