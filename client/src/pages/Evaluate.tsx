import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Evaluate() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [ideaText, setIdeaText] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  const evaluateMut = trpc.ideas.quickEvaluate.useMutation({
    onSuccess: (data) => {
      setEvaluationResult(data);
      setShowDialog(true);
    },
    onError: (error) => {
      console.error("Evaluation error:", error);
      alert("حدث خطأ أثناء تقييم الفكرة. يرجى المحاولة مرة أخرى.");
    },
  });

  const handleEvaluate = () => {
    if (!ideaText.trim()) {
      alert("يرجى كتابة وصف الفكرة");
      return;
    }
    evaluateMut.mutate({ ideaName: "فكرة جديدة", ideaDescription: ideaText });
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
                placeholder="تطبيق توصيل عشب"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">نتيجة التقييم</DialogTitle>
          </DialogHeader>

          {evaluationResult && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold text-purple-600">{evaluationResult.overallScore}</div>
                <p className="text-muted-foreground">من 100</p>
                <Progress value={evaluationResult.overallScore} className="h-3" />
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">الجدوى الفنية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{evaluationResult.technicalFeasibility}/100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">إمكانات السوق</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{evaluationResult.marketPotential}/100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">الجدوى المالية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{evaluationResult.financialViability}/100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">قابلية التنفيذ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{evaluationResult.executability}/100</div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">إمكانات النمو</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">{evaluationResult.scalability}/100</div>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths */}
              {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">✅ نقاط القوة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluationResult.strengths.map((strength: string, idx: number) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Weaknesses */}
              {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">⚠️ نقاط الضعف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluationResult.weaknesses.map((weakness: string, idx: number) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Risks */}
              {evaluationResult.risks && evaluationResult.risks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">⚡ المخاطر</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluationResult.risks.map((risk: string, idx: number) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              {evaluationResult.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>📝 ملخص التقييم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{evaluationResult.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Analysis */}
              <div className="space-y-4">
                {evaluationResult.technicalAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">🔧 التحليل الفني</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{evaluationResult.technicalAnalysis}</p>
                    </CardContent>
                  </Card>
                )}
                {evaluationResult.marketAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">📊 تحليل السوق</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{evaluationResult.marketAnalysis}</p>
                    </CardContent>
                  </Card>
                )}
                {evaluationResult.financialAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">💰 التحليل المالي</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{evaluationResult.financialAnalysis}</p>
                    </CardContent>
                  </Card>
                )}
                {evaluationResult.executionAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">⚙️ تحليل التنفيذ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{evaluationResult.executionAnalysis}</p>
                    </CardContent>
                  </Card>
                )}
                {evaluationResult.growthAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">📈 تحليل النمو</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{evaluationResult.growthAnalysis}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <Button
                  onClick={() => navigate("/early-access")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  size="lg"
                >
                  🎯 سجّل الآن للحصول على تقييم مفصّل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
