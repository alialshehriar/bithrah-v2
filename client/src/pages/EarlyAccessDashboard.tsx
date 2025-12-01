import { useState } from "react";
import { useLocation } from "wouter";
import {
  Trophy,
  Users,
  Calendar,
  Copy,
  Share2,
  TrendingUp,
  Award,
  Mail,
  User,
  Phone,
  Hash,
  CheckCircle2,
  Sparkles,
  Crown,
  Medal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function EarlyAccessDashboard() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Get user dashboard data
  const { data: dashboardData, isLoading } = trpc.earlyAccess.getUserDashboard.useQuery(
    { email: userEmail },
    { enabled: hasAccess && !!userEmail }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("يرجى إدخال البريد الإلكتروني");
      return;
    }
    setUserEmail(email);
    setHasAccess(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ!");
  };

  const shareReferralLink = () => {
    if (dashboardData?.user.referralLink) {
      if (navigator.share) {
        navigator.share({
          title: "انضم إلى بذره",
          text: `انضم إلى بذره واحصل على سنة مجانية! استخدم كود الإحالة الخاص بي: ${dashboardData.user.referralCode}`,
          url: dashboardData.user.referralLink,
        });
      } else {
        copyToClipboard(dashboardData.user.referralLink);
      }
    }
  };

  // Get level based on referral count
  const getLevel = (referralCount: number) => {
    if (referralCount >= 50) return { name: "أسطوري", icon: <Crown className="w-5 h-5 text-yellow-500" />, color: "from-yellow-500 to-orange-500" };
    if (referralCount >= 20) return { name: "ماسي", icon: <Trophy className="w-5 h-5 text-purple-500" />, color: "from-purple-500 to-pink-500" };
    if (referralCount >= 10) return { name: "ذهبي", icon: <Medal className="w-5 h-5 text-yellow-600" />, color: "from-yellow-600 to-yellow-400" };
    if (referralCount >= 5) return { name: "فضي", icon: <Star className="w-5 h-5 text-gray-400" />, color: "from-gray-400 to-gray-300" };
    return { name: "برونزي", icon: <Award className="w-5 h-5 text-orange-700" />, color: "from-orange-700 to-orange-500" };
  };

  // Get next level info
  const getNextLevel = (referralCount: number) => {
    if (referralCount >= 50) return { name: "أسطوري", needed: 0, total: 50 };
    if (referralCount >= 20) return { name: "أسطوري", needed: 50 - referralCount, total: 50 };
    if (referralCount >= 10) return { name: "ماسي", needed: 20 - referralCount, total: 20 };
    if (referralCount >= 5) return { name: "ذهبي", needed: 10 - referralCount, total: 10 };
    return { name: "فضي", needed: 5 - referralCount, total: 5 };
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">لوحة التحكم - التسجيل المبكر</CardTitle>
            <CardDescription>أدخل بريدك الإلكتروني لعرض إحصائياتك</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Sparkles className="w-4 h-4 ml-2" />
                عرض لوحة التحكم
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                العودة للرئيسية
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <p className="text-lg mb-4">لم يتم العثور على حساب بهذا البريد الإلكتروني</p>
            <Button onClick={() => setHasAccess(false)}>المحاولة مرة أخرى</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = dashboardData.user;
  const currentLevel = getLevel(user.referralCount);
  const nextLevel = getNextLevel(user.referralCount);
  const progressToNextLevel = user.referralCount >= 50 ? 100 : ((user.referralCount % nextLevel.total) / nextLevel.total) * 100;

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
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setHasAccess(false)}>
              تسجيل خروج
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">مرحباً، {user.fullName}! 👋</h1>
                <p className="text-white/90">أنت في المرتبة #{dashboardData.leaderboardPosition} من أصل {dashboardData.totalUsers} مسجل</p>
              </div>
              <div className={`bg-gradient-to-r ${currentLevel.color} px-6 py-3 rounded-full flex items-center gap-2`}>
                {currentLevel.icon}
                <span className="font-bold text-lg">{currentLevel.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                الإحالات الناجحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{user.referralCount}</div>
              <p className="text-xs text-muted-foreground mt-1">شخص انضم عن طريقك</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                السنوات المجانية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{user.bonusYears}</div>
              <p className="text-xs text-muted-foreground mt-1">سنة مجانية عند الإطلاق</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                الترتيب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">#{dashboardData.leaderboardPosition}</div>
              <p className="text-xs text-muted-foreground mt-1">في لوحة الصدارة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                المستوى
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{currentLevel.name}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {nextLevel.needed > 0 ? `${nextLevel.needed} إحالات للمستوى التالي` : "أعلى مستوى!"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Level */}
        {nextLevel.needed > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                التقدم نحو المستوى التالي: {nextLevel.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{user.referralCount} إحالات</span>
                <span className="text-muted-foreground">{nextLevel.needed} إحالات متبقية</span>
                <span>{nextLevel.total} إحالات</span>
              </div>
              <Progress value={progressToNextLevel} className="h-3" />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                معلوماتك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم الكامل
                </Label>
                <div className="font-medium">{user.fullName}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  اسم المستخدم
                </Label>
                <div className="font-medium">@{user.username}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </Label>
                <div className="font-medium" dir="ltr">{user.email}</div>
              </div>
              {user.phone && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الجوال
                  </Label>
                  <div className="font-medium" dir="ltr">{user.phone}</div>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  تاريخ التسجيل
                </Label>
                <div className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Code */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-600" />
                كود الإحالة الخاص بك
              </CardTitle>
              <CardDescription>شارك هذا الكود مع أصدقائك واحصل على سنة مجانية عن كل إحالة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>كود الإحالة</Label>
                <div className="flex gap-2">
                  <Input
                    value={user.referralCode}
                    readOnly
                    className="font-mono text-lg font-bold text-center bg-white"
                    dir="ltr"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(user.referralCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>رابط الإحالة</Label>
                <div className="flex gap-2">
                  <Input
                    value={user.referralLink}
                    readOnly
                    className="text-sm bg-white"
                    dir="ltr"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(user.referralLink)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={shareReferralLink}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Share2 className="w-4 h-4 ml-2" />
                مشاركة رابط الإحالة
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              الأشخاص الذين أحلتهم ({dashboardData.referrals.length})
            </CardTitle>
            <CardDescription>قائمة بجميع الأشخاص الذين انضموا عن طريق كود الإحالة الخاص بك</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.referrals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>لم تقم بإحالة أي شخص بعد</p>
                <p className="text-sm mt-2">شارك كود الإحالة الخاص بك لتبدأ في كسب السنوات المجانية!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.referrals.map((referral, idx) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{referral.fullName}</div>
                        <div className="text-sm text-muted-foreground">@{referral.username}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">مسجل</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(referral.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-2">استمر في الإحالة واكسب المزيد!</h3>
            <p className="text-white/90 mb-4">
              كل إحالة ناجحة تمنحك سنة مجانية إضافية عند إطلاق المنصة
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/early-access")}
            >
              <Trophy className="w-5 h-5 ml-2" />
              عرض لوحة الصدارة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
