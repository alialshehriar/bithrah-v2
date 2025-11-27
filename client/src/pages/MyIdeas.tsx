import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Rocket,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Mock data
const mockIdeas = [
  {
    id: "1",
    title: "منصة توصيل طعام صحي للرياضيين",
    description:
      "منصة إلكترونية تربط الرياضيين بمطاعم متخصصة في الطعام الصحي، مع خطط غذائية مخصصة وتوصيل سريع.",
    category: "الصحة",
    currentStage: "مجرد فكرة",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    evaluation: {
      overallScore: 8.2,
      successProbability: 75,
    },
  },
  {
    id: "2",
    title: "تطبيق تعليم البرمجة للأطفال",
    description:
      "تطبيق تفاعلي يعلم الأطفال من 7-15 سنة أساسيات البرمجة من خلال الألعاب والتحديات الممتعة.",
    category: "التعليم",
    currentStage: "بحث أولي",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    evaluation: {
      overallScore: 7.8,
      successProbability: 70,
    },
  },
  {
    id: "3",
    title: "منصة حجز خدمات الصيانة المنزلية",
    description:
      "منصة تربط أصحاب المنازل بمقدمي خدمات الصيانة المعتمدين (كهرباء، سباكة، تكييف) مع ضمان الجودة.",
    category: "الخدمات",
    currentStage: "نموذج أولي",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    evaluation: {
      overallScore: 7.5,
      successProbability: 68,
    },
  },
];

export default function MyIdeas() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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

  // TODO: Fetch ideas from API
  const ideas = mockIdeas;

  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter((idea) => {
      if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterCategory !== "all" && idea.category !== filterCategory) {
        return false;
      }
      if (filterStage !== "all" && idea.currentStage !== filterStage) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "score") {
        return b.evaluation.overallScore - a.evaluation.overallScore;
      }
      return 0;
    });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">أفكاري</h1>
              <p className="text-gray-600">
                إدارة ومتابعة جميع أفكارك المقيّمة بالذكاء الاصطناعي
              </p>
            </div>
            <Button asChild size="lg" className="gradient-bg">
              <Link href="/ideas/new">
                <a className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  قيّم فكرة جديدة
                </a>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">إجمالي الأفكار</p>
                    <p className="text-3xl font-bold">{ideas.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">متوسط التقييم</p>
                    <p className="text-3xl font-bold text-green-600">
                      {(ideas.reduce((sum, idea) => sum + idea.evaluation.overallScore, 0) / ideas.length).toFixed(1)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">أفكار قوية</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {ideas.filter(idea => idea.evaluation.overallScore >= 8).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">هذا الشهر</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {ideas.filter(idea => {
                        const ideaDate = new Date(idea.createdAt);
                        const now = new Date();
                        return ideaDate.getMonth() === now.getMonth() && ideaDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="ابحث في أفكارك..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="كل المجالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المجالات</SelectItem>
                    <SelectItem value="التكنولوجيا">التكنولوجيا</SelectItem>
                    <SelectItem value="الصحة">الصحة</SelectItem>
                    <SelectItem value="التعليم">التعليم</SelectItem>
                    <SelectItem value="الخدمات">الخدمات</SelectItem>
                  </SelectContent>
                </Select>

                {/* Stage Filter */}
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="كل المراحل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المراحل</SelectItem>
                    <SelectItem value="مجرد فكرة">مجرد فكرة</SelectItem>
                    <SelectItem value="بحث أولي">بحث أولي</SelectItem>
                    <SelectItem value="نموذج أولي">نموذج أولي</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">الأحدث</SelectItem>
                    <SelectItem value="score">التقييم الأعلى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ideas List */}
          {filteredIdeas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery || filterCategory !== "all" || filterStage !== "all"
                    ? "لا توجد أفكار مطابقة للبحث"
                    : "لم تقم بتقييم أي أفكار بعد"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterCategory !== "all" || filterStage !== "all"
                    ? "جرب تغيير معايير البحث"
                    : "ابدأ بتقييم فكرتك الأولى بالذكاء الاصطناعي"}
                </p>
                <Button asChild className="gradient-bg">
                  <Link href="/ideas/new">
                    <a className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      قيّم فكرتك الأولى
                    </a>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <Card key={idea.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Score Badge */}
                      <div className={`w-20 h-20 rounded-xl ${getScoreBgColor(idea.evaluation.overallScore)} flex flex-col items-center justify-center flex-shrink-0`}>
                        <span className={`text-3xl font-bold ${getScoreColor(idea.evaluation.overallScore)}`}>
                          {idea.evaluation.overallScore}
                        </span>
                        <span className="text-xs text-gray-600">/10</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link href={`/ideas/${idea.id}`}>
                              <a className="text-xl font-bold text-gray-900 hover:text-primary transition-colors mb-2 block">
                                {idea.title}
                              </a>
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className="bg-gradient-bg text-white">
                                {idea.category}
                              </Badge>
                              <Badge variant="outline">{idea.currentStage}</Badge>
                              <span className="text-sm text-gray-500">
                                {format(new Date(idea.createdAt), "d MMMM yyyy", { locale: ar })}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mr-4">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/ideas/${idea.id}`}>
                                <a>
                                  <Eye className="w-4 h-4" />
                                </a>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {idea.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>احتمالية النجاح: {idea.evaluation.successProbability}%</span>
                            </div>
                          </div>

                          <Button variant="outline" size="sm">
                            <Rocket className="w-4 h-4 ml-2" />
                            حوّل إلى مشروع
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
