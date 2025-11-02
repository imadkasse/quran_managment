import ParentsPage from "@/components/parents/Parents";
import { getAllMyParent } from "@/services/teacher";

import React from "react";

const page = async () => {

  const parents = await getAllMyParent()

  return (
    <div className="">
      <ParentsPage parentsFromDb={parents} />
    </div>
  );
};

export default page;
