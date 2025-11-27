import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const projectsRouter = router({
  // Create new project
  create: protectedProcedure
    .input(
      z.object({
        projectName: z.string().min(3).max(255),
        description: z.string().min(10),
        sector: z.string().optional(),
        category: z.string().optional(),
        fundingGoal: z.string(),
        coverImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      // Generate unique slug
      const slug = `${input.projectName
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now()}`;

      const project = await db.createProject({
        userId: ctx.user.id,
        ...input,
        slug,
        status: "draft",
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      });

      return project;
    }),

  // Get project by ID
  getById: publicProcedure.input(z.object({ projectId: z.number() })).query(async ({ input }) => {
    return db.getProjectById(input.projectId);
  }),

  // Get project by slug
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return db.getProjectBySlug(input.slug);
  }),

  // List projects with filters
  list: publicProcedure
    .input(
      z.object({
        status: z.string().optional(),
        userId: z.number().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return db.getProjects({
        status: input.status,
        userId: input.userId,
        includeDemo: false,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  // Get user's projects
  myProjects: protectedProcedure.query(async ({ ctx }) => {
    return db.getProjects({
      userId: ctx.user.id,
      includeDemo: false,
    });
  }),

  // Update project
  update: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        projectName: z.string().min(3).max(255).optional(),
        description: z.string().min(10).optional(),
        sector: z.string().optional(),
        category: z.string().optional(),
        fundingGoal: z.string().optional(),
        coverImageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        status: z.enum(["draft", "under_review", "published", "funded", "completed", "suspended"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await db.getProjectById(input.projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (project.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const { projectId, ...updates } = input;
      return db.updateProject(projectId, updates);
    }),

  // Delete project
  delete: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const project = await db.getProjectById(input.projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (project.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return db.deleteProject(input.projectId);
    }),

  // Get project packages
  getPackages: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return db.getProjectPackages(input.projectId);
    }),

  // Get project team members
  getTeamMembers: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return db.getProjectTeamMembers(input.projectId);
    }),

  // Get project media
  getMedia: publicProcedure.input(z.object({ projectId: z.number() })).query(async ({ input }) => {
    return db.getProjectMedia(input.projectId);
  }),

  // Get project links
  getLinks: publicProcedure.input(z.object({ projectId: z.number() })).query(async ({ input }) => {
    return db.getProjectLinks(input.projectId);
  }),

  // Get project updates
  getUpdates: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return db.getProjectUpdates(input.projectId);
    }),

  // Get project comments
  getComments: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return db.getProjectComments(input.projectId);
    }),

  // Publish project
  publish: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const project = await db.getProjectById(input.projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (project.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return db.updateProject(input.projectId, {
        status: "published",
        publishedAt: new Date(),
      });
    }),
});
