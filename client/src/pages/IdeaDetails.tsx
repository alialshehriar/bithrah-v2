import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
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
  DollarSign,
  Zap,
  Shield,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

export default function IdeaDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: idea, isLoading, error, refetch } = trpc.ideas.getById.useQuery(
    { ideaId: parseInt(id!) },
    { enabled: !!id }
  );

  const evaluateIdea = trpc.ideas.evaluate.useMutation({
    onSuccess: () => {
      toast.success("تم تقييم الفكرة بنجاح!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "فشل التقييم");
    },
  });

  const deleteIdea = trpc.ideas.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الفكرة");
      setLocation("/ideas/my-ideas");
    },
    onError: (error) => {
      toast.error(error.message || "فشل الحذف");
    },
  });

  const handleEvaluate = () => {
    if (!id) return;
    evaluateIdea.mutate({ ideaId: parseInt(id) });
  };

  const handleDelete = () => {
    if (!id || !confirm("هل أنت متأكد من حذف هذه الفكرة؟")) return;
    deleteIdea.mutate({ ideaId: parseInt(id) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">الفكرة غير موجودة</h1>
          <p className="text-muted-foreground mb-6">
            {error?.message || "لم يتم العثور على الفكرة المطلوبة"}
          </p>
          <Button onClick={() => setLocation("/ideas/my-ideas")}>
            العودة إلى أفكاري
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === idea.userId;
  
  // Parse evaluation data from separate fields
  const evaluationData = idea.evaluationStatus === "completed" && idea.overallScore ? {
    overallScore: parseFloat(idea.overallScore),
    technicalFeasibility: idea.feasibilityOpinion ? JSON.parse(idea.feasibilityOpinion) : null,
    marketAnalysis: idea.marketAnalysis ? JSON.parse(idea.marketAnalysis) : null,
    financialViability: idea.financialAnalysis ? JSON.parse(idea.financialAnalysis) : null,
    executionCapability: idea.executionAnalysis ? JSON.parse(idea.executionAnalysis) : null,
    growthStrategy: idea.growthStrategy ? JSON.parse(idea.growthStrategy) : null,
    strengths: idea.strengths ? JSON.parse(idea.strengths) : [],
    weaknesses: idea.weaknesses ? JSON.parse(idea.weaknesses) : [],
    risks: idea.risks ? JSON.parse(idea.risks) : [],
    recommendations: idea.strategicAnalysis ? JSON.parse(idea.strategicAnalysis).recommendations || [] : [],
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{idea.ideaName}</h1>
                  <p className="text-sm text-muted-foreground">
                    تم الإنشاء {format(new Date(idea.createdAt), "dd MMMM yyyy", { locale: ar })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {idea.sector && (
                  <Badge variant="secondary" className="gap-1">
                    <Target className="w-3 h-3" />
                    {idea.sector}
                  </Badge>
                )}
                {idea.category && (
                  <Badge variant="outline">{idea.category}</Badge>
                )}
                {idea.stage && (
                  <Badge variant="outline">{idea.stage}</Badge>
                )}
                <Badge
                  variant={
                    idea.evaluationStatus === "completed"
                      ? "default"
                      : idea.evaluationStatus === "processing"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {idea.evaluationStatus === "completed"
                    ? "تم التقييم"
                    : idea.evaluationStatus === "processing"
                    ? "جاري التقييم..."
                    : "في انتظار التقييم"}
                </Badge>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(`/ideas/${id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteIdea.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {idea.ideaDescription}
          </p>
        </div>

        {/* Evaluation Status */}
        {idea.evaluationStatus === "pending" && isOwner && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">جاهز للتقييم</h3>
                    <p className="text-sm text-muted-foreground">
                      احصل على تقييم شامل بالذكاء الاصطناعي لفكرتك
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEvaluate}
                  disabled={evaluateIdea.isPending}
                  size="lg"
                >
                  {evaluateIdea.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري التقييم...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 ml-2" />
                      قيّم الفكرة الآن
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evaluation Results */}
        {evaluationData && idea.evaluationStatus === "completed" && (
          <div className="space-y-6 mb-8">
            {/* Overall Score */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  التقييم الإجمالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                    <div className="text-5xl font-bold text-primary">
                      {evaluationData.overallScore}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <Progress value={evaluationData.overallScore} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {evaluationData.overallScore >= 80
                      ? "فكرة ممتازة جداً - قابلة للتنفيذ بقوة"
                      : evaluationData.overallScore >= 60
                      ? "فكرة جيدة - تحتاج بعض التحسينات"
                      : "فكرة تحتاج تطوير كبير"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle>التقييم التفصيلي</CardTitle>
                <CardDescription>تحليل شامل لجميع جوانب الفكرة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Feasibility */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-medium">الجدوى الفنية</span>
                      </div>
                      <span className="text-sm font-bold">{evaluationData.technicalFeasibility.score}/100</span>
                    </div>
                    <Progress value={evaluationData.technicalFeasibility.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {evaluationData.technicalFeasibility.summary}
                    </p>
                  </div>

                  {/* Market Analysis */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="font-medium">تحليل السوق</span>
                      </div>
                      <span className="text-sm font-bold">{evaluationData.marketAnalysis.score}/100</span>
                    </div>
                    <Progress value={evaluationData.marketAnalysis.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {evaluationData.marketAnalysis.summary}
                    </p>
                  </div>

                  {/* Financial Viability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-medium">الجدوى المالية</span>
                      </div>
                      <span className="text-sm font-bold">{evaluationData.financialViability.score}/100</span>
                    </div>
                    <Progress value={evaluationData.financialViability.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {evaluationData.financialViability.summary}
                    </p>
                  </div>

                  {/* Execution Capability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-primary" />
                        <span className="font-medium">القدرة على التنفيذ</span>
                      </div>
                      <span className="text-sm font-bold">{evaluationData.executionCapability.score}/100</span>
                    </div>
                    <Progress value={evaluationData.executionCapability.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {evaluationData.executionCapability.summary}
                    </p>
                  </div>

                  {/* Growth Strategy */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-medium">استراتيجية النمو</span>
                      </div>
                      <span className="text-sm font-bold">{evaluationData.growthStrategy.score}/100</span>
                    </div>
                    <Progress value={evaluationData.growthStrategy.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {evaluationData.growthStrategy.summary}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths, Weaknesses, Risks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    نقاط القوة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {evaluationData.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
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
                  <ul className="space-y-2">
                    {evaluationData.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Risks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    المخاطر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {evaluationData.risks.map((risk: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  التوصيات والخطوات التالية
                </CardTitle>
                <CardDescription>
                  نصائح عملية قابلة للتنفيذ لتطوير فكرتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {evaluationData.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm leading-relaxed">{recommendation}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {isOwner && (
              <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">جاهز للانطلاق؟</h3>
                      <p className="text-sm text-muted-foreground">
                        حوّل فكرتك إلى مشروع واعرضها للمستثمرين
                      </p>
                    </div>
                    <Button size="lg" onClick={() => setLocation(`/projects/new?ideaId=${id}`)}>
                      إنشاء مشروع
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Idea Details Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">التفاصيل</TabsTrigger>
            <TabsTrigger value="market">السوق</TabsTrigger>
            <TabsTrigger value="needs">الاحتياجات</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الفكرة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">الوصف</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {idea.ideaDescription}
                  </p>
                </div>
                {idea.stage && (
                  <div>
                    <h4 className="font-semibold mb-2">المرحلة الحالية</h4>
                    <Badge variant="outline">{idea.stage}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل السوق والمنافسة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.targetMarket && (
                  <div>
                    <h4 className="font-semibold mb-2">السوق المستهدف</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {idea.targetMarket}
                    </p>
                  </div>
                )}
                {idea.competitiveAdvantage && (
                  <div>
                    <h4 className="font-semibold mb-2">الميزة التنافسية</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {idea.competitiveAdvantage}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="needs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الاحتياجات والمتطلبات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.technicalNeeds && (
                  <div>
                    <h4 className="font-semibold mb-2">الاحتياجات التقنية</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {idea.technicalNeeds}
                    </p>
                  </div>
                )}
                {idea.financialNeeds && (
                  <div>
                    <h4 className="font-semibold mb-2">الاحتياجات المالية</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {idea.financialNeeds}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
