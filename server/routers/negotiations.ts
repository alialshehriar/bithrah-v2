import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const negotiationsRouter = router({
  // Start new negotiation
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        packageId: z.number().optional(),
        proposedAmount: z.string(),
        proposedEquity: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await db.getProjectById(input.projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (project.userId === ctx.user.id) {
        throw new Error("Cannot negotiate on your own project");
      }

      const now = new Date();
      const negotiation = await db.createNegotiation({
        projectId: input.projectId,
        investorId: ctx.user.id,
        projectOwnerId: project.userId,
        depositAmount: input.proposedAmount,
        status: "open",
        createdAt: now,
        updatedAt: now,
      });

      // Create initial message if provided
      if (input.message && negotiation) {
        await db.createNegotiationMessage({
          negotiationId: negotiation.id,
          senderId: ctx.user.id,
          messageText: input.message,
          createdAt: now,
          updatedAt: now,
        });
      }

      return negotiation;
    }),

  // Get negotiation by ID
  getById: protectedProcedure
    .input(z.object({ negotiationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const negotiation = await db.getNegotiationById(input.negotiationId);

      if (!negotiation) {
        throw new Error("Negotiation not found");
      }

      // Check if user is part of this negotiation
      if (negotiation.investorId !== ctx.user.id && negotiation.projectOwnerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return negotiation;
    }),

  // Get user's negotiations
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getNegotiationsByUser(ctx.user.id);
  }),

  // Get negotiations for a project
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await db.getProjectById(input.projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      // Only project owner can see all negotiations
      if (project.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return db.getNegotiationsByProject(input.projectId);
    }),

  // Update negotiation status
  updateStatus: protectedProcedure
    .input(
      z.object({
        negotiationId: z.number(),
        status: z.enum(["open", "in_progress", "cancelled", "closed_success", "closed_failed"]),
        counterAmount: z.string().optional(),
        counterEquity: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const negotiation = await db.getNegotiationById(input.negotiationId);

      if (!negotiation) {
        throw new Error("Negotiation not found");
      }

      // Check if user is part of this negotiation
      if (negotiation.investorId !== ctx.user.id && negotiation.projectOwnerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const { negotiationId, ...updates } = input;
      return db.updateNegotiation(negotiationId, updates);
    }),

  // Get negotiation messages
  getMessages: protectedProcedure
    .input(z.object({ negotiationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const negotiation = await db.getNegotiationById(input.negotiationId);

      if (!negotiation) {
        throw new Error("Negotiation not found");
      }

      // Check if user is part of this negotiation
      if (negotiation.investorId !== ctx.user.id && negotiation.projectOwnerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return db.getNegotiationMessages(input.negotiationId);
    }),

  // Send message
  sendMessage: protectedProcedure
    .input(
      z.object({
        negotiationId: z.number(),
        messageText: z.string().min(1),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const negotiation = await db.getNegotiationById(input.negotiationId);

      if (!negotiation) {
        throw new Error("Negotiation not found");
      }

      // Check if user is part of this negotiation
      if (negotiation.investorId !== ctx.user.id && negotiation.projectOwnerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const now = new Date();
      return db.createNegotiationMessage({
        negotiationId: input.negotiationId,
        senderId: ctx.user.id,
        messageText: input.messageText,
        attachmentUrl: input.attachmentUrl,
        createdAt: now,
        updatedAt: now,
      });
    }),

  // Accept negotiation (finalize deal)
  accept: protectedProcedure
    .input(z.object({ negotiationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const negotiation = await db.getNegotiationById(input.negotiationId);

      if (!negotiation) {
        throw new Error("Negotiation not found");
      }

      // Only project owner can accept
      if (negotiation.projectOwnerId !== ctx.user.id) {
        throw new Error("Only project owner can accept negotiation");
      }

      return db.updateNegotiation(input.negotiationId, {
        status: "closed_success",
        closedAt: new Date(),
      });
    }),

  // Reject negotiation
  reject: protectedProcedure
    .input(z.object({ negotiationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const negotiation = await db.getNegotiationById(input.negotiationId);

      if (!negotiation) {
        throw new Error("Negotiation not found");
      }

      // Only project owner can reject
      if (negotiation.projectOwnerId !== ctx.user.id) {
        throw new Error("Only project owner can reject negotiation");
      }

      return db.updateNegotiation(input.negotiationId, {
        status: "closed_failed",
        closedAt: new Date(),
      });
    }),
});
