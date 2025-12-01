import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Users,
  TrendingUp,
  Award,
  Crown,
  Medal,
  Zap,
  CheckCircle,
  Mail,
  User,
  Phone,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function EarlyAccess() {
  const [, setLocation] = useLocation();
  
  // Get initial tab from URL hash
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'evaluate' || hash === 'leaderboard') {
      return hash;
    }
    return 'register';
  };
  
  const [selectedTab, setSelectedTab] = useState(getInitialTab());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    howDidYouHear: "",
    referralCode: "",
  });
  const [ideaText, setIdeaText] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  console.log('Current selectedTab:', selectedTab);

  // Countdown to December 31, 2025
  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date('2025-12-31T23:59:59').getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for URL hash to set active tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      console.log('Hash changed:', hash);
      if (hash === 'evaluate' || hash === 'leaderboard' || hash === 'register') {
        console.log('Setting tab to:', hash);
        setSelectedTab(hash);
      } else if (!hash) {
        console.log('No hash, setting to register');
        setSelectedTab('register');
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      // Save to localStorage
      localStorage.setItem('referral_code', refCode);
      // Pre-fill form
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    } else {
      // Check if we have a saved referral code
      const savedRefCode = localStorage.getItem('referral_code');
      if (savedRefCode) {
        setFormData(prev => ({ ...prev, referralCode: savedRefCode }));
      }
    }
  }, []);

  // tRPC queries
  const { data: stats, isLoading: statsLoading } = trpc.earlyAccess.getStats.useQuery();
  
  // Leaderboard state (using fetch instead of tRPC for now)
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  
  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true);
        const response = await fetch('/api/trpc/earlyAccess.getLeaderboard');
        const data = await response.json();
        const users = data.result.data.json;
        setLeaderboard(users);
        console.log('[Leaderboard] Loaded:', users.length, 'users');
      } catch (error) {
        console.error('[Leaderboard] Error:', error);
        setLeaderboard([]);
      } finally {
        setLeaderboardLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  const registerMutation = trpc.earlyAccess.register.useMutation();
  const evaluateMutation = trpc.ideas.quickEvaluate.useMutation();
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);

  const benefits = [
    {
      icon: Crown,
      title: "أولوية الوصول",
      description: "كن من أوائل المستخدمين واحصل على وصول مبكر لجميع الميزات",
    },
    {
      icon: Star,
      title: "مزايا حصرية",
      description: "احصل على مزايا خاصة وخصومات على الباقات المميزة",
    },
    {
      icon: Award,
      title: "شارة مميزة",
      description: "احصل على شارة 'عضو مؤسس' تظهر في ملفك الشخصي",
    },
    {
      icon: Zap,
      title: "نقاط إضافية",
      description: "احصل على نقاط بونص عند التسجيل المبكر",
    },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <Crown className="w-6 h-6" />
          <span className="font-bold">المركز الأول</span>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <Medal className="w-6 h-6" />
          <span className="font-bold">المركز الثاني</span>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <Medal className="w-6 h-6" />
          <span className="font-bold">المركز الثالث</span>
        </div>
      );
    }
    return <span className="text-gray-600 font-bold">#{rank}</span>;
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return undefined;
    const colors: Record<string, string> = {
      "ذهبي": "bg-yellow-100 text-yellow-800",
      "فضي": "bg-gray-100 text-gray-800",
      "برونزي": "bg-orange-100 text-orange-800",
    };
    return colors[badge] || "bg-gray-100 text-gray-800";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await registerMutation.mutateAsync({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        username: formData.username,
        source: formData.howDidYouHear,
        referralCode: formData.referralCode || undefined,
      });

      // Save user data to localStorage
      localStorage.setItem('early_access_user', JSON.stringify(result.user));
      // Clear referral code from localStorage after successful registration
      localStorage.removeItem('referral_code');
      
      toast.success("تم التسجيل بنجاح!");
      
      // Redirect to success page
      setLocation('/early-access-success');
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التسجيل");
    }
  };

  const handleEvaluateIdea = async () => {
    if (!ideaText.trim()) {
      toast.error("الرجاء كتابة فكرتك");
      return;
    }

    try {
      const result = await evaluateMutation.mutateAsync({
        ideaName: "فكرة سريعة",
        ideaDescription: ideaText,
      });

      setEvaluationResult(result);
      setShowEvaluationDialog(true);
      toast.success("تم تقييم فكرتك بنجاح!");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التقييم");
    }
  };

  const statsData = [
    {
      label: "المسجلون",
      value: statsLoading ? "..." : (stats?.totalUsers || 0).toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "الدفعات",
      value: statsLoading ? "..." : "1",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "الإحالات",
      value: statsLoading ? "..." : (stats?.totalReferrals || 0).toString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "النقاط",
      value: statsLoading ? "..." : ((stats?.totalReferrals || 0) * 50).toString(),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-bg text-white py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 text-white text-lg px-6 py-2">
                <Star className="w-5 h-5 ml-2" />
                التسجيل المبكر مفتوح الآن!
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                كن من الأوائل
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                سجّل الآن واحصل على وصول مبكر لمنصة بذرة مع مزايا حصرية
              </p>
              
              {/* Countdown Timer */}
              <div className="mb-8">
                <p className="text-lg text-white/80 mb-4">ينتهي التسجيل المبكر في:</p>
                <div className="flex gap-4 justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                    <div className="text-4xl font-bold">{countdown.days}</div>
                    <div className="text-sm text-white/70">يوم</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                    <div className="text-4xl font-bold">{countdown.hours}</div>
                    <div className="text-sm text-white/70">ساعة</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                    <div className="text-4xl font-bold">{countdown.minutes}</div>
                    <div className="text-sm text-white/70">دقيقة</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                    <div className="text-4xl font-bold">{countdown.seconds}</div>
                    <div className="text-sm text-white/70">ثانية</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-6"
                  onClick={() => setSelectedTab("register")}
                >
                  <CheckCircle className="w-5 h-5 ml-2" />
                  سجّل الآن مجاناً
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={() => setSelectedTab("leaderboard")}
                >
                  <Trophy className="w-5 h-5 ml-2" />
                  لوحة الصدارة
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-white border-b">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <div>
              <div className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedTab('register')}
                  className={`py-3 px-4 rounded-md font-medium transition-all ${
                    selectedTab === 'register'
                      ? 'bg-white shadow-sm text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  التسجيل المبكر
                </button>
                <button
                  onClick={() => setSelectedTab('leaderboard')}
                  className={`py-3 px-4 rounded-md font-medium transition-all ${
                    selectedTab === 'leaderboard'
                      ? 'bg-white shadow-sm text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  لوحة الصدارة
                </button>
              </div>

              {/* Register Tab */}
              <div className={selectedTab !== 'register' ? 'hidden' : ''}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Registration Form */}
                  <Card className="p-8">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold mb-2">سجّل الآن</h2>
                      <p className="text-gray-600">
                        املأ البيانات التالية للحصول على وصول مبكر
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          الاسم الكامل *
                        </label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="text"
                            placeholder="أدخل اسمك الكامل"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            className="pr-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          اسم المستخدم (يوزر) *
                        </label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="text"
                            placeholder="username"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData({ ...formData, username: e.target.value })
                            }
                            required
                            className="pr-10"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          اسم فريد سيظهر في ملفك الشخصي
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          البريد الإلكتروني *
                        </label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                            className="pr-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          رقم الجوال (اختياري)
                        </label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="tel"
                            placeholder="05xxxxxxxx"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="pr-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          كيف سمعت عن بذره؟ *
                        </label>
                        <Select
                          value={formData.howDidYouHear}
                          onValueChange={(value) =>
                            setFormData({ ...formData, howDidYouHear: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social_media">وسائل التواصل الاجتماعي</SelectItem>
                            <SelectItem value="friend">صديق أو معرفة</SelectItem>
                            <SelectItem value="search">محرك بحث</SelectItem>
                            <SelectItem value="ad">إعلان</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          كود الإحالة (اختياري)
                        </label>
                        <Input
                          type="text"
                          placeholder="أدخل كود الإحالة إن وجد"
                          value={formData.referralCode}
                          onChange={(e) =>
                            setFormData({ ...formData, referralCode: e.target.value })
                          }
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full gradient-bg text-lg py-6"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                            جاري التسجيل...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 ml-2" />
                            سجّل الآن
                          </>
                        )}
                      </Button>
                    </form>

                    <p className="text-sm text-gray-600 text-center mt-6">
                      بالتسجيل، أنت توافق على{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        الشروط والأحكام
                      </Link>{" "}
                      و{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </p>
                  </Card>

                  {/* Benefits */}
                  <div className="space-y-6">
                    <Card className="p-8 gradient-bg text-white">
                      <h3 className="text-2xl font-bold mb-6">
                        لماذا التسجيل المبكر؟
                      </h3>
                      <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-white/20">
                              <benefit.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">{benefit.title}</h4>
                              <p className="text-white/80 text-sm">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Leaderboard Tab */}
              <div className={selectedTab !== 'leaderboard' ? 'hidden' : ''}>
                <Card className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      لوحة الصدارة
                    </h2>
                    <p className="text-gray-600">
                      أفضل المسجلين حسب عدد الإحالات
                    </p>
                  </div>

                  {leaderboardLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : !leaderboard || !Array.isArray(leaderboard) || leaderboard.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">لا توجد بيانات بعد</p>
                      <p className="text-sm text-gray-400 mt-2">
                        كن أول من يسجل ويحصل على إحالات!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leaderboard.map((user: any, index: number) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 text-center">
                              {getRankBadge(index + 1)}
                            </div>
                            <div>
                              <p className="font-bold">{user.fullName}</p>
                              <p className="text-sm text-gray-600">@{user.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">
                                {user.referralCount}
                              </p>
                              <p className="text-xs text-gray-600">إحالات</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-yellow-600">
                                {user.referralCount * 50}
                              </p>
                              <p className="text-xs text-gray-600">نقطة</p>
                            </div>
                            {user.badge && (
                              <Badge className={getBadgeColor(user.badge)}>
                                {user.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Evaluation Result Dialog */}
      <Dialog open={showEvaluationDialog} onOpenChange={setShowEvaluationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              نتيجة تقييم الفكرة
            </DialogTitle>
            <DialogDescription>
              تقييم شامل لفكرتك باستخدام الذكاء الاصطناعي
            </DialogDescription>
          </DialogHeader>

          {evaluationResult && (
            <div className="space-y-6 mt-4">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="text-5xl font-bold text-primary mb-2">
                  {evaluationResult.scores.overall}/100
                </div>
                <div className="text-lg text-gray-600">الدرجة الإجمالية</div>
                <Progress value={evaluationResult.scores.overall} className="mt-4 h-3" />
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {evaluationResult.scores.feasibility}/100
                  </div>
                  <div className="text-sm text-gray-600">الجدوى الفنية</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {evaluationResult.scores.market}/100
                  </div>
                  <div className="text-sm text-gray-600">تحليل السوق</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {evaluationResult.scores.financial}/100
                  </div>
                  <div className="text-sm text-gray-600">الجدوى المالية</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {evaluationResult.scores.execution}/100
                  </div>
                  <div className="text-sm text-gray-600">القدرة على التنفيذ</div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {evaluationResult.scores.growth}/100
                  </div>
                  <div className="text-sm text-gray-600">استراتيجية النمو</div>
                </div>
              </div>

              {/* Evaluation Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">ملخص التقييم</h3>
                <p className="text-gray-700 leading-relaxed">
                  {evaluationResult.evaluationSummary}
                </p>
              </div>

              {/* Strengths */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  نقاط القوة
                </h3>
                <ul className="space-y-2">
                  {evaluationResult.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  نقاط الضعف
                </h3>
                <ul className="space-y-2">
                  {evaluationResult.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  المخاطر
                </h3>
                <ul className="space-y-2">
                  {evaluationResult.risks.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analysis Sections */}
              <div className="space-y-4">
                {evaluationResult.feasibilityOpinion && (
                  <div className="p-4 border-r-4 border-blue-500 bg-blue-50">
                    <h4 className="font-bold mb-2">رأي الجدوى</h4>
                    <p className="text-gray-700">{evaluationResult.feasibilityOpinion}</p>
                  </div>
                )}
                {evaluationResult.marketAnalysis && (
                  <div className="p-4 border-r-4 border-green-500 bg-green-50">
                    <h4 className="font-bold mb-2">تحليل السوق</h4>
                    <p className="text-gray-700">{evaluationResult.marketAnalysis}</p>
                  </div>
                )}
                {evaluationResult.financialAnalysis && (
                  <div className="p-4 border-r-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-bold mb-2">التحليل المالي</h4>
                    <p className="text-gray-700">{evaluationResult.financialAnalysis}</p>
                  </div>
                )}
                {evaluationResult.executionAnalysis && (
                  <div className="p-4 border-r-4 border-purple-500 bg-purple-50">
                    <h4 className="font-bold mb-2">تحليل التنفيذ</h4>
                    <p className="text-gray-700">{evaluationResult.executionAnalysis}</p>
                  </div>
                )}
                {evaluationResult.growthStrategy && (
                  <div className="p-4 border-r-4 border-pink-500 bg-pink-50">
                    <h4 className="font-bold mb-2">استراتيجية النمو</h4>
                    <p className="text-gray-700">{evaluationResult.growthStrategy}</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowEvaluationDialog(false);
                    setSelectedTab("register");
                  }}
                  className="flex-1 gradient-bg"
                >
                  سجّل الآن للحصول على تقييم مفصّل
                </Button>
                <Button
                  onClick={() => setShowEvaluationDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
