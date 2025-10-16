import { Database } from "./supabase.types";

export type UserRole = "TEACHER" | "PARENT" | "ADMIN";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Parent = Database["public"]["Tables"]["users"]["Row"] | null;

export type AddParentFormData = {
  username: string;
  email: string;
  password: string;
  teacher_id: string;
};

type ParentInStudent = {
  username: string;
  email: string;
};
export type Student = Database["public"]["Tables"]["students"]["Row"] & {
  parent: ParentInStudent | null;
};

export interface Attendance {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string; // صيغة YYYY-MM-DD
  status: AttendanceStatus;
  notes: string;
  created_at: Date;
}

export interface Evaluation {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string; // صيغة YYYY-MM-DD
  subject: string; // الجزء المحفوط
  score: number;
  note: string;
  created_at: Date;
}
export interface Notification {
  id: string;
  user_id: string; // any teacher ,admin or parent
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: Date;
}
export interface Report {
  id: string;
  student_id: string;
  teacher_id: string;
  month: Date;
  attendance_summary: {};
  total_memorization: number;
  extra_data: {};
  note: string;
  created_at: Date;
}
export interface Subscription {
  id: string;
  student_id: string;
  teacher_id: string;
  amount: number;
  start_data: Date;
  end_data: Date;
  status: string;
  note: string;
  created_at: Date;
}

export interface AttendanceRecord extends Student, Attendance {}

// Props للمكون
export interface AttendancePageProps {
  role: UserRole;
  students: Student[];
  initialAttendances: Attendance[];
}
