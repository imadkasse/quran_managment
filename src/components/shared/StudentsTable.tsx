"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Calendar, GraduationCap, Users } from "lucide-react";

type UserRole = "TEACHER" | "PARENT";

interface Student {
  id: string;
  full_name: string;
  age: number;
  level: string;
  parent_name?: string;
}

export const StudentsTable: React.FC = () => {
  const user = {
    role: "TEACHER", // يمكن أن يكون "ADMIN" أو "TEACHER" أو "PARENT"
    //... باقي البيانات أعملها لاحقا
  };
  const students: Student[] = [
    {
      id: "STD001",
      full_name: "أحمد محمد العلي",
      age: 15,
      level: "الحزب الأول",
      parent_name: "محمد العلي",
    },
    {
      id: "STD002",
      full_name: "فاطمة أحمد السعيد",
      age: 14,
      level: "الحزب الثالث",
      parent_name: "أحمد السعيد",
    },
    {
      id: "STD003",
      full_name: "عمر خالد الحسن",
      age: 16,
      level: "الحزب الأول",
      parent_name: "خالد الحسن",
    },
    {
      id: "STD004",
      full_name: "سارة يوسف المحمود",
      age: 13,
      level: "الحزب الأول",
      parent_name: "يوسف المحمود",
    },
    {
      id: "STD005",
      full_name: "محمود علي الشريف",
      age: 15,
      level: "الحزب الأول",
      parent_name: "علي الشريف",
    },
  ];
  const getStudentLink = (studentId: string) => {
    return user.role === "TEACHER"
      ? `/teacher/students/${studentId}`
      : `/parent/students/${studentId}`;
  };

  // Mobile Card View Component
  const MobileStudentCard: React.FC<{ student: Student }> = ({ student }) => (
    <Card className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with Name */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  {student.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  معرف: {student.id}
                </p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العمر</p>
                <p className="font-medium text-foreground">{student.age} سنة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <GraduationCap className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المستوى</p>
                <p className="font-medium text-foreground">{student.level}</p>
              </div>
            </div>
          </div>

          {/* Parent Name (Teacher Only) */}
          {user.role === "TEACHER" && student.parent_name && (
            <div className="flex items-center gap-2 pt-2">
              <div className="p-2 bg-muted rounded-lg">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ولي الأمر</p>
                <p className="font-medium text-foreground">
                  {student.parent_name}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-3 border-t border-border">
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a href={getStudentLink(student.id)}>
                <span>عرض التفاصيل</span>
                <ArrowRight className="w-4 h-4 mr-2" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Desktop Table View
  const DesktopTable = () => (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                الاسم الكامل
              </th>
              <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                العمر
              </th>
              <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                المستوى
              </th>
              {user.role === "TEACHER" && (
                <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                  ولي الأمر
                </th>
              )}
              <th className="text-left px-4 py-3 text-foreground font-semibold border-b border-border">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={user.role === "TEACHER" ? 5 : 4}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-12 h-12 text-muted-foreground/50" />
                    <p>لا توجد بيانات طلاب</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-accent/5 transition-colors border-b border-border"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>{student.age} سنة</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium">
                      <GraduationCap className="w-4 h-4" />
                      {student.level}
                    </span>
                  </td>
                  {user.role === "TEACHER" && (
                    <td className="px-4 py-4 text-foreground">
                      {student.parent_name ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{student.parent_name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          غير متوفر
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4 text-left">
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <a href={getStudentLink(student.id)}>
                        <span>عرض</span>
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-2xl">
                  {user.role === "TEACHER" ? "قائمة الطلاب" : "أبنائي"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  إجمالي: {students.length}{" "}
                  {students.length === 1 ? "طالب" : "طلاب"}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Desktop View - Hidden on Mobile */}
      <div className="hidden md:block">
        <DesktopTable />
      </div>

      {/* Mobile View - Cards Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {students.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Users className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-center font-medium">لا توجد بيانات طلاب</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          students.map((student) => (
            <MobileStudentCard key={student.id} student={student} />
          ))
        )}
      </div>

      {/* Footer Info */}
      {students.length > 0 && (
        <Card className="border-border bg-muted/30">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-muted-foreground font-medium">
                  عرض {students.length} من {students.length} طالب
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">نشط</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-accent" />
                  <span className="text-muted-foreground">
                    آخر تحديث: {new Date().toLocaleDateString("ar-DZ")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
