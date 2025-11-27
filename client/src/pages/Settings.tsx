import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Settings() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    communityActivity: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showProjects: true,
    showActivity: true,
  });

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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save profile API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات الإشعارات");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات الخصوصية");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
            <p className="text-gray-600">إدارة حسابك وتفضيلاتك</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 ml-2" />
                الملف الشخصي
              </TabsTrigger>
              <TabsTrigger value="account">
                <Lock className="w-4 h-4 ml-2" />
                الحساب
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 ml-2" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="w-4 h-4 ml-2" />
                الخصوصية
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                  <CardDescription>
                    قم بتحديث معلومات ملفك الشخصي
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-gradient-bg text-white text-2xl">
                        {user.name?.charAt(0) || "م"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 ml-2" />
                        تحميل صورة
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف الصورة
                      </Button>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">اسم المستخدم</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      placeholder="username"
                      dir="ltr"
                    />
                    <p className="text-xs text-gray-500">
                      سيظهر في رابط ملفك الشخصي: bithrahapp.com/@{profileData.username || "username"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة عنك</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="اكتب نبذة مختصرة عنك..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">
                      {profileData.bio.length}/500 حرف
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="المدينة، الدولة"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">الموقع الإلكتروني</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      placeholder="https://example.com"
                      dir="ltr"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+966 50 000 0000"
                      dir="ltr"
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gradient-bg">
                    <Save className="w-4 h-4 ml-2" />
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تغيير كلمة المرور</CardTitle>
                  <CardDescription>
                    تأكد من استخدام كلمة مرور قوية وفريدة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="gradient-bg">
                    <Lock className="w-4 h-4 ml-2" />
                    تحديث كلمة المرور
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>نوع الحساب</CardTitle>
                  <CardDescription>
                    اختر نوع حسابك في المنصة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-type">نوع الحساب</Label>
                    <Select defaultValue="user">
                      <SelectTrigger id="account-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">مستخدم عادي</SelectItem>
                        <SelectItem value="project_owner">صاحب مشروع</SelectItem>
                        <SelectItem value="investor">مستثمر</SelectItem>
                        <SelectItem value="marketer">مسوّق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="gradient-bg">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">منطقة الخطر</CardTitle>
                  <CardDescription>
                    إجراءات لا يمكن التراجع عنها
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">حذف الحساب</h4>
                      <p className="text-sm text-gray-600">
                        حذف حسابك وجميع بياناتك بشكل نهائي
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف الحساب
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>
                    اختر الإشعارات التي تريد استلامها
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-gray-500">
                        استلام إشعارات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تحديثات المشاريع</Label>
                      <p className="text-sm text-gray-500">
                        إشعارات عن المشاريع التي تتابعها
                      </p>
                    </div>
                    <Switch
                      checked={notifications.projectUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, projectUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>نشاط المجتمع</Label>
                      <p className="text-sm text-gray-500">
                        إشعارات عن التعليقات والإعجابات
                      </p>
                    </div>
                    <Switch
                      checked={notifications.communityActivity}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, communityActivity: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>رسائل تسويقية</Label>
                      <p className="text-sm text-gray-500">
                        عروض وأخبار المنصة
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, marketingEmails: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>ملخص أسبوعي</Label>
                      <p className="text-sm text-gray-500">
                        ملخص أسبوعي بأهم الأحداث
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyDigest: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={isSaving} className="gradient-bg">
                    <Save className="w-4 h-4 ml-2" />
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الخصوصية</CardTitle>
                  <CardDescription>
                    تحكم في من يمكنه رؤية معلوماتك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">ظهور الملف الشخصي</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) =>
                        setPrivacy({ ...privacy, profileVisibility: value })
                      }
                    >
                      <SelectTrigger id="profile-visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">عام - يمكن للجميع رؤيته</SelectItem>
                        <SelectItem value="members">الأعضاء فقط</SelectItem>
                        <SelectItem value="private">خاص - أنا فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إظهار البريد الإلكتروني</Label>
                      <p className="text-sm text-gray-500">
                        السماح للآخرين برؤية بريدك الإلكتروني
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showEmail: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إظهار المشاريع</Label>
                      <p className="text-sm text-gray-500">
                        عرض مشاريعك في ملفك الشخصي
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showProjects}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showProjects: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إظهار النشاط</Label>
                      <p className="text-sm text-gray-500">
                        عرض نشاطك الأخير في ملفك الشخصي
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showActivity}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showActivity: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSavePrivacy} disabled={isSaving} className="gradient-bg">
                    <Save className="w-4 h-4 ml-2" />
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
