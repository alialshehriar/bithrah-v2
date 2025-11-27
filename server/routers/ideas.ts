import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";

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

  // Evaluate idea with AI
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
        // Call AI for evaluation
        const prompt = `أنت خبير في تقييم الأفكار والمشاريع الناشئة. قم بتقييم الفكرة التالية بشكل شامل ومفصل:

**اسم الفكرة:** ${idea.ideaName}

**وصف الفكرة:** ${idea.ideaDescription}

**القطاع:** ${idea.sector || "غير محدد"}

**الفئة:** ${idea.category || "غير محدد"}

**المرحلة:** ${idea.stage || "غير محدد"}

**الاحتياجات التقنية:** ${idea.technicalNeeds || "غير محدد"}

**الاحتياجات المالية:** ${idea.financialNeeds || "غير محدد"}

قدم تقييماً شاملاً يتضمن:
1. ملخص الفكرة (2-3 جمل)
2. نقاط القوة (3-5 نقاط)
3. نقاط الضعف (3-5 نقاط)
4. المخاطر المحتملة (3-5 مخاطر)
5. رأي مبدئي في جدوى الفكرة
6. التحليل الاستراتيجي
7. التحليل المالي
8. تحليل السوق
9. تحليل التنفيذ
10. استراتيجية النمو
11. تقييم عام من 10

قدم الإجابة بصيغة JSON بالشكل التالي:
{
  "summary": "ملخص الفكرة",
  "strengths": "نقاط القوة",
  "weaknesses": "نقاط الضعف",
  "risks": "المخاطر",
  "feasibility": "رأي مبدئي في الجدوى",
  "strategicAnalysis": "التحليل الاستراتيجي",
  "financialAnalysis": "التحليل المالي",
  "marketAnalysis": "تحليل السوق",
  "executionAnalysis": "تحليل التنفيذ",
  "growthStrategy": "استراتيجية النمو",
  "overallScore": 8.5
}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "أنت خبير في تقييم الأفكار والمشاريع الناشئة. قدم تقييمات شاملة ومفصلة.",
            },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "idea_evaluation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  strengths: { type: "string" },
                  weaknesses: { type: "string" },
                  risks: { type: "string" },
                  feasibility: { type: "string" },
                  strategicAnalysis: { type: "string" },
                  financialAnalysis: { type: "string" },
                  marketAnalysis: { type: "string" },
                  executionAnalysis: { type: "string" },
                  growthStrategy: { type: "string" },
                  overallScore: { type: "number" },
                },
                required: [
                  "summary",
                  "strengths",
                  "weaknesses",
                  "risks",
                  "feasibility",
                  "strategicAnalysis",
                  "financialAnalysis",
                  "marketAnalysis",
                  "executionAnalysis",
                  "growthStrategy",
                  "overallScore",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0].message.content;
        const evaluation = JSON.parse(typeof content === "string" ? content : "{}");

        // Update idea with evaluation results
        const updatedIdea = await db.updateIdea(input.ideaId, {
          evaluationStatus: "completed",
          evaluationSummary: evaluation.summary,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          risks: evaluation.risks,
          feasibilityOpinion: evaluation.feasibility,
          strategicAnalysis: evaluation.strategicAnalysis,
          financialAnalysis: evaluation.financialAnalysis,
          marketAnalysis: evaluation.marketAnalysis,
          executionAnalysis: evaluation.executionAnalysis,
          growthStrategy: evaluation.growthStrategy,
          overallScore: evaluation.overallScore.toString(),
          evaluatedAt: new Date(),
        });

        return updatedIdea;
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
  getById: protectedProcedure.input(z.object({ ideaId: z.number() })).query(async ({ ctx, input }) => {
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
});
