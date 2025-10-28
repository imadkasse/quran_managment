"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Search,
  Save,
  RotateCcw,
  ChevronDown,
  Trash2,
  Edit,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import showToast from "@/utils/showToast";
import {
  createDailyAttendanceRecords,
  updateAttendance,
  updateAttendanceStatus,
} from "@/services/teacher";
import { Attendance, Student } from "@/types/types";

// Types
type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

// Mock Data
const user = {
  role: "TEACHER", // غير إلى "PARENT" لاختبار واجهة ولي الأمر
  user_id: "1f2d6c42-c50e-4a26-bdd5-9b60ed566081", // parent_id for testing
};
const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // another time get this from session

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("ar-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

const TODAY_DATE = new Date().toISOString().split("T")[0];

interface Props {
  attendanceFetcher: Attendance[];
  studentsFetcher: Student[];
}

const STATUS_OPTIONS: {
  value: AttendanceStatus;
  label: string;
  color: string;
  bgColor: string;
  badgeColor: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "PRESENT",
    label: "حاضر",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor:
      "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700",
    badgeColor:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300",
    Icon: Check,
  },
  {
    value: "ABSENT",
    label: "غائب",
    color: "text-rose-700 dark:text-rose-400",
    bgColor:
      "bg-rose-50 border-rose-300 dark:bg-rose-950/50 dark:border-rose-700",
    badgeColor:
      "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300",
    Icon: X,
  },
  {
    value: "LATE",
    label: "متأخر",
    color: "text-amber-700 dark:text-amber-400",
    bgColor:
      "bg-amber-50 border-amber-300 dark:bg-amber-950/50 dark:border-amber-700",
    badgeColor:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300",
    Icon: Clock,
  },
  {
    value: "EXCUSED",
    label: "بعذر",
    color: "text-sky-700 dark:text-sky-400",
    bgColor: "bg-sky-50 border-sky-300 dark:bg-sky-950/50 dark:border-sky-700",
    badgeColor:
      "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/50 dark:text-sky-300",
    Icon: AlertTriangle,
  },
];

