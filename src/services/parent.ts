import { supabase } from "@/supabase/supabase";
import { Database } from "@/types/supabase.types";
import { PostgrestError } from "@supabase/supabase-js";

// Types
type Parent = Database["public"]["Tables"]["users"]["Row"];
type Student = Database["public"]["Tables"]["students"]["Row"];
type Evaluation = Database["public"]["Tables"]["evaluations"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

// Helper function
async function handleResponse<T>(res: {
    data: T | null;
    error: PostgrestError | null;
}) {
    if (res.error) throw res.error;
    return res.data;
}

// Get parent profile
export async function getParentProfile(parentId: string) {
    const res = await supabase
        .from("users")
        .select("*")
        .eq("id", parentId)
        .single();
    return handleResponse<Parent>(res);
}

// Get parent's children
export async function getMyChildren(parentId: string) {
    const res = await supabase
        .from("students")
        .select("*, teacher:teachers(username, email)")
        .eq("parent_id", parentId)
        .order("full_name", { ascending: true });
    return (await handleResponse<Student[]>(res)) ?? [];
}

// Get child's evaluations
export async function getChildEvaluations(studentId: string) {
    const res = await supabase
        .from("evaluations")
        .select("*")
        .eq("student_id", studentId)
        .order("date", { ascending: false });
    return (await handleResponse<Evaluation[]>(res)) ?? [];
}

// Get child's attendance
export async function getChildAttendance(studentId: string, month?: string) {
    const query = supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .order("date", { ascending: false });

    if (month) {
        query.ilike("date", `${month}%`);
    }

    const res = await query;
    return (await handleResponse<Attendance[]>(res)) ?? [];
}

// Get child's subscription
export async function getChildSubscription(studentId: string) {
    const res = await supabase
        .from("subscriptions")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    return handleResponse<Subscription>(res);
}

// Update parent profile
export async function updateParentProfile(
    parentId: string,
    updates: Partial<Parent>
) {
    const res = await supabase
        .from("users")
        .update(updates)
        .eq("id", parentId)
        .select()
        .single();
    return handleResponse<Parent>(res);
}

// Get monthly statistics for a child
export async function getChildMonthlyStats(studentId: string, month: string) {
    const attendanceStats = await supabase
        .from("attendance")
        .select("status")
        .eq("student_id", studentId)
        .ilike("date", `${month}%`);

    const evaluationsStats = await supabase
        .from("evaluations")
        .select("rating")
        .eq("student_id", studentId)
        .ilike("date", `${month}%`);

    return {
        attendance: attendanceStats.data ?? [],
        evaluations: evaluationsStats.data ?? []
    };
}