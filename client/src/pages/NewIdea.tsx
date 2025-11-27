import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Lightbulb, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewIdea() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetMarket: "",
    targetAudience: "",
    problemSolved: "",
    uniqueValue: "",
    revenueModel: "",
    estimatedBudget: "",
    timeframe: "",
    requiredSkills: "",
    currentStage: "",
  });

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("الرجاء ملء الحقول المطلوبة");
      return;
    }

    if (formData.title.length < 10) {
      toast.error("عنوان الفكرة يجب أن يكون 10 أحرف على الأقل");
      return;
    }

    if (formData.description.length < 50) {
      toast.error("وصف الفكرة يجب أن يكون 50 حرف على الأقل");
      return;
    }

    setIsEvaluating(true);

    try {
      // TODO: Call API to create idea and get AI evaluation
      // const result = await trpc.ideas.createAndEvaluate.mutate(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("تم تقييم فكرتك بنجاح!");
      
      // Navigate to idea details page
      // navigate(`/ideas/${result.id}`);
      navigate("/ideas/my-ideas");
    } catch (error) {
      console.error("Error evaluating idea:", error);
      toast.error("حدث خطأ أثناء تقييم الفكرة");
    } finally {
      setIsEvaluating(false);
    }
  };

  const categories = [
    "التكنولوجيا",
    "التجارة الإلكترونية",
    "التعليم",
    "الصحة",
    "الخدمات المالية",
    "الترفيه",
    "النقل والمواصلات",
    "العقارات",
    "الطعام والمشروبات",
    "الموضة والأزياء",
    "الرياضة واللياقة",
    "السياحة والسفر",
    "البيئة والاستدامة",
    "أخرى",
  ];

  const stages = [
    "مجرد فكرة",
    "بحث أولي",
    "نموذج أولي",
    "منتج تجريبي (MVP)",
    "إطلاق تجريبي",
    "في السوق",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-bg flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">
              قيّم فكرتك بالذكاء الاصطناعي
            </h1>
            <p className="text-gray-600 text-lg">
              أدخل تفاصيل فكرتك واحصل على تقييم شامل مدعوم بـ GPT-4
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              سيقوم الذكاء الاصطناعي بتحليل فكرتك من 8 جوانب مختلفة وتقديم تقييم شامل مع
              توصيات عملية لتحسينها
            </AlertDescription>
          </Alert>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>تفاصيل الفكرة</CardTitle>
                <CardDescription>
                  كلما كانت التفاصيل أكثر دقة، كان التقييم أكثر فائدة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    عنوان الفكرة <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="مثال: منصة توصيل طعام صحي للرياضيين"
                    className="text-lg"
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formData.title.length}/100 حرف (10 أحرف على الأقل)
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    وصف الفكرة <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="اشرح فكرتك بالتفصيل: ما هي؟ كيف تعمل؟ ما الذي يميزها؟"
                    rows={6}
                    maxLength={2000}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formData.description.length}/2000 حرف (50 حرف على الأقل)
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base font-semibold">
                    المجال <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="اختر مجال الفكرة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Market */}
                <div className="space-y-2">
                  <Label htmlFor="targetMarket" className="text-base font-semibold">
                    السوق المستهدف
                  </Label>
                  <Input
                    id="targetMarket"
                    value={formData.targetMarket}
                    onChange={(e) => handleChange("targetMarket", e.target.value)}
                    placeholder="مثال: السعودية، الخليج، الشرق الأوسط"
                    maxLength={200}
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-base font-semibold">
                    الجمهور المستهدف
                  </Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleChange("targetAudience", e.target.value)}
                    placeholder="مثال: الشباب من 18-35 سنة، الرياضيون، رواد الأعمال"
                    maxLength={200}
                  />
                </div>

                {/* Problem Solved */}
                <div className="space-y-2">
                  <Label htmlFor="problemSolved" className="text-base font-semibold">
                    المشكلة التي تحلها الفكرة
                  </Label>
                  <Textarea
                    id="problemSolved"
                    value={formData.problemSolved}
                    onChange={(e) => handleChange("problemSolved", e.target.value)}
                    placeholder="ما المشكلة الحقيقية التي تعالجها فكرتك؟"
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                {/* Unique Value */}
                <div className="space-y-2">
                  <Label htmlFor="uniqueValue" className="text-base font-semibold">
                    القيمة الفريدة
                  </Label>
                  <Textarea
                    id="uniqueValue"
                    value={formData.uniqueValue}
                    onChange={(e) => handleChange("uniqueValue", e.target.value)}
                    placeholder="ما الذي يميز فكرتك عن المنافسين؟"
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                {/* Revenue Model */}
                <div className="space-y-2">
                  <Label htmlFor="revenueModel" className="text-base font-semibold">
                    نموذج الإيرادات
                  </Label>
                  <Textarea
                    id="revenueModel"
                    value={formData.revenueModel}
                    onChange={(e) => handleChange("revenueModel", e.target.value)}
                    placeholder="كيف ستحقق الأرباح؟ (اشتراكات، عمولات، إعلانات، إلخ)"
                    rows={3}
                    maxLength={500}
                  />
                </div>

                {/* Estimated Budget */}
                <div className="space-y-2">
                  <Label htmlFor="estimatedBudget" className="text-base font-semibold">
                    الميزانية التقديرية
                  </Label>
                  <Input
                    id="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={(e) => handleChange("estimatedBudget", e.target.value)}
                    placeholder="مثال: 50,000 - 100,000 ريال"
                    maxLength={100}
                  />
                </div>

                {/* Timeframe */}
                <div className="space-y-2">
                  <Label htmlFor="timeframe" className="text-base font-semibold">
                    الإطار الزمني المتوقع
                  </Label>
                  <Input
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => handleChange("timeframe", e.target.value)}
                    placeholder="مثال: 6-12 شهر"
                    maxLength={100}
                  />
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                  <Label htmlFor="requiredSkills" className="text-base font-semibold">
                    المهارات المطلوبة
                  </Label>
                  <Textarea
                    id="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={(e) => handleChange("requiredSkills", e.target.value)}
                    placeholder="مثال: تطوير تطبيقات، تسويق رقمي، إدارة عمليات"
                    rows={3}
                    maxLength={500}
                  />
                </div>

                {/* Current Stage */}
                <div className="space-y-2">
                  <Label htmlFor="currentStage" className="text-base font-semibold">
                    المرحلة الحالية
                  </Label>
                  <Select value={formData.currentStage} onValueChange={(value) => handleChange("currentStage", value)}>
                    <SelectTrigger id="currentStage">
                      <SelectValue placeholder="في أي مرحلة فكرتك الآن؟" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isEvaluating}
                className="gradient-bg text-lg px-12 py-6 h-auto"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري التقييم بالذكاء الاصطناعي...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 ml-2" />
                    قيّم فكرتي الآن
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Info Note */}
            <p className="text-center text-sm text-gray-500 mt-4">
              التقييم مجاني بالكامل ويستغرق حوالي 30 ثانية
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
