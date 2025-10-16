import { StudentsTable } from "@/components/shared/StudentsTable";
import { getAllMyStudents } from "@/services/teacher";
import { supabase } from "@/supabase/supabase";
import React from "react";

const page = async () => {
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // just for testing
  
  const students = await getAllMyStudents(teacher_id);

  return (
    <div className="">
      <StudentsTable students={students} />
    </div>
  );
};

export default page;
