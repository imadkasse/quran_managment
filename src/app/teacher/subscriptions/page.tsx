import TeacherSubscriptions from "@/components/subscriptions/TeacherSubscriptions";
import { getAllMyStudents, getAllMySubscriptions } from "@/services/teacher";
import { createSupabaseServer } from "@/supabase/server";
import { Student, Subscription } from "@/types/types";
import React from "react";

const page = async () => {
  const {
    data: { user },
  } = await createSupabaseServer().auth.getUser();
  const subs: Subscription[] | [] = (await getAllMySubscriptions()) || [];
  const students: Student[] | [] = await getAllMyStudents(user?.id as string);

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
