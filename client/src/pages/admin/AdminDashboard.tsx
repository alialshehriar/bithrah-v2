import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FolderKanban,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Eye,
  UserPlus,
  FileText,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Redirect if not admin
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">غير مصرّح</h2>
          <p className="text-gray-600 mb-4">
            ليس لديك صلاحية الوصول إلى لوحة الإدارة
          </p>
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // TODO: Replace with real data from trpc.admin.getStats.useQuery()
  const stats = [
    {
      label: "إجمالي المستخدمين",
      value: "2,450",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "المشاريع النشطة",
      value: "156",
      change: "+8%",
      changeType: "increase",
      icon: FolderKanban,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "الأفكار المقيّمة",
      value: "1,234",
      change: "+23%",
      changeType: "increase",
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "إجمالي الإيرادات",
      value: "125,000 ر.س",
      change: "+15%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickStats = [
    { label: "مستخدمون جدد اليوم", value: "45", icon: UserPlus },
    { label: "مشاريع قيد المراجعة", value: "12", icon: Clock },
    { label: "تقارير جديدة", value: "8", icon: AlertTriangle },
    { label: "معاملات اليوم", value: "34", icon: Activity },
  ];

  // TODO: Replace with real data
  const recentUsers = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmad@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      role: "project_owner",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      name: "خالد سعد",
      email: "khaled@example.com",
      role: "investor",
      status: "pending",
      createdAt: "2024-01-14",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      title: "منصة تعليمية تفاعلية",
      owner: "أحمد محمد",
      status: "pending",
      category: "تعليم",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "تطبيق توصيل طعام",
      owner: "سارة أحمد",
      status: "active",
      category: "خدمات",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      title: "نظام إدارة مخزون",
      owner: "محمد علي",
      status: "rejected",
      category: "تقنية",
      createdAt: "2024-01-13",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", className: "bg-green-100 text-green-800" },
      pending: { label: "قيد المراجعة", className: "bg-yellow-100 text-yellow-800" },
      rejected: { label: "مرفوض", className: "bg-red-100 text-red-800" },
      suspended: { label: "موقوف", className: "bg-gray-100 text-gray-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">لوحة الإدارة</h1>
                <p className="text-sm text-gray-600">منصة بذرة</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض الموقع
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">مرحباً، {user?.name}</h2>
          <p className="text-gray-600">
            إليك نظرة عامة على أداء المنصة اليوم
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge
                  className={
                    stat.changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <stat.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      المستخدمون الجدد
                    </h3>
                    <Link href="/admin/users">
                      <Button variant="ghost" size="sm">
                        عرض الكل
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="divide-y">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{user.role}</span>
                        <span>•</span>
                        <span>{user.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Projects */}
              <Card>
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FolderKanban className="w-5 h-5" />
                      المشاريع الأخيرة
                    </h3>
                    <Link href="/admin/projects">
                      <Button variant="ghost" size="sm">
                        عرض الكل
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="divide-y">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold">{project.title}</p>
                          <p className="text-sm text-gray-600">{project.owner}</p>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{project.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-5 h-5 ml-2" />
                    إدارة المستخدمين
                  </Button>
                </Link>
                <Link href="/admin/projects">
                  <Button variant="outline" className="w-full justify-start">
                    <FolderKanban className="w-5 h-5 ml-2" />
                    مراجعة المشاريع
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-5 h-5 ml-2" />
                    إعدادات الموقع
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">إدارة المستخدمين</h3>
              <p className="text-gray-600 mb-4">
                عرض وإدارة جميع مستخدمي المنصة
              </p>
              <Link href="/admin/users">
                <Button>الانتقال لإدارة المستخدمين</Button>
              </Link>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="p-8 text-center">
              <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">إدارة المشاريع</h3>
              <p className="text-gray-600 mb-4">
                مراجعة وإدارة جميع المشاريع في المنصة
              </p>
              <Link href="/admin/projects">
                <Button>الانتقال لإدارة المشاريع</Button>
              </Link>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">التحليلات المتقدمة</h3>
              <p className="text-gray-600 mb-4">
                عرض تقارير وتحليلات مفصلة عن أداء المنصة
              </p>
              <Link href="/admin/analytics">
                <Button>الانتقال للتحليلات</Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
