import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  Filter,
} from "lucide-react";

export default function Negotiations() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNegotiation, setSelectedNegotiation] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  // TODO: Replace with real data from trpc.negotiations.list.useQuery()
  const negotiations = [
    {
      id: 1,
      projectTitle: "منصة التجارة الإلكترونية",
      projectOwner: "أحمد محمد",
      investorName: "صندوق الاستثمار السعودي",
      status: "active",
      amount: 500000,
      equity: 15,
      createdAt: new Date("2024-01-15"),
      lastMessage: "نحن مهتمون بالاستثمار، هل يمكننا مناقشة التفاصيل؟",
      unreadCount: 3,
    },
    {
      id: 2,
      projectTitle: "تطبيق التوصيل السريع",
      projectOwner: "فاطمة علي",
      investorName: "شركة رأس المال الجريء",
      status: "accepted",
      amount: 1000000,
      equity: 20,
      createdAt: new Date("2024-01-10"),
      lastMessage: "تم قبول العرض، سنبدأ في إجراءات التوقيع",
      unreadCount: 0,
    },
    {
      id: 3,
      projectTitle: "منصة التعليم الإلكتروني",
      projectOwner: "خالد سعد",
      investorName: "مستثمر فردي",
      status: "rejected",
      amount: 250000,
      equity: 10,
      createdAt: new Date("2024-01-05"),
      lastMessage: "نعتذر، لا يتناسب المشروع مع استراتيجيتنا الاستثمارية",
      unreadCount: 0,
    },
    {
      id: 4,
      projectTitle: "تطبيق الصحة واللياقة",
      projectOwner: "سارة أحمد",
      investorName: "صندوق التقنية",
      status: "pending",
      amount: 750000,
      equity: 18,
      createdAt: new Date("2024-01-20"),
      lastMessage: "نحن ندرس العرض، سنرد خلال 48 ساعة",
      unreadCount: 1,
    },
  ];

  const stats = [
    {
      label: "إجمالي التفاوضات",
      value: "24",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "قيد التفاوض",
      value: "8",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "مقبولة",
      value: "12",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "إجمالي الاستثمارات",
      value: "12.5M ريال",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "قيد التفاوض", variant: "default" as const, color: "bg-yellow-100 text-yellow-800" },
      pending: { label: "قيد المراجعة", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
      accepted: { label: "مقبول", variant: "default" as const, color: "bg-green-100 text-green-800" },
      rejected: { label: "مرفوض", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredNegotiations = negotiations.filter((neg) => {
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "active" && neg.status === "active") ||
      (selectedTab === "accepted" && neg.status === "accepted") ||
      (selectedTab === "rejected" && neg.status === "rejected");

    const matchesSearch =
      searchQuery === "" ||
      neg.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      neg.investorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-bg text-white py-12">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                التفاوضات
              </h1>
              <p className="text-lg text-white/90">
                تابع جميع تفاوضاتك مع المستثمرين وأصحاب المشاريع في مكان واحد
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
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Negotiations List */}
        <section className="py-12">
          <div className="container">
            <div className="mb-8">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="ابحث عن تفاوض..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  فلترة
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">الكل ({negotiations.length})</TabsTrigger>
                  <TabsTrigger value="active">
                    قيد التفاوض ({negotiations.filter((n) => n.status === "active").length})
                  </TabsTrigger>
                  <TabsTrigger value="accepted">
                    مقبولة ({negotiations.filter((n) => n.status === "accepted").length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    مرفوضة ({negotiations.filter((n) => n.status === "rejected").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="mt-6">
                  <div className="space-y-4">
                    {filteredNegotiations.length === 0 ? (
                      <Card className="p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">لا توجد تفاوضات</h3>
                        <p className="text-gray-600 mb-6">
                          لم تبدأ أي تفاوضات بعد
                        </p>
                        <Button asChild className="gradient-bg">
                          <Link href="/projects">استكشف المشاريع</Link>
                        </Button>
                      </Card>
                    ) : (
                      filteredNegotiations.map((negotiation) => (
                        <Card key={negotiation.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-bold">{negotiation.projectTitle}</h3>
                                {getStatusBadge(negotiation.status)}
                                {negotiation.unreadCount > 0 && (
                                  <Badge className="bg-red-500 text-white">
                                    {negotiation.unreadCount} جديد
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">صاحب المشروع</p>
                                  <p className="font-medium">{negotiation.projectOwner}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">المستثمر</p>
                                  <p className="font-medium">{negotiation.investorName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">المبلغ المطلوب</p>
                                  <p className="font-medium text-green-600">
                                    {negotiation.amount.toLocaleString()} ريال
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                <MessageSquare className="w-4 h-4" />
                                <span>{negotiation.lastMessage}</span>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(negotiation.createdAt).toLocaleDateString("ar-SA")}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    className="gradient-bg"
                                    onClick={() => setSelectedNegotiation(negotiation)}
                                  >
                                    <MessageSquare className="w-4 h-4 ml-2" />
                                    فتح المحادثة
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl">
                                      {selectedNegotiation?.projectTitle}
                                    </DialogTitle>
                                    <DialogDescription>
                                      محادثة مع {selectedNegotiation?.investorName}
                                    </DialogDescription>
                                  </DialogHeader>

                                  {/* Messages */}
                                  <div className="space-y-4 my-6">
                                    {/* Sample messages - TODO: Replace with real data */}
                                    <div className="flex gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-bg flex items-center justify-center text-white font-bold">
                                        م
                                      </div>
                                      <div className="flex-1">
                                        <div className="bg-gray-100 rounded-lg p-4">
                                          <p className="font-medium mb-1">
                                            {selectedNegotiation?.investorName}
                                          </p>
                                          <p className="text-gray-700">
                                            {selectedNegotiation?.lastMessage}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-2">
                                            منذ ساعتين
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Message Input */}
                                  <div className="flex gap-2">
                                    <Textarea
                                      placeholder="اكتب رسالتك..."
                                      value={messageText}
                                      onChange={(e) => setMessageText(e.target.value)}
                                      rows={3}
                                      className="flex-1"
                                    />
                                    <Button className="gradient-bg">
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {/* Actions */}
                                  {selectedNegotiation?.status === "active" && (
                                    <div className="flex gap-2 mt-4">
                                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                        قبول العرض
                                      </Button>
                                      <Button variant="destructive" className="flex-1">
                                        <XCircle className="w-4 h-4 ml-2" />
                                        رفض العرض
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 ml-2" />
                                التفاصيل
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
