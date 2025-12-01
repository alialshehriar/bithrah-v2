import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Settings,
  FileText,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  LogOut,
  Loader2,
} from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Check authentication
  const { data: authData, isLoading: authLoading } = trpc.admin.checkAuth.useQuery();
  
  useEffect(() => {
    if (!authLoading && !authData?.isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [authData, authLoading, setLocation]);
  
  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!authData?.isAuthenticated) {
    return null;
  }

  // Mock data - Replace with real data from tRPC
  const stats = {
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  };

  const recentUsers: any[] = [];
  const recentProjects: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
              <p className="text-sm text-gray-600 mt-1">إدارة ومراقبة المنصة</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 ml-2" />
                الإشعارات
              </Button>
              <Button variant="outline" size="sm" onClick={() => setLocation('/admin/login')}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "نظرة عامة", icon: BarChart3 },
            { id: "users", label: "المستخدمين", icon: Users },
            { id: "projects", label: "المشاريع", icon: FileText },
            { id: "early-access", label: "التسجيل المبكر", icon: UserPlus },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "outline"}
              onClick={() => {
                if (tab.id === "early-access") {
                  setLocation("/admin/early-access");
                } else {
                  setSelectedTab(tab.id);
                }
              }}
              className="whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4 ml-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</h3>
                    <p className="text-sm text-green-600 mt-2">مستخدم مسجل</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المشاريع النشطة</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProjects}</h3>
                    <p className="text-sm text-blue-600 mt-2">مشروع نشط</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRevenue}</h3>
                    <p className="text-sm text-green-600 mt-2">ريال سعودي</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">بانتظار الموافقة</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApprovals}</h3>
                    <p className="text-sm text-orange-600 mt-2">مشروع قيد المراجعة</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-full">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">المستخدمون الجدد</h3>
                  <Button variant="outline" size="sm">
                    عرض الكل
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentUsers.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">لا يوجد مستخدمون جدد</p>
                  ) : (
                    recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Recent Projects */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">المشاريع الأخيرة</h3>
                  <Button variant="outline" size="sm">
                    عرض الكل
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentProjects.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">لا توجد مشاريع جديدة</p>
                  ) : (
                    recentProjects.map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{project.title}</p>
                            <p className="text-sm text-gray-600">{project.category}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === "users" && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">إدارة المستخدمين</h3>
            <p className="text-gray-600">قريباً...</p>
          </Card>
        )}

        {/* Projects Tab */}
        {selectedTab === "projects" && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">إدارة المشاريع</h3>
            <p className="text-gray-600">قريباً...</p>
          </Card>
        )}
      </main>
    </div>
  );
}
