/**
 * AI Evaluation System for Bithrah Platform - Lean Canvas Model
 * 
 * Uses Lean Canvas framework for efficient and comprehensive idea evaluation
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

export interface LeanCanvasAnalysis {
  problem: string[];           // 3 main problems
  solution: string[];          // 3 key solutions
  uniqueValue: string;         // Unique value proposition
  unfairAdvantage: string;     // Competitive advantage
  customerSegments: string[];  // Target customer segments
  channels: string[];          // Marketing/distribution channels
  revenueStreams: string[];    // Revenue sources
  costStructure: string[];     // Main cost categories
  keyMetrics: string[];        // KPIs to track
}

export interface FinancialProjection {
  initialCost: string;         // Estimated startup cost
  yearOneRevenue: string;      // First year revenue projection
  breakEvenPoint: string;      // When to break even
  fundingNeeded: string;       // Required funding
}

export interface ExecutionRoadmap {
  phase1: { title: string; duration: string; tasks: string[] };
  phase2: { title: string; duration: string; tasks: string[] };
  phase3: { title: string; duration: string; tasks: string[] };
}

export interface EvaluationResult {
  // Overall
  overallScore: number; // 0-100
  evaluationSummary: string;
  
  // Lean Canvas Analysis
  leanCanvas: LeanCanvasAnalysis;
  
  // Financial Analysis
  financialProjection: FinancialProjection;
  
  // Execution Plan
  executionRoadmap: ExecutionRoadmap;
  
  // SWOT (simplified)
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  
  // Detailed Analysis
  marketAnalysis: string;
  competitiveAnalysis: string;
  riskAssessment: string;
  recommendations: string[];
  
  // Scores by dimension
  feasibilityScore: number; // 0-100
  marketScore: number; // 0-100
  financialScore: number; // 0-100
  executionScore: number; // 0-100
  growthScore: number; // 0-100
}

/**
 * System prompt using Lean Canvas methodology
 */
export const SYSTEM_PROMPT = `أنت خبير تقييم مشاريع ريادية متخصص في السوق السعودي والخليجي. تستخدم منهجية Lean Canvas لتقييم الأفكار الريادية بشكل عملي وشامل.

**منهجية التقييم:**
1. تحليل Lean Canvas الكامل (9 عناصر)
2. تحليل SWOT مبسط
3. توقعات مالية واقعية
4. خارطة طريق تنفيذية (6 أشهر)
5. تقييم المخاطر والفرص

**معايير الدرجات:**
- الجدوى الفنية (20%): قابلية التنفيذ والموارد
- السوق (25%): حجم السوق والطلب والمنافسة
- المالية (20%): نموذج الربح والتكاليف
- التنفيذ (20%): الخطة والفريق والموارد
- النمو (15%): قابلية التوسع والاستدامة

**أسلوب التقييم:**
- موضوعي ومبني على البيانات
- عملي وقابل للتطبيق
- واضح ومباشر
- يركز على القيمة الفريدة والميزة التنافسية`;

/**
 * Main evaluation prompt using Lean Canvas
 */
export function buildEvaluationPrompt(idea: IdeaInput): string {
  return `قم بتقييم الفكرة الريادية التالية باستخدام منهجية Lean Canvas:

**معلومات الفكرة:**
- الاسم: ${idea.ideaName}
- الوصف: ${idea.ideaDescription}
${idea.sector ? `- القطاع: ${idea.sector}` : ''}
${idea.targetMarket ? `- السوق المستهدف: ${idea.targetMarket}` : ''}
${idea.competitiveAdvantage ? `- الميزة التنافسية: ${idea.competitiveAdvantage}` : ''}
${idea.technicalNeeds ? `- الاحتياجات التقنية: ${idea.technicalNeeds}` : ''}
${idea.financialNeeds ? `- الاحتياجات المالية: ${idea.financialNeeds}` : ''}

**المطلوب:**

1. **ملخص التقييم** (فقرتان): نظرة عامة على الفكرة وجدواها وإمكانية نجاحها

2. **تحليل Lean Canvas:**
   - المشكلة: 3 مشاكل رئيسية يحلها المشروع
   - الحل: 3 حلول رئيسية يقدمها
   - القيمة الفريدة: جملة واحدة تلخص القيمة
   - الميزة التنافسية: ما يميزك عن المنافسين
   - شرائح العملاء: 2-3 شرائح مستهدفة
   - القنوات: 3-4 قنوات تسويق/توزيع
   - مصادر الدخل: 2-3 مصادر دخل محتملة
   - هيكل التكاليف: 3-4 بنود تكلفة رئيسية
   - المقاييس الرئيسية: 3-4 KPIs لقياس النجاح

3. **التوقعات المالية:**
   - التكلفة الأولية: رقم تقديري بالريال
   - الإيرادات المتوقعة (السنة الأولى): رقم تقديري
   - نقطة التعادل: متى يتوقع تحقيقها
   - التمويل المطلوب: المبلغ المقترح

4. **خارطة الطريق (6 أشهر):**
   - المرحلة 1 (شهر 1-2): العنوان، المدة، 3-4 مهام
   - المرحلة 2 (شهر 3-4): العنوان، المدة، 3-4 مهام
   - المرحلة 3 (شهر 5-6): العنوان، المدة، 3-4 مهام

5. **تحليل SWOT:**
   - نقاط القوة: 3-4 نقاط
   - نقاط الضعف: 3-4 نقاط
   - الفرص: 3-4 فرص
   - التهديدات: 3-4 تهديدات

6. **التحليلات:**
   - تحليل السوق: فقرة واحدة (حجم السوق، الطلب، الاتجاهات)
   - تحليل المنافسة: فقرة واحدة (المنافسون الرئيسيون، موقعك)
   - تقييم المخاطر: فقرة واحدة (المخاطر الرئيسية وكيفية التعامل معها)

7. **التوصيات:** 4-5 توصيات عملية قابلة للتطبيق

8. **الدرجات:**
   - الدرجة الإجمالية (من 100)
   - درجة الجدوى الفنية (من 100)
   - درجة السوق (من 100)
   - درجة الجدوى المالية (من 100)
   - درجة القدرة على التنفيذ (من 100)
   - درجة استراتيجية النمو (من 100)

**ملاحظات:**
- كن واقعياً في الأرقام المالية
- الدرجات 70-79 = جيد، 80-89 = ممتاز، 90+ = استثنائي
- ركز على القيمة العملية والقابلية للتنفيذ`;
}

