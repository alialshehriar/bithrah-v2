import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SubmitIdea() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    ideaName: "",
    ideaDescription: "",
    sector: "",
    category: "",
    stage: "",
    technicalNeeds: "",
    financialNeeds: "",
    targetMarket: "",
    competitiveAdvantage: "",
  });

  const createIdea = trpc.ideas.create.useMutation({
    onSuccess: async (data) => {
      toast.success("تم إرسال فكرتك بنجاح!");
      
      // Automatically trigger evaluation
      try {
        await evaluateIdea.mutateAsync({ ideaId: data!.id });
        toast.success("جاري تقييم فكرتك بالذكاء الاصطناعي...");
        setLocation(`/ideas/${data!.id}`);
      } catch (error) {
        console.error("Evaluation failed:", error);
        toast.error("فشل التقييم التلقائي. يمكنك المحاولة لاحقاً.");
        setLocation(`/ideas/${data!.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "فشل إرسال الفكرة");
    },
  });

  const evaluateIdea = trpc.ideas.evaluate.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIdea.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isLoading = createIdea.isPending || evaluateIdea.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">قيّم فكرتك بالذكاء الاصطناعي</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            احصل على تقييم شامل ومفصّل لفكرتك الريادية خلال ثوانٍ
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              معلومات الفكرة
            </CardTitle>
            <CardDescription>
              املأ المعلومات التالية للحصول على تقييم دقيق ومفصّل من الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">المعلومات الأساسية</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="ideaName">
                    اسم الفكرة <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ideaName"
                    placeholder="مثال: منصة توصيل ذكية للطلبات"
                    value={formData.ideaName}
                    onChange={(e) => handleChange("ideaName", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ideaDescription">
                    وصف الفكرة <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="ideaDescription"
                    placeholder="اشرح فكرتك بالتفصيل: ما المشكلة التي تحلها؟ كيف تعمل؟ من هم المستفيدون؟"
                    value={formData.ideaDescription}
                    onChange={(e) => handleChange("ideaDescription", e.target.value)}
                    required
                    disabled={isLoading}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.ideaDescription.length} حرف (الحد الأدنى: 10)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sector">القطاع</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => handleChange("sector", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="اختر القطاع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تقنية">تقنية</SelectItem>
                        <SelectItem value="صحة">صحة</SelectItem>
                        <SelectItem value="تعليم">تعليم</SelectItem>
                        <SelectItem value="تجارة إلكترونية">تجارة إلكترونية</SelectItem>
                        <SelectItem value="خدمات مالية">خدمات مالية</SelectItem>
                        <SelectItem value="عقارات">عقارات</SelectItem>
                        <SelectItem value="نقل وتوصيل">نقل وتوصيل</SelectItem>
                        <SelectItem value="ضيافة وسياحة">ضيافة وسياحة</SelectItem>
                        <SelectItem value="أخرى">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">الفئة</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2B">B2B (شركات لشركات)</SelectItem>
                        <SelectItem value="B2C">B2C (شركات لأفراد)</SelectItem>
                        <SelectItem value="C2C">C2C (أفراد لأفراد)</SelectItem>
                        <SelectItem value="B2G">B2G (شركات لحكومة)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">المرحلة الحالية</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleChange("stage", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="فكرة">فكرة فقط</SelectItem>
                      <SelectItem value="نموذج أولي">نموذج أولي (Prototype)</SelectItem>
                      <SelectItem value="MVP">منتج أولي (MVP)</SelectItem>
                      <SelectItem value="تشغيلي">تشغيلي مع عملاء</SelectItem>
                      <SelectItem value="نمو">مرحلة النمو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Market & Competition */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-primary">السوق والمنافسة</h3>

                <div className="space-y-2">
                  <Label htmlFor="targetMarket">السوق المستهدف</Label>
                  <Textarea
                    id="targetMarket"
                    placeholder="من هم عملاؤك المستهدفون؟ ما حجم السوق؟ ما خصائص العملاء المحتملين؟"
                    value={formData.targetMarket}
                    onChange={(e) => handleChange("targetMarket", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitiveAdvantage">الميزة التنافسية</Label>
                  <Textarea
                    id="competitiveAdvantage"
                    placeholder="ما الذي يميز فكرتك عن المنافسين؟ لماذا سيختارك العملاء؟"
                    value={formData.competitiveAdvantage}
                    onChange={(e) => handleChange("competitiveAdvantage", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Needs & Requirements */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-primary">الاحتياجات والمتطلبات</h3>

                <div className="space-y-2">
                  <Label htmlFor="technicalNeeds">الاحتياجات التقنية</Label>
                  <Textarea
                    id="technicalNeeds"
                    placeholder="ما التقنيات المطلوبة؟ هل تحتاج تطوير تطبيق؟ موقع؟ نظام معين؟"
                    value={formData.technicalNeeds}
                    onChange={(e) => handleChange("technicalNeeds", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financialNeeds">الاحتياجات المالية</Label>
                  <Textarea
                    id="financialNeeds"
                    placeholder="ما حجم التمويل المطلوب؟ كيف ستستخدم التمويل؟ ما التكاليف المتوقعة؟"
                    value={formData.financialNeeds}
                    onChange={(e) => handleChange("financialNeeds", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={isLoading || !formData.ideaName || formData.ideaDescription.length < 10}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      {evaluateIdea.isPending ? "جاري التقييم..." : "جاري الإرسال..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 ml-2" />
                      قيّم فكرتي الآن
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  سيتم تقييم فكرتك تلقائياً بالذكاء الاصطناعي فور الإرسال
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">تقييم فوري</h4>
                <p className="text-sm text-muted-foreground">
                  احصل على نتائج التقييم خلال ثوانٍ
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">تحليل شامل</h4>
                <p className="text-sm text-muted-foreground">
                  تقييم 5 محاور رئيسية للفكرة
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">توصيات عملية</h4>
                <p className="text-sm text-muted-foreground">
                  نصائح قابلة للتنفيذ لتطوير فكرتك
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
