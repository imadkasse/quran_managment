import { supabase } from "@/supabase/supabase";
import { Database } from "@/types/supabase.types";
import { PostgrestError } from "@supabase/supabase-js";

// Student
export type CreateStudentPayload = StudentInsert;
export type UpdateStudentPayload = StudentUpdate;
export type StudentWithParent = Student & { parent: ParentInStudent | null };
type Student = Database["public"]["Tables"]["students"]["Row"];
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];
type ParentInStudent = {
  username: string;
  email: string;
};
// Parent
type Parent = Database["public"]["Tables"]["users"]["Row"];
// Evaluation
type Evaluation = Database["public"]["Tables"]["evaluations"]["Row"];
type EvaluationInsert = Database["public"]["Tables"]["evaluations"]["Insert"];
type EvaluationUpdate = Database["public"]["Tables"]["evaluations"]["Update"];
// Attendance
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type AttendanceInsert = Database["public"]["Tables"]["attendance"]["Insert"];
type AttendanceUpdate = Database["public"]["Tables"]["attendance"]["Update"];
// Subscriptions
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
type SubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];

async function handleResponse<T>(res: {
  data: T | null;
  error: PostgrestError | null;
}) {
  if (res.error) throw res.error;
  return res.data;
}
// students
export async function getAllMyStudents(teacherId: string) {
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
export async function updateStudent(
  studentId: string,
  data: UpdateStudentPayload
) {
  // no need to check teacher_id because I Enable the RLS policys on All Tables
  const res = await supabase
    .from("students")
    .update(data)
    .eq("id", studentId)
    .select(
      "id, full_name, age, level, teacher_id, parent_id, created_at ,parent:students_parent_id_fkey(username, email)"
    )
    .single();
  return await handleResponse<StudentWithParent>(res);
}
export async function deleteStudent(studentId: string) {
  const { error: deleteDbError } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId);
  if (deleteDbError) {
    console.log("Failed to delete evaluation in DB");
    return null;
  }
  return {
    status: true,
  };
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

// attendance
export async function getAllAttendance(teacherId: string, day?: string) {
  const res = await supabase
    .from("attendance")
    .select("*")
    .eq("teacher_id", teacherId)
    .eq(day ? "date" : "", day ? day : "")
    .order("date", { ascending: false });

  return await handleResponse(res);
}
export async function insertAttendance(data: AttendanceInsert) {
  const res = await supabase.from("attendance").insert(data).select().single();
  return await handleResponse(res);
}
export async function updateAttendance(
  data: AttendanceUpdate,
  attendanceId: string
) {
  const { error: errorUpdating, data: updateAttendance } = await supabase
    .from("attendance")
    .update(data)
    .eq("id", attendanceId)
    .select("*")
    .single();
  if (errorUpdating) {
    return {
      status: false,
      msg: "خطأ أثناء التحديث",
    };
  }
  return {
    status: true,
    msg: "تم تحديث الحضور ",
    attendance: updateAttendance,
  };
}
export async function deleteAttendance(attendanceId: string) {
  const { error: deleteDbError } = await supabase
    .from("attendance")
    .delete()
    .eq("id", attendanceId);
  if (deleteDbError) {
    console.log("Failed to delete attendance in DB");
    return null;
  }
  return {
    status: true,
  };
}
export async function createDailyAttendanceRecords(
  teacherId: string,
  toDay: string
) {
  // 1. نحصل على التاريخ الحالي بصيغة YYYY-MM-DD

  // 2. نحصل على طلاب هذا المعلم
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, full_name, teacher_id")
    .eq("teacher_id", teacherId);

  if (studentsError) throw new Error("خطأ أثناء جلب الطلاب");

  if (!students || students.length === 0)
    return {
      status: false,
      msg: "لا يوجد طلاب لهذا المعلم.",
      attendnaces: [],
    };

  // 3. نتحقق هل تم إنشاء سجل اليوم بالفعل
  const { count } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("date", toDay)
    .eq("teacher_id", teacherId);

  if (count && count > 0) {
    return {
      status: false,
      msg: "سجلات اليوم موجودة بالفعل ✅",
      attendnaces: [],
    };
  }

  // 4. نُنشئ سجلات جديدة لكل طالب (status = ABSENT بشكل افتراضي)
  const records = students.map((s) => ({
    student_id: s.id,
    teacher_id: teacherId,
    date: toDay,
    status: "PRESENT" as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
    note: "",
  }));

  // 5. عملية الإدخال الجماعي
  const { error: insertError, data: newAttendance } = await supabase
    .from("attendance")
    .insert(records);

  if (insertError) throw new Error("فشل أثناء إنشاء السجلات اليومية");

  return {
    status: true,
    msg: `تم إنشاء ${records.length} سجل حضور جديد لليوم (${toDay}) بنجاح ✅`,
    attendnaces: newAttendance,
  };
}
export async function updateAttendanceStatus(
  status: Attendance["status"],
  attendanceId: string
) {
  const { error: errorUpdating, data: updatingAttendance } = await supabase
    .from("attendance")
    .update({
      status: status,
    })
    .eq("id", attendanceId)
    .select("*")
    .single();

  if (errorUpdating) {
    console.log(errorUpdating);
    return {
      status: false,
      msg: "حدث خطأ أثناء تحديث الحالة",
    };
  }
  return {
    status: true,
    msg: "تم تحديث الحالة ",
    attendance: updatingAttendance,
  };
}

// subscriptions
export async function getAllMySubscriptions() {
  const res = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });
  return await handleResponse(res);
}

