import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Lightbulb,
  Rocket,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

export default function WelcomePopup({ open, onClose }: WelcomePopupProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Lightbulb className="w-16 h-16 text-primary" />,
      title: "مرحباً بك في بذرة! 🌱",
      description: "منصة الوساطة الذكية التي تربط أصحاب الأفكار بالمستثمرين والداعمين",
      features: [
        "قدّم فكرتك واحصل على تقييم مجاني بالذكاء الاصطناعي",
        "حوّل فكرتك إلى مشروع وابدأ حملة دعم جماعي",
        "تواصل مع مستثمرين وداعمين مهتمين",
      ],
    },
    {
      icon: <Rocket className="w-16 h-16 text-secondary" />,
      title: "كيف تبدأ؟",
      description: "خطوات بسيطة لتحويل فكرتك إلى واقع",
      features: [
        "1️⃣ قدّم فكرتك: اكتب فكرتك واحصل على تقييم فوري",
        "2️⃣ أنشئ مشروعك: حوّل الفكرة المقبولة إلى مشروع كامل",
        "3️⃣ ابدأ الدعم: أطلق حملة دعم جماعي واجمع الدعم",
      ],
    },
    {
      icon: <Users className="w-16 h-16 text-blue-600" />,
      title: "انضم للمجتمع",
      description: "تواصل مع رواد الأعمال والمستثمرين",
      features: [
        "شارك تجاربك وتعلم من الآخرين في صفحة المجتمع",
        "احصل على نصائح واستشارات من خبراء",
        "ابنِ شبكة علاقات قوية تساعدك على النجاح",
      ],
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-green-600" />,
      title: "اربح مع بذرة",
      description: "فرص متعددة لتحقيق الدخل",
      features: [
        "💰 احصل على عمولات من دعم المشاريع",
        "🎁 اكسب مكافآت من إحالة مستخدمين جدد",
        "🏆 تصدّر لوحة الصدارة واحصل على مزايا حصرية",
      ],
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              {currentStepData.icon}
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">{currentStepData.title}</h2>
            <p className="text-lg text-gray-600">{currentStepData.description}</p>
          </div>

          {/* Features */}
          <Card className="p-6 bg-gray-50 border-none">
            <ul className="space-y-4">
              {currentStepData.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              السابق
            </Button>
            <Button onClick={handleNext} className="flex-1 gradient-bg btn-hover">
              {isLastStep ? (
                <>
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                  ابدأ الآن
                </>
              ) : (
                <>
                  التالي
                  <ArrowRight className="w-5 h-5 mr-2" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Button */}
          {!isLastStep && (
            <div className="text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                تخطي الجولة التعريفية
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
