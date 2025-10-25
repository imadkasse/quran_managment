import AttendancePage from "@/components/shared/Attendance";
import { getAllAttendance, getAllMyStudents } from "@/services/teacher";
import { Attendance, Student } from "@/types/types";
import React from "react";

const page = async () => {
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // another time get this from session
  const attendances: Attendance[] | [] = (await getAllAttendance(
    teacher_id
  )) as Attendance[];
  const students: Student[] | [] = await getAllMyStudents(teacher_id);

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
