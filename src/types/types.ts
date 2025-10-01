// types.ts (أو داخل ملف المكون)

export type UserRole = "TEACHER" | "PARENT";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface Student {
  student_id: string;
  name: string;
  age: number;
  level: string;
  teacher_id?: string; // لربط الطلاب بالمعلم
  parent_id?: string; // لربط الطلاب بولي الأمر
}

export interface Attendance {
  student_id: string;
  date: string; // صيغة YYYY-MM-DD
  status: AttendanceStatus;
  notes: string;
  attendance_id?: string; // لعملية التحديث/الحذف
}

export interface AttendanceRecord extends Student, Attendance {}

// Props للمكون
export interface AttendancePageProps {
  role: UserRole;
  students: Student[];
  initialAttendances: Attendance[];
}
