// components/AttendancePage.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Trash2,
  Save,
  Users,
  Calendar,
  Clock,
  Slash,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// -----------------------------------------------------------------------------
// 1. تعريف الأنواع (Types) داخليًا
// -----------------------------------------------------------------------------
type UserRole = "TEACHER" | "PARENT" | "ADMIN";
type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

interface Student {
  student_id: string;
  name: string;
  age: number;
  level: string;
  teacher_id?: string;
  parent_id?: string;
}

interface Attendance {
  student_id: string;
  date: string; // صيغة YYYY-MM-DD
  status: AttendanceStatus;
  notes: string;
  attendance_id?: string;
}

// لدمج بيانات الطالب والحضور في سجل واحد
interface AttendanceRecord extends Student, Attendance {}

// -----------------------------------------------------------------------------
// 2. Mock Data والثوابت
// -----------------------------------------------------------------------------

// بيانات المستخدم المحاكية التي تحل محل الـ Props
const user = {
  role: "TEACHER" as UserRole, // يمكنك تغييرها لاختبار الواجهات 'PARENT'
  user_id: "t1", // يمكن أن يكون teacher_id أو parent_id
};

// دالة مساعدة لتنسيق التاريخ
const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("ar-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const TODAY_DATE = new Date().toISOString().split("T")[0]; // صيغة YYYY-MM-DD للحالة الداخلية

const MOCK_STUDENTS: Student[] = [
  {
    student_id: "s001",
    name: "أحمد علي",
    age: 10,
    level: "الصف الخامس",
    teacher_id: "t1",
    parent_id: "p1",
  },
  {
    student_id: "s002",
    name: "سارة خالد",
    age: 9,
    level: "الصف الرابع",
    teacher_id: "t1",
    parent_id: "p1",
  },
  {
    student_id: "s003",
    name: "يوسف محمد",
    age: 11,
    level: "الصف السادس",
    teacher_id: "t2",
    parent_id: "p2",
  },
  {
    student_id: "s004",
    name: "فاطمة إبراهيم",
    age: 10,
    level: "الصف الخامس",
    teacher_id: "t1",
    parent_id: "p3",
  },
  {
    student_id: "s005",
    name: "زينب عادل",
    age: 7,
    level: "الصف الثاني",
    teacher_id: "t2",
    parent_id: "p1",
  },
];

const MOCK_ATTENDANCES: Attendance[] = [
  {
    student_id: "s001",
    date: TODAY_DATE,
    status: "PRESENT",
    notes: "وصل مبكراً",
    attendance_id: "a001",
  },
  {
    student_id: "s002",
    date: TODAY_DATE,
    status: "LATE",
    notes: "تأخر 5 دقائق",
    attendance_id: "a002",
  },
  {
    student_id: "s004",
    date: TODAY_DATE,
    status: "ABSENT",
    notes: "مريض",
    attendance_id: "a003",
  },
];

const STATUS_OPTIONS: {
  value: AttendanceStatus;
  label: string;
  color: string;
  Icon: React.ElementType;
}[] = [
  { value: "PRESENT", label: "حاضر", color: "text-primary", Icon: Check },
  { value: "ABSENT", label: "غائب", color: "text-destructive", Icon: X },
  { value: "LATE", label: "متأخر", color: "text-secondary", Icon: Clock },
  {
    value: "EXCUSED",
    label: "بعذر",
    color: "text-muted-foreground",
    Icon: AlertTriangle,
  },
];

// -----------------------------------------------------------------------------
// مكون صف الجدول للمعلم
// -----------------------------------------------------------------------------
const TeacherAttendanceRow: React.FC<{
  student: Student;
  initialAttendance: Attendance | undefined;
  onSave: (attendance: Attendance) => void;
  onDelete: (studentId: string, attendanceId: string) => void;
}> = ({ student, initialAttendance, onSave, onDelete }) => {
  const [status, setStatus] = useState<AttendanceStatus>(
    initialAttendance?.status || "ABSENT"
  );
  const [notes, setNotes] = useState(initialAttendance?.notes || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setStatus(initialAttendance?.status || "ABSENT");
    setNotes(initialAttendance?.notes || "");
    setIsEditing(false);
  }, [initialAttendance]);

  const handleSave = () => {
    const newAttendance: Attendance = {
      student_id: student.student_id,
      date: TODAY_DATE,
      status,
      notes,
      attendance_id: initialAttendance?.attendance_id,
    };
    onSave(newAttendance);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (initialAttendance?.attendance_id) {
      onDelete(student.student_id, initialAttendance.attendance_id);
      setStatus("ABSENT");
      setNotes("");
      setIsEditing(false);
    }
  };

  const currentStatus =
    STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[1];

  return (
    <TableRow className="hover:bg-muted/50 transition-colors shadow-sm rounded-lg">
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>{student.age}</TableCell>
      <TableCell>{student.level}</TableCell>
      <TableCell>{formatDate(new Date(TODAY_DATE))}</TableCell>

      <TableCell>
        <Select
          value={status}
          onValueChange={(value: AttendanceStatus) => {
            setStatus(value);
            setIsEditing(true);
          }}
        >
          <SelectTrigger
            className={`w-[180px] ${currentStatus.color} font-semibold border-2 border-input/50`}
          >
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className={`${opt.color} hover:bg-muted/80 flex items-center`}
              >
                <opt.Icon className="h-4 w-4 inline-block ml-2" />
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <Input
          placeholder="ملاحظات..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setIsEditing(true);
          }}
          className="w-full bg-background/80 border-input/50 focus-visible:ring-ring/50"
        />
      </TableCell>

      <TableCell className="space-x-2 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!isEditing}
          variant="default"
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleDelete}
          disabled={!initialAttendance?.attendance_id}
          variant="destructive"
          size="icon"
          className="shadow-md"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

