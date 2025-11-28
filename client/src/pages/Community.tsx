import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Lightbulb,
  TrendingUp,
  Users,
  Send,
  Image as ImageIcon,
  Video,
  Smile,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Community() {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, following
  const [showNewPost, setShowNewPost] = useState(false);

  // TODO: Replace with actual API calls
  // const { data: posts, isLoading } = trpc.community.getPosts.useQuery({ type: selectedTab });

  // Mock data
  const posts = [
    {
      id: 1,
      user: {
        id: 1,
        name: "أحمد محمد",
        avatar: null,
        verified: true,
      },
      content: "متحمس جداً لإطلاق منصتنا التعليمية الجديدة! بعد 6 أشهر من العمل المتواصل، أصبحنا جاهزين للإطلاق التجريبي. شكراً لكل من دعمنا في هذه الرحلة 🚀",
      images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"],
      createdAt: "2024-03-21T10:30:00",
      likes: 145,
      comments: 23,
      shares: 12,
      bookmarks: 34,
      isLiked: false,
      isBookmarked: false,
      projectId: 1,
      projectTitle: "منصة تعليمية تفاعلية",
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "سارة أحمد",
        avatar: null,
        verified: false,
      },
      content: "ما هي أفضل الممارسات لتقييم جدوى المشاريع الناشئة؟ أبحث عن نصائح من المستثمرين ذوي الخبرة.",
      images: [],
      createdAt: "2024-03-21T09:15:00",
      likes: 67,
      comments: 18,
      shares: 5,
      bookmarks: 22,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "خالد علي",
        avatar: null,
        verified: false,
      },
      content: "نصيحة لكل رائد أعمال: ابدأ صغيراً، تعلم بسرعة، وتوسع بحكمة. النجاح ليس سباقاً، بل ماراثون 💪",
      images: [],
      createdAt: "2024-03-21T08:00:00",
      likes: 234,
      comments: 45,
      shares: 67,
      bookmarks: 89,
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: 4,
      user: {
        id: 4,
        name: "نورة سعد",
        avatar: null,
        verified: true,
      },
      content: "ورشة عمل مجانية عن التسويق الرقمي للمشاريع الناشئة! سأشارك استراتيجيات عملية ساعدت أكثر من 50 مشروع على النمو. من يهتم؟",
      images: ["https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"],
      createdAt: "2024-03-20T16:45:00",
      likes: 189,
      comments: 56,
      shares: 34,
      bookmarks: 78,
      isLiked: true,
      isBookmarked: true,
    },
  ];

  const trendingTopics = [
    { tag: "ريادة_الأعمال", count: 1234 },
    { tag: "الدعم_الجماعي", count: 892 },
    { tag: "الذكاء_الاصطناعي", count: 756 },
    { tag: "التسويق_الرقمي", count: 645 },
    { tag: "التقنية", count: 534 },
  ];

  const suggestedUsers = [
    {
      id: 5,
      name: "فهد محمد",
      bio: "مستثمر ومستشار للمشاريع الناشئة",
      followers: 2340,
      isFollowing: false,
    },
    {
      id: 6,
      name: "ريم خالد",
      bio: "مطورة ومؤسسة 3 مشاريع ناجحة",
      followers: 1890,
      isFollowing: false,
    },
    {
      id: 7,
      name: "عمر سعيد",
      bio: "خبير في التسويق الرقمي",
      followers: 1567,
      isFollowing: true,
    },
  ];

  const handleLike = (postId: number) => {
    // TODO: Implement like logic
    toast.success("تم الإعجاب بالمنشور");
  };

  const handleBookmark = (postId: number) => {
    // TODO: Implement bookmark logic
    toast.success("تم حفظ المنشور");
  };

  const handleShare = (postId: number) => {
    // TODO: Implement share logic
    toast.success("تم نسخ رابط المنشور");
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("الرجاء كتابة محتوى المنشور");
      return;
    }
    // TODO: Implement create post logic
    toast.success("تم نشر المنشور بنجاح");
    setNewPostContent("");
    setShowNewPost(false);
  };

  const handleFollow = (userId: number) => {
    // TODO: Implement follow logic
    toast.success("تمت المتابعة بنجاح");
  };

  // Removed getRoleBadge - all users are now unified

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "منذ دقائق";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return "منذ يوم";
    return `منذ ${Math.floor(diffInHours / 24)} أيام`;
  };

  // Filter and sort posts
  const getFilteredPosts = (posts: any[], tab: string, sort: string) => {
    let filtered = [...posts];

    // Filter by tab
    if (tab === "projects") {
      filtered = filtered.filter(post => post.projectId);
    } else if (tab === "trending") {
      // Show posts with high engagement
      filtered = filtered.filter(post => post.likes > 100 || post.comments > 20);
    } else if (tab === "following") {
      // TODO: Filter by following (mock for now)
      filtered = filtered.slice(0, 2);
    }

    // Sort
    if (sort === "popular") {
      filtered.sort((a, b) => {
        const aScore = a.likes + a.comments * 2 + a.shares * 3;
        const bScore = b.likes + b.comments * 2 + b.shares * 3;
        return bScore - aScore;
      });
    } else {
      // recent (default)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-bg text-white py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">مجتمع بذرة</h1>
              <p className="text-xl text-white/90">
                تواصل مع رواد الأعمال والمستثمرين، شارك تجاربك، واستفد من خبرات الآخرين
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-8">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Stats - Removed fake numbers */}

              {/* Trending Topics */}
              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  المواضيع الرائجة
                </h3>
                <div className="space-y-2">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic.tag}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors text-right"
                    >
                      <span className="text-sm font-medium text-primary">#{topic.tag}</span>
                      <span className="text-xs text-gray-500">{topic.count}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6 space-y-6">
              {/* New Post Card */}
              <Card className="p-6">
                {!showNewPost ? (
                  <button
                    onClick={() => setShowNewPost(true)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-bg text-white">م</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-500">شارك أفكارك مع المجتمع...</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-bg text-white">م</AvatarFallback>
                      </Avatar>
                      <Textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="ماذا تريد أن تشارك؟"
                        className="min-h-[120px] resize-none"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ImageIcon className="w-4 h-4 ml-1" />
                          صورة
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4 ml-1" />
                          فيديو
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="w-4 h-4 ml-1" />
                          إيموجي
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => setShowNewPost(false)}>
                          إلغاء
                        </Button>
                        <Button className="gradient-bg" onClick={handleCreatePost}>
                          <Send className="w-4 h-4 ml-1" />
                          نشر
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Filter Tabs & Sort */}
              <Card className="p-4 space-y-4">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 h-11">
                    <TabsTrigger value="all" className="text-sm">
                      <TrendingUp className="w-4 h-4 ml-1" />
                      الكل
                    </TabsTrigger>
                    <TabsTrigger value="following" className="text-sm">
                      <Users className="w-4 h-4 ml-1" />
                      المتابَعون
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="text-sm">
                      <Lightbulb className="w-4 h-4 ml-1" />
                      الرائج
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="text-sm">
                      <Bookmark className="w-4 h-4 ml-1" />
                      المشاريع
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Sort Options */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">ترتيب حسب:</span>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === "recent" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("recent")}
                      className={sortBy === "recent" ? "gradient-bg" : ""}
                    >
                      الأحدث
                    </Button>
                    <Button
                      variant={sortBy === "popular" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("popular")}
                      className={sortBy === "popular" ? "gradient-bg" : ""}
                    >
                      الأكثر تفاعلاً
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-6">
                {getFilteredPosts(posts, selectedTab, sortBy).length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">لا توجد منشورات</h3>
                      <p className="text-gray-600">جرب تغيير الفلتر أو كن أول من ينشر!</p>
                    </div>
                  </Card>
                ) : (
                  getFilteredPosts(posts, selectedTab, sortBy).map((post) => {
                  return (
                    <Card key={post.id} className="p-6 space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.user.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-bg text-white">
                              {post.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link href={`/profile/${post.user.id}`}>
                                <span className="font-bold hover:text-primary transition-colors cursor-pointer">
                                  {post.user.name}
                                </span>
                              </Link>
                              {post.user.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  ✓ موثق
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>حفظ المنشور</DropdownMenuItem>
                            <DropdownMenuItem>نسخ الرابط</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              الإبلاغ عن المنشور
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {/* Post Images */}
                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                          {post.images.map((image: string, index: number) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                            >
                              <img
                                src={image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Project Link */}
                      {post.projectId && post.projectTitle && (
                        <Link href={`/projects/${post.projectId}`}>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              {post.projectTitle}
                            </span>
                          </div>
                        </Link>
                      )}

                      {/* Post Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 pt-2">
                        <span>{post.likes} إعجاب</span>
                        <span>{post.comments} تعليق</span>
                        <span>{post.shares} مشاركة</span>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="ghost"
                          className={`flex-1 ${post.isLiked ? "text-red-600" : ""}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart
                            className={`w-5 h-5 ml-1 ${post.isLiked ? "fill-current" : ""}`}
                          />
                          إعجاب
                        </Button>
                        <Button variant="ghost" className="flex-1">
                          <MessageCircle className="w-5 h-5 ml-1" />
                          تعليق
                        </Button>
                        <Button variant="ghost" className="flex-1" onClick={() => handleShare(post.id)}>
                          <Share2 className="w-5 h-5 ml-1" />
                          مشاركة
                        </Button>
                        <Button
                          variant="ghost"
                          className={post.isBookmarked ? "text-primary" : ""}
                          onClick={() => handleBookmark(post.id)}
                        >
                          <Bookmark
                            className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`}
                          />
                        </Button>
                      </div>
                    </Card>
                  );
                })
                )}
              </div>

              {/* Load More */}
              <div className="flex justify-center">
                <Button variant="outline" size="lg">
                  تحميل المزيد
                </Button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Suggested Users */}
              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  اقتراحات المتابعة
                </h3>
                <div className="space-y-4">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-bg text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.bio}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.followers.toLocaleString()} متابع
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={user.isFollowing ? "outline" : "default"}
                        className={user.isFollowing ? "" : "gradient-bg"}
                        onClick={() => handleFollow(user.id)}
                      >
                        {user.isFollowing ? "متابَع" : "متابعة"}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  عرض المزيد
                </Button>
              </Card>

              {/* Community Guidelines */}
              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-lg">إرشادات المجتمع</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>كن محترماً ومهذباً مع الجميع</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>شارك محتوى ذو قيمة وفائدة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>لا تنشر محتوى مسيء أو مخالف</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>احترم خصوصية الآخرين</span>
                  </li>
                </ul>
                <Button variant="link" className="p-0 h-auto text-primary">
                  اقرأ المزيد
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