// note Dialog Component
const NoteDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  studentName: string;
  note: string;
}> = ({ open, onClose, studentName, note }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ملاحظات الطالب</DialogTitle>
          <DialogDescription>{studentName}</DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[100px]">
          <p className="text-sm">{note || "لا توجد ملاحظات"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Dialog Component
const EditDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  student: Student;
  initialAttendance: Attendance | null;
  onSave: (
    attendanceId: string,
    status: AttendanceStatus,
    note: string
  ) => void;
}> = ({ open, onClose, student, initialAttendance, onSave }) => {
  const [status, setStatus] = useState<AttendanceStatus>(
    initialAttendance?.status || "ABSENT"
  );
  const [note, setnote] = useState(initialAttendance?.note || "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setStatus(initialAttendance?.status || "ABSENT");
    setnote(initialAttendance?.note || "");
  }, [initialAttendance, open]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onSave(initialAttendance?.id as string, status, note);
    } finally {
      setIsUpdating(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل حضور الطالب</DialogTitle>
          <DialogDescription>{student.full_name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">حالة الحضور</label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as AttendanceStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => {
                  const Icon = opt.Icon;
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ملاحظات</label>
            <Input
              placeholder="أضف ملاحظة..."
              value={note}
              onChange={(e) => setnote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  حفظ
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Teacher Table Row Component
const TeacherTableRow: React.FC<{
  student: Student;
  attendance: Attendance | undefined;
  setAttendances: Dispatch<SetStateAction<Attendance[]>>;
  onViewnote: () => void;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ student, attendance, onViewnote, onEdit, setAttendances }) => {
  const currentStatus = STATUS_OPTIONS.find(
    (opt) => opt.value === (attendance?.status || "ABSENT")
  )!;
  const handleUpdateAttendanceStatus = async (
    status: AttendanceStatus,
    attendanceId: string
  ) => {
    try {
      const updateStatus = await updateAttendanceStatus(status, attendanceId);
      if (!updateStatus.status) {
        showToast("info", updateStatus.msg);
        return;
      }

      showToast("success", updateStatus.msg);
      setAttendances((prev: Attendance[]) =>
        prev.map((a) =>
          a.id === updateStatus.attendance?.id ? updateStatus.attendance : a
        )
      );
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error");
    }
  };
  return (
    <TableRow className="hover:bg-muted/50 w-full  ">
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onViewnote}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {/* no need to remove the attendance */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
            disabled={!attendance?.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={attendance?.status || "ABSENT"}
          onValueChange={(v) => {
            handleUpdateAttendanceStatus(
              v as AttendanceStatus,
              attendance?.id as string
            );
          }}
        >
          <SelectTrigger
            className={`w-[140px] ${currentStatus.color} font-medium border-2`}
          >
            <div className="flex items-center gap-2">
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => {
              const Icon = opt.Icon;
              return (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${opt.color}`} />
                    <span className={opt.color}>{opt.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{attendance?.date}</TableCell>

      <TableCell>{student.level}</TableCell>
      <TableCell>{student.age}</TableCell>
      <TableCell className="font-medium">{student.full_name}</TableCell>
    </TableRow>
  );
};

// Parent Card Component
const StudentAttendanceCard: React.FC<{
  student: Student;
  initialAttendance: Attendance | undefined;
}> = ({ student, initialAttendance }) => {
  const status = initialAttendance?.status || "ABSENT";
  const note = initialAttendance?.note || "";

  const currentStatus = STATUS_OPTIONS.find((opt) => opt.value === status)!;
  const StatusIcon = currentStatus.Icon;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold mb-1">
              {student.full_name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="font-normal">
                {student.level}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {student.age} سنوات
              </Badge>
              <Badge variant="outline" className="font-normal">
                {initialAttendance?.date} التاريخ
              </Badge>
            </div>
          </div>
          <div className={`p-2 rounded-full ${currentStatus.bgColor}`}>
            <StatusIcon className={`h-5 w-5 ${currentStatus.color}`} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <StatusIcon className={`h-5 w-5 ${currentStatus.color}`} />
          <span className={`font-semibold ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>

        {note && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              ملاحظات
            </label>
            <div className="p-3 rounded-lg bg-muted/30 text-sm">{note}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = ({ label, count, icon: Icon, color, bgColor }) => {
  return (
    <Card className={`${bgColor} border-2 transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
          </div>
          <div className={`p-3 rounded-full bg-background/60`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const AttendancePage = ({ attendanceFetcher, studentsFetcher }: Props) => {
  const { role, user_id } = user;
  const [attendances, setAttendances] = useState<Attendance[] | []>(
    attendanceFetcher || []
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [noteDialog, setnoteDialog] = useState<{
    open: boolean;
    studentName: string;
    note: string;
  }>({
    open: false,
    studentName: "",
    note: "",
  });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    student: Student | null;
    attendance: Attendance | null;
  }>({
    open: false,
    student: null,
    attendance: null,
  });
  // loadings
  const [configTodayLoading, setConfigTodayLoading] = useState<boolean>(false);
  const [isUpdateingStatus, setIsUpdateingStatus] = useState<boolean>(false);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    let filtered = [...students];

    if (role === "TEACHER") {
      filtered = filtered.filter((s) => s.teacher_id === teacher_id);
    } else if (role === "PARENT") {
      filtered = filtered.filter((s) => s.parent_id === user_id);
    }

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter((s) =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [students, role, user_id, searchQuery]);
  const attendanceStats = useMemo(() => {
    const stats: Record<AttendanceStatus, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };

    filteredStudents?.forEach((student) => {
      const record = attendances?.find(
        (a) => a.student_id === student.id && a.date === TODAY_DATE
      );
      const status = record
        ? (record.status as AttendanceStatus)
        : ("PRESENT" as AttendanceStatus);
      stats[status]++;
    });

    return stats;
  }, [filteredStudents, attendances]);

  const handleUpdateAttendance = async (
    attendanceId: string,
    status: AttendanceStatus,
    note: string
  ) => {
    try {
      const updateStatus = await updateAttendance(
        { status, note },
        attendanceId
      );
      if (!updateStatus.status) {
        showToast("error", updateStatus.msg);
        return;
      }
      showToast("success", updateStatus.msg);
      setAttendances((prev) =>
        prev.map((a) =>
          a.id === updateStatus.attendance?.id ? updateStatus.attendance : a
        )
      );
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error");
    }
  };

  const handleDeleteAttendance = (studentId: string) => {
    if (confirm("هل تريد حذف سجل الحضور لهذا الطالب؟")) {
      setAttendances((prev) =>
        prev.filter((a) => !(a.id === studentId && a.date === TODAY_DATE))
      );
    }
  };

  const handleSaveAll = () => {
    alert("تم حفظ جميع التغييرات بنجاح!");
  };
  const handleConfigToday = async () => {
    setConfigTodayLoading(true);
    try {
      const configTheDay = await createDailyAttendanceRecords(
        teacher_id,
        TODAY_DATE
      );
      showToast(
        `${configTheDay.status ? "success" : "info"}`,
        configTheDay.msg
      );
      if (configTheDay.status) {
        setAttendances(
          configTheDay.attendnaces ? configTheDay.attendnaces : []
        );
        return;
      }
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error ");
    } finally {
      setConfigTodayLoading(false);
    }
  };
  const isParent = role === "PARENT";
  const pageTitle = role === "TEACHER" ? "سجل الحضور اليومي" : "حضور الأبناء";
  useEffect(() => {
    setStudents(studentsFetcher);
  }, [studentsFetcher]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-xl border-2">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(new Date())}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!isParent && (
                  <>
                    <Button
                      onClick={handleConfigToday}
                      variant="outline"
                      disabled={configTodayLoading}
                    >
                      {configTodayLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          تهيئة سجل اليوم
                        </>
                      )}
                    </Button>
                    {/* <Button onClick={handleSaveAll}>
                      <Save className="h-4 w-4 mr-2" />
                      حفظ الكل
                    </Button> */}
                  </>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن طالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setShowStats(!showStats)}
            className="w-full justify-between hover:bg-muted/50"
          >
            <span className="font-semibold">الإحصائيات</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showStats ? "rotate-180" : ""
              }`}
            />
          </Button>

          {showStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                label="حاضر"
                count={attendanceStats.PRESENT}
                icon={Check}
                color="text-emerald-700 dark:text-emerald-400"
                bgColor="bg-emerald-50 border-emerald-300 dark:bg-emerald-950/50"
              />
              <StatsCard
                label="غائب"
                count={attendanceStats.ABSENT}
                icon={X}
                color="text-rose-700 dark:text-rose-400"
                bgColor="bg-rose-50 border-rose-300 dark:bg-rose-950/50"
              />
              <StatsCard
                label="متأخر"
                count={attendanceStats.LATE}
                icon={Clock}
                color="text-amber-700 dark:text-amber-400"
                bgColor="bg-amber-50 border-amber-300 dark:bg-amber-950/50"
              />
              <StatsCard
                label="بعذر"
                count={attendanceStats.EXCUSED}
                icon={AlertTriangle}
                color="text-sky-700 dark:text-sky-400"
                bgColor="bg-sky-50 border-sky-300 dark:bg-sky-950/50"
              />
            </div>
          )}
        </div>

        {/* Students Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {isParent ? "الأبناء" : "الطلاب"} ({filteredStudents.length})
            </h2>
          </div>

          {filteredStudents.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                {searchQuery ? "لم يتم العثور على طلاب" : "لا يوجد طلاب لعرضهم"}
              </p>
            </Card>
          ) : isParent ? (
            // Cards View for Parents
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {filteredStudents.map((student) => (
                  <StudentAttendanceCard
                    key={student.id}
                    student={student}
                    initialAttendance={attendances.find(
                      (a) => a.student_id === student.id && a.date === TODAY_DATE
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            // Table View for Teachers
            <Card>
              <ScrollArea className="">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur z-10">
                    <TableRow>
                      <TableHead>الإجراءات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المستوى</TableHead>
                      <TableHead>العمر</TableHead>
                      <TableHead>اسم الطالب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const attendance = attendances.find(
                        (a) =>
                          a.student_id === student.id && a.date === TODAY_DATE
                      );
                      return (
                        <TeacherTableRow
                          key={student.id}
                          student={student}
                          attendance={attendance}
                          onViewnote={() =>
                            setnoteDialog({
                              open: true,
                              studentName: student.full_name,
                              note: attendance?.note || "",
                            })
                          }
                          setAttendances={setAttendances}
                          onDelete={() => handleDeleteAttendance(student.id)}
                          onEdit={() => {
                            setEditDialog({
                              attendance: attendance ? attendance : null,
                              open: true,
                              student,
                            });
                          }}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>

      {/* Dialogs */}

      <NoteDialog
        open={noteDialog.open}
        onClose={() => setnoteDialog({ ...noteDialog, open: false })}
        studentName={noteDialog.studentName}
        note={noteDialog.note}
      />

      {editDialog.student && (
        <EditDialog
          open={editDialog.open}
          onClose={() => setEditDialog({ ...editDialog, open: false })}
          student={editDialog.student}
          initialAttendance={
            editDialog.attendance ? editDialog.attendance : null
          }
          onSave={handleUpdateAttendance}
        />
      )}
    </div>
  );
};

export default AttendancePage;