// -----------------------------------------------------------------------------
// مكون صف الجدول لولي الأمر (للقراءة فقط)
// -----------------------------------------------------------------------------
const ParentAttendanceRow: React.FC<{ record: AttendanceRecord }> = ({
  record,
}) => {
  const currentStatus =
    STATUS_OPTIONS.find((opt) => opt.value === record.status) ||
    STATUS_OPTIONS[1];
  const Icon = currentStatus.Icon;

  return (
    <TableRow className="hover:bg-card/90 transition-colors">
      <TableCell className="font-medium">{record.name}</TableCell>
      <TableCell>{record.level}</TableCell>
      <TableCell>{formatDate(new Date(record.date))}</TableCell>
      <TableCell
        className={`font-semibold ${currentStatus.color} flex items-center gap-2`}
      >
        <Icon className="h-4 w-4" />
        {currentStatus.label}
      </TableCell>
      <TableCell>{record.notes || "-"}</TableCell>
    </TableRow>
  );
};

// -----------------------------------------------------------------------------
// 3. المكون الرئيسي (بدون Props)
// -----------------------------------------------------------------------------
const AttendancePage: React.FC = () => {
  const { role, user_id } = user;
  const students = MOCK_STUDENTS;
  const initialAttendances = MOCK_ATTENDANCES;

  const [attendances, setAttendances] =
    useState<Attendance[]>(initialAttendances);

  // منطق تصفية الطلاب بناءً على الدور
  const filteredStudents = useMemo(() => {
    if (role === "TEACHER") {
      return students.filter((s) => s.teacher_id === user_id);
    }
    if (role === "PARENT") {
      return students.filter((s) => s.parent_id === user_id);
    }
    return students.filter((s) => s.teacher_id === "t1"); // Fallback
  }, [role, user_id, students]);

  // حساب إحصائيات الحضور لليوم الحالي
  const attendanceStats = useMemo(() => {
    const stats: Record<AttendanceStatus, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };

    // نعتمد على الطلاب المفلترين فقط (طلاب المعلم أو أبناء ولي الأمر)
    filteredStudents.forEach((student) => {
      const record = attendances.find(
        (a) => a.student_id === student.student_id && a.date === TODAY_DATE
      );
      // الحالة الافتراضية هي ABSENT إذا لم يتم تسجيل أي شيء
      const status = record ? record.status : "ABSENT";
      stats[status] = (stats[status] || 0) + 1;
    });

    return stats;
  }, [filteredStudents, attendances]);

  // دالة لحفظ أو تحديث الحضور
  const handleSaveAttendance = useCallback((newAttendance: Attendance) => {
    setAttendances((prev) => {
      const existingIndex = prev.findIndex(
        (a) =>
          a.student_id === newAttendance.student_id &&
          a.date === newAttendance.date
      );

      if (existingIndex > -1) {
        // تحديث
        return prev.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                ...newAttendance,
                attendance_id: item.attendance_id || `a${Date.now()}`,
              }
            : item
        );
      } else {
        // إدراج جديد
        return [...prev, { ...newAttendance, attendance_id: `a${Date.now()}` }];
      }
    });
  }, []);

  // دالة لحذف الحضور
  const handleDeleteAttendance = useCallback(
    (studentId: string, attendanceId: string) => {
      setAttendances((prev) =>
        prev.filter((a) => a.attendance_id !== attendanceId)
      );
    },
    []
  );

  // دمج بيانات الطالب مع الحضور لعرض ولي الأمر
  const parentRecords: AttendanceRecord[] = useMemo(() => {
    return filteredStudents.map((student) => {
      const attendance = attendances.find(
        (a) => a.student_id === student.student_id && a.date === TODAY_DATE
      );
      return {
        ...student,
        status: attendance?.status || "ABSENT",
        notes: attendance?.notes || "",
        date: TODAY_DATE,
      };
    });
  }, [filteredStudents, attendances]);

  // تحديد العنوان والأيقونة بناءً على الدور
  const title =
    role === "TEACHER" ? "سجل الحضور اليومي للمعلم" : "سجل حضور الأبناء";
  const Icon = role === "TEACHER" ? Check : Users;

  // تحديد رؤوس الأعمدة بناءً على الدور
  const tableHeaders = useMemo(() => {
    const headers = [
      <TableHead key="name">اسم الطالب</TableHead>,
      <TableHead key="level">المستوى</TableHead>,
      <TableHead key="date">التاريخ</TableHead>,
      <TableHead key="status">الحالة</TableHead>,
      <TableHead key="notes">الملاحظات</TableHead>,
    ];

    if (role === "TEACHER") {
      headers.splice(1, 0, <TableHead key="age">العمر</TableHead>);
      headers.push(
        <TableHead key="actions" className="text-right">
          الإجراءات
        </TableHead>
      );
    }

    return headers;
  }, [role]);

  // مكون لعرض الإحصائية
  const StatCard: React.FC<{ status: AttendanceStatus; count: number }> = ({
    status,
    count,
  }) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status)!;
    const Icon = option.Icon;

    return (
      <div
        className={`p-4 rounded-lg border shadow-sm flex items-center justify-between bg-card hover:bg-muted/30 transition-colors`}
      >
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {option.label}
          </p>
          <p className={`text-2xl font-bold ${option.color}`}>{count}</p>
        </div>
        <Icon className={`h-6 w-6 opacity-60 ${option.color}`} />
      </div>
    );
  };

  return (
    <div className="h-[95vh]  space-y-6">
      {/* Card Header and Stats */}
      <Card className="shadow-xl rounded-xl  ">
        <CardHeader className="bg-muted/20 dark:bg-muted/10 border-b p-6 rounded-t-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
              <Icon className="h-6 w-6 text-primary" />
              {title}
            </CardTitle>
            <div className="text-sm font-normal text-muted-foreground flex items-center gap-2 bg-background p-2 rounded-lg border shadow-inner">
              <Calendar className="h-4 w-4 text-primary" />
              التاريخ:{" "}
              <span className="font-semibold text-foreground">
                {formatDate(new Date(TODAY_DATE))}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard status="PRESENT" count={attendanceStats.PRESENT} />
            <StatCard status="ABSENT" count={attendanceStats.ABSENT} />
            <StatCard status="LATE" count={attendanceStats.LATE} />
            <StatCard status="EXCUSED" count={attendanceStats.EXCUSED} />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <span className="font-medium text-foreground">
              إجمالي الطلاب المُرتبطين:
            </span>{" "}
            {filteredStudents.length}
          </p>
        </CardContent>
      </Card>

      {/* Attendance Table Card */}
      <Card className="shadow-xl   rounded-xl">
        <CardContent className="p-0">
          <ScrollArea className="  w-full">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10 shadow-sm">
                <TableRow className="uppercase text-muted-foreground hover:bg-muted/20">
                  {tableHeaders}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={role === "TEACHER" ? 7 : 5}
                      className="text-center py-10 text-muted-foreground text-lg"
                    >
                      لا يوجد طلاب لعرضهم حالياً ضمن دورك ({role}).
                    </TableCell>
                  </TableRow>
                ) : role === "TEACHER" ? (
                  filteredStudents.map((student) => (
                    <TeacherAttendanceRow
                      key={student.student_id}
                      student={student}
                      initialAttendance={attendances.find(
                        (a) =>
                          a.student_id === student.student_id &&
                          a.date === TODAY_DATE
                      )}
                      onSave={handleSaveAttendance}
                      onDelete={handleDeleteAttendance}
                    />
                  ))
                ) : (
                  parentRecords.map((record) => (
                    <ParentAttendanceRow
                      key={record.student_id}
                      record={record}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
