import { StudentsTable } from "@/components/shared/StudentsTable";
import { getAllMyParent, getAllMyStudents } from "@/services/teacher";
import { Parent, Student } from "@/types/types";

import React from "react";

const page = async () => {
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // just for testing

  const students: Student[] | null = await getAllMyStudents(teacher_id);
  const parents: Parent[] | null = await getAllMyParent();

  return (
    <div className="">
      <StudentsTable studentsFetcher={students} parentsFetcher={parents} />
    </div>
  );
};

export default page;
