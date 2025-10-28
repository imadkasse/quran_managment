"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Bell,
  TrendingUp,
  Calendar,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
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
} from "recharts";
import { useUser } from "@/store/userStore";

type UserRole = "ADMIN" | "TEACHER" | "PARENT";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color,
}) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`${color} p-2 rounded-lg bg-opacity-10`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${color}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const user = {
    role: "TEACHER", // يمكن أن يكون "ADMIN" أو "TEACHER" أو "PARENT"
    //... باقي البيانات أعملها لاحقا
  };
  const { user: userData } = useUser();
  // ألوان النظام
  const colors = {
    primary: "hsl(145 70% 45%)", // --chart-1
    secondary: "hsl(90 70% 70%)", // --chart-2
    tertiary: "hsl(160 50% 35%)", // --chart-3
    quaternary: "hsl(95 75% 75%)", // --chart-4
    quinary: "hsl(140 60% 40%)", // --chart-5
  };

  // Mock data for charts
  const monthlyData = [
    { month: "يناير", value: 65 },
    { month: "فبراير", value: 78 },
    { month: "مارس", value: 90 },
    { month: "أبريل", value: 81 },
    { month: "مايو", value: 95 },
    { month: "يونيو", value: 87 },
  ];

  const attendanceData = [
    { day: "الأحد", present: 45, absent: 5 },
    { day: "الإثنين", present: 48, absent: 2 },
    { day: "الثلاثاء", present: 47, absent: 3 },
    { day: "الأربعاء", present: 50, absent: 0 },
    { day: "الخميس", present: 46, absent: 4 },
  ];

  const pieData = [
    { name: "فعّال", value: 75, color: colors.primary },
    { name: "منتهي", value: 15, color: "hsl(27 90% 55%)" },
    { name: "معلّق", value: 10, color: colors.secondary },
  ];

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي المستخدمين"
          value="1,234"
          icon={<Users className="w-6 h-6" />}
          description="مستخدم نشط"
          trend="+12% من الشهر الماضي"
          color="text-primary"
        />
        <StatCard
          title="المعلمين"
          value="56"
          icon={<GraduationCap className="w-6 h-6" />}
          description="معلم مسجل"
          trend="+3 معلمين جدد"
          color="text-[hsl(90,70%,70%)]"
        />
        <StatCard
          title="الطلاب"
          value="987"
          icon={<BookOpen className="w-6 h-6" />}
          description="طالب نشط"
          trend="+45 هذا الشهر"
          color="text-[hsl(160,50%,35%)]"
        />
        <StatCard
          title="الاشتراكات"
          value="$45,231"
          icon={<DollarSign className="w-6 h-6" />}
          description="إجمالي الإيرادات"
          trend="+20% نمو"
          color="text-[hsl(95,75%,75%)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">نمو المستخدمين</CardTitle>
            <CardDescription>عدد المستخدمين الجدد شهريًا</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.625rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.primary}
                  strokeWidth={3}
                  dot={{ fill: colors.primary, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="المستخدمين"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">توزيع الاشتراكات</CardTitle>
            <CardDescription>حالة الاشتراكات الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(Number(percent) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.625rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="طلابي"
          value="48"
          icon={<Users className="w-6 h-6" />}
          description="طالب مسجل"
          color="text-primary"
        />
        <StatCard
          title="الحضور اليوم"
          value="45/48"
          icon={<UserCheck className="w-6 h-6" />}
          description="نسبة الحضور 94%"
          trend="ممتاز"
          color="text-[hsl(140,60%,40%)]"
        />
        <StatCard
          title="التقييمات"
          value="127"
          icon={<FileText className="w-6 h-6" />}
          description="تقييم هذا الشهر"
          color="text-[hsl(90,70%,70%)]"
        />
        <StatCard
          title="الإشعارات"
          value="8"
          icon={<Bell className="w-6 h-6" />}
          description="إشعار جديد"
          color="text-[hsl(27,90%,55%)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">الحضور الأسبوعي</CardTitle>
            <CardDescription>إحصائيات حضور الطلاب</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.625rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="present"
                  fill={colors.primary}
                  name="حاضر"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  fill="hsl(27 90% 55%)"
                  name="غائب"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">أداء الطلاب</CardTitle>
            <CardDescription>متوسط الدرجات شهريًا</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.625rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.secondary}
                  strokeWidth={3}
                  dot={{ fill: colors.secondary, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="المتوسط"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">الحصص القادمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: "09:00 - 10:00",
                subject: "رياضيات",
                class: "الصف الخامس",
              },
              { time: "10:30 - 11:30", subject: "علوم", class: "الصف السادس" },
              {
                time: "13:00 - 14:00",
                subject: "لغة عربية",
                class: "الصف الرابع",
              },
            ].map((lesson, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {lesson.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.class}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground px-3 py-1 bg-secondary/20 rounded-md">
                  {lesson.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderParentDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="أبنائي"
          value="3"
          icon={<Users className="w-6 h-6" />}
          description="طالب مسجل"
          color="text-primary"
        />
        <StatCard
          title="الاشتراكات الفعّالة"
          value="2"
          icon={<DollarSign className="w-6 h-6" />}
          description="اشتراك نشط"
          color="text-[hsl(90,70%,70%)]"
        />
        <StatCard
          title="التقارير الشهرية"
          value="6"
          icon={<FileText className="w-6 h-6" />}
          description="تقرير متاح"
          color="text-[hsl(160,50%,35%)]"
        />
        <StatCard
          title="الإشعارات"
          value="5"
          icon={<Bell className="w-6 h-6" />}
          description="إشعار جديد"
          color="text-[hsl(27,90%,55%)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">أداء الأبناء</CardTitle>
            <CardDescription>متوسط الدرجات الشهرية</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.625rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.quinary}
                  strokeWidth={3}
                  dot={{ fill: colors.quinary, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="المتوسط"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">الحضور الشهري</CardTitle>
            <CardDescription>نسبة حضور الأبناء</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.625rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  fill={colors.primary}
                  name="نسبة الحضور %"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">ملخص الأبناء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "أحمد محمد",
                class: "الصف السادس",
                avg: 92,
                attendance: 95,
              },
              {
                name: "فاطمة محمد",
                class: "الصف الرابع",
                avg: 88,
                attendance: 98,
              },
              {
                name: "عمر محمد",
                class: "الصف الثاني",
                avg: 85,
                attendance: 92,
              },
            ].map((student, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {student.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {student.class}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">
                    المتوسط:{" "}
                    <span className="font-semibold text-primary">
                      {student.avg}%
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    الحضور:{" "}
                    <span className="font-semibold text-[hsl(140,60%,40%)]">
                      {student.attendance}%
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const getDashboardTitle = () => {
    switch (user.role) {
      case "ADMIN":
        return "لوحة تحكم الإدارة";
      case "TEACHER":
        return "لوحة تحكم المعلم";
      case "PARENT":
        return "لوحة تحكم ولي الأمر";
      default:
        return "لوحة التحكم";
    }
  };
  useEffect(() => {
    console.log(userData)
  }, [userData]);

  return (
    <div className="h-[95vh]  p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {getDashboardTitle()}
          </h1>
          <p className="text-muted-foreground">
            مرحباً بك، اليوم{" "}
            {new Date().toLocaleDateString("ar-DZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              التحليلات
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              التقارير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {user.role === "ADMIN" && renderAdminDashboard()}
            {user.role === "TEACHER" && renderTeacherDashboard()}
            {user.role === "PARENT" && renderParentDashboard()}
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  التحليلات المتقدمة
                </CardTitle>
                <CardDescription>
                  قريباً - تحليلات وإحصائيات متقدمة
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium">قيد التطوير...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  التقارير الشاملة
                </CardTitle>
                <CardDescription>قريباً - تقارير مفصلة</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[hsl(90,70%,70%)]" />
                  </div>
                  <p className="font-medium">قيد التطوير...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
