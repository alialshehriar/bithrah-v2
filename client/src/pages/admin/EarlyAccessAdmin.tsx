import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Download, Search, Users, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";

export default function EarlyAccessAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: leaderboard, isLoading } = trpc.earlyAccess.getLeaderboard.useQuery();
  
  const filteredUsers = leaderboard?.filter((user: any) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleExportCSV = () => {
    if (!leaderboard || leaderboard.length === 0) {
      toast.error("لا توجد بيانات للتصدير");
      return;
    }
    
    const headers = ["الاسم الكامل", "البريد الإلكتروني", "اسم المستخدم", "رقم الجوال", "كود الإحالة", "عدد الإحالات", "سنوات المكافأة", "المصدر", "تاريخ التسجيل"];
    const rows = leaderboard.map((user: any) => [
      user.fullName,
      user.email,
      user.username,
      user.phone || "-",
      user.referralCode,
      user.referralCount,
      user.bonusYears,
      user.source,
      new Date(user.createdAt).toLocaleDateString("ar-SA"),
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(",")),
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `early-access-users-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    toast.success("تم تصدير البيانات بنجاح!");
  };
  
  const stats = {
    totalUsers: leaderboard?.length || 0,
    totalReferrals: leaderboard?.reduce((sum: number, user: any) => sum + user.referralCount, 0) || 0,
    topReferrer: leaderboard?.[0]?.fullName || "-",
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">لوحة إدارة التسجيل المبكر</h1>
          <p className="text-muted-foreground">إدارة ومتابعة المسجلين في التسجيل المبكر</p>
        </div>
        <Button onClick={handleExportCSV} disabled={!leaderboard || leaderboard.length === 0}>
          <Download className="w-4 h-4 ml-2" />
          تصدير CSV
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المسجلين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">مستخدم مسجل</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإحالات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">إحالة ناجحة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أفضل محيل</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.topReferrer}</div>
            <p className="text-xs text-muted-foreground">
              {leaderboard?.[0]?.referralCount || 0} إحالة
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المسجلين</CardTitle>
          <CardDescription>بحث وعرض جميع المستخدمين المسجلين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو اسم المستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الترتيب</TableHead>
                    <TableHead>الاسم الكامل</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>رقم الجوال</TableHead>
                    <TableHead>كود الإحالة</TableHead>
                    <TableHead>الإحالات</TableHead>
                    <TableHead>المكافأة</TableHead>
                    <TableHead>المصدر</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any, index: number) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {index + 1}
                        {index === 0 && <span className="mr-1">🥇</span>}
                        {index === 1 && <span className="mr-1">🥈</span>}
                        {index === 2 && <span className="mr-1">🥉</span>}
                      </TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell className="font-mono text-sm">{user.email}</TableCell>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {user.referralCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.referralCount > 0 ? "default" : "secondary"}>
                          {user.referralCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.bonusYears > 0 ? (
                          <Badge variant="default" className="bg-green-600">
                            {user.bonusYears} سنة
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.source}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "لا توجد نتائج للبحث" : "لا يوجد مسجلين بعد"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
