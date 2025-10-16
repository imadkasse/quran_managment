import SideBar from "@/components/shared/SideBar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

export default layout;
