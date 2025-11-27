import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { toast } from "sonner";

export default function EarlyAccess() {
  const [selectedTab, setSelectedTab] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Replace with real data from trpc.users.getLeaderboard.useQuery()
  const leaderboard = [
    {
      rank: 1,
      name: "أحمد محمد",
      batch: "الدفعة الأولى",
      referrals: 45,
      points: 2250,
      badge: "ذهبي",
      avatar: null,
    },
    {
      rank: 2,
      name: "فاطمة علي",
      batch: "الدفعة الأولى",
      referrals: 38,
      points: 1900,
      badge: "فضي",
      avatar: null,
    },
    {
      rank: 3,
      name: "خالد سعد",
      batch: "الدفعة الأولى",
      referrals: 32,
      points: 1600,
      badge: "برونزي",
      avatar: null,
    },
    {
      rank: 4,
      name: "سارة أحمد",
      batch: "الدفعة الثانية",
      referrals: 28,
      points: 1400,
      badge: null,
      avatar: null,
    },
    {
      rank: 5,
      name: "محمد علي",
      batch: "الدفعة الثانية",
      referrals: 25,
      points: 1250,
      badge: null,
      avatar: null,
    },
  ];

  const stats = [
    {
      label: "المسجلون",
      value: "2,450",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "الدفعات",
      value: "5",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "الإحالات",
      value: "5,890",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "النقاط",
      value: "125K",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

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
    if (!badge) return null;
    const colors = {
      "ذهبي": "bg-yellow-100 text-yellow-800",
      "فضي": "bg-gray-100 text-gray-800",
      "برونزي": "bg-orange-100 text-orange-800",
    };
    return colors[badge as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with trpc.users.registerEarlyAccess.useMutation()
    setTimeout(() => {
      toast.success("تم التسجيل بنجاح! سنتواصل معك قريباً.");
      setFormData({ name: "", email: "", phone: "" });
      setIsSubmitting(false);
    }, 1500);
  };

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
              {stats.map((stat, index) => (
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
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="register">التسجيل المبكر</TabsTrigger>
                <TabsTrigger value="leaderboard">لوحة الصدارة</TabsTrigger>
              </TabsList>

              {/* Register Tab */}
              <TabsContent value="register">
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
                          الاسم الكامل
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
                          البريد الإلكتروني
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

                      <Button
                        type="submit"
                        className="w-full gradient-bg text-lg py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "جاري التسجيل..."
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

                    <Card className="p-8">
                      <h3 className="text-xl font-bold mb-4">
                        نظام الدفعات
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-bold text-green-800">الدفعة الأولى</p>
                            <p className="text-sm text-green-600">مغلقة</p>
                          </div>
                          <Badge className="bg-green-600 text-white">500 عضو</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-bold text-blue-800">الدفعة الثانية</p>
                            <p className="text-sm text-blue-600">مفتوحة الآن</p>
                          </div>
                          <Badge className="bg-blue-600 text-white">350/500</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-bold text-gray-800">الدفعة الثالثة</p>
                            <p className="text-sm text-gray-600">قريباً</p>
                          </div>
                          <Badge className="bg-gray-400 text-white">0/500</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard">
                <Card>
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Trophy className="w-7 h-7 text-yellow-600" />
                      لوحة الصدارة
                    </h2>
                    <p className="text-gray-600 mt-2">
                      أفضل المسجلين الأوائل حسب عدد الإحالات والنقاط
                    </p>
                  </div>

                  <div className="divide-y">
                    {leaderboard.map((user) => (
                      <div
                        key={user.rank}
                        className={`p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors ${
                          user.rank <= 3 ? "bg-gradient-to-l from-yellow-50/50" : ""
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-20 text-center">
                          {getRankBadge(user.rank)}
                        </div>

                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-bg flex items-center justify-center text-white text-2xl font-bold">
                          {user.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            {user.badge && (
                              <Badge className={getBadgeColor(user.badge) || "bg-gray-100 text-gray-800"}>
                                {user.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.batch}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                              {user.referrals}
                            </p>
                            <p className="text-xs text-gray-600">إحالة</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                              {user.points.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">نقطة</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 text-center">
                    <p className="text-gray-600 mb-4">
                      هل تريد الظهور في لوحة الصدارة؟
                    </p>
                    <Button
                      className="gradient-bg"
                      onClick={() => setSelectedTab("register")}
                    >
                      سجّل الآن
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
