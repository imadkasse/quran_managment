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
  Check,
  Clock,
  RotateCcw,
  Loader2,
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
import { Database } from "@/types/supabase.types";
import { Student } from "@/types/types";
import showToast from "@/utils/showToast";
import { insertSubscription, renewSupscription } from "@/services/teacher";

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

type SubscriptionStatus =
  Database["public"]["Tables"]["subscriptions"]["Row"]["status"];
type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
interface Props {
  studentsFetcher: Student[];
  subscriptionsFetcher: Subscription[];
}
const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // just for testing

export default function TeacherSubscriptions({
  studentsFetcher,
  subscriptionsFetcher,
}: Props) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(subscriptionsFetcher);
  const [students, setStudents] = useState<Student[]>(studentsFetcher);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewSubscription, setViewSubscription] = useState<Subscription | null>(
    null
  );
  // loadings
  const [isLoadingCreating, setIsLoadingCreating] = useState<boolean>(false);
  const [isLoadingRenew, setIsLoadingRenew] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<SubscriptionInsert>();

  // Get student name by ID
  const getStudentName = (studentId: string) => {
    return (
      students.find((s) => s.id === studentId)?.full_name || "Unknown Student"
    );
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const PAID = subscriptions.filter((s) => s.status === "PAID").length;
    const expired = subscriptions.filter((s) => s.status === "EXPIRED").length;
    const pending = subscriptions.filter((s) => s.status === "PENDING").length;
    const totalRevenue = subscriptions
      .filter((s) => s.status === "PAID")
      .reduce((sum, s) => sum + s.amount, 0);

    return { PAID, expired, pending, totalRevenue };
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
  const handleSubmit = async () => {
    setIsLoadingCreating(true);

    try {
      console.log("formData :", formData);
      const newSubs = await insertSubscription(formData as SubscriptionInsert);
      setSubscriptions([...subscriptions, newSubs as Subscription]);
      showToast("success", "تم إنشاء الإشتراك بنجاح");
      // Reset form
      setFormData({
        student_id: "",
        status: "",
        amount: 0,
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        note: "",
        created_by: "",
      });
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error");
    } finally {
      setIsLoadingCreating(false);
    }
  };

  // Handle renew
  const handleRenew = async (sub: Subscription) => {
    setIsLoadingRenew(true);
    try {
      const isRenew = await renewSupscription(sub.id);
      if (!isRenew.status) {
        showToast("error", isRenew.msg || "حدث خطأ أثناء تجديد الاشتراك");
        return;
      }
      showToast("success", isRenew.msg);
      console.log(isRenew.subscription);
      setSubscriptions(
        subscriptions.map(
          (s) => (s.id === sub.id ? isRenew.subscription : s) as Subscription
        )
      );
    } catch (error) {
      const err = error as Error;
      console.log(error);
      showToast("error", err.message || "حدث خطأ أثناء تجديد الاشتراك");
    } finally {
      setIsLoadingRenew(false);
    }
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
      PAID: { className: "bg-primary/10 text-primary hover:bg-primary/20" },
      EXPIRED: {
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      PENDING: {
        className:
          "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
      },
    };

    return (
      <Badge className={variants[`${status}`].className}>
        {status === "PAID"
          ? "نشط"
          : status === "PENDING"
          ? "قيد الإنتظار"
          : "منتهي"}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-US", {
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
        <Card className="shadow-xl border-2">
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex  flex-1 items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    الاشتراكات
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    إدارة اشتراكات الطلاب
                  </p>
                </div>
                <div className="flex-1  flex justify-end group">
                  <Button variant="outline">
                    <>
                      <RotateCcw className="h-4 w-4 mr-2 group-hover:-rotate-360 transition duration-500" />
                      تهيئة الإشتراك الشهري
                    </>
                  </Button>
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
                    <DialogDescription>
                      إضافة اشتراك جديد لطالب
                    </DialogDescription>
                  </DialogHeader>

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student">الطالب</Label>
                      <Select
                        value={formData?.student_id}
                        onValueChange={(value) =>
                          setFormData({
                            ...(formData as SubscriptionInsert),
                            student_id: value as string,
                            created_by: teacher_id,
                          })
                        }
                        required
                      >
                        <SelectTrigger id="student">
                          <SelectValue placeholder="اختر طالباً" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                      <Select
                        value={formData?.status}
                        onValueChange={(value) =>
                          setFormData({
                            ...(formData as SubscriptionInsert),
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAID">نشط</SelectItem>
                          <SelectItem value="PENDING">معلَّق</SelectItem>
                          <SelectItem value="EXPIRED">
                            منتهي الصلاحية
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">المبلغ (د.ج)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="5000"
                        value={formData?.amount}
                        onChange={(e) =>
                          setFormData({
                            ...(formData as SubscriptionInsert),
                            amount: Number(e.target.value),
                          })
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
                          value={formData?.start_date}
                          onChange={(e) =>
                            setFormData({
                              ...(formData as SubscriptionInsert),
                              start_date: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_date">تاريخ الانتهاء</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={formData?.end_date}
                          onChange={(e) =>
                            setFormData({
                              ...(formData as SubscriptionInsert),
                              end_date: e.target.value,
                            })
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
                        value={formData?.note as string}
                        onChange={(e) =>
                          setFormData({
                            ...(formData as SubscriptionInsert),
                            note: e.target.value,
                          })
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
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoadingCreating}
                      >
                        {isLoadingCreating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "إنشاء إشتراك"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

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
              <div className="text-2xl font-bold">{stats.PAID}</div>
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
                  <SelectItem value="PAID">نشط</SelectItem>
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
                          {sub.status !== "PAID" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRenew(sub)}
                              disabled={isLoadingRenew}
                            >
                              {isLoadingRenew ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {sub.status === "PAID" && (
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
                      {sub.status !== "PAID" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRenew(sub)}
                          disabled={isLoadingRenew}
                        >
                          {isLoadingRenew ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              تجديد
                            </>
                          )}
                        </Button>
                      )}
                      {sub.status === "PAID" && (
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
