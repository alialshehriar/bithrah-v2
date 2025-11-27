import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Wallet() {
  const [selectedTab, setSelectedTab] = useState("all");

  // Mock data - replace with actual API
  const walletData = {
    totalBalance: 12500,
    referralBalance: 4200,
    commissionBalance: 8300,
    pendingBalance: 2100,
    totalEarnings: 45600,
    totalWithdrawals: 33100,
  };

  const transactions = [
    {
      id: 1,
      type: "commission",
      amount: 1500,
      status: "completed",
      description: "عمولة من دعم مشروع 'منصة تعليمية'",
      date: "2024-03-21T10:30:00",
      projectTitle: "منصة تعليمية تفاعلية",
    },
    {
      id: 2,
      type: "referral",
      amount: 500,
      status: "completed",
      description: "مكافأة إحالة مستخدم جديد",
      date: "2024-03-20T14:20:00",
      referredUser: "أحمد محمد",
    },
    {
      id: 3,
      type: "withdrawal",
      amount: -5000,
      status: "completed",
      description: "سحب إلى الحساب البنكي",
      date: "2024-03-19T09:15:00",
      bankAccount: "SA** **** **** 1234",
    },
    {
      id: 4,
      type: "commission",
      amount: 2300,
      status: "pending",
      description: "عمولة من تفاوض ناجح",
      date: "2024-03-18T16:45:00",
      negotiationTitle: "تفاوض مع مستثمر",
    },
    {
      id: 5,
      type: "referral",
      amount: 700,
      status: "completed",
      description: "مكافأة إحالة مستخدم جديد",
      date: "2024-03-17T11:30:00",
      referredUser: "سارة أحمد",
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "commission":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "referral":
        return <Share2 className="w-5 h-5 text-blue-600" />;
      case "withdrawal":
        return <ArrowDownLeft className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 ml-1" />
            مكتمل
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 ml-1" />
            قيد المعالجة
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 ml-1" />
            فشل
          </Badge>
        );
      default:
        return null;
    }
  };

  const getFilteredTransactions = (tab: string) => {
    if (tab === "all") return transactions;
    return transactions.filter((t) => t.type === tab);
  };

  const handleWithdraw = () => {
    toast.success("تم إرسال طلب السحب بنجاح");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-bg text-white py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <WalletIcon className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">محفظتي</h1>
              </div>
              <p className="text-xl text-white/90">
                تتبع أرباحك من الإحالات والعمولات واسحب أموالك بسهولة
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Total Balance */}
              <Card className="p-6 space-y-4 bg-gradient-to-br from-primary to-secondary text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/90">الرصيد الكلي</h3>
                  <WalletIcon className="w-5 h-5 text-white/80" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{walletData.totalBalance.toLocaleString()}</p>
                  <p className="text-sm text-white/80">ريال سعودي</p>
                </div>
                <Button
                  className="w-full bg-white text-primary hover:bg-white/90"
                  onClick={handleWithdraw}
                >
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                  سحب الأموال
                </Button>
              </Card>

              {/* Referral Balance */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">رصيد الإحالات</h3>
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {walletData.referralBalance.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">ريال سعودي</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+15% عن الشهر الماضي</span>
                </div>
              </Card>

              {/* Commission Balance */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">رصيد العمولات</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {walletData.commissionBalance.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">ريال سعودي</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+22% عن الشهر الماضي</span>
                </div>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الأرباح</p>
                    <p className="text-xl font-bold text-gray-900">
                      {walletData.totalEarnings.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">إجمالي السحوبات</p>
                    <p className="text-xl font-bold text-gray-900">
                      {walletData.totalWithdrawals.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">قيد المعالجة</p>
                    <p className="text-xl font-bold text-gray-900">
                      {walletData.pendingBalance.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Transactions */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">سجل المعاملات</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 ml-2" />
                    تصفية
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="commission">العمولات</TabsTrigger>
                  <TabsTrigger value="referral">الإحالات</TabsTrigger>
                  <TabsTrigger value="withdrawal">السحوبات</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Transactions List */}
              <div className="space-y-4">
                {getFilteredTransactions(selectedTab).map((transaction) => (
                  <Card key={transaction.id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {transaction.description}
                              </p>
                              {transaction.projectTitle && (
                                <p className="text-sm text-gray-600 mt-1">
                                  المشروع: {transaction.projectTitle}
                                </p>
                              )}
                              {transaction.referredUser && (
                                <p className="text-sm text-gray-600 mt-1">
                                  المستخدم: {transaction.referredUser}
                                </p>
                              )}
                              {transaction.bankAccount && (
                                <p className="text-sm text-gray-600 mt-1">
                                  الحساب: {transaction.bankAccount}
                                </p>
                              )}
                            </div>
                            <div className="text-left flex-shrink-0">
                              <p
                                className={`text-xl font-bold ${
                                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount.toLocaleString()} ر.س
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {formatDate(transaction.date)}
                            </div>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
