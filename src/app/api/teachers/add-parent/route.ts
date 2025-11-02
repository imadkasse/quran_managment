import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabase/server";


export async function POST(request: Request) {
  try {
    const { username, email, password, num_phone, teacher_id } =
      await request.json();

    if (!password || !email || !num_phone) {
      return NextResponse.json(
        { error: "password & email or phone number are required" },
        { status: 400 }
      );
    }

    if (!teacher_id) {
      return NextResponse.json(
        { error: "teacher_id are required" },
        { status: 400 }
      );
    }
    // 1) إنشاء المستخدم في auth
    const authRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || "12345678",
      email_confirm: true,
    });

    if (authRes.error || !authRes.data.user) {
      throw authRes.error || new Error("Failed to create auth user");
    }

    const userId = authRes.data.user.id;

    // 2) إدخاله في جدول users
    const insertRes = await supabaseAdmin
      .from("users")
      .insert({
        id: userId,
        username,
        email,
        role: "PARENT",
        teacher_id,
        num_phone,
      })
      .select()
      .single();

    if (insertRes.error) {
      // 3) إذا فشل الإدخال → حذف من auth
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw insertRes.error;
    }

    return NextResponse.json({ success: true, parent: insertRes.data });
  } catch (error) {
    const err = error as Error;
    console.error("ERROR:", error);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
