import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { AlertCircle, CheckCircle2, Clock, Users, FileText, Settings, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EnhancedAdminDashboard() {
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  // Fetch data
  const { data: stats, refetch: refetchStats } = trpc.admin.getStats.useQuery();
  const { data: users } = trpc.admin.getAllUsers.useQuery({ limit: 100, offset: 0 });
  const { data: evaluations } = trpc.admin.getAllEvaluations.useQuery({ limit: 100, offset: 0 });
  const { data: maintenanceMode } = trpc.admin.getMaintenanceMode.useQuery();
  
  // Mutations
  const setMaintenanceModeMutation = trpc.admin.setMaintenanceMode.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setMaintenanceEnabled(data.enabled);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleMaintenanceToggle = (enabled: boolean) => {
    setMaintenanceModeMutation.mutate({ enabled });
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'مكتمل', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
      processing: { label: 'جاري المعالجة', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      pending: { label: 'قيد الانتظار', variant: 'outline' as const, icon: AlertCircle, color: 'text-yellow-600' },
      failed: { label: 'فشل', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم المتقدمة</h1>
            <p className="text-gray-600">إدارة شاملة للموقع والمستخدمين</p>
          </div>
          
          {/* Maintenance Mode Toggle */}
          <Card className="w-auto">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">وضع الصيانة</span>
                  <span className="text-xs text-gray-500">
                    {maintenanceMode?.enabled ? 'الموقع مغلق حالياً' : 'الموقع مفتوح'}
                  </span>
                </div>
                <Switch
                  checked={maintenanceMode?.enabled || maintenanceEnabled}
                  onCheckedChange={handleMaintenanceToggle}
                  disabled={setMaintenanceModeMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                إجمالي المسجلين
              </CardDescription>
              <CardTitle className="text-3xl">{stats?.totalUsers || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">مستخدم مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                إجمالي التقييمات
              </CardDescription>
              <CardTitle className="text-3xl">{stats?.totalEvaluations || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">تقييم مُرسل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                تقييمات مكتملة
              </CardDescription>
              <CardTitle className="text-3xl">{stats?.completedEvaluations || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">تقييم مكتمل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                إجمالي الإحالات
              </CardDescription>
              <CardTitle className="text-3xl">{stats?.totalReferrals || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">إحالة ناجحة</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">المستخدمون ({users?.length || 0})</TabsTrigger>
            <TabsTrigger value="evaluations">التقييمات ({evaluations?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>جميع المستخدمين المسجلين</CardTitle>
                <CardDescription>قائمة كاملة بالمستخدمين الذين سجلوا في التسجيل المبكر</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم الكامل</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">رقم الجوال</TableHead>
                      <TableHead className="text-right">الدفعة</TableHead>
                      <TableHead className="text-right">الإحالات</TableHead>
                      <TableHead className="text-right">السنوات المجانية</TableHead>
                      <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.fullName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.batch}</Badge>
                          </TableCell>
                          <TableCell>{user.referralCount}</TableCell>
                          <TableCell>{user.bonusYears}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                          لا توجد مستخدمين مسجلين بعد
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluations Tab */}
          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>جميع التقييمات</CardTitle>
                <CardDescription>قائمة كاملة بتقييمات الأفكار من الذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الفكرة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التقييم</TableHead>
                      <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right">تاريخ التحديث</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations && evaluations.length > 0 ? (
                      evaluations.map((evaluation: any) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="max-w-md">
                            <div className="truncate font-medium">{evaluation.description}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(evaluation.evaluationStatus)}</TableCell>
                          <TableCell>
                            {evaluation.evaluation ? (
                              <div className="max-w-xs truncate text-sm text-gray-600">
                                {evaluation.evaluation.substring(0, 100)}...
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">لم يتم التقييم بعد</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(evaluation.createdAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(evaluation.updatedAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          لا توجد تقييمات بعد
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
