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
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Info,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type ProjectFormData = {
  // Step 1: Basic Info
  title: string;
  tagline: string;
  category: string;
  description: string;
  
  // Step 2: Details
  problemSolved: string;
  solution: string;
  targetAudience: string;
  uniqueValue: string;
  
  // Step 3: Funding
  fundingGoal: string;
  fundingType: string;
  duration: string;
  currency: string;
  
  // Step 4: Media
  coverImage: string;
  videoUrl: string;
  galleryImages: string[];
  
  // Step 5: Team & Links
  teamMembers: Array<{ name: string; role: string; bio: string }>;
  links: Array<{ type: string; url: string }>;
  
  // Step 6: Packages (optional)
  packages: Array<{
    title: string;
    description: string;
    price: string;
    estimatedDelivery: string;
    quantity: string;
  }>;
};

const STEPS = [
  { id: 1, title: "المعلومات الأساسية", description: "عنوان المشروع ووصفه" },
  { id: 2, title: "التفاصيل", description: "المشكلة والحل والقيمة" },
  { id: 3, title: "الدعم", description: "الهدف والمدة" },
  { id: 4, title: "الوسائط", description: "الصور والفيديو" },
  { id: 5, title: "الفريق والروابط", description: "أعضاء الفريق والروابط" },
  { id: 6, title: "الباقات", description: "باقات الدعم (اختياري)" },
];

