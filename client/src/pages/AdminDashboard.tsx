import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch stats
  const { data: stats } = trpc.earlyAccess.getStats.useQuery();
  const { data: leaderboard } = trpc.earlyAccess.getLeaderboard.useQuery();
  const { data: allUsersData } = trpc.earlyAccess.getAllUsers.useQuery({
    page: 1,
    limit: 1000,
    search: searchTerm,
  });

  const allUsers = allUsersData?.users || [];

  // Filter users based on search
  const filteredUsers = allUsers.filter(
    (user: any) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const referralDistribution = [
    { name: '0 إحالات', value: allUsers.filter((u: any) => u.referralCount === 0).length },
    { name: '1-4 إحالات', value: allUsers.filter((u: any) => u.referralCount >= 1 && u.referralCount <= 4).length },
    { name: '5-9 إحالات', value: allUsers.filter((u: any) => u.referralCount >= 5 && u.referralCount <= 9).length },
    { name: '10+ إحالات', value: allUsers.filter((u: any) => u.referralCount >= 10).length },
  ];

  const topReferrers = leaderboard?.slice(0, 10).map((user: any) => ({
    name: user.fullName,
    referrals: user.referralCount,
    bonusYears: user.bonusYears,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة تحكم المشرف</h1>
          <p className="text-gray-600">إدارة ومراقبة التسجيل المبكر</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>إجمالي المسجلين</CardDescription>
              <CardTitle className="text-3xl">{stats?.totalUsers || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">مستخدم مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>إجمالي الإحالات</CardDescription>
              <CardTitle className="text-3xl">{stats?.totalReferrals || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">إحالة ناجحة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>الدفعة الحالية</CardDescription>
              <CardTitle className="text-3xl">1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">دفعة نشطة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>إجمالي السنوات المجانية</CardDescription>
              <CardTitle className="text-3xl">
                {allUsers.reduce((sum: number, u: any) => sum + u.bonusYears, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">سنة مكتسبة</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Referrers Chart */}
          <Card>
            <CardHeader>
              <CardTitle>أفضل 10 مُحيلين</CardTitle>
              <CardDescription>المستخدمون الأكثر إحالة</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topReferrers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="referrals" fill="#667eea" name="الإحالات" />
                  <Bar dataKey="bonusYears" fill="#764ba2" name="السنوات المجانية" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Referral Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع الإحالات</CardTitle>
              <CardDescription>عدد المستخدمين حسب الإحالات</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={referralDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {referralDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>جميع المستخدمين ({allUsers.length})</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <Input
                  placeholder="بحث بالاسم، البريد، أو كود الإحالة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  مسح
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">كود الإحالة</TableHead>
                    <TableHead className="text-right">الإحالات</TableHead>
                    <TableHead className="text-right">السنوات المجانية</TableHead>
                    <TableHead className="text-right">المصدر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {user.referralCode}
                        </code>
                      </TableCell>
                      <TableCell>{user.referralCount}</TableCell>
                      <TableCell>{user.bonusYears}</TableCell>
                      <TableCell className="text-sm text-gray-600">{user.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