/**
 * JSON schema for structured Lean Canvas output
 */
export const EVALUATION_SCHEMA = {
  type: "object",
  properties: {
    evaluationSummary: {
      type: "string",
      description: "ملخص شامل للتقييم في فقرتين"
    },
    leanCanvas: {
      type: "object",
      properties: {
        problem: {
          type: "array",
          items: { type: "string" },
          description: "3 مشاكل رئيسية"
        },
        solution: {
          type: "array",
          items: { type: "string" },
          description: "3 حلول رئيسية"
        },
        uniqueValue: {
          type: "string",
          description: "القيمة الفريدة في جملة واحدة"
        },
        unfairAdvantage: {
          type: "string",
          description: "الميزة التنافسية"
        },
        customerSegments: {
          type: "array",
          items: { type: "string" },
          description: "2-3 شرائح عملاء"
        },
        channels: {
          type: "array",
          items: { type: "string" },
          description: "3-4 قنوات تسويق"
        },
        revenueStreams: {
          type: "array",
          items: { type: "string" },
          description: "2-3 مصادر دخل"
        },
        costStructure: {
          type: "array",
          items: { type: "string" },
          description: "3-4 بنود تكلفة"
        },
        keyMetrics: {
          type: "array",
          items: { type: "string" },
          description: "3-4 مقاييس نجاح"
        }
      },
      required: ["problem", "solution", "uniqueValue", "unfairAdvantage", "customerSegments", "channels", "revenueStreams", "costStructure", "keyMetrics"]
    },
    financialProjection: {
      type: "object",
      properties: {
        initialCost: { type: "string", description: "التكلفة الأولية بالريال" },
        yearOneRevenue: { type: "string", description: "إيرادات السنة الأولى" },
        breakEvenPoint: { type: "string", description: "نقطة التعادل" },
        fundingNeeded: { type: "string", description: "التمويل المطلوب" }
      },
      required: ["initialCost", "yearOneRevenue", "breakEvenPoint", "fundingNeeded"]
    },
    executionRoadmap: {
      type: "object",
      properties: {
        phase1: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "string" },
            tasks: { type: "array", items: { type: "string" } }
          },
          required: ["title", "duration", "tasks"]
        },
        phase2: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "string" },
            tasks: { type: "array", items: { type: "string" } }
          },
          required: ["title", "duration", "tasks"]
        },
        phase3: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "string" },
            tasks: { type: "array", items: { type: "string" } }
          },
          required: ["title", "duration", "tasks"]
        }
      },
      required: ["phase1", "phase2", "phase3"]
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "3-4 نقاط قوة"
    },
    weaknesses: {
      type: "array",
      items: { type: "string" },
      description: "3-4 نقاط ضعف"
    },
    opportunities: {
      type: "array",
      items: { type: "string" },
      description: "3-4 فرص"
    },
    threats: {
      type: "array",
      items: { type: "string" },
      description: "3-4 تهديدات"
    },
    marketAnalysis: {
      type: "string",
      description: "تحليل السوق في فقرة"
    },
    competitiveAnalysis: {
      type: "string",
      description: "تحليل المنافسة في فقرة"
    },
    riskAssessment: {
      type: "string",
      description: "تقييم المخاطر في فقرة"
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "4-5 توصيات عملية"
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
    "leanCanvas",
    "financialProjection",
    "executionRoadmap",
    "strengths",
    "weaknesses",
    "opportunities",
    "threats",
    "marketAnalysis",
    "competitiveAnalysis",
    "riskAssessment",
    "recommendations",
    "overallScore",
    "feasibilityScore",
    "marketScore",
    "financialScore",
    "executionScore",
    "growthScore"
  ],
  additionalProperties: false
};
