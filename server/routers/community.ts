import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const communityRouter = router({
  // Create new post
  createPost: protectedProcedure
    .input(
      z.object({
        postText: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        postType: z.enum(["text", "image", "video", "link", "poll"]).default("text"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const post = await db.createCommunityPost({
        userId: ctx.user.id,
        ...input,
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      });

      return post;
    }),

  // Get feed posts
  getFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return db.getCommunityPosts({
        includeDemo: false,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  // Get user's posts
  getUserPosts: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return db.getCommunityPosts({
        userId: input.userId,
        includeDemo: false,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  // Get post by ID
  getPostById: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    return db.getCommunityPostById(input.postId);
  }),

  // Update post
  updatePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        postText: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        linkUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await db.getCommunityPostById(input.postId);

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const { postId, ...updates } = input;
      return db.updateCommunityPost(postId, updates);
    }),

  // Delete post
  deletePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await db.getCommunityPostById(input.postId);

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return db.deleteCommunityPost(input.postId);
    }),

  // Get post comments
  getComments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return db.getPostComments(input.postId);
    }),

  // Create comment
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        commentText: z.string().min(1),
        parentCommentId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      return db.createComment({
        ...input,
        userId: ctx.user.id,
        createdAt: now,
        updatedAt: now,
      });
    }),

  // Toggle reaction (like)
  toggleReaction: protectedProcedure
    .input(
      z.object({
        postId: z.number().optional(),
        commentId: z.number().optional(),
        reactionType: z.enum(["like", "love", "celebrate", "support", "insightful"]).default("like"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      return db.toggleReaction({
        userId: ctx.user.id,
        postId: input.postId,
        commentId: input.commentId,
        reactionType: input.reactionType,
        createdAt: now,
      });
    }),

  // Follow user
  followUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId) {
        throw new Error("Cannot follow yourself");
      }

      return db.followUser(ctx.user.id, input.userId);
    }),

  // Unfollow user
  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return db.unfollowUser(ctx.user.id, input.userId);
    }),

  // Check if following
  isFollowing: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return db.isFollowing(ctx.user.id, input.userId);
    }),

  // Get followers
  getFollowers: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.getFollowers(input.userId);
    }),

  // Get following
  getFollowing: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.getFollowing(input.userId);
    }),
});
