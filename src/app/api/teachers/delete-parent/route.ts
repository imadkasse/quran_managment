import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabase/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const teacher_id = searchParams.get("teacher_id");
    const parentId = searchParams.get("parentId");

    // valid the data
    if (!teacher_id || !parentId) {
      return NextResponse.json(
        { error: "teacher_id and parentId are required" },
        { status: 400 }
      );
    }
    // get the parent
    const { data: parentData, error: parentError } = await supabaseAdmin
      .from("users")
      .select("teacher_id")
      .eq("id", parentId)
      .single();

    if (parentError) {
      return NextResponse.json(
        { error: "Parent not found in DB", details: parentError.message },
        { status: 404 }
      );
    }
    //check the teacher own this parent
    if (parentData.teacher_id !== teacher_id) {
      return NextResponse.json(
        { error: "This teacher does not own this parent" },
        { status: 403 }
      );
    }
    // delete the parent from Users Table
    const { error: deleteDbError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", parentId);

    if (deleteDbError) {
      return NextResponse.json(
        {
          error: "Failed to delete parent in DB",
          details: deleteDbError.message,
        },
        { status: 500 }
      );
    }
    // delete the parent from Auth
    const { error: deleteAuthError } =
      await supabaseAdmin.auth.admin.deleteUser(parentId);

    if (deleteAuthError) {
      // ⚠️ هنا يمكن تعمل rollback لو تحب (تسترجع السطر من DB)
      return NextResponse.json(
        {
          error: "Failed to delete parent in Auth",
          details: deleteAuthError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Parent deleted successfully",
    });
  } catch (error) {
    const err = error as Error;
    console.error("ERROR:", error);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