export async function insertSubscription(subscription: SubscriptionInsert) {
  const res = await supabase
    .from("subscriptions")
    .insert(subscription)
    .select("*")
    .single();

  return await handleResponse(res);
}

export async function updateSubscription(
  subsId: string,
  updates: SubscriptionUpdate
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", subsId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubscription(subsId: string) {
  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", subsId);
  if (error) throw error;
}
// export async function createMonthlySubscriptionsRecords(teacherId: string) {
//   // 1. نحصل على التاريخ الحالي بصيغة YYYY-MM-DD

//   // 2. نحصل على طلاب هذا المعلم
//   const { data: students, error: studentsError } = await supabase
//     .from("students")
//     .select("id, full_name, teacher_id")
//     .eq("teacher_id", teacherId);

//   if (studentsError) throw new Error("خطأ أثناء جلب الطلاب");

//   if (!students || students.length === 0)
//     return {
//       status: false,
//       msg: "لا يوجد طلاب لهذا المعلم.",
//       attendnaces: [],
//     };

//   // 3. نتحقق هل تم إنشاء سجل اليوم بالفعل
//   const { count } = await supabase
//     .from("attendance")
//     .select("*", { count: "exact", head: true })
//     .eq("date", toDay)
//     .eq("teacher_id", teacherId);

//   if (count && count > 0) {
//     return {
//       status: false,
//       msg: "سجلات اليوم موجودة بالفعل ✅",
//       attendnaces: [],
//     };
//   }

//   // 4. نُنشئ سجلات جديدة لكل طالب (status = ABSENT بشكل افتراضي)
//   const records = students.map((s) => ({
//     student_id: s.id,
//     teacher_id: teacherId,
//     date: toDay,
//     status: "PRESENT" as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
//     note: "",
//   }));

//   // 5. عملية الإدخال الجماعي
//   const { error: insertError, data: newAttendance } = await supabase
//     .from("attendance")
//     .insert(records);

//   if (insertError) throw new Error("فشل أثناء إنشاء السجلات اليومية");

//   return {
//     status: true,
//     msg: `تم إنشاء ${records.length} سجل حضور جديد لليوم (${toDay}) بنجاح ✅`,
//     attendnaces: newAttendance,
//   };
// }
