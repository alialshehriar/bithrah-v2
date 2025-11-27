import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Zap,
  Shield,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Info,
  Share2,
  Download,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Mock data for demonstration
const mockIdea = {
  id: "1",
  title: "منصة توصيل طعام صحي للرياضيين",
  description:
    "منصة إلكترونية تربط الرياضيين بمطاعم متخصصة في الطعام الصحي، مع خطط غذائية مخصصة وتوصيل سريع.",
  category: "الصحة",
  targetMarket: "السعودية",
  targetAudience: "الرياضيون من 18-45 سنة",
  problemSolved:
    "صعوبة إيجاد وجبات صحية متوازنة تناسب احتياجات الرياضيين مع ضيق الوقت",
  uniqueValue:
    "خطط غذائية مخصصة من أخصائيي تغذية معتمدين، توصيل خلال 30 دقيقة، تتبع السعرات والبروتين",
  revenueModel: "عمولة 15% من كل طلب + اشتراكات شهرية للخطط المخصصة",
  estimatedBudget: "100,000 - 150,000 ريال",
  timeframe: "8-12 شهر",
  requiredSkills: "تطوير تطبيقات، تسويق رقمي، إدارة عمليات، خبرة تغذية",
  currentStage: "مجرد فكرة",
  createdAt: new Date().toISOString(),
  userId: "1",
  
  // AI Evaluation Results
  evaluation: {
    overallScore: 8.2,
    scores: {
      innovation: 8.5,
      marketPotential: 8.0,
      feasibility: 7.5,
      scalability: 8.5,
      profitability: 8.0,
      competition: 7.0,
      risks: 7.5,
      sustainability: 8.5,
    },
    strengths: [
      "فكرة مبتكرة تجمع بين الصحة والتكنولوجيا",
      "سوق متنامي مع زيادة الوعي الصحي",
      "نموذج إيرادات متنوع ومستدام",
      "قابلية عالية للتوسع إلى مدن أخرى",
      "قيمة مضافة واضحة للعملاء",
    ],
    weaknesses: [
      "منافسة قوية من منصات التوصيل الكبرى",
      "تحتاج إلى شراكات مع مطاعم متخصصة",
      "تكلفة اكتساب العملاء قد تكون مرتفعة",
      "تحديات في ضمان جودة الطعام وسرعة التوصيل",
    ],
    opportunities: [
      "التوسع في خدمات التغذية الرياضية",
      "شراكات مع صالات رياضية ونوادي",
      "إضافة منتجات مكملات غذائية",
      "برامج ولاء للعملاء الدائمين",
      "التوسع الإقليمي في دول الخليج",
    ],
    threats: [
      "دخول منافسين كبار إلى السوق",
      "تغير تفضيلات المستهلكين",
      "تحديات تنظيمية في قطاع الأغذية",
      "ارتفاع تكاليف التشغيل",
    ],
    recommendations: [
      "ابدأ بمدينة واحدة (الرياض أو جدة) وركز على بناء قاعدة عملاء قوية",
      "اعقد شراكات استراتيجية مع 3-5 مطاعم صحية موثوقة في البداية",
      "استثمر في تطبيق جوال عالي الجودة مع تجربة مستخدم ممتازة",
      "قدم عروض تجريبية مجانية للشهر الأول لجذب العملاء الأوائل",
      "ركز على التسويق عبر المؤثرين الرياضيين ومدربي اللياقة",
      "احصل على شهادات صحية واعتمادات من الهيئات المختصة",
    ],
    nextSteps: [
      "إجراء بحث سوق تفصيلي واستطلاع آراء 100+ رياضي محتمل",
      "بناء نموذج أولي (Prototype) للتطبيق",
      "التواصل مع 10 مطاعم صحية محتملة",
      "إعداد دراسة جدوى مالية مفصلة",
      "البحث عن شريك تقني أو فريق تطوير",
      "التقديم على برامج حاضنات الأعمال",
    ],
    estimatedInvestment: "100,000 - 150,000 ريال",
    estimatedTimeToLaunch: "8-12 شهر",
    successProbability: 75,
  },
};

