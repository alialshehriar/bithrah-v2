import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const usersRouter = router({
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Get user by ID
  getById: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return db.getUserById(input.userId);
  }),

  // Get user by username
  getByUsername: publicProcedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    return db.getUserByUsername(input.username);
  }),

  // Update profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if username is already taken
      if (input.username) {
        const existing = await db.getUserByUsername(input.username);
        if (existing && existing.id !== ctx.user.id) {
          throw new Error("Username already taken");
        }
      }

      return db.updateUser(ctx.user.id, input);
    }),

  // Get user wallet
  getWallet: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserWallet(ctx.user.id);
  }),

  // Get wallet transactions
  getWalletTransactions: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return db.getWalletTransactions(ctx.user.id, input.limit);
    }),

  // Get user commissions
  getCommissions: protectedProcedure.query(async ({ ctx }) => {
    return db.getCommissionsByUser(ctx.user.id);
  }),

  // Get user referrals
  getReferrals: protectedProcedure.query(async ({ ctx }) => {
    return db.getReferralsByUser(ctx.user.id);
  }),

  // Get user notifications
  getNotifications: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return db.getUserNotifications(ctx.user.id, input.limit);
    }),

  // Mark notification as read
  markNotificationAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      return db.markNotificationAsRead(input.notificationId);
    }),

  // Mark all notifications as read
  markAllNotificationsAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return db.markAllNotificationsAsRead(ctx.user.id);
  }),

  // Get statistics
  getStatistics: publicProcedure.query(async () => {
    return db.getStatistics();
  }),

  // Get user stats (ideas, projects, followers, points)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserStats(ctx.user.id);
  }),
});