export default function NewProject() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    tagline: "",
    category: "",
    description: "",
    problemSolved: "",
    solution: "",
    targetAudience: "",
    uniqueValue: "",
    fundingGoal: "",
    fundingType: "flexible",
    duration: "30",
    currency: "SAR",
    coverImage: "",
    videoUrl: "",
    galleryImages: [],
    teamMembers: [{ name: "", role: "", bio: "" }],
    links: [{ type: "website", url: "" }],
    packages: [],
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

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title || formData.title.length < 10) {
          toast.error("عنوان المشروع يجب أن يكون 10 أحرف على الأقل");
          return false;
        }
        if (!formData.category) {
          toast.error("الرجاء اختيار مجال المشروع");
          return false;
        }
        if (!formData.description || formData.description.length < 100) {
          toast.error("وصف المشروع يجب أن يكون 100 حرف على الأقل");
          return false;
        }
        return true;
      
      case 2:
        if (!formData.problemSolved || formData.problemSolved.length < 50) {
          toast.error("المشكلة يجب أن تكون 50 حرف على الأقل");
          return false;
        }
        if (!formData.solution || formData.solution.length < 50) {
          toast.error("الحل يجب أن يكون 50 حرف على الأقل");
          return false;
        }
        return true;
      
      case 3:
        if (!formData.fundingGoal || parseInt(formData.fundingGoal) < 1000) {
          toast.error("هدف الدعم يجب أن يكون 1000 ريال على الأقل");
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // TODO: Call API to create project
      // const result = await trpc.projects.create.mutate(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("تم إنشاء المشروع بنجاح!");
      
      // Navigate to project page
      // navigate(`/projects/${result.id}`);
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("حدث خطأ أثناء إنشاء المشروع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", role: "", bio: "" }],
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { type: "website", url: "" }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [
        ...prev.packages,
        { title: "", description: "", price: "", estimatedDelivery: "", quantity: "unlimited" },
      ],
    }));
  };

  const removePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const updatePackage = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    }));
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

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-bg flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">
              إنشاء مشروع جديد
            </h1>
            <p className="text-gray-600 text-lg">
              أنشئ مشروعك واحصل على الدعم من المستثمرين
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                الخطوة {currentStep} من {STEPS.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 min-w-[150px] p-4 rounded-lg border-2 transition-all ${
                    step.id === currentStep
                      ? "border-primary bg-blue-50"
                      : step.id < currentStep
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        step.id === currentStep
                          ? "bg-primary text-white"
                          : step.id < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{step.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
              <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold">
                      عنوان المشروع <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="مثال: منصة توصيل طعام صحي للرياضيين"
                      className="text-lg"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.title.length}/100 حرف (10 أحرف على الأقل)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-base font-semibold">
                      الشعار (Tagline)
                    </Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                      placeholder="جملة قصيرة تلخص مشروعك في سطر واحد"
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.tagline.length}/150 حرف
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-semibold">
                      المجال <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="اختر مجال المشروع" />
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

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-semibold">
                      وصف المشروع <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="اشرح مشروعك بالتفصيل: ما هو؟ كيف يعمل؟ ما الذي يميزه؟"
                      rows={8}
                      maxLength={5000}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.description.length}/5000 حرف (100 حرف على الأقل)
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="problemSolved" className="text-base font-semibold">
                      المشكلة التي يحلها المشروع <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="problemSolved"
                      value={formData.problemSolved}
                      onChange={(e) => handleChange("problemSolved", e.target.value)}
                      placeholder="ما المشكلة الحقيقية التي يعالجها مشروعك؟"
                      rows={5}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.problemSolved.length}/2000 حرف (50 حرف على الأقل)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-base font-semibold">
                      الحل المقترح <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="solution"
                      value={formData.solution}
                      onChange={(e) => handleChange("solution", e.target.value)}
                      placeholder="كيف يحل مشروعك هذه المشكلة؟"
                      rows={5}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.solution.length}/2000 حرف (50 حرف على الأقل)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="text-base font-semibold">
                      الجمهور المستهدف
                    </Label>
                    <Textarea
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => handleChange("targetAudience", e.target.value)}
                      placeholder="من هم المستفيدون من مشروعك؟"
                      rows={3}
                      maxLength={1000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uniqueValue" className="text-base font-semibold">
                      القيمة الفريدة
                    </Label>
                    <Textarea
                      id="uniqueValue"
                      value={formData.uniqueValue}
                      onChange={(e) => handleChange("uniqueValue", e.target.value)}
                      placeholder="ما الذي يميز مشروعك عن المنافسين؟"
                      rows={3}
                      maxLength={1000}
                    />
                  </div>
                </>
              )}

              {/* Step 3: Funding */}
              {currentStep === 3 && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fundingGoal" className="text-base font-semibold">
                        هدف الدعم <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fundingGoal"
                        type="number"
                        value={formData.fundingGoal}
                        onChange={(e) => handleChange("fundingGoal", e.target.value)}
                        placeholder="100000"
                        min="1000"
                      />
                      <p className="text-xs text-gray-500">
                        الحد الأدنى: 1,000 ريال
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-base font-semibold">
                        العملة
                      </Label>
                      <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                          <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                          <SelectItem value="EUR">يورو (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingType" className="text-base font-semibold">
                      نوع الدعم
                    </Label>
                    <Select value={formData.fundingType} onValueChange={(value) => handleChange("fundingType", value)}>
                      <SelectTrigger id="fundingType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">مرن - تحصل على المبلغ حتى لو لم تصل للهدف</SelectItem>
                        <SelectItem value="fixed">ثابت - تحصل على المبلغ فقط عند الوصول للهدف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-base font-semibold">
                      مدة الحملة (بالأيام)
                    </Label>
                    <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 يوم</SelectItem>
                        <SelectItem value="30">30 يوم</SelectItem>
                        <SelectItem value="45">45 يوم</SelectItem>
                        <SelectItem value="60">60 يوم</SelectItem>
                        <SelectItem value="90">90 يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">ملاحظة حول الدعم:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>الدعم المرن: تحصل على المبلغ المجموع حتى لو لم تصل للهدف</li>
                          <li>الدعم الثابت: تحصل على المبلغ فقط إذا وصلت للهدف الكامل</li>
                          <li>تطبق عمولة منصة بذره على المبالغ المجموعة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Media */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="coverImage" className="text-base font-semibold">
                      صورة الغلاف
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        اسحب الصورة هنا أو انقر للرفع
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG أو GIF (الحد الأقصى: 5MB)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        الأبعاد الموصى بها: 1920x1080
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-base font-semibold">
                      رابط الفيديو التعريفي
                    </Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => handleChange("videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-500">
                      يمكنك إضافة رابط من YouTube أو Vimeo
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      معرض الصور
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        أضف صور إضافية للمشروع
                      </p>
                      <p className="text-xs text-gray-500">
                        يمكنك رفع حتى 10 صور
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">نصائح للوسائط:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>استخدم صور عالية الجودة وواضحة</li>
                          <li>الفيديو التعريفي يزيد فرص نجاح المشروع بنسبة 80%</li>
                          <li>أضف صور توضح المنتج أو الخدمة من زوايا مختلفة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 5: Team & Links */}
              {currentStep === 5 && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        أعضاء الفريق
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTeamMember}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة عضو
                      </Button>
                    </div>

                    {formData.teamMembers.map((member, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold">عضو {index + 1}</h4>
                          {formData.teamMembers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                            placeholder="الاسم"
                          />
                          <Input
                            value={member.role}
                            onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                            placeholder="الدور (مثال: المؤسس، المطور، المصمم)"
                          />
                          <Textarea
                            value={member.bio}
                            onChange={(e) => updateTeamMember(index, "bio", e.target.value)}
                            placeholder="نبذة مختصرة"
                            rows={2}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        الروابط
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLink}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة رابط
                      </Button>
                    </div>

                    {formData.links.map((link, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-3">
                            <Select
                              value={link.type}
                              onValueChange={(value) => updateLink(index, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="website">موقع إلكتروني</SelectItem>
                                <SelectItem value="facebook">فيسبوك</SelectItem>
                                <SelectItem value="twitter">تويتر</SelectItem>
                                <SelectItem value="instagram">إنستقرام</SelectItem>
                                <SelectItem value="linkedin">لينكد إن</SelectItem>
                                <SelectItem value="github">جيت هاب</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              value={link.url}
                              onChange={(e) => updateLink(index, "url", e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                          {formData.links.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLink(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Step 6: Packages */}
              {currentStep === 6 && (
                <>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">الباقات اختيارية</p>
                        <p>
                          يمكنك إضافة باقات دعم مختلفة بمكافآت متنوعة، أو تخطي هذه الخطوة إذا كنت
                          تريد الحصول على دعم مالي فقط بدون مكافآت.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        باقات الدعم
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPackage}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة باقة
                      </Button>
                    </div>

                    {formData.packages.length === 0 ? (
                      <Card className="p-8 text-center">
                        <p className="text-gray-600 mb-4">
                          لم تقم بإضافة أي باقات بعد
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addPackage}
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة باقة الآن
                        </Button>
                      </Card>
                    ) : (
                      formData.packages.map((pkg, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="font-semibold">باقة {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackage(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <Input
                              value={pkg.title}
                              onChange={(e) => updatePackage(index, "title", e.target.value)}
                              placeholder="عنوان الباقة"
                            />
                            <Textarea
                              value={pkg.description}
                              onChange={(e) => updatePackage(index, "description", e.target.value)}
                              placeholder="وصف الباقة والمكافآت المتضمنة"
                              rows={3}
                            />
                            <div className="grid md:grid-cols-2 gap-3">
                              <Input
                                type="number"
                                value={pkg.price}
                                onChange={(e) => updatePackage(index, "price", e.target.value)}
                                placeholder="السعر (ريال)"
                                min="1"
                              />
                              <Input
                                value={pkg.estimatedDelivery}
                                onChange={(e) => updatePackage(index, "estimatedDelivery", e.target.value)}
                                placeholder="موعد التسليم المتوقع"
                              />
                            </div>
                            <Input
                              value={pkg.quantity}
                              onChange={(e) => updatePackage(index, "quantity", e.target.value)}
                              placeholder="الكمية المتاحة (أو 'unlimited' لغير محدود)"
                            />
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              السابق
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="gradient-bg"
              >
                التالي
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gradient-bg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    إنشاء المشروع
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