export default function IdeaDetails() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const idea = mockIdea; // TODO: Fetch from API using params.id

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  const scoreCategories = [
    { key: "innovation", label: "الابتكار", icon: Lightbulb },
    { key: "marketPotential", label: "إمكانات السوق", icon: TrendingUp },
    { key: "feasibility", label: "قابلية التنفيذ", icon: Target },
    { key: "scalability", label: "قابلية التوسع", icon: Rocket },
    { key: "profitability", label: "الربحية", icon: DollarSign },
    { key: "competition", label: "المنافسة", icon: Users },
    { key: "risks", label: "المخاطر", icon: Shield },
    { key: "sustainability", label: "الاستدامة", icon: Zap },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-gradient-bg text-white">
                    {idea.category}
                  </Badge>
                  <Badge variant="outline">{idea.currentStage}</Badge>
                  <span className="text-sm text-gray-500">
                    {format(new Date(idea.createdAt), "d MMMM yyyy", { locale: ar })}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-3">{idea.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {idea.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mr-6">
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Overall Score */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      التقييم الإجمالي بالذكاء الاصطناعي
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold gradient-text">
                        {idea.evaluation.overallScore}
                      </span>
                      <span className="text-3xl text-gray-500">/10</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      احتمالية النجاح: <span className="font-bold text-green-600">
                        {idea.evaluation.successProbability}%
                      </span>
                    </p>
                  </div>

                  <div className="text-left">
                    <Button size="lg" className="gradient-bg">
                      <Rocket className="w-5 h-5 ml-2" />
                      حوّل إلى مشروع
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      ابدأ في بناء مشروعك الآن
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="scores">التقييمات التفصيلية</TabsTrigger>
              <TabsTrigger value="analysis">التحليل</TabsTrigger>
              <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
              <TabsTrigger value="details">تفاصيل الفكرة</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Score Categories Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scoreCategories.map((category) => {
                  const score = idea.evaluation.scores[category.key as keyof typeof idea.evaluation.scores];
                  return (
                    <Card key={category.key} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-full ${getScoreBgColor(score)} flex items-center justify-center`}>
                            <category.icon className={`w-6 h-6 ${getScoreColor(score)}`} />
                          </div>
                          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                            {score}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{category.label}</h4>
                        <Progress value={score * 10} className="mt-2" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      نقاط القوة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {idea.evaluation.strengths.slice(0, 5).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-5 h-5" />
                      نقاط الضعف
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {idea.evaluation.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Scores Tab */}
            <TabsContent value="scores" className="space-y-6">
              {scoreCategories.map((category) => {
                const score = idea.evaluation.scores[category.key as keyof typeof idea.evaluation.scores];
                return (
                  <Card key={category.key}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full ${getScoreBgColor(score)} flex items-center justify-center`}>
                            <category.icon className={`w-7 h-7 ${getScoreColor(score)}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{category.label}</h3>
                            <p className="text-sm text-gray-600">تقييم شامل لهذا الجانب</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                            {score}
                          </span>
                          <span className="text-2xl text-gray-500">/10</span>
                        </div>
                      </div>
                      <Progress value={score * 10} className="h-3" />
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <TrendingUp className="w-5 h-5" />
                      الفرص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {idea.evaluation.opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <span className="text-gray-700">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Threats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <Shield className="w-5 h-5" />
                      التهديدات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {idea.evaluation.threats.map((threat, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-red-600">{index + 1}</span>
                          </div>
                          <span className="text-gray-700">{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Investment & Timeline */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      الاستثمار المتوقع
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">
                      {idea.evaluation.estimatedInvestment}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      وقت الإطلاق
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">
                      {idea.evaluation.estimatedTimeToLaunch}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      احتمالية النجاح
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {idea.evaluation.successProbability}%
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    توصيات الذكاء الاصطناعي
                  </CardTitle>
                  <CardDescription>
                    خطوات عملية لتحسين فكرتك وزيادة فرص نجاحها
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {idea.evaluation.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <p className="text-gray-900 leading-relaxed">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    الخطوات التالية
                  </CardTitle>
                  <CardDescription>
                    خارطة طريق للبدء في تنفيذ فكرتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {idea.evaluation.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-bg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 leading-relaxed">{step}</p>
                          {index < idea.evaluation.nextSteps.length - 1 && (
                            <div className="w-0.5 h-6 bg-gray-200 mr-4 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الفكرة الكاملة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">المشكلة التي تحلها</h4>
                    <p className="text-gray-700 leading-relaxed">{idea.problemSolved}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">القيمة الفريدة</h4>
                    <p className="text-gray-700 leading-relaxed">{idea.uniqueValue}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">نموذج الإيرادات</h4>
                    <p className="text-gray-700 leading-relaxed">{idea.revenueModel}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">السوق المستهدف</h4>
                      <p className="text-gray-700">{idea.targetMarket}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">الجمهور المستهدف</h4>
                      <p className="text-gray-700">{idea.targetAudience}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">المهارات المطلوبة</h4>
                    <p className="text-gray-700 leading-relaxed">{idea.requiredSkills}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">الميزانية التقديرية</h4>
                      <p className="text-gray-700">{idea.estimatedBudget}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">الإطار الزمني</h4>
                      <p className="text-gray-700">{idea.timeframe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">
                جاهز لتحويل فكرتك إلى مشروع حقيقي؟
              </h3>
              <p className="text-blue-100 mb-6">
                ابدأ في بناء مشروعك الآن واحصل على دعم من المستثمرين
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Rocket className="w-5 h-5 ml-2" />
                حوّل إلى مشروع
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
