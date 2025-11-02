import { StudentsTable } from "@/components/shared/StudentsTable";
import { getAllMyParent, getAllMyStudents } from "@/services/teacher";
import { createSupabaseServer } from "@/supabase/server";
import { Parent, Student } from "@/types/types";

import React from "react";

const page = async () => {
  const {
    data: { user },
  } = await createSupabaseServer().auth.getUser();
  const students: Student[] | null = await getAllMyStudents(user?.id as string);
  const parents: Parent[] | null = await getAllMyParent();

  return (
    <div className="">
      <StudentsTable studentsFetcher={students} parentsFetcher={parents} />
    </div>
  );
};

export default page;
