import ParentsPage from "@/components/parents/Parents";
import { getAllMyParent } from "@/services/teacher";

import React from "react";

const page = async () => {
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // just for testing

  const parents = await getAllMyParent()

  return (
    <div className="">
      <ParentsPage parentsFromDb={parents} />
    </div>
  );
};

export default page;
