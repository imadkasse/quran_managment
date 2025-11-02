import AttendancePage from "@/components/shared/Attendance";
import { getAllAttendance, getAllMyStudents } from "@/services/teacher";
import { createSupabaseServer } from "@/supabase/server";
import { Attendance, Student } from "@/types/types";
import React from "react";

const page = async () => {
  const {
    data: { user },
  } = await createSupabaseServer().auth.getUser();
  const attendances: Attendance[] | [] = (await getAllAttendance(
    user?.id as string
  )) as Attendance[];
  const students: Student[] | [] = await getAllMyStudents(user?.id as string);

  return (
    <div className="">
      <AttendancePage
        attendanceFetcher={attendances}
        studentsFetcher={students}
      />
    </div>
  );
};

export default page;
