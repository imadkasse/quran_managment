import { supabaseAdmin } from "@/supabase/server";
import { supabase } from "@/supabase/supabase";
import { Database } from "@/types/supabase.types";
import { AddParentFormData } from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";

type Student = Database["public"]["Tables"]["students"]["Row"];
type Parent = Database["public"]["Tables"]["users"]["Row"];
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];
type ParentInStudent = {
  username: string;
  email: string;
};

export type StudentWithParent = Student & { parent: ParentInStudent | null };

// type User = Database["public"]["Tables"]["users"]["Row"];

export type CreateStudentPayload = StudentInsert;
export type UpdateStudentPayload = StudentUpdate;

async function handleResponse<T>(res: {
  data: T | null;
  error: PostgrestError | null;
}) {
  if (res.error) throw res.error;
  return res.data;
}
// students
export async function getAllMyStudents(
  teacherId: string
): Promise<StudentWithParent[]> {
  const res = await supabase
    .from("students")
    .select(
      "id, full_name, age, level, teacher_id, parent_id, created_at ,parent:students_parent_id_fkey(username, email) "
    )
    .eq("teacher_id", teacherId)
    .order("full_name", { ascending: true });

  return (await handleResponse<StudentWithParent[]>(res)) ?? [];
}
// parents
// in after time add filed teacher_id in users schema and get olny the parent with the same teacher_id
export async function getAllMyParent(): Promise<Parent[]> {
  const res = await supabase.from("users").select("*").eq("role", "PARENT");
  return (await handleResponse<Parent[]>(res)) ?? [];
}
// this function need to 
export async function insertParent(parent: AddParentFormData) {
  // 1) إنشاء المستخدم في auth
  const authUser = await supabaseAdmin.auth.admin.createUser({
    email: parent.email,
    password: parent.username || "12345678",
    email_confirm: true,
  });

  if (authUser.error || !authUser.data.user) {
    throw authUser.error || new Error("Failed to create auth user");
  }

  const authId = authUser.data.user.id;

  // 2) إدخاله في جدول users بنفس الـ id
  const res = await supabase.from("users").insert({
    id: authId,
    username: parent.username,
    email: parent.email,
    role: "PARENT",
  });

  // 3) إذا فشل الإدخال → حذف المستخدم من auth
  if (res.error) {
    await supabase.auth.admin.deleteUser(authId);
    throw res.error;
  }

  return await handleResponse<Parent>(res);
}

/*
export async function getStudentById(
  studentId: string,
  teacherId?: string
): Promise<Student | null> {
  let q = supabase
    .from("students")
    .select("id, full_name, age, level, teacher_id, parent_id, created_at")
    .eq("id", studentId)
    .limit(1)
    .single();

  if (teacherId) q = q.eq("teacher_id", teacherId);

  const res = await q;
  return handleResponse<Student | null>(res);
}

export async function createStudent(
  payload: CreateStudentPayload
): Promise<Student> {
  const res = await supabase.from("students").insert(payload).select().single();
  return handleResponse<Student>(res) as Promise<Student>;
}

export async function updateStudent(
  studentId: string,
  payload: UpdateStudentPayload,
  teacherId?: string
): Promise<Student> {
  let q = supabase
    .from("students")
    .update(payload)
    .eq("id", studentId)
    .select()
    .single();

  if (teacherId) q = q.eq("teacher_id", teacherId);

  const res = await q;
  return handleResponse<Student>(res) as Promise<Student>;
}

export async function deleteStudent(
  studentId: string,
  teacherId?: string
): Promise<Student | null> {
  let q = supabase
    .from("students")
    .delete()
    .eq("id", studentId)
    .select()
    .single();

  if (teacherId) q = q.eq("teacher_id", teacherId);

  const res = await q;
  return handleResponse<Student | null>(res);
}
*/
