import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Users,
  MousePointerClick,
  Copy,
  CheckCircle,
  Share2,
  Wallet,
  Calendar,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function MarketerDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  // TODO: Replace with real data from trpc.users.getReferrals.useQuery()
  const referralCode = "BITHRAH2024";
  const referralLink = `https://bithrahapp.com/register?ref=${referralCode}`;

  const stats = [
    {
      label: "إجمالي العمولات",
      value: "45,250 ريال",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "النقرات",
      value: "1,234",
      change: "+8.2%",
      icon: MousePointerClick,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "التحويلات",
      value: "89",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "معدل التحويل",
      value: "7.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const commissions = [
    {
      id: 1,
      projectTitle: "منصة التجارة الإلكترونية",
      clientName: "أحمد محمد",
      amount: 5000,
      percentage: 5,
      status: "paid",
      date: new Date("2024-01-15"),
    },
    {
      id: 2,
      projectTitle: "تطبيق التوصيل السريع",
      clientName: "فاطمة علي",
      amount: 10000,
      percentage: 5,
      status: "pending",
      date: new Date("2024-01-20"),
    },
    {
      id: 3,
      projectTitle: "منصة التعليم الإلكتروني",
      clientName: "خالد سعد",
      amount: 2500,
      percentage: 3,
      status: "paid",
      date: new Date("2024-01-10"),
    },
  ];

  const referrals = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      status: "active",
      signupDate: new Date("2024-01-15"),
      totalSpent: 15000,
      commissionEarned: 750,
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      status: "active",
      signupDate: new Date("2024-01-20"),
      totalSpent: 25000,
      commissionEarned: 1250,
    },
    {
      id: 3,
      name: "خالد سعد",
      email: "khaled@example.com",
      status: "pending",
      signupDate: new Date("2024-01-25"),
      totalSpent: 0,
      commissionEarned: 0,
    },
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedCode(true);
    toast.success("تم نسخ رابط الإحالة!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "مدفوع", color: "bg-green-100 text-green-800" },
      pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
      active: { label: "نشط", color: "bg-blue-100 text-blue-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-bg text-white py-12">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                لوحة المسوّق
              </h1>
              <p className="text-lg text-white/90">
                تابع أرباحك وإحالاتك وعمولاتك من التسويق بالعمولة
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-white border-b">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Referral Link Section */}
        <section className="py-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-bg">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">رابط الإحالة الخاص بك</h2>
                  <p className="text-gray-600">شارك هذا الرابط واحصل على عمولة من كل عملية ناجحة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">كود الإحالة</label>
                  <div className="flex gap-2">
                    <Input
                      value={referralCode}
                      readOnly
                      className="flex-1 font-mono text-lg"
                    />
                    <Button onClick={copyReferralLink} className="gap-2">
                      {copiedCode ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          نسخ
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الرابط الكامل</label>
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button onClick={copyReferralLink} className="gap-2">
                      {copiedCode ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          نسخ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  نسب العمولات
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>عمولة أساسية:</strong> على المشاريع العادية</li>
                  <li>• <strong>عمولة بلس:</strong> على المشاريع المميزة</li>
                  <li>• <strong>عمولة المسوّق:</strong> على المشاريع التي تسوق لها</li>
                </ul>
              </div>
            </Card>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12">
          <div className="container">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="commissions">العمولات</TabsTrigger>
                <TabsTrigger value="referrals">الإحالات</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Commissions */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      آخر العمولات
                    </h3>
                    <div className="space-y-4">
                      {commissions.slice(0, 5).map((commission) => (
                        <div
                          key={commission.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{commission.projectTitle}</p>
                            <p className="text-sm text-gray-600">{commission.clientName}</p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-green-600">
                              +{commission.amount.toLocaleString()} ريال
                            </p>
                            <p className="text-xs text-gray-500">
                              عمولة
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Performance Chart Placeholder */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      الأداء الشهري
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">الرسم البياني قريباً</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Commissions Tab */}
              <TabsContent value="commissions">
                <Card>
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">سجل العمولات</h3>
                      <Button className="gradient-bg gap-2">
                        <Wallet className="w-4 h-4" />
                        طلب سحب
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المشروع</TableHead>
                        <TableHead>العميل</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell className="font-medium">
                            {commission.projectTitle}
                          </TableCell>
                          <TableCell>{commission.clientName}</TableCell>
                          <TableCell className="font-bold text-green-600">
                            {commission.amount.toLocaleString()} ريال
                          </TableCell>
                          <TableCell>{getStatusBadge(commission.status)}</TableCell>
                          <TableCell>
                            {new Date(commission.date).toLocaleDateString("ar-SA")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Referrals Tab */}
              <TabsContent value="referrals">
                <Card>
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-bold">الإحالات الناجحة</h3>
                    <p className="text-gray-600">المستخدمون الذين سجلوا عبر رابط الإحالة الخاص بك</p>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ التسجيل</TableHead>
                        <TableHead>إجمالي الإنفاق</TableHead>
                        <TableHead>العمولة المكتسبة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">{referral.name}</TableCell>
                          <TableCell>{referral.email}</TableCell>
                          <TableCell>{getStatusBadge(referral.status)}</TableCell>
                          <TableCell>
                            {new Date(referral.signupDate).toLocaleDateString("ar-SA")}
                          </TableCell>
                          <TableCell>
                            {referral.totalSpent.toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            {referral.commissionEarned.toLocaleString()} ريال
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
