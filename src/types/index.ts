export type Role = "TEACHER" | "PARENT" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  level: string; // مثال: "تحضيري" أو "جزء عمّ"
  parentId: string; // ربط مع الولي
  teacherId: string; // ربط مع المعلم
  createdAt: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: "PRESENT" | "ABSENT";
  note?: string;
}

export interface Evaluation {
  id: string;
  studentId: string;
  date: Date;
  subject: string; // مثال: "حفظ سورة البقرة"
  score: number; // من 0 إلى 100
  note?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  status: "PAID" | "UNPAID" | "PENDING";
  date: Date;
} // this is optional 
