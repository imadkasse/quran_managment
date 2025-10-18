"use client";
import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Eye,
  RefreshCw,
  X,
  Calendar,
  DollarSign,
  FileText,
  User,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type Subscription = {
  id: string;
  student_id: string;
  created_by: string;
  status: string;
  amount: number;
  start_date: string;
  end_date: string;
  note: string | null;
  created_at: string;
};

type Student = {
  id: string;
  name: string;
};

// Dummy data
const dummyStudents: Student[] = [
  { id: "std-1", name: "Ahmed Hassan" },
  { id: "std-2", name: "Fatima Ali" },
  { id: "std-3", name: "Mohamed Ibrahim" },
  { id: "std-4", name: "Aisha Omar" },
  { id: "std-5", name: "Youssef Mahmoud" },
  { id: "std-6", name: "Mariam Khalil" },
];

const dummySubscriptions: Subscription[] = [
  {
    id: "sub-1",
    student_id: "std-1",
    created_by: "teacher-1",
    status: "ACTIVE",
    amount: 5000,
    start_date: "2025-01-01",
    end_date: "2025-06-30",
    note: "Full semester subscription",
    created_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "sub-2",
    student_id: "std-2",
    created_by: "teacher-1",
    status: "ACTIVE",
    amount: 5000,
    start_date: "2025-02-01",
    end_date: "2025-07-31",
    note: null,
    created_at: "2025-02-01T10:00:00Z",
  },
  {
    id: "sub-3",
    student_id: "std-3",
    created_by: "teacher-1",
    status: "EXPIRED",
    amount: 4500,
    start_date: "2024-09-01",
    end_date: "2024-12-31",
    note: "Previous semester",
    created_at: "2024-09-01T10:00:00Z",
  },
  {
    id: "sub-4",
    student_id: "std-4",
    created_by: "teacher-1",
    status: "PENDING",
    amount: 5500,
    start_date: "2025-03-01",
    end_date: "2025-08-31",
    note: "Waiting for payment confirmation",
    created_at: "2025-02-28T10:00:00Z",
  },
  {
    id: "sub-5",
    student_id: "std-5",
    created_by: "teacher-1",
    status: "ACTIVE",
    amount: 5000,
    start_date: "2025-01-15",
    end_date: "2025-07-15",
    note: null,
    created_at: "2025-01-15T10:00:00Z",
  },
];

