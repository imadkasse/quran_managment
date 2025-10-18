import TeacherEvaluations from "@/components/evaluations/TeacherEvaluations";
import { getAllMyEvaluations, getAllMyStudents } from "@/services/teacher";
import { Evaluation } from "@/types/types";
import React from "react";

const page = async () => {
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // just for testing

  const students = await getAllMyStudents(teacher_id);

  const evaluations: Evaluation[] | null = await getAllMyEvaluations(
    teacher_id
  );
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
