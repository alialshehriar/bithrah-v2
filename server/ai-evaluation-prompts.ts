/**
 * AI Evaluation System for Bithrah Platform - Simplified Version
 * 
 * Simple and efficient idea evaluation with 5 key points
 */

export interface IdeaInput {
  ideaName: string;
  ideaDescription: string;
  sector?: string;
  targetMarket?: string;
}

export interface EvaluationResult {
  overallScore: number; // 0-100
  evaluationSummary: string; // One paragraph summary
  strengths: string[]; // 3-4 strengths
  weaknesses: string[]; // 3-4 weaknesses
  recommendations: string[]; // 3-4 actionable recommendations
}

/**
 * System prompt - simplified
 */
export const SYSTEM_PROMPT = `أنت خبير تقييم مشاريع ريادية متخصص في السوق السعودي والخليجي.

**مهمتك:**
تقييم الأفكار الريادية بشكل موضوعي وعملي، مع التركيز على:
- الجدوى والقابلية للتنفيذ
- حجم السوق والطلب
- المنافسة والميزة التنافسية
- نموذج الربح والاستدامة

**أسلوب التقييم:**
- موضوعي ومبني على الواقع
- عملي وقابل للتطبيق
- واضح ومباشر
- مختصر ومفيد`;

/**
 * Build evaluation prompt from idea input
 */
export function buildEvaluationPrompt(idea: IdeaInput): string {
  return `قيّم الفكرة التالية:

**اسم الفكرة:** ${idea.ideaName}
**الوصف:** ${idea.ideaDescription}
**القطاع:** ${idea.sector || 'عام'}
**السوق المستهدف:** ${idea.targetMarket || 'السوق السعودي'}

قدّم تقييماً شاملاً يتضمن:
1. **الدرجة الإجمالية** من 100 (بناءً على الجدوى، السوق، المنافسة، نموذج الربح)
2. **نقاط القوة** (3-4 نقاط محددة)
3. **نقاط الضعف** (3-4 نقاط محددة)
4. **التوصيات** (3-4 توصيات عملية قابلة للتطبيق)
5. **ملخص التقييم** (فقرة واحدة شاملة)`;
}

/**
 * JSON schema for structured output
 */
export const EVALUATION_SCHEMA = {
  type: "object",
  properties: {
    overallScore: {
      type: "integer",
      description: "الدرجة الإجمالية من 100"
    },
    evaluationSummary: {
      type: "string",
      description: "ملخص شامل للتقييم في فقرة واحدة"
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "3-4 نقاط قوة محددة"
    },
    weaknesses: {
      type: "array",
      items: { type: "string" },
      description: "3-4 نقاط ضعف محددة"
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "3-4 توصيات عملية"
    }
  },
  required: ["overallScore", "evaluationSummary", "strengths", "weaknesses", "recommendations"],
  additionalProperties: false
};
