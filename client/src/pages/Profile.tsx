import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  Lightbulb,
  FolderKanban,
  MessageSquare,
  Settings,
  Edit,
  Share2,
  Star,
  Trophy,
  Target,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: "الأفكار", value: "12", icon: Lightbulb, color: "text-yellow-500" },
    { label: "المشاريع", value: "5", icon: FolderKanban, color: "text-blue-500" },
    { label: "المتابعون", value: "234", icon: Users, color: "text-purple-500" },
    { label: "النقاط", value: "1,250", icon: Trophy, color: "text-orange-500" },
  ];

  const achievements = [
    { title: "رائد مبتكر", description: "قيّم 10 أفكار", icon: Lightbulb, earned: true },
    { title: "صاحب مشروع", description: "أنشأ أول مشروع", icon: FolderKanban, earned: true },
    { title: "عضو نشط", description: "100 تفاعل في المجتمع", icon: MessageSquare, earned: true },
    { title: "مستثمر", description: "دعم 5 مشاريع", icon: TrendingUp, earned: false },
    { title: "نجم المجتمع", description: "حصل على 50 إعجاب", icon: Star, earned: false },
    { title: "خبير", description: "وصل للمستوى 10", icon: Award, earned: false },
  ];

  const recentActivity = [
    {
      type: "idea",
      title: "قيّم فكرة جديدة: تطبيق توصيل طعام صحي",
      time: "منذ ساعتين",
      icon: Lightbulb,
    },
    {
      type: "project",
      title: "أنشأ مشروع: منصة تعليمية تفاعلية",
      time: "منذ يوم",
      icon: FolderKanban,
    },
    {
      type: "community",
      title: "علّق على منشور في المجتمع",
      time: "منذ يومين",
      icon: MessageSquare,
    },
    {
      type: "achievement",
      title: "حصل على إنجاز: رائد مبتكر",
      time: "منذ 3 أيام",
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container">
          {/* Profile Header */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-gradient-bg text-white text-4xl font-bold">
                    {user.name?.charAt(0) || "م"}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        {user.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            انضم في {format(new Date(user.createdAt || Date.now()), "MMMM yyyy", { locale: ar })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/settings">
                          <a className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            <span>الإعدادات</span>
                          </a>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gradient-bg text-white">
                      <Zap className="w-3 h-3 ml-1" />
                      عضو ذهبي
                    </Badge>
                    <Badge variant="outline">
                      <Target className="w-3 h-3 ml-1" />
                      رائد أعمال
                    </Badge>
                    <Badge variant="outline">
                      <Award className="w-3 h-3 ml-1" />
                      المستوى 5
                    </Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 leading-relaxed">
                    رائد أعمال شغوف بالتكنولوجيا والابتكار. أبحث عن فرص استثمارية في المشاريع
                    الناشئة الواعدة.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="ideas">الأفكار</TabsTrigger>
              <TabsTrigger value="projects">المشاريع</TabsTrigger>
              <TabsTrigger value="activity">النشاط</TabsTrigger>
              <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      النشاط الأخير
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <activity.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      أبرز الإنجازات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.filter(a => a.earned).map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-bg flex items-center justify-center flex-shrink-0">
                            <achievement.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-0.5">
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Ideas Tab */}
            <TabsContent value="ideas">
              <Card>
                <CardHeader>
                  <CardTitle>أفكاري</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">لم تقم بتقييم أي أفكار بعد</p>
                    <Button asChild className="gradient-bg">
                      <Link href="/ideas/new">
                        <a>قيّم فكرتك الأولى</a>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>مشاريعي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">لم تنشئ أي مشاريع بعد</p>
                    <Button asChild className="gradient-bg">
                      <Link href="/projects/new">
                        <a>أنشئ مشروعك الأول</a>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>سجل النشاط</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 mb-1">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className={achievement.earned ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50" : "opacity-60"}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                          achievement.earned ? "bg-gradient-bg" : "bg-gray-200"
                        }`}>
                          <achievement.icon className={`w-7 h-7 ${achievement.earned ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.earned ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              تم الإنجاز ✓
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              لم يتم بعد
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
