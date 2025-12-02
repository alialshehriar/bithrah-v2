import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export default function Evaluate() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [ideaText, setIdeaText] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  const evaluateMut = trpc.ideas.quickEvaluate.useMutation({
    onSuccess: (data) => {
      console.log("Evaluation success:", data);
      setEvaluationResult(data);
      setShowDialog(true);
      toast.success("تم تقييم فكرتك بنجاح! 🎉");
    },
    onError: (error) => {
      console.error("Evaluation error:", error);
      toast.error("حدث خطأ أثناء تقييم الفكرة. يرجى المحاولة مرة أخرى.");
    },
  });

  const handleEvaluate = () => {
    if (!ideaText.trim()) {
      toast.error("يرجى كتابة وصف الفكرة");
      return;
    }
    console.log("Starting evaluation...");
    evaluateMut.mutate({ ideaName: "فكرة جديدة", ideaDescription: ideaText });
  };

  // Prepare data for charts
  const getChartData = () => {
    if (!evaluationResult?.scores) return null;

    const radarData = [
      { subject: "الجدوى الفنية", value: evaluationResult.scores.feasibility || 0, fullMark: 100 },
      { subject: "السوق", value: evaluationResult.scores.market || 0, fullMark: 100 },
      { subject: "المالية", value: evaluationResult.scores.financial || 0, fullMark: 100 },
      { subject: "التنفيذ", value: evaluationResult.scores.execution || 0, fullMark: 100 },
      { subject: "النمو", value: evaluationResult.scores.growth || 0, fullMark: 100 },
    ];

    const barData = [
      { name: "الجدوى الفنية", score: evaluationResult.scores.feasibility || 0, color: "#3b82f6" },
      { name: "السوق", score: evaluationResult.scores.market || 0, color: "#10b981" },
      { name: "المالية", score: evaluationResult.scores.financial || 0, color: "#f59e0b" },
      { name: "التنفيذ", score: evaluationResult.scores.execution || 0, color: "#8b5cf6" },
      { name: "النمو", score: evaluationResult.scores.growth || 0, color: "#ec4899" },
    ];

    return { radarData, barData };
  };

  const chartData = getChartData();

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ب</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">بذرة</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/")}>
              الرئيسية
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/early-access")}>
              سجّل الآن
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              قيّم فكرتك بالذكاء الاصطناعي
            </CardTitle>
            <CardDescription className="text-lg">
              اكتب فكرتك وسنقوم بتقييمها باستخدام الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">وصف الفكرة</label>
              <Textarea
                placeholder="مثال: تطبيق توصيل طلبات بدون سائق باستخدام الدرونز في المدن السعودية. الفكرة تعتمد على استخدام طائرات بدون طيار لتوصيل الطلبات الصغيرة والمتوسطة خلال 15 دقيقة فقط..."
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                className="min-h-[200px] text-right"
                dir="rtl"
              />
            </div>

            <Button
              onClick={handleEvaluate}
              disabled={evaluateMut.isPending || !ideaText.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6"
            >
              {evaluateMut.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري التقييم...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 ml-2" />
                  قيّم فكرتي
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              التقييم مجاني ولا يتطلب تسجيل. للحصول على تقييم مفصّل وخطة عمل، سجّل في المنصة.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Result Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              نتيجة التقييم
            </DialogTitle>
          </DialogHeader>

          {evaluationResult && chartData && (
            <div className="space-y-8">
              {/* Overall Score - Large Display */}
              <div className="text-center space-y-4 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className={`text-8xl font-bold ${getScoreColor(evaluationResult.scores?.overall || 0)}`}>
                  {evaluationResult.scores?.overall || 0}
                </div>
                <p className="text-xl text-muted-foreground font-semibold">من 100</p>
                <Progress value={evaluationResult.scores?.overall || 0} className="h-4 max-w-md mx-auto" />
                <p className="text-lg font-medium text-muted-foreground">
                  {evaluationResult.scores?.overall >= 80 && "🎉 فكرة ممتازة! جاهزة للتنفيذ"}
                  {evaluationResult.scores?.overall >= 60 && evaluationResult.scores?.overall < 80 && "👍 فكرة جيدة مع بعض التحسينات"}
                  {evaluationResult.scores?.overall >= 40 && evaluationResult.scores?.overall < 60 && "⚠️ فكرة واعدة لكن تحتاج تطوير"}
                  {evaluationResult.scores?.overall < 40 && "💡 فكرة تحتاج إعادة تقييم وتحسين كبير"}
                </p>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-center">التحليل الشامل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={chartData.radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="الدرجة"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-center">الدرجات التفصيلية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                          {chartData.barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Score Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "الجدوى الفنية", score: evaluationResult.scores?.feasibility || 0, icon: "🔧" },
                  { name: "السوق", score: evaluationResult.scores?.market || 0, icon: "📊" },
                  { name: "المالية", score: evaluationResult.scores?.financial || 0, icon: "💰" },
                  { name: "التنفيذ", score: evaluationResult.scores?.execution || 0, icon: "⚙️" },
                  { name: "النمو", score: evaluationResult.scores?.growth || 0, icon: "📈" },
                ].map((item, idx) => (
                  <Card key={idx} className={`${getScoreBgColor(item.score)} border-2`}>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className={`text-3xl font-bold ${getScoreColor(item.score)}`}>{item.score}</div>
                      <p className="text-xs font-medium mt-2 text-muted-foreground">{item.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Strengths */}
                {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        نقاط القوة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {evaluationResult.strengths.slice(0, 3).map((strength: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Weaknesses */}
                {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-700 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        نقاط الضعف
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {evaluationResult.weaknesses.slice(0, 3).map((weakness: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600 mt-0.5">⚠</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Risks */}
                {evaluationResult.risks && evaluationResult.risks.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        المخاطر
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {evaluationResult.risks.slice(0, 3).map((risk: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-red-600 mt-0.5">⚡</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Summary */}
              {evaluationResult.evaluationSummary && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      ملخص التقييم
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-lg">{evaluationResult.evaluationSummary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Analysis Accordion */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-center mb-4">التحليل التفصيلي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluationResult.feasibilityOpinion && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          🔧 <span>الجدوى الفنية</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evaluationResult.feasibilityOpinion}</p>
                      </CardContent>
                    </Card>
                  )}
                  {evaluationResult.marketAnalysis && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          📊 <span>تحليل السوق</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evaluationResult.marketAnalysis}</p>
                      </CardContent>
                    </Card>
                  )}
                  {evaluationResult.financialAnalysis && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          💰 <span>التحليل المالي</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evaluationResult.financialAnalysis}</p>
                      </CardContent>
                    </Card>
                  )}
                  {evaluationResult.executionAnalysis && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          ⚙️ <span>تحليل التنفيذ</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evaluationResult.executionAnalysis}</p>
                      </CardContent>
                    </Card>
                  )}
                  {evaluationResult.growthStrategy && (
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          📈 <span>استراتيجية النمو</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evaluationResult.growthStrategy}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-6 space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <h4 className="text-xl font-bold mb-2">هل أعجبك التقييم؟</h4>
                  <p className="text-muted-foreground mb-4">
                    سجّل الآن للحصول على تقييم أكثر تفصيلاً، خطة عمل كاملة، وفرصة للتواصل مع مستثمرين!
                  </p>
                  <Button
                    onClick={() => navigate("/early-access")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 ml-2" />
                    سجّل الآن مجاناً
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
