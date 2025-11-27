/**
 * AI Evaluation System for Bithrah Platform
 * 
 * This module contains carefully engineered prompts for evaluating business ideas
 * across multiple dimensions using AI analysis.
 */

export interface IdeaInput {
  ideaName: string;
  ideaDescription: string;
  sector?: string;
  category?: string;
  stage?: string;
  technicalNeeds?: string;
  financialNeeds?: string;
  targetMarket?: string;
  competitiveAdvantage?: string;
}

export interface EvaluationResult {
  // Overall
  overallScore: number; // 0-100
  evaluationSummary: string;
  
  // Strengths, Weaknesses, Risks
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  
  // Detailed Analysis
  feasibilityOpinion: string;
  strategicAnalysis: string;
  financialAnalysis: string;
  marketAnalysis: string;
  executionAnalysis: string;
  growthStrategy: string;
  
  // Scores by dimension
  feasibilityScore: number; // 0-100
  marketScore: number; // 0-100
  financialScore: number; // 0-100
  executionScore: number; // 0-100
  growthScore: number; // 0-100
}

/**
 * System prompt that sets the context for the AI evaluator
 */
export const SYSTEM_PROMPT = `أنت خبير تقييم مشاريع ريادية متخصص في السوق السعودي والخليجي. مهمتك تقييم الأفكار الريادية بشكل موضوعي وشامل.

**معايير التقييم:**
1. الجدوى الفنية (20 نقطة): قابلية التنفيذ تقنياً، توفر الموارد، التعقيد التقني
2. تحليل السوق (25 نقطة): حجم السوق، الطلب، المنافسة، الميزة التنافسية
3. الجدوى المالية (20 نقطة): نموذج الربح، التكاليف، العائد المتوقع
4. القدرة على التنفيذ (20 نقطة): الفريق، الخطة، الموارد، الجدول الزمني
5. استراتيجية النمو (15 نقطة): قابلية التوسع، الاستدامة، الرؤية طويلة المدى

**أسلوب التقييم:**
- كن موضوعياً ومحايداً
- قدم تحليلاً عميقاً مبنياً على البيانات المقدمة
- اذكر نقاط القوة والضعف بوضوح
- قدم توصيات عملية قابلة للتنفيذ
- استخدم لغة عربية فصحى واضحة ومهنية`;

/**
 * Main evaluation prompt that requests comprehensive analysis
 */
export function buildEvaluationPrompt(idea: IdeaInput): string {
  return `قم بتقييم الفكرة الريادية التالية بشكل شامل:

**معلومات الفكرة:**
- الاسم: ${idea.ideaName}
- الوصف: ${idea.ideaDescription}
${idea.sector ? `- القطاع: ${idea.sector}` : ''}
${idea.category ? `- الفئة: ${idea.category}` : ''}
${idea.stage ? `- المرحلة: ${idea.stage}` : ''}
${idea.targetMarket ? `- السوق المستهدف: ${idea.targetMarket}` : ''}
${idea.competitiveAdvantage ? `- الميزة التنافسية: ${idea.competitiveAdvantage}` : ''}
${idea.technicalNeeds ? `- الاحتياجات التقنية: ${idea.technicalNeeds}` : ''}
${idea.financialNeeds ? `- الاحتياجات المالية: ${idea.financialNeeds}` : ''}

**المطلوب:**
قدم تقييماً شاملاً يتضمن:

1. **ملخص التقييم** (فقرة واحدة): نظرة عامة على الفكرة وجدواها

2. **نقاط القوة** (3-5 نقاط): ما يميز هذه الفكرة

3. **نقاط الضعف** (3-5 نقاط): التحديات والمشاكل المحتملة

4. **المخاطر** (3-5 نقاط): المخاطر الرئيسية التي قد تواجه المشروع

5. **الجدوى الفنية** (فقرة): تحليل قابلية التنفيذ تقنياً ومدى توفر الموارد والتقنيات المطلوبة

6. **تحليل السوق** (فقرة): تحليل حجم السوق، الطلب، المنافسة، والفرص المتاحة

7. **الجدوى المالية** (فقرة): تحليل نموذج الربح، التكاليف المتوقعة، والعائد على الاستثمار

8. **القدرة على التنفيذ** (فقرة): تقييم الخطة، الموارد المطلوبة، والجدول الزمني

9. **استراتيجية النمو** (فقرة): تحليل قابلية التوسع والاستدامة والرؤية المستقبلية

10. **الدرجات:**
- الدرجة الإجمالية (من 100)
- درجة الجدوى الفنية (من 100)
- درجة السوق (من 100)
- درجة الجدوى المالية (من 100)
- درجة القدرة على التنفيذ (من 100)
- درجة استراتيجية النمو (من 100)

**ملاحظة:** كن واقعياً في التقييم. الدرجات العالية (80+) تُعطى فقط للأفكار الاستثنائية.`;
}

/**
 * JSON schema for structured output from the AI
 */
export const EVALUATION_SCHEMA = {
  type: "object",
  properties: {
    evaluationSummary: {
      type: "string",
      description: "ملخص شامل للتقييم في فقرة واحدة"
    },
    strengths: {
      type: "array",
      description: "قائمة نقاط القوة (3-5 نقاط)",
      items: { type: "string" }
    },
    weaknesses: {
      type: "array",
      description: "قائمة نقاط الضعف (3-5 نقاط)",
      items: { type: "string" }
    },
    risks: {
      type: "array",
      description: "قائمة المخاطر الرئيسية (3-5 نقاط)",
      items: { type: "string" }
    },
    feasibilityOpinion: {
      type: "string",
      description: "تحليل الجدوى الفنية في فقرة واحدة"
    },
    marketAnalysis: {
      type: "string",
      description: "تحليل السوق في فقرة واحدة"
    },
    financialAnalysis: {
      type: "string",
      description: "تحليل الجدوى المالية في فقرة واحدة"
    },
    executionAnalysis: {
      type: "string",
      description: "تحليل القدرة على التنفيذ في فقرة واحدة"
    },
    growthStrategy: {
      type: "string",
      description: "تحليل استراتيجية النمو في فقرة واحدة"
    },
    strategicAnalysis: {
      type: "string",
      description: "التحليل الاستراتيجي الشامل في فقرة واحدة"
    },
    overallScore: {
      type: "integer",
      description: "الدرجة الإجمالية من 100"
    },
    feasibilityScore: {
      type: "integer",
      description: "درجة الجدوى الفنية من 100"
    },
    marketScore: {
      type: "integer",
      description: "درجة السوق من 100"
    },
    financialScore: {
      type: "integer",
      description: "درجة الجدوى المالية من 100"
    },
    executionScore: {
      type: "integer",
      description: "درجة القدرة على التنفيذ من 100"
    },
    growthScore: {
      type: "integer",
      description: "درجة استراتيجية النمو من 100"
    }
  },
  required: [
    "evaluationSummary",
    "strengths",
    "weaknesses",
    "risks",
    "feasibilityOpinion",
    "marketAnalysis",
    "financialAnalysis",
    "executionAnalysis",
    "growthStrategy",
    "strategicAnalysis",
    "overallScore",
    "feasibilityScore",
    "marketScore",
    "financialScore",
    "executionScore",
    "growthScore"
  ],
  additionalProperties: false
};
