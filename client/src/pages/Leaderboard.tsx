import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Users,
  Rocket,
  Target,
  Award,
  Zap,
  Flame,
  Calendar,
} from "lucide-react";

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Mock data - replace with actual API
  const topUsers = [
    {
      id: 1,
      rank: 1,
      name: "أحمد محمد السعيد",
      avatar: null,
      points: 15420,
      level: "بطل بذرة",
      badges: ["🏆", "⭐", "🚀", "💎"],
      stats: {
        projects: 12,
        supporters: 450,
        referrals: 89,
        commissions: 45600,
      },
      trend: "up",
    },
    {
      id: 2,
      rank: 2,
      name: "سارة أحمد الغامدي",
      avatar: null,
      points: 13850,
      level: "نجم بذرة",
      badges: ["🏆", "⭐", "🚀"],
      stats: {
        projects: 10,
        supporters: 380,
        referrals: 76,
        commissions: 38900,
      },
      trend: "up",
    },
    {
      id: 3,
      rank: 3,
      name: "خالد علي القحطاني",
      avatar: null,
      points: 12340,
      level: "نجم بذرة",
      badges: ["🏆", "⭐"],
      stats: {
        projects: 9,
        supporters: 320,
        referrals: 65,
        commissions: 32100,
      },
      trend: "same",
    },
    {
      id: 4,
      rank: 4,
      name: "نورة سعد العتيبي",
      avatar: null,
      points: 10890,
      level: "خبير بذرة",
      badges: ["🏆", "⭐"],
      stats: {
        projects: 8,
        supporters: 290,
        referrals: 58,
        commissions: 28700,
      },
      trend: "down",
    },
    {
      id: 5,
      rank: 5,
      name: "محمد فهد الدوسري",
      avatar: null,
      points: 9560,
      level: "خبير بذرة",
      badges: ["🏆"],
      stats: {
        projects: 7,
        supporters: 245,
        referrals: 52,
        commissions: 24300,
      },
      trend: "up",
    },
  ];

  const achievements = [
    {
      icon: Rocket,
      title: "مطلق المشاريع",
      description: "أطلق 10 مشاريع ناجحة",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      title: "محبوب المجتمع",
      description: "احصل على 500 داعم",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      title: "نجم الإحالات",
      description: "أحِل 100 مستخدم جديد",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Trophy,
      title: "بطل العمولات",
      description: "اكسب 50,000 ر.س عمولات",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-600" />;
      default:
        return <div className="text-2xl font-bold text-gray-600">#{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-bg text-white py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">لوحة الصدارة</h1>
              </div>
              <p className="text-xl text-white/90">
                تصدّر القائمة واحصل على مزايا حصرية ومكافآت مميزة
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Period Tabs */}
            <Card className="p-6">
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all">
                    <Trophy className="w-4 h-4 ml-2" />
                    الكل
                  </TabsTrigger>
                  <TabsTrigger value="month">
                    <Calendar className="w-4 h-4 ml-2" />
                    هذا الشهر
                  </TabsTrigger>
                  <TabsTrigger value="week">
                    <Flame className="w-4 h-4 ml-2" />
                    هذا الأسبوع
                  </TabsTrigger>
                  <TabsTrigger value="today">
                    <Zap className="w-4 h-4 ml-2" />
                    اليوم
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>

            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 items-end">
              {/* 2nd Place */}
              {topUsers[1] && (
                <Card className="p-6 space-y-4 transform md:-translate-y-4">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {topUsers[1].name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Medal className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{topUsers[1].name}</h3>
                      <Badge className="bg-gray-100 text-gray-700 mt-2">
                        {topUsers[1].level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {topUsers[1].points.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">نقطة</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* 1st Place */}
              {topUsers[0] && (
                <Card className="p-6 space-y-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ring-4 ring-yellow-200">
                        <span className="text-4xl font-bold text-white">
                          {topUsers[0].name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Crown className="w-7 h-7 text-yellow-500" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-xl">{topUsers[0].name}</h3>
                      <Badge className="bg-yellow-500 text-white mt-2">
                        {topUsers[0].level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold gradient-text">
                        {topUsers[0].points.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">نقطة</p>
                    </div>
                    <div className="flex gap-2">
                      {topUsers[0].badges.map((badge, i) => (
                        <span key={i} className="text-2xl">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* 3rd Place */}
              {topUsers[2] && (
                <Card className="p-6 space-y-4 transform md:-translate-y-4">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {topUsers[2].name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Medal className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{topUsers[2].name}</h3>
                      <Badge className="bg-gray-100 text-gray-700 mt-2">
                        {topUsers[2].level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {topUsers[2].points.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">نقطة</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Full Leaderboard */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">التصنيف الكامل</h2>
              <div className="space-y-3">
                {topUsers.map((user) => (
                  <Card
                    key={user.id}
                    className={`p-5 hover:shadow-md transition-all ${
                      user.rank <= 3 ? "border-2" : ""
                    } ${
                      user.rank === 1
                        ? "border-yellow-400 bg-yellow-50/50"
                        : user.rank === 2
                        ? "border-gray-300 bg-gray-50/50"
                        : user.rank === 3
                        ? "border-orange-300 bg-orange-50/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-16 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>

                        {/* Avatar & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-white">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">{user.name}</h3>
                              {getTrendIcon(user.trend)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {user.level}
                              </Badge>
                              <div className="flex gap-1">
                                {user.badges.slice(0, 3).map((badge, i) => (
                                  <span key={i} className="text-sm">
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden md:flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-gray-900">{user.stats.projects}</p>
                            <p className="text-gray-600">مشاريع</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-900">{user.stats.supporters}</p>
                            <p className="text-gray-600">داعم</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-900">{user.stats.referrals}</p>
                            <p className="text-gray-600">إحالة</p>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-left flex-shrink-0">
                          <p className="text-2xl font-bold gradient-text">
                            {user.points.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">نقطة</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">الإنجازات المتاحة</h2>
                <Badge className="bg-primary/10 text-primary">
                  <Award className="w-4 h-4 ml-1" />
                  احصل على نقاط إضافية
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="p-5 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${achievement.bgColor} flex items-center justify-center`}
                      >
                        <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Target className="w-4 h-4 ml-2" />
                        ابدأ التحدي
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
