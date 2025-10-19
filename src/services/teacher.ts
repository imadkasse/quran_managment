import { supabase } from "@/supabase/supabase";
import { Database } from "@/types/supabase.types";
import { PostgrestError } from "@supabase/supabase-js";

type Student = Database["public"]["Tables"]["students"]["Row"];
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

type Parent = Database["public"]["Tables"]["users"]["Row"];
type Evaluation = Database["public"]["Tables"]["evaluations"]["Row"];
type EvaluationInsert = Database["public"]["Tables"]["evaluations"]["Insert"];
type EvaluationUpdate = Database["public"]["Tables"]["evaluations"]["Update"];

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

export async function insertStudent(payload: CreateStudentPayload) {
  const res = await supabase
    .from("students")
    .insert(payload)
    .select(
      "id, full_name, age, level, teacher_id, parent_id, created_at ,parent:students_parent_id_fkey(username, email) "
    )
    .single();
  return await handleResponse<StudentWithParent>(res);
}

// parents
// in after time add filed teacher_id in users schema and get olny the parent with the same teacher_id
export async function getAllMyParent(): Promise<Parent[]> {
  const res = await supabase.from("users").select("*").eq("role", "PARENT");
  return (await handleResponse<Parent[]>(res)) ?? [];
}
export async function getAllMyEvaluations(teacherId: string) {
  const res = await supabase
    .from("evaluations")
    .select("*")
    .order("date", { ascending: false })
    .eq("teacher_id", teacherId);

  return await handleResponse<Evaluation[]>(res);
}
export async function insertEvaluation(data: EvaluationInsert) {
  const res = await supabase.from("evaluations").insert(data).select().single();
  return await handleResponse<Evaluation>(res);
}
export async function updateEvaluation(
  evaluationId: string,
  teacherId: string,
  data: EvaluationUpdate
) {
  const evaluation = await supabase
    .from("evaluations")
    .select("teacher_id")
    .eq("id", evaluationId)
    .single();
  if (evaluation.data?.teacher_id !== teacherId) {
    return null;
  }

  const res = await supabase
    .from("evaluations")
    .update(data)
    .eq("id", evaluationId)
    .select("*")
    .single();

  return handleResponse(res);
}
export async function deleteEvaluation(
  evaluationId: string,
  teacherId: string
) {
  const { data: evaluationData, error: evaluationError } = await supabase
    .from("evaluations")
    .select("teacher_id")
    .eq("id", evaluationId)
    .single();
  if (evaluationError) {
    console.log("Error when selecting evaluation");
    return null;
  }
  if (evaluationData.teacher_id !== teacherId) {
    console.log("This teacher does not own this evaluation");
    return null;
  }
  const { error: deleteDbError } = await supabase
    .from("evaluations")
    .delete()
    .eq("id", evaluationId);

  if (deleteDbError) {
    console.log("Failed to delete evaluation in DB");

    return null;
  }
  return {
    status: true,
  };
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
