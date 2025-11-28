import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import WelcomePopup from "@/components/WelcomePopup";
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  FolderKanban,
  MessageSquare,
  Trophy,
  Star,
  BarChart3,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome popup for first-time visitors
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  const features = [
    {
      icon: Lightbulb,
      title: "تقييم الأفكار بالذكاء الاصطناعي",
      description: "احصل على تقييم شامل لفكرتك باستخدام GPT-4 في ثوانٍ معدودة",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: FolderKanban,
      title: "عرض المشاريع الاحترافي",
      description: "اعرض مشروعك بطريقة احترافية مع باقات متنوعة للمستثمرين",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "بوابة تفاوض آمنة",
      description: "تفاوض مع المستثمرين في بيئة آمنة ومحمية بنظام إيداع",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "مجتمع تفاعلي",
      description: "انضم لمجتمع من رواد الأعمال والمستثمرين وشارك تجربتك",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Trophy,
      title: "نظام المكافآت والإنجازات",
      description: "اكسب نقاط ومكافآت مع كل نشاط وتفاعل في المنصة",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: TrendingUp,
      title: "نظام الإحالة والعمولات",
      description: "اربح عمولات عند إحالة مشاريع ناجحة للمنصة",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
  ];

  // Removed fake stats - will be replaced with real data from DB

  const howItWorks = [
    {
      step: "1",
      title: "قيّم فكرتك",
      description: "ابدأ بتقييم فكرتك باستخدام الذكاء الاصطناعي للحصول على تحليل شامل",
      icon: Lightbulb,
    },
    {
      step: "2",
      title: "أنشئ مشروعك",
      description: "حوّل فكرتك المقيّمة إلى مشروع احترافي مع باقات وخطط واضحة",
      icon: FolderKanban,
    },
    {
      step: "3",
      title: "تواصل مع المستثمرين",
      description: "استقبل عروض المستثمرين وابدأ التفاوض في بيئة آمنة",
      icon: MessageSquare,
    },
    {
      step: "4",
      title: "حقق النجاح",
      description: "أغلق الصفقة واحصل على الدعم اللازم لتحويل فكرتك إلى واقع",
      icon: Trophy,
    },
  ];

  const benefits = [
    "تقييم فوري بالذكاء الاصطناعي",
    "بوابة تفاوض آمنة ومحمية",
    "نظام عمولات شفاف",
    "مجتمع داعم ومتفاعل",
    "أدوات احترافية لعرض المشاريع",
    "دعم فني على مدار الساعة",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 animate-fade-in">
              <Sparkles className="w-4 h-4 ml-2" />
              مدعوم بالذكاء الاصطناعي GPT-4
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-slide-in-right">
              <span className="gradient-text">حوّل أفكارك</span>
              <br />
              <span className="text-gray-900">إلى واقع</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto animate-slide-in-left">
              بذرة تربط أصحاب الأفكار والمستثمرين في بيئة وساطة سعودية ذكية مدعومة بالذكاء
              الاصطناعي. قيّم فكرتك، اعرض مشروعك، وتفاوض بأمان.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
              <Button
                size="lg"
                className="gradient-bg btn-hover text-lg px-8 py-6 h-auto shadow-lg"
                asChild
              >
                {isAuthenticated ? (
                  <Link href="/ideas/new">
                    <a className="flex items-center gap-2">
                      <span>قيّم فكرتك الآن</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </Link>
                ) : (
                  <a href={getLoginUrl()} className="flex items-center gap-2">
                    <span>ابدأ مجاناً</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-2 hover:border-primary hover:text-primary"
                asChild
              >
                <Link href="/projects">
                  <a>استكشف المشاريع</a>
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>مجاني 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>آمن ومحمي</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>دعم على مدار الساعة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* Stats section removed - will be replaced with real data from DB */}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2">
              <Zap className="w-4 h-4 ml-2" />
              الميزات
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              كل ما تحتاجه <span className="gradient-text">في مكان واحد</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              منصة متكاملة توفر لك جميع الأدوات اللازمة لتحويل فكرتك إلى مشروع ناجح
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-hover border-0 shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2">
              <Target className="w-4 h-4 ml-2" />
              كيف يعمل
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              رحلتك نحو <span className="gradient-text">النجاح</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              أربع خطوات بسيطة تفصلك عن تحقيق حلمك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector Line (hidden on mobile and last item) */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 w-full h-0.5 bg-gradient-to-l from-primary/30 to-transparent -z-10 translate-x-1/2"></div>
                )}

                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-bg opacity-10 rounded-full"></div>
                    <div className="relative w-16 h-16 bg-gradient-bg rounded-full flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-50/50 to-pink-50/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <Badge className="mb-4 px-4 py-2">
                <CheckCircle2 className="w-4 h-4 ml-2" />
                المزايا
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                لماذا تختار <span className="gradient-text">بذرة</span>؟
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                نوفر لك بيئة متكاملة وآمنة لتحويل أفكارك إلى مشاريع ناجحة بدعم من الذكاء
                الاصطناعي ومجتمع من رواد الأعمال والمستثمرين
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="gradient-bg btn-hover" asChild>
                {isAuthenticated ? (
                  <Link href="/ideas/new">
                    <a className="flex items-center gap-2">
                      <span>ابدأ الآن</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </Link>
                ) : (
                  <a href={getLoginUrl()} className="flex items-center gap-2">
                    <span>انضم إلينا</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}
              </Button>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full bg-white rounded-xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-32 h-32 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold gradient-text mb-2">
                        نمو مستمر
                      </h3>
                      <p className="text-gray-600">
                        انضم إلى رواد الأعمال الناجحين
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              {/* Fake stats removed - will be replaced with real data */}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              جاهز لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              انضم إلى رواد الأعمال الذين يحولون أفكارهم إلى مشاريع ناجحة على بذرة
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="gradient-bg btn-hover text-lg px-8 py-6 h-auto"
                asChild
              >
                {isAuthenticated ? (
                  <Link href="/ideas/new">
                    <a className="flex items-center gap-2">
                      <span>ابدأ الآن مجاناً</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </Link>
                ) : (
                  <a href={getLoginUrl()} className="flex items-center gap-2">
                    <span>ابدأ الآن مجاناً</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-2 border-white text-white hover:bg-white hover:text-gray-900"
                asChild
              >
                <Link href="/about">
                  <a>تعرف على المزيد</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Welcome Popup */}
      <WelcomePopup open={showWelcome} onClose={handleCloseWelcome} />
    </div>
  );
}
