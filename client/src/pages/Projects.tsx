import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Users,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Filter,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [showFilters, setShowFilters] = useState(false);

  // TODO: Replace with actual API call
  // const { data: projects, isLoading } = trpc.projects.list.useQuery({
  //   search: searchQuery,
  //   category: selectedCategory !== "all" ? selectedCategory : undefined,
  //   status: selectedStatus !== "all" ? selectedStatus : undefined,
  //   sortBy,
  // });

  const categories = [
    { value: "all", label: "جميع المجالات" },
    { value: "tech", label: "تقنية" },
    { value: "education", label: "تعليم" },
    { value: "health", label: "صحة" },
    { value: "finance", label: "مالية" },
    { value: "ecommerce", label: "تجارة إلكترونية" },
    { value: "entertainment", label: "ترفيه" },
    { value: "food", label: "طعام" },
    { value: "fashion", label: "أزياء" },
    { value: "real-estate", label: "عقارات" },
    { value: "services", label: "خدمات" },
    { value: "other", label: "أخرى" },
  ];

  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "active", label: "نشط" },
    { value: "funded", label: "مكتمل الدعم" },
    { value: "ended", label: "منتهي" },
  ];

  const sortOptions = [
    { value: "trending", label: "الأكثر رواجاً" },
    { value: "newest", label: "الأحدث" },
    { value: "ending-soon", label: "ينتهي قريباً" },
    { value: "most-funded", label: "الأكثر دعماً" },
    { value: "most-backers", label: "الأكثر داعمين" },
  ];

  // Mock data
  const projects = [
    {
      id: 1,
      title: "منصة تعليمية تفاعلية للأطفال",
      slug: "interactive-learning-platform",
      description: "منصة تعليمية مبتكرة تستخدم الذكاء الاصطناعي والألعاب التفاعلية",
      category: "تعليم",
      status: "active",
      goalAmount: 500000,
      currentAmount: 325000,
      backersCount: 156,
      daysLeft: 23,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      owner: { name: "أحمد محمد", avatar: null },
      isFeatured: true,
      isNew: false,
      isDemo: true,
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalFunding: projects.reduce((sum, p) => sum + p.currentAmount, 0),
    totalBackers: projects.reduce((sum, p) => sum + p.backersCount, 0),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-bg text-white py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                استكشف المشاريع المبتكرة
              </h1>
              <p className="text-xl text-white/90">
                ادعم المشاريع التي تؤمن بها وكن جزءاً من قصص النجاح
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن مشاريع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-14 text-lg bg-white"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.totalProjects}</p>
                  <p className="text-white/80 text-sm">مشروع</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.activeProjects}</p>
                  <p className="text-white/80 text-sm">نشط</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">
                    {(stats.totalFunding / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-white/80 text-sm">ريال مُجمّع</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.totalBackers}</p>
                  <p className="text-white/80 text-sm">داعم</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b sticky top-16 z-40">
          <div className="container py-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="المجال" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((sort) => (
                    <SelectItem key={sort.value} value={sort.value}>
                      {sort.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1" />

              {/* Results Count */}
              <p className="text-sm text-gray-600">
                {filteredProjects.length} مشروع
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="container py-12">
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">لا توجد مشاريع</h3>
                <p className="text-gray-600">
                  لم نجد أي مشاريع تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بكلمات مختلفة.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const progressPercentage =
                  (project.currentAmount / project.goalAmount) * 100;

                return (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {project.isDemo && (
                            <Badge className="bg-orange-500 hover:bg-orange-500">
                              <AlertCircle className="w-3 h-3 ml-1" />
                              عرض توضيحي
                            </Badge>
                          )}
                          {project.isFeatured && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-500">
                              <Sparkles className="w-3 h-3 ml-1" />
                              مميز
                            </Badge>
                          )}
                          {project.isNew && (
                            <Badge className="bg-green-500 hover:bg-green-500">جديد</Badge>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          {project.status === "active" && (
                            <Badge className="bg-blue-500 hover:bg-blue-500">
                              <Clock className="w-3 h-3 ml-1" />
                              {project.daysLeft} يوم
                            </Badge>
                          )}
                          {project.status === "funded" && (
                            <Badge className="bg-green-500 hover:bg-green-500">
                              <CheckCircle2 className="w-3 h-3 ml-1" />
                              مكتمل
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Category */}
                        <Badge variant="secondary" className="w-fit mb-3">
                          {project.category}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                          {project.description}
                        </p>

                        {/* Owner */}
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                          <div className="w-6 h-6 rounded-full bg-gradient-bg flex items-center justify-center text-white text-xs">
                            {project.owner.name.charAt(0)}
                          </div>
                          <span>{project.owner.name}</span>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2 mb-4">
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-primary">
                              {project.currentAmount.toLocaleString()} ريال
                            </span>
                            <span className="text-gray-600">
                              {progressPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{project.backersCount} داعم</span>
                          </div>
                          {project.status === "active" && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{project.daysLeft} يوم</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {filteredProjects.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                تحميل المزيد
              </Button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-bg text-white py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                هل لديك فكرة مشروع؟
              </h2>
              <p className="text-xl text-white/90">
                ابدأ مشروعك الآن واحصل على الدعم الذي تحتاجه
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/projects/new">ابدأ مشروعك</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/ideas/new">قيّم فكرتك أولاً</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
