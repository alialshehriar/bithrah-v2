import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
  ArrowLeft,
  Shield,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // TODO: Replace with real data from trpc.admin.getUsers.useQuery()
  const users = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmad@example.com",
      role: "user",
      userType: "user",
      status: "active",
      isVerified: true,
      subscriptionTier: "gold",
      createdAt: "2024-01-15",
      lastSignedIn: "2024-01-20",
      projectsCount: 3,
      ideasCount: 5,
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      role: "user",
      userType: "project_owner",
      status: "active",
      isVerified: true,
      subscriptionTier: "platinum",
      createdAt: "2024-01-14",
      lastSignedIn: "2024-01-19",
      projectsCount: 8,
      ideasCount: 12,
    },
    {
      id: 3,
      name: "خالد سعد",
      email: "khaled@example.com",
      role: "user",
      userType: "investor",
      status: "pending",
      isVerified: false,
      subscriptionTier: "free",
      createdAt: "2024-01-14",
      lastSignedIn: "2024-01-18",
      projectsCount: 0,
      ideasCount: 2,
    },
    {
      id: 4,
      name: "سارة أحمد",
      email: "sara@example.com",
      role: "user",
      userType: "marketer",
      status: "active",
      isVerified: true,
      subscriptionTier: "silver",
      createdAt: "2024-01-13",
      lastSignedIn: "2024-01-17",
      projectsCount: 1,
      ideasCount: 3,
    },
  ];

  const stats = [
    { label: "إجمالي المستخدمين", value: users.length.toString() },
    { label: "نشط", value: users.filter((u) => u.status === "active").length.toString() },
    { label: "قيد المراجعة", value: users.filter((u) => u.status === "pending").length.toString() },
    { label: "موقوف", value: "0" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", className: "bg-green-100 text-green-800" },
      pending: { label: "قيد المراجعة", className: "bg-yellow-100 text-yellow-800" },
      suspended: { label: "موقوف", className: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (userType: string) => {
    const roleConfig = {
      user: { label: "مستخدم", className: "bg-gray-100 text-gray-800" },
      project_owner: { label: "صاحب مشروع", className: "bg-blue-100 text-blue-800" },
      investor: { label: "مستثمر", className: "bg-purple-100 text-purple-800" },
      marketer: { label: "مسوّق", className: "bg-orange-100 text-orange-800" },
    };
    const config = roleConfig[userType as keyof typeof roleConfig] || roleConfig.user;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      free: { label: "مجاني", className: "bg-gray-100 text-gray-800" },
      silver: { label: "فضي", className: "bg-gray-300 text-gray-800" },
      gold: { label: "ذهبي", className: "bg-yellow-100 text-yellow-800" },
      platinum: { label: "بلاتيني", className: "bg-purple-100 text-purple-800" },
    };
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.free;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleSuspendUser = (user: any) => {
    // TODO: Implement with trpc.admin.suspendUser.useMutation()
    toast.success(`تم إيقاف المستخدم ${user.name}`);
    setSelectedUser(null);
  };

  const handleActivateUser = (user: any) => {
    // TODO: Implement with trpc.admin.activateUser.useMutation()
    toast.success(`تم تفعيل المستخدم ${user.name}`);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    // TODO: Implement with trpc.admin.deleteUser.useMutation()
    toast.success(`تم حذف المستخدم ${selectedUser?.name}`);
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.userType === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold">إدارة المستخدمين</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="بحث بالاسم أو البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="نوع المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="user">مستخدم</SelectItem>
                <SelectItem value="project_owner">صاحب مشروع</SelectItem>
                <SelectItem value="investor">مستثمر</SelectItem>
                <SelectItem value="marketer">مسوّق</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold">المستخدم</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">النوع</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">الاشتراك</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">النشاط</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{user.name}</p>
                          {user.isVerified && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.userType)}</td>
                    <td className="px-6 py-4">{getTierBadge(user.subscriptionTier)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p>{user.projectsCount} مشروع</p>
                        <p className="text-gray-600">{user.ideasCount} فكرة</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspendUser(user)}
                          >
                            <Ban className="w-4 h-4 text-red-600" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivateUser(user)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد نتائج</p>
            </div>
          )}
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>
              تعديل معلومات المستخدم {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              ستتمكن قريباً من تعديل معلومات المستخدم من هنا
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setShowEditDialog(false)}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المستخدم {selectedUser?.name}؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
