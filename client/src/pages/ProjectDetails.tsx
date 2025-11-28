import { useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  Flag,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  Eye,
  Bookmark,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProjectDetails() {
  const { id } = useParams();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // TODO: Replace with actual API call
  // const { data: project, isLoading } = trpc.projects.getById.useQuery({ id: Number(id) });

  // Mock data for demonstration
  const project = {
    id: 1,
    title: "منصة تعليمية تفاعلية للأطفال",
    slug: "interactive-learning-platform",
    description: "منصة تعليمية مبتكرة تستخدم الذكاء الاصطناعي والألعاب التفاعلية لتعليم الأطفال المهارات الأساسية بطريقة ممتعة وجذابة",
    longDescription: `
## عن المشروع

منصة تعليمية متكاملة تهدف إلى تحويل تجربة التعلم للأطفال من 5-12 سنة إلى مغامرة ممتعة ومفيدة. نستخدم أحدث تقنيات الذكاء الاصطناعي لتخصيص المحتوى التعليمي حسب قدرات كل طفل.

## المشكلة

- صعوبة جذب انتباه الأطفال للتعلم التقليدي
- عدم تخصيص المحتوى حسب قدرات الطفل
- نقص المحتوى التعليمي العربي الجذاب
- غياب التفاعل والمتعة في التعلم

## الحل

منصة شاملة تجمع بين:
- **ذكاء اصطناعي**: لتخصيص المحتوى
- **ألعاب تفاعلية**: لجعل التعلم ممتعاً
- **مكافآت ونقاط**: لتحفيز الاستمرار
- **تقارير للأهل**: لمتابعة التقدم

## الفئة المستهدفة

- الأطفال من 5-12 سنة
- الأهل المهتمون بتعليم أطفالهم
- المدارس والمراكز التعليمية
    `,
    category: "تعليم",
    status: "active",
    goalAmount: 500000,
    currentAmount: 325000,
    backersCount: 156,
    daysLeft: 23,
    location: "الرياض، السعودية",
    createdAt: "2024-01-15",
    owner: {
      id: 1,
      name: "أحمد محمد",
      avatar: null,
      bio: "مطور ومهتم بالتعليم التقني",
      projectsCount: 3,
      successRate: 85,
    },
    team: [
      { id: 2, name: "سارة أحمد", role: "مصممة UI/UX", avatar: null },
      { id: 3, name: "خالد علي", role: "مطور Backend", avatar: null },
      { id: 4, name: "نورة سعد", role: "متخصصة محتوى", avatar: null },
    ],
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800" },
      { type: "image", url: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800" },
      { type: "video", url: "https://example.com/video.mp4", thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800" },
    ],
    packages: [
      {
        id: 1,
        title: "الداعم",
        amount: 100,
        description: "شكراً على دعمك! ستحصل على:",
        rewards: ["شهادة شكر رقمية", "اسمك في قائمة الداعمين", "تحديثات حصرية"],
        backersCount: 45,
        deliveryDate: "2024-06-01",
        isAvailable: true,
      },
      {
        id: 2,
        title: "المؤيد",
        amount: 500,
        description: "دعم أكبر، مكافآت أفضل:",
        rewards: ["كل مكافآت الباقة السابقة", "اشتراك مجاني لمدة 6 أشهر", "دعوة لحضور الإطلاق"],
        backersCount: 78,
        deliveryDate: "2024-06-01",
        isAvailable: true,
      },
      {
        id: 3,
        title: "الشريك",
        amount: 2000,
        description: "كن شريكاً في النجاح:",
        rewards: ["كل مكافآت الباقات السابقة", "اشتراك مدى الحياة", "جلسة استشارية خاصة", "شعارك على المنصة"],
        backersCount: 33,
        deliveryDate: "2024-06-01",
        isAvailable: true,
      },
    ],
    updates: [
      {
        id: 1,
        title: "وصلنا 65% من الهدف! 🎉",
        content: "شكراً لكل الداعمين! وصلنا إلى 65% من هدفنا في أقل من أسبوعين...",
        date: "2024-03-20",
        likes: 45,
      },
      {
        id: 2,
        title: "تحديث: إضافة ميزة الألعاب التفاعلية",
        content: "بناءً على اقتراحاتكم، قررنا إضافة المزيد من الألعاب التفاعلية...",
        date: "2024-03-15",
        likes: 32,
      },
    ],
    comments: [
      {
        id: 1,
        user: { name: "فاطمة خالد", avatar: null },
        content: "فكرة رائعة! متحمسة جداً لرؤية المنصة",
        date: "2024-03-21",
        likes: 12,
      },
      {
        id: 2,
        user: { name: "عمر سعيد", avatar: null },
        content: "هل ستكون المنصة متاحة على الهواتف؟",
        date: "2024-03-20",
        likes: 8,
        replies: [
          {
            id: 3,
            user: { name: "أحمد محمد", avatar: null },
            content: "نعم! سنطلق تطبيقات iOS و Android",
            date: "2024-03-20",
            likes: 15,
          },
        ],
      },
    ],
    links: [
      { type: "website", url: "https://example.com" },
      { type: "facebook", url: "https://facebook.com/project" },
      { type: "twitter", url: "https://twitter.com/project" },
    ],
    stats: {
      views: 2450,
      likes: 189,
      shares: 45,
      bookmarks: 67,
    },
  };

  const progressPercentage = (project.currentAmount / project.goalAmount) * 100;

  const handleBackProject = (packageId: number) => {
    setSelectedPackage(packageId);
    // TODO: Implement backing logic
    toast.success("سيتم توجيهك لصفحة الدفع قريباً");
  };

  const handleLike = () => {
    // TODO: Implement like logic
    toast.success("تمت الإضافة إلى المفضلة");
  };

  const handleShare = () => {
    // TODO: Implement share logic
    navigator.clipboard.writeText(window.location.href);
    toast.success("تم نسخ الرابط");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Media */}
        <section className="bg-white border-b">
          <div className="container py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/">الرئيسية</Link>
              <span>/</span>
              <Link href="/projects">المشاريع</Link>
              <span>/</span>
              <span className="text-gray-900">{project.title}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Media Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={project.media[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.media[0].type === "video" && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary mr-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {project.media.slice(0, 4).map((item, index) => (
                    <button
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={item.type === "video" ? item.thumbnail : item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Info & Funding */}
              <div className="space-y-6">
                {/* Category & Status */}
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {project.category}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle2 className="w-3 h-3 ml-1" />
                    نشط
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {project.title}
                </h1>

                {/* Short Description */}
                <p className="text-lg text-gray-600 leading-relaxed">
                  {project.description}
                </p>

                {/* Owner */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={project.owner.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-bg text-white">
                      {project.owner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{project.owner.name}</p>
                    <p className="text-sm text-gray-600">{project.owner.bio}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    متابعة
                  </Button>
                </div>

                {/* Funding Progress */}
                <Card className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {project.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-600">ريال</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      من {project.goalAmount.toLocaleString()} ريال ({progressPercentage.toFixed(0)}%)
                    </p>
                  </div>

                  <Progress value={progressPercentage} className="h-3" />

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{project.backersCount}</p>
                      <p className="text-sm text-gray-600">داعم</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{project.daysLeft}</p>
                      <p className="text-sm text-gray-600">يوم متبقي</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {progressPercentage.toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600">مكتمل</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Button className="flex-1 gradient-bg btn-hover" size="lg">
                      ادعم المشروع
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleLike}>
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {project.stats.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {project.stats.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {project.stats.shares}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>بدأ في {new Date(project.createdAt).toLocaleDateString("ar-SA")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    الوصف
                  </TabsTrigger>
                  <TabsTrigger
                    value="updates"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    التحديثات ({project.updates.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    التعليقات ({project.comments.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    الفريق ({project.team.length + 1})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6 space-y-6">
                  <Card className="p-6">
                    <div className="prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: project.longDescription.replace(/\n/g, "<br/>") }} />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="updates" className="mt-6 space-y-4">
                  {project.updates.map((update) => (
                    <Card key={update.id} className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{update.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(update.date).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{update.content}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4 ml-1" />
                          {update.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4 ml-1" />
                          تعليق
                        </Button>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="comments" className="mt-6 space-y-4">
                  {project.comments.map((comment) => (
                    <Card key={comment.id} className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={comment.user.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-bg text-white">
                            {comment.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{comment.user.name}</span>
                            <span className="text-sm text-gray-600">
                              {new Date(comment.date).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 ml-1" />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              رد
                            </Button>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mr-8 mt-4 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={reply.user.avatar || undefined} />
                                    <AvatarFallback className="bg-gradient-bg text-white text-xs">
                                      {reply.user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm">{reply.user.name}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        صاحب المشروع
                                      </Badge>
                                      <span className="text-xs text-gray-600">
                                        {new Date(reply.date).toLocaleDateString("ar-SA")}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{reply.content}</p>
                                    <Button variant="ghost" size="sm" className="mt-2">
                                      <ThumbsUp className="w-3 h-3 ml-1" />
                                      {reply.likes}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Add Comment */}
                  <Card className="p-6">
                    <textarea
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="اكتب تعليقك هنا..."
                    />
                    <div className="flex justify-end mt-3">
                      <Button className="gradient-bg">نشر التعليق</Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="mt-6 space-y-4">
                  {/* Owner */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={project.owner.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-bg text-white text-xl">
                          {project.owner.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{project.owner.name}</h3>
                          <Badge variant="secondary">صاحب المشروع</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{project.owner.bio}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{project.owner.projectsCount} مشاريع</span>
                          <span>•</span>
                          <span>{project.owner.successRate}% نسبة نجاح</span>
                        </div>
                      </div>
                      <Button variant="outline">متابعة</Button>
                    </div>
                  </Card>

                  {/* Team Members */}
                  {project.team.map((member) => (
                    <Card key={member.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-bg text-white">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{member.name}</h3>
                          <p className="text-gray-600">{member.role}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Packages */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">باقات الدعم</h2>
                  <Badge variant="secondary" className="text-sm">
                    {project.packages.length} باقات
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {project.packages.map((pkg, index) => (
                    <Card
                      key={pkg.id}
                      className={`relative overflow-hidden transition-all duration-300 ${
                        selectedPackage === pkg.id
                          ? "ring-2 ring-primary shadow-xl scale-[1.02]"
                          : "hover:shadow-lg hover:scale-[1.01]"
                      }`}
                    >
                      {/* Popular Badge */}
                      {index === 1 && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary py-1.5 text-center">
                          <span className="text-white text-xs font-bold">⭐ الأكثر شعبية</span>
                        </div>
                      )}
                      
                      <div 
                        className={`p-6 space-y-5 cursor-pointer ${index === 1 ? 'pt-10' : ''}`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        {/* Header */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                            <Badge 
                              variant="outline" 
                              className="bg-green-50 text-green-700 border-green-200 flex-shrink-0"
                            >
                              <Users className="w-3 h-3 ml-1" />
                              {pkg.backersCount} داعم
                            </Badge>
                          </div>
                          
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {pkg.amount.toLocaleString()}
                            </span>
                            <span className="text-lg text-gray-600">ريال</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed">{pkg.description}</p>

                        <Separator className="my-4" />

                        {/* Rewards */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 text-sm">يتضمن:</h4>
                          <ul className="space-y-2.5">
                            {pkg.rewards.map((reward, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                </div>
                                <span className="leading-relaxed">{reward}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator className="my-4" />

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>التسليم المتوقع</span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {new Date(pkg.deliveryDate).toLocaleDateString("ar-SA", {
                                year: "numeric",
                                month: "long"
                              })}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Target className="w-4 h-4" />
                              <span>متبقي</span>
                            </div>
                            <p className="font-semibold text-green-600">
                              {pkg.isAvailable ? "غير محدود" : "نفدت"}
                            </p>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                          className={`w-full h-12 text-base font-semibold transition-all ${
                            selectedPackage === pkg.id
                              ? "gradient-bg btn-hover shadow-lg"
                              : "bg-white border-2 border-primary text-primary hover:gradient-bg hover:text-white hover:border-transparent"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBackProject(pkg.id);
                          }}
                        >
                          {selectedPackage === pkg.id ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 ml-2" />
                              تم اختيار هذه الباقة
                            </>
                          ) : (
                            "اختر هذه الباقة"
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              {project.links && project.links.length > 0 && (
                <Card className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">روابط المشروع</h3>
                  <div className="space-y-2">
                    {project.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        {link.type === "website" && <LinkIcon className="w-4 h-4" />}
                        {link.type === "facebook" && <Facebook className="w-4 h-4" />}
                        {link.type === "twitter" && <Twitter className="w-4 h-4" />}
                        <span>{link.type === "website" ? "الموقع الإلكتروني" : link.type}</span>
                      </a>
                    ))}
                  </div>
                </Card>
              )}

              {/* Report */}
              <Card className="p-6">
                <button className="flex items-center gap-2 text-sm text-red-600 hover:underline">
                  <Flag className="w-4 h-4" />
                  <span>الإبلاغ عن المشروع</span>
                </button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
