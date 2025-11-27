import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  Search,
  Filter,
  SlidersHorizontal,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Available sectors
const SECTORS = [
  "تقنية",
  "صحة",
  "تعليم",
  "تجارة إلكترونية",
  "خدمات مالية",
  "عقارات",
  "سياحة",
  "زراعة",
  "صناعة",
  "طاقة",
];

// Available stages
const STAGES = [
  "مجرد فكرة",
  "نموذج أولي",
  "منتج تجريبي",
  "منتج جاهز",
  "في السوق",
];

export default function InvestorDashboard() {
  const [, setLocation] = useLocation();

  // Filter states
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "highest_score" | "lowest_budget">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = trpc.ideas.getEvaluationStats.useQuery();

  // Fetch ideas with filters
  const { data, isLoading, refetch } = trpc.ideas.getEvaluatedIdeas.useQuery({
    sectors: selectedSectors.length > 0 ? selectedSectors : undefined,
    scoreMin: scoreRange[0],
    scoreMax: scoreRange[1],
    stages: selectedStages.length > 0 ? selectedStages : undefined,
    search: searchQuery || undefined,
    sortBy,
    page: currentPage,
    pageSize: 12,
  });

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
    setCurrentPage(1);
  };

  const handleStageToggle = (stage: string) => {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedSectors([]);
    setScoreRange([0, 100]);
    setSelectedStages([]);
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"; // Green
    if (score >= 60) return "secondary"; // Blue
    if (score >= 40) return "outline"; // Yellow
    return "destructive"; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "ممتازة";
    if (score >= 60) return "جيدة";
    if (score >= 40) return "متوسطة";
    return "ضعيفة";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">اكتشف الأفكار الواعدة</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            استكشف مئات الأفكار الريادية المقيّمة بالذكاء الاصطناعي واعثر على فرصتك الاستثمارية القادمة
          </p>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  إجمالي الأفكار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold">{stats.totalIdeas}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  أفكار ممتازة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">{stats.excellentIdeas}</span>
                  <Badge variant="outline" className="mr-auto">80+</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  أفكار جيدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-600">{stats.goodIdeas}</span>
                  <Badge variant="outline" className="mr-auto">60-79</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  متوسط الدرجة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold">{stats.averageScore.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  الفلاتر
                </CardTitle>
                <CardDescription>قم بتخصيص البحث حسب احتياجاتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sectors */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">القطاع</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {SECTORS.map((sector) => (
                      <div key={sector} className="flex items-center gap-2">
                        <Checkbox
                          id={`sector-${sector}`}
                          checked={selectedSectors.includes(sector)}
                          onCheckedChange={() => handleSectorToggle(sector)}
                        />
                        <label
                          htmlFor={`sector-${sector}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {sector}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Range */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    الدرجة: {scoreRange[0]} - {scoreRange[1]}
                  </Label>
                  <Slider
                    value={scoreRange}
                    onValueChange={(value) => {
                      setScoreRange(value as [number, number]);
                      setCurrentPage(1);
                    }}
                    min={0}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Stages */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">المرحلة</Label>
                  <div className="space-y-2">
                    {STAGES.map((stage) => (
                      <div key={stage} className="flex items-center gap-2">
                        <Checkbox
                          id={`stage-${stage}`}
                          checked={selectedStages.includes(stage)}
                          onCheckedChange={() => handleStageToggle(stage)}
                        />
                        <label
                          htmlFor={`stage-${stage}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {stage}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResetFilters}
                >
                  <SlidersHorizontal className="w-4 h-4 ml-2" />
                  إعادة تعيين الفلاتر
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Ideas Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن فكرة..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pr-10"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: any) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="highest_score">الأعلى تقييماً</SelectItem>
                  <SelectItem value="lowest_budget">الأقل ميزانية</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            {data && (
              <div className="text-sm text-muted-foreground">
                عرض {data.ideas.length} من أصل {data.total} فكرة
              </div>
            )}

            {/* Ideas Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : data && data.ideas.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {data.ideas.map((idea) => {
                    const score = idea.overallScore ? parseFloat(idea.overallScore) : 0;
                    return (
                      <Card
                        key={idea.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setLocation(`/ideas/${idea.id}`)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant={getScoreBadgeVariant(score)}>
                              {score.toFixed(0)} - {getScoreLabel(score)}
                            </Badge>
                            {idea.sector && (
                              <Badge variant="outline">{idea.sector}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl line-clamp-2">
                            {idea.ideaName}
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {idea.ideaDescription}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={score} className="h-2 mb-4" />
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {idea.category && (
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {idea.category}
                              </span>
                            )}
                            {idea.financialNeeds && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {idea.financialNeeds.substring(0, 30)}...
                              </span>
                            )}
                            <span className="flex items-center gap-1 mr-auto">
                              منذ {format(new Date(idea.createdAt), "d MMMM", { locale: ar })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {data.totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant={currentPage === data.totalPages ? "default" : "outline"}
                          onClick={() => setCurrentPage(data.totalPages)}
                        >
                          {data.totalPages}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
                      disabled={currentPage === data.totalPages}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">لا توجد أفكار</h3>
                  <p className="text-muted-foreground mb-6">
                    لم نعثر على أفكار تطابق معايير البحث
                  </p>
                  <Button onClick={handleResetFilters}>
                    إعادة تعيين الفلاتر
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
