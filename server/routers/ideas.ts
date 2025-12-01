import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";
import {
  SYSTEM_PROMPT,
  buildEvaluationPrompt,
  EVALUATION_SCHEMA,
  type IdeaInput,
  type EvaluationResult,
} from "../ai-evaluation-prompts";

export const ideasRouter = router({
  // Create new idea
  create: protectedProcedure
    .input(
      z.object({
        ideaName: z.string().min(3).max(255),
        ideaDescription: z.string().min(10),
        sector: z.string().optional(),
        category: z.string().optional(),
        stage: z.string().optional(),
        technicalNeeds: z.string().optional(),
        financialNeeds: z.string().optional(),
        targetMarket: z.string().optional(),
        competitiveAdvantage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create idea with pending evaluation status
      const now = new Date();
      const idea = await db.createIdea({
        userId: ctx.user.id,
        ...input,
        evaluationStatus: "pending",
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      });

      return idea;
    }),

  // Quick evaluate idea text without saving (for early access popup)
  quickEvaluate: publicProcedure
    .input(
      z.object({
        ideaName: z.string().min(3).default("فكرة جديدة"),
        ideaDescription: z.string().min(10),
        sector: z.string().optional(),
        targetMarket: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Prepare idea input for evaluation
        const ideaInput: IdeaInput = {
          ideaName: input.ideaName || "فكرة جديدة",
          ideaDescription: input.ideaDescription,
          sector: input.sector || "عام",
          targetMarket: input.targetMarket || "السوق السعودي",
        };

        // Build evaluation prompt
        const evaluationPrompt = buildEvaluationPrompt(ideaInput);

        // Call AI for comprehensive evaluation
        const response = await invokeLLM({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: evaluationPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "idea_evaluation",
              strict: true,
              schema: EVALUATION_SCHEMA,
            },
          },
        });

        const content = response.choices[0].message.content;
        
        // Log for debugging
        console.log("AI Response:", content);
        
        if (!content) {
          throw new Error("AI returned empty response");
        }
        
        let evaluation: EvaluationResult;
        try {
          evaluation = JSON.parse(
            typeof content === "string" ? content : JSON.stringify(content)
          );
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          console.error("Content:", content);
          throw new Error("Failed to parse AI response");
        }

        return {
          evaluationSummary: evaluation.evaluationSummary,
          leanCanvas: evaluation.leanCanvas,
          financialProjection: evaluation.financialProjection,
          executionRoadmap: evaluation.executionRoadmap,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          opportunities: evaluation.opportunities,
          threats: evaluation.threats,
          marketAnalysis: evaluation.marketAnalysis,
          competitiveAnalysis: evaluation.competitiveAnalysis,
          riskAssessment: evaluation.riskAssessment,
          recommendations: evaluation.recommendations,
          scores: {
            overall: evaluation.overallScore,
            feasibility: evaluation.feasibilityScore,
            market: evaluation.marketScore,
            financial: evaluation.financialScore,
            execution: evaluation.executionScore,
            growth: evaluation.growthScore,
          },
        };
      } catch (error) {
        console.error("AI Evaluation failed:", error);
        throw new Error("Failed to evaluate idea");
      }
    }),

  // Evaluate idea with AI - Enhanced version
  evaluate: protectedProcedure
    .input(z.object({ ideaId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const idea = await db.getIdeaById(input.ideaId);

      if (!idea) {
        throw new Error("Idea not found");
      }

      if (idea.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Update status to processing
      await db.updateIdea(input.ideaId, { evaluationStatus: "processing" });

      try {
        // Prepare idea input for evaluation
        const ideaInput: IdeaInput = {
          ideaName: idea.ideaName,
          ideaDescription: idea.ideaDescription,
          sector: idea.sector || undefined,
          category: idea.category || undefined,
          stage: idea.stage || undefined,
          technicalNeeds: idea.technicalNeeds || undefined,
          financialNeeds: idea.financialNeeds || undefined,
          targetMarket: idea.targetMarket || undefined,
          competitiveAdvantage: idea.competitiveAdvantage || undefined,
        };

        // Build evaluation prompt
        const evaluationPrompt = buildEvaluationPrompt(ideaInput);

        // Call AI for comprehensive evaluation
        const response = await invokeLLM({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: evaluationPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "idea_evaluation",
              strict: true,
              schema: EVALUATION_SCHEMA,
            },
          },
        });

        const content = response.choices[0].message.content;
        
        // Log for debugging
        console.log("AI Response:", content);
        
        if (!content) {
          throw new Error("AI returned empty response");
        }
        
        let evaluation: EvaluationResult;
        try {
          evaluation = JSON.parse(
            typeof content === "string" ? content : JSON.stringify(content)
          );
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          console.error("Content:", content);
          throw new Error("Failed to parse AI response");
        }

        // Convert arrays to strings for database storage
        const strengthsText = evaluation.strengths.join("\n• ");
        const weaknessesText = evaluation.weaknesses.join("\n• ");
        const risksText = evaluation.risks.join("\n• ");

        // Update idea with evaluation results
        const updatedIdea = await db.updateIdea(input.ideaId, {
          evaluationStatus: "completed",
          evaluationSummary: evaluation.evaluationSummary,
          strengths: strengthsText,
          weaknesses: weaknessesText,
          risks: risksText,
          feasibilityOpinion: evaluation.feasibilityOpinion,
          strategicAnalysis: evaluation.strategicAnalysis,
          financialAnalysis: evaluation.financialAnalysis,
          marketAnalysis: evaluation.marketAnalysis,
          executionAnalysis: evaluation.executionAnalysis,
          growthStrategy: evaluation.growthStrategy,
          overallScore: evaluation.overallScore.toString(),
          evaluatedAt: new Date(),
        });

        return {
          ...updatedIdea,
          scores: {
            overall: evaluation.overallScore,
            feasibility: evaluation.feasibilityScore,
            market: evaluation.marketScore,
            financial: evaluation.financialScore,
            execution: evaluation.executionScore,
            growth: evaluation.growthScore,
          },
        };
      } catch (error) {
        console.error("AI Evaluation failed:", error);
        await db.updateIdea(input.ideaId, { evaluationStatus: "failed" });
        throw new Error("Failed to evaluate idea");
      }
    }),

  // Get user's ideas
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getIdeasByUser(ctx.user.id, false);
  }),

  // Get idea by ID
  getById: protectedProcedure
    .input(z.object({ ideaId: z.number() }))
    .query(async ({ ctx, input }) => {
      const idea = await db.getIdeaById(input.ideaId);

      if (!idea) {
        throw new Error("Idea not found");
      }

      if (idea.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return idea;
    }),

  // Update idea
  update: protectedProcedure
    .input(
      z.object({
        ideaId: z.number(),
        ideaName: z.string().min(3).max(255).optional(),
        ideaDescription: z.string().min(10).optional(),
        sector: z.string().optional(),
        category: z.string().optional(),
        stage: z.string().optional(),
        technicalNeeds: z.string().optional(),
        financialNeeds: z.string().optional(),
        targetMarket: z.string().optional(),
        competitiveAdvantage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const idea = await db.getIdeaById(input.ideaId);

      if (!idea) {
        throw new Error("Idea not found");
      }

      if (idea.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const { ideaId, ...updates } = input;
      return db.updateIdea(ideaId, updates);
    }),

  // Delete idea
  delete: protectedProcedure
    .input(z.object({ ideaId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const idea = await db.getIdeaById(input.ideaId);

      if (!idea) {
        throw new Error("Idea not found");
      }

      if (idea.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return db.deleteIdea(input.ideaId);
    }),

  // Convert idea to project
  convertToProject: protectedProcedure
    .input(z.object({ ideaId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const idea = await db.getIdeaById(input.ideaId);

      if (!idea) {
        throw new Error("Idea not found");
      }

      if (idea.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      if (idea.convertedToProject) {
        throw new Error("Idea already converted to project");
      }

      // Only allow conversion if evaluation is completed
      if (idea.evaluationStatus !== "completed") {
        throw new Error("Idea must be evaluated before conversion to project");
      }

      // Generate unique slug
      const slug = `${idea.ideaName
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now()}`;

      // Create project from idea
      const now = new Date();
      const project = await db.createProject({
        userId: ctx.user.id,
        ideaId: idea.id,
        projectName: idea.ideaName,
        slug,
        description: idea.ideaDescription,
        sector: idea.sector || undefined,
        category: idea.category || undefined,
        fundingGoal: "0",
        status: "draft",
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      });

      // Mark idea as converted
      await db.updateIdea(input.ideaId, {
        convertedToProject: true,
        projectId: project?.id,
      });

      return project;
    }),

  // Get all evaluated ideas with advanced filters (for investors)
  getEvaluatedIdeas: protectedProcedure
    .input(
      z.object({
        sectors: z.array(z.string()).optional(),
        scoreMin: z.number().min(0).max(100).optional(),
        scoreMax: z.number().min(0).max(100).optional(),
        stages: z.array(z.string()).optional(),
        budgetMin: z.number().min(0).optional(),
        budgetMax: z.number().min(0).optional(),
        search: z.string().optional(),
        sortBy: z.enum(["newest", "highest_score", "lowest_budget"]).optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(12),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.pageSize;

      const ideas = await db.getEvaluatedIdeas({
        sectors: input.sectors,
        scoreMin: input.scoreMin,
        scoreMax: input.scoreMax,
        stages: input.stages,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        search: input.search,
        sortBy: input.sortBy || "newest",
        limit: input.pageSize,
        offset,
      });

      const total = await db.countEvaluatedIdeas({
        sectors: input.sectors,
        scoreMin: input.scoreMin,
        scoreMax: input.scoreMax,
        stages: input.stages,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        search: input.search,
      });

      return {
        ideas,
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.ceil(total / input.pageSize),
      };
    }),

  // Get evaluation stats (for dashboard)
  getEvaluationStats: protectedProcedure.query(async () => {
    const stats = await db.getEvaluationStats();
    return stats;
  }),
});
