import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Users } from 'lucide-react';
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
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showReferralsDialog, setShowReferralsDialog] = useState(false);
  
  // Check auth first
  const { data: authCheck, isLoading: authLoading } = trpc.admin.checkAuth.useQuery();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authCheck?.isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [authCheck, authLoading, setLocation]);
  
  // Fetch stats only if authenticated
  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: authCheck?.isAuthenticated === true,
  });
  const { data: allUsers } = trpc.admin.getAllUsers.useQuery({ limit: 1000, offset: 0 });
  const { data: evaluationsData } = trpc.admin.getAllEvaluations.useQuery({ limit: 1000, offset: 0 });

  const users = allUsers || [];

  // Filter users based on search
  const filteredUsers = users.filter(
    (user: any) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const referralDistribution = [
    { name: '0 إحالات', value: users.filter((u: any) => u.referralCount === 0).length },
    { name: '1-4 إحالات', value: users.filter((u: any) => u.referralCount >= 1 && u.referralCount <= 4).length },
    { name: '5-9 إحالات', value: users.filter((u: any) => u.referralCount >= 5 && u.referralCount <= 9).length },
    { name: '10+ إحالات', value: users.filter((u: any) => u.referralCount >= 10).length },
  ];

  const topReferrers = users
    .sort((a: any, b: any) => b.referralCount - a.referralCount)
    .slice(0, 10)
    .map((user: any) => ({
      name: user.fullName,
      referrals: user.referralCount,
      bonusYears: user.bonusYears,
    }));

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
                {allUsers?.reduce((sum: number, u: any) => sum + u.bonusYears, 0) || 0}
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
            <BarChart data={topReferrers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="referrals" fill="#667eea" name="عدد الإحالات" />
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
            <CardTitle>جميع المستخدمين ({allUsers?.length || 0})</CardTitle>
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
                    <TableHead className="text-right">اليوزر</TableHead>
                    <TableHead className="text-right">الجوال</TableHead>
                    <TableHead className="text-right">كود الإحالة</TableHead>
                    <TableHead className="text-right">رابط الإحالة</TableHead>
                    <TableHead className="text-right">أُحيل بواسطة</TableHead>
                    <TableHead className="text-right">الإحالات</TableHead>
                    <TableHead className="text-right">السنوات المجانية</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => {
                    const referralLink = `https://bithrahapp.com/early-access?ref=${user.referralCode}`;
                    const referredByUser = user.referredBy 
                      ? allUsers?.find((u: any) => u.referralCode === user.referredBy)
                      : null;
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            @{user.username}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm">{user.phone || '-'}</TableCell>
                        <TableCell>
                          <code className="bg-purple-100 px-2 py-1 rounded text-sm font-bold text-purple-800">
                            {user.referralCode}
                          </code>
                        </TableCell>
                        <TableCell>
                          <a
                            href={referralLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            فتح
                          </a>
                        </TableCell>
                        <TableCell>
                          {referredByUser ? (
                            <div className="text-sm">
                              <div className="font-medium">{referredByUser.fullName}</div>
                              <div className="text-xs text-gray-500">@{referredByUser.username}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.referralCount > 0 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowReferralsDialog(true);
                              }}
                              className="gap-1"
                            >
                              <Users className="w-3 h-3" />
                              {user.referralCount}
                            </Button>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.bonusYears} سنة</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Dialog */}
      <Dialog open={showReferralsDialog} onOpenChange={setShowReferralsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              قائمة المحالين لـ {selectedUser?.fullName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* User Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">كود الإحالة:</span>
                    <code className="bg-purple-100 px-2 py-1 rounded ml-2 font-bold text-purple-800">
                      {selectedUser?.referralCode}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">إجمالي الإحالات:</span>
                    <span className="font-bold ml-2">{selectedUser?.referralCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referred Users List */}
            <div>
              <h3 className="font-semibold mb-3">الأشخاص الذين تم إحالتهم:</h3>
              <div className="space-y-2">
                {(allUsers || [])
                  .filter((u: any) => u.referredBy === selectedUser?.referralCode)
                  .map((referredUser: any) => (
                    <Card key={referredUser.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium">{referredUser.fullName}</div>
                            <div className="text-sm text-gray-600">{referredUser.email}</div>
                            <div className="text-xs text-gray-500">@{referredUser.username}</div>
                          </div>
                          <div className="text-left">
                            <div className="text-xs text-gray-500">تاريخ التسجيل</div>
                            <div className="text-sm font-medium">
                              {new Date(referredUser.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
