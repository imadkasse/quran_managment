import TeacherEvaluations from "@/components/evaluations/TeacherEvaluations";
import { getAllMyEvaluations, getAllMyStudents } from "@/services/teacher";
import { createSupabaseServer } from "@/supabase/server";
import { Evaluation } from "@/types/types";
import React from "react";

const page = async () => {
  const {
    data: { user },
  } = await createSupabaseServer().auth.getUser();
  const students = await getAllMyStudents(user?.id as string);

  const evaluations: Evaluation[] | null = await getAllMyEvaluations(user?.id as string);
  return (
    <div className="">
      <TeacherEvaluations
        studentsFetchers={students}
        evaluationFetcher={evaluations}
      />
    </div>
  );
};

export default page;