export default function TeacherSubscriptions() {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(dummySubscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewSubscription, setViewSubscription] = useState<Subscription | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    student_id: "",
    status: "ACTIVE",
    amount: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    note: "",
  });

  // Get student name by ID
  const getStudentName = (studentId: string) => {
    return (
      dummyStudents.find((s) => s.id === studentId)?.name || "Unknown Student"
    );
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === "ACTIVE").length;
    const expired = subscriptions.filter((s) => s.status === "EXPIRED").length;
    const pending = subscriptions.filter((s) => s.status === "PENDING").length;
    const totalRevenue = subscriptions
      .filter((s) => s.status === "ACTIVE")
      .reduce((sum, s) => sum + s.amount, 0);

    return { active, expired, pending, totalRevenue };
  }, [subscriptions]);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const studentName = getStudentName(sub.student_id).toLowerCase();
      const matchesSearch = studentName.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, statusFilter]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      student_id: formData.student_id,
      created_by: "teacher-1",
      status: formData.status,
      amount: parseFloat(formData.amount),
      start_date: formData.start_date,
      end_date: formData.end_date,
      note: formData.note || null,
      created_at: new Date().toISOString(),
    };

    setSubscriptions([newSubscription, ...subscriptions]);
    setIsDialogOpen(false);

    // Reset form
    setFormData({
      student_id: "",
      status: "ACTIVE",
      amount: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      note: "",
    });
  };

  // Handle renew
  const handleRenew = (sub: Subscription) => {
    const endDate = new Date(sub.end_date);
    const newStartDate = new Date(endDate);
    newStartDate.setDate(newStartDate.getDate() + 1);
    const newEndDate = new Date(newStartDate);
    newEndDate.setMonth(newEndDate.getMonth() + 6);

    setFormData({
      student_id: sub.student_id,
      status: "ACTIVE",
      amount: sub.amount.toString(),
      start_date: newStartDate.toISOString().split("T")[0],
      end_date: newEndDate.toISOString().split("T")[0],
      note: "Renewal",
    });
    setIsDialogOpen(true);
  };

  // Handle cancel
  const handleCancel = (id: string) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: "EXPIRED" } : sub
      )
    );
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string }> = {
      ACTIVE: { className: "bg-primary/10 text-primary hover:bg-primary/20" },
      EXPIRED: {
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      PENDING: {
        className:
          "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
      },
    };

    return (
      <Badge variant="outline" className={variants[status]?.className || ""}>
        {status}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(amount);
  };

  return (
    <div className=" bg-background p-4 md:p-8">
      <div className="w-full space-y-8">
        {/* Header - الرأس */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">الاشتراكات</h1>
              <p className="text-sm text-muted-foreground">
                إدارة اشتراكات الطلاب
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                اشتراك جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء اشتراك جديد</DialogTitle>
                <DialogDescription>إضافة اشتراك جديد لطالب</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">الطالب</Label>
                  <Select
                    value={formData.student_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, student_id: value })
                    }
                    required
                  >
                    <SelectTrigger id="student">
                      <SelectValue placeholder="اختر طالباً" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">نشط</SelectItem>
                      <SelectItem value="PENDING">معلَّق</SelectItem>
                      <SelectItem value="EXPIRED">منتهي الصلاحية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ (د.ج)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="5000"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">تاريخ البدء</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">تاريخ الانتهاء</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">ملاحظة (اختياري)</Label>
                  <Textarea
                    id="note"
                    placeholder="أضف أي ملاحظات إضافية..."
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">إنشاء الاشتراك</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards - بطاقات الملخص */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الاشتراكات النشطة
              </CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">نشطة حالياً</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                منتهية الصلاحية
              </CardTitle>
              <X className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expired}</div>
              <p className="text-xs text-muted-foreground">تحتاج إلى تجديد</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معلَّقة</CardTitle>
              <Calendar className="h-4 w-4 text-secondary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">في انتظار التأكيد</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الإيرادات
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                من الاشتراكات النشطة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters - الفلاتر */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الاشتراكات</CardTitle>
            <CardDescription>عرض وإدارة جميع اشتراكات الطلاب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث باسم الطالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع الحالات</SelectItem>
                  <SelectItem value="ACTIVE">نشط</SelectItem>
                  <SelectItem value="EXPIRED">منتهي الصلاحية</SelectItem>
                  <SelectItem value="PENDING">معلَّق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Table - جدول سطح المكتب */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      الطالب
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      الحالة
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      المبلغ
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      تاريخ البدء
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      تاريخ الانتهاء
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {getStudentName(sub.student_id)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(sub.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(sub.start_date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(sub.end_date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewSubscription(sub)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {sub.status !== "ACTIVE" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRenew(sub)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          {sub.status === "ACTIVE" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancel(sub.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSubscriptions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  لم يتم العثور على اشتراكات
                </div>
              )}
            </div>

            {/* Mobile Cards - بطاقات الجوال */}
            <div className="md:hidden space-y-4">
              {filteredSubscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {getStudentName(sub.student_id)}
                        </span>
                      </div>
                      {getStatusBadge(sub.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">المبلغ:</span>
                        <p className="font-medium">
                          {formatCurrency(sub.amount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">البدء:</span>
                        <p className="font-medium">
                          {formatDate(sub.start_date)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">الانتهاء:</span>
                        <p className="font-medium">
                          {formatDate(sub.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setViewSubscription(sub)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        عرض
                      </Button>
                      {sub.status !== "ACTIVE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRenew(sub)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          تجديد
                        </Button>
                      )}
                      {sub.status === "ACTIVE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleCancel(sub.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          إلغاء
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredSubscriptions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  لم يتم العثور على اشتراكات
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Dialog - نافذة العرض المنبثقة */}
        <Dialog
          open={!!viewSubscription}
          onOpenChange={() => setViewSubscription(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تفاصيل الاشتراك</DialogTitle>
              <DialogDescription>
                عرض معلومات الاشتراك الكاملة
              </DialogDescription>
            </DialogHeader>

            {viewSubscription && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">الطالب</Label>
                    <p className="font-medium">
                      {getStudentName(viewSubscription.student_id)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">الحالة</Label>
                    <div className="mt-1">
                      {getStatusBadge(viewSubscription.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">المبلغ</Label>
                  <p className="font-medium text-lg">
                    {formatCurrency(viewSubscription.amount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">تاريخ البدء</Label>
                    <p className="font-medium">
                      {formatDate(viewSubscription.start_date)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      تاريخ الانتهاء
                    </Label>
                    <p className="font-medium">
                      {formatDate(viewSubscription.end_date)}
                    </p>
                  </div>
                </div>

                {viewSubscription.note && (
                  <div>
                    <Label className="text-muted-foreground">ملاحظة</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                      {viewSubscription.note}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">تاريخ الإنشاء</Label>
                  <p className="text-sm">
                    {new Date(viewSubscription.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewSubscription(null)}
              >
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
