import TeacherSubscriptions from "@/components/subscriptions/TeacherSubscriptions";
import { getAllMyStudents, getAllMySubscriptions } from "@/services/teacher";
import { Student, Subscription } from "@/types/types";
import React from "react";

const page = async () => {
  //
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // just for testing
  const subs: Subscription[] | [] = (await getAllMySubscriptions()) || [];
  const students: Student[] | [] = await getAllMyStudents(teacher_id);

  return (
    <div className="">
      <TeacherSubscriptions
        subscriptionsFetcher={subs}
        studentsFetcher={students}
      />
    </div>
  );
};

export default page;
