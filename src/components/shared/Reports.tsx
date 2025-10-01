"use client";
import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  User,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Search,
  Download,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Moon,
  Sun,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type UserRole = "TEACHER" | "PARENT";
type Theme = "light" | "dark";

interface User {
  role: UserRole;
  user_id: string;
}

interface Report {
  id: string;
  student_id: string;
  student_name: string;
  month: string;
  total_memorization: number;
  attendance_summary: {
    present: number;
    absent: number;
  };
  note?: string;
  teacher_id: string;
}

const fakeReports: Report[] = [
  {
    id: "r1",
    student_id: "s1",
    student_name: "أحمد محمد",
    month: "2025-01",
    total_memorization: 15,
    attendance_summary: { present: 20, absent: 2 },
    note: "طالب متميز ويحفظ بسرعة",
    teacher_id: "t1",
  },
  {
    id: "r2",
    student_id: "s2",
    student_name: "فاطمة علي",
    month: "2025-01",
    total_memorization: 12,
    attendance_summary: { present: 18, absent: 4 },
    note: "تحتاج إلى مزيد من المراجعة",
    teacher_id: "t1",
  },
  {
    id: "r3",
    student_id: "s3",
    student_name: "خالد حسن",
    month: "2025-01",
    total_memorization: 18,
    attendance_summary: { present: 22, absent: 0 },
    note: "أداء ممتاز ومواظبة مستمرة",
    teacher_id: "t1",
  },
  {
    id: "r4",
    student_id: "s1",
    student_name: "أحمد محمد",
    month: "2024-12",
    total_memorization: 14,
    attendance_summary: { present: 19, absent: 3 },
    teacher_id: "t1",
  },
];

const Reports: React.FC = () => {
  const user: User = {
    role: "TEACHER",
    user_id: "t1",
  };

  const [reports, setReports] = useState<Report[]>(fakeReports);
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-01");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredReports =
    user.role === "TEACHER"
      ? reports.filter(
          (r) =>
            r.teacher_id === user.user_id &&
            r.month === selectedMonth &&
            r.student_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : reports.filter(
          (r) => r.student_id === "s1" && r.month === selectedMonth
        );

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التقرير؟")) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    alert(`تعديل التقرير: ${id}`);
  };

  const handleAdd = () => {
    alert("إضافة تقرير جديد");
  };

  const stats = {
    totalStudents: filteredReports.length,
    totalMemorization: filteredReports.reduce(
      (sum, r) => sum + r.total_memorization,
      0
    ),
    avgAttendance:
      filteredReports.length > 0
        ? Math.round(
            filteredReports.reduce(
              (sum, r) => sum + r.attendance_summary.present,
              0
            ) / filteredReports.length
          )
        : 0,
  };

  const Table = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full overflow-auto rounded-lg">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-muted/50">{children}</thead>
  );

  const TableBody = ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  );

  const TableRow = ({
    children,
    clickable,
  }: {
    children: React.ReactNode;
    clickable?: boolean;
  }) => (
    <tr
      className={`border-b border-border transition-all ${
        clickable ? "hover:bg-muted/30 cursor-pointer" : ""
      }`}
    >
      {children}
    </tr>
  );

  const TableHead = ({ children }: { children: React.ReactNode }) => (
    <th className="h-14 px-6 text-right align-middle font-semibold text-sm text-foreground">
      {children}
    </th>
  );

  const TableCell = ({
    children,
    className = "",
    colSpan,
  }: {
    children: React.ReactNode;
    className?: string;
    colSpan?: number;
  }) => (
    <td className={`px-6 py-4 align-middle ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );

  const StatsCard = ({ icon: Icon, label, value, colorClass }: any) => (
    <Card className="border shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
          </div>
          <div className={`p-4 rounded-full ${colorClass} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TeacherView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl shadow-lg bg-primary">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              تقارير الطلاب
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة ومتابعة تقارير الطلاب الشهرية
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAdd}
            size="lg"
            className="gap-2 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            إضافة تقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={User}
          label="إجمالي الطلاب"
          value={stats.totalStudents}
          colorClass="text-primary"
        />
        <StatsCard
          icon={BookOpen}
          label="إجمالي الحفظ"
          value={`${stats.totalMemorization} صفحة`}
          colorClass="text-green-600 dark:text-green-400"
        />
        <StatsCard
          icon={TrendingUp}
          label="متوسط الحضور"
          value={`${stats.avgAttendance} يوم`}
          colorClass="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن طالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pr-10 pl-4 py-3 rounded-lg border border-border bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="2025-01">يناير 2025</option>
                  <option value="2024-12">ديسمبر 2024</option>
                </select>
              </div>
              <Button variant="outline" size="lg" className="gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الطالب</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحفظ</TableHead>
                <TableHead>الحضور</TableHead>
                <TableHead>الملاحظات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-muted/50">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg mb-1 text-foreground">
                          لا توجد تقارير
                        </p>
                        <p className="text-muted-foreground text-sm">
                          لم يتم العثور على تقارير لهذا الشهر
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id} clickable>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-primary-foreground bg-primary">
                          {report.student_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">
                          {report.student_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.month).toLocaleDateString("ar-DZ", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="font-semibold px-3 py-1 bg-secondary text-secondary-foreground">
                        {report.total_memorization} صفحة
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 dark:bg-green-950/30">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            {report.attendance_summary.present}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 dark:bg-red-950/30">
                          <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-700 dark:text-red-400">
                            {report.attendance_summary.absent}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {report.note ? (
                        <span className="text-sm text-muted-foreground truncate block">
                          {report.note}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          لا توجد ملاحظات
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(report.id)}
                          className="hover:bg-primary/10 text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(report.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const ParentView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl shadow-lg bg-primary">
            <FileText className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              تقارير الطالب
            </h1>
            <p className="text-muted-foreground mt-1">
              متابعة الأداء والحضور الشهري
            </p>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              <option value="2025-01">يناير 2025</option>
              <option value="2024-12">ديسمبر 2024</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports */}
      {filteredReports.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="py-20 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 rounded-full bg-muted/50">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-xl mb-2 text-foreground">
                  لا توجد تقارير متاحة
                </p>
                <p className="text-muted-foreground">
                  لم يتم إضافة أي تقارير لهذا الشهر بعد
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="h-2 bg-primary" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary-foreground bg-primary text-lg shadow-md">
                      {report.student_name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">
                        {report.student_name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {new Date(report.month).toLocaleDateString("ar-DZ", {
                          year: "numeric",
                          month: "long",
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-background shadow-sm">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium text-sm text-muted-foreground">
                        إجمالي الحفظ
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {report.total_memorization}
                      <span className="text-lg text-muted-foreground mr-2">
                        صفحة
                      </span>
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-background shadow-sm">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium text-sm text-muted-foreground">
                        سجل الحضور
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-950/30 shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="font-bold text-lg text-green-700 dark:text-green-400">
                          {report.attendance_summary.present}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-950/30 shadow-sm">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="font-bold text-lg text-red-700 dark:text-red-400">
                          {report.attendance_summary.absent}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {report.note && (
                  <div className="p-5 rounded-xl bg-muted/50 border-r-4 border-primary">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <p className="font-semibold text-sm text-foreground">
                        ملاحظة المعلم
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {report.note}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-[95vh] bg-background text-foreground ">
      <div className=" p-6 ">
        {user.role === "TEACHER" ? <TeacherView /> : <ParentView />}
      </div>
    </div>
  );
};

export default Reports;
